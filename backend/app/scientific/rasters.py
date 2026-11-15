"""
Raster and Vector Output Generator.
Converts scientific numpy arrays into georeferenced GeoTIFF rasters and
interactive vector GeoJSON geometries suitable for frontend map rendering.
"""

import os
from typing import Dict, Any, Optional, List, Tuple
import numpy as np
import rasterio
from rasterio.transform import from_origin
from rasterio.crs import CRS
from rasterio.features import shapes
from shapely.geometry import shape, mapping, MultiPolygon, Polygon
import json


def save_as_geotiff(
    data_array: np.ndarray,
    x_coords: np.ndarray,
    y_coords: np.ndarray,
    epsg_code: int,
    output_path: str,
    nodata_value: float = -9999.0,
    dtype: str = "float32"
) -> str:
    """
    Saves a 2D numpy array as a georeferenced GeoTIFF.
    """
    os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
    
    rows, cols = data_array.shape
    x_res = abs(float(x_coords[1] - x_coords[0])) if len(x_coords) > 1 else 80.0
    y_res = abs(float(y_coords[1] - y_coords[0])) if len(y_coords) > 1 else 80.0
    
    # Calculate top-left corner (pixel center to pixel outer edge)
    west = float(x_coords[0] - (x_res / 2.0))
    north = float(y_coords[0] + (y_res / 2.0))
    
    transform = from_origin(west, north, x_res, y_res)
    crs = CRS.from_epsg(epsg_code)
    
    arr_to_write = data_array.astype(dtype)
    # Replace NaN or inf with nodata
    arr_to_write[~np.isfinite(arr_to_write)] = nodata_value

    with rasterio.open(
        output_path,
        "w",
        driver="GTiff",
        height=rows,
        width=cols,
        count=1,
        dtype=dtype,
        crs=crs,
        transform=transform,
        nodata=nodata_value,
        compress="deflate"
    ) as dst:
        dst.write(arr_to_write, 1)

    return output_path


def vectorize_change_categories(
    delta_db: np.ndarray,
    valid_mask: np.ndarray,
    x_coords: np.ndarray,
    y_coords: np.ndarray,
    epsg_code: int,
    threshold_db: float = 3.0,
    output_geojson_path: Optional[str] = None
) -> Dict[str, Any]:
    """
    Converts raster change zones into vector GeoJSON polygons:
    - Category 1: Negative change (delta_db <= -threshold_db)
    - Category 2: Positive change (delta_db >= +threshold_db)
    - Category 0: Stable (-threshold_db < delta_db < threshold_db)
    Reprojects polygon coordinates from UTM to WGS84 (lon/lat) for web mapping.
    """
    rows, cols = delta_db.shape
    x_res = abs(float(x_coords[1] - x_coords[0])) if len(x_coords) > 1 else 80.0
    y_res = abs(float(y_coords[1] - y_coords[0])) if len(y_coords) > 1 else 80.0
    west = float(x_coords[0] - (x_res / 2.0))
    north = float(y_coords[0] + (y_res / 2.0))
    transform = from_origin(west, north, x_res, y_res)

    # Classification integer array
    classified = np.zeros((rows, cols), dtype=np.int16)
    classified[valid_mask & (delta_db <= -threshold_db)] = 1  # Significant decrease
    classified[valid_mask & (delta_db >= threshold_db)] = 2   # Significant increase

    # Extract polygon shapes using rasterio.features.shapes
    features = []
    from rasterio.warp import transform_geom

    src_crs = f"EPSG:{epsg_code}"
    dst_crs = "EPSG:4326"

    for geom_dict, val in shapes(classified, mask=valid_mask, transform=transform):
        val = int(val)
        if val == 0:
            continue  # Omit stable baseline polygons to keep vector payload lightweight
            
        geom_obj = shape(geom_dict)
        if geom_obj.is_empty or geom_obj.area < (x_res * y_res * 2): # Filter tiny speckle pixels
            continue

        # Transform to WGS84 using rasterio.warp.transform_geom
        try:
            geom_wgs84_dict = transform_geom(src_crs, dst_crs, geom_dict)
        except Exception:
            continue

        label = "decreased_backscatter" if val == 1 else "increased_backscatter"
        color = "#e63946" if val == 1 else "#457b9d" # Red for drop (inundation/canopy loss), Blue for gain

        features.append({
            "type": "Feature",
            "properties": {
                "category_id": val,
                "category_label": label,
                "color": color,
                "threshold_db": threshold_db
            },
            "geometry": geom_wgs84_dict
        })

    geojson_data = {
        "type": "FeatureCollection",
        "crs": {
            "type": "name",
            "properties": {"name": "urn:ogc:def:crs:OGC:1.3:CRS84"}
        },
        "features": features
    }

    if output_geojson_path:
        os.makedirs(os.path.dirname(os.path.abspath(output_geojson_path)), exist_ok=True)
        with open(output_geojson_path, "w", encoding="utf-8") as f:
            json.dump(geojson_data, f, indent=2)

    return geojson_data
