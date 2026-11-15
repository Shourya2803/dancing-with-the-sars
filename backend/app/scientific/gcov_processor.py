"""
NISAR Level-2 GCOV (Geocoded Polarimetric Covariance) Scientific Processor.
Processes Radiometrically Terrain Corrected (RTC) radar backscatter for
temporal change analysis over user-specified Areas of Interest.
"""

import os
from typing import Dict, Any, Optional, Tuple, Union
import numpy as np
import h5py
from shapely.geometry import shape, Polygon, MultiPolygon
import rasterio
from rasterio.transform import from_origin
from rasterio.features import geometry_mask
from rasterio.warp import transform_geom

from app.scientific.metrics import compute_backscatter_metrics
from app.scientific.rasters import save_as_geotiff, vectorize_change_categories


class GCOVProcessingError(Exception):
    """Raised when GCOV data reading or computation encounters a scientific failure."""
    pass


class GCOVProcessor:
    """
    Standard scientific processor for NISAR Level-2 GCOV products.
    """

    def __init__(self, frequency_group: str = "frequencyA"):
        self.frequency_group = frequency_group

    def process_temporal_pair(
        self,
        baseline_h5_path: str,
        secondary_h5_path: str,
        aoi_geojson: Optional[Dict[str, Any]] = None,
        output_dir: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Processes a temporal pair of NISAR GCOV observations (t1 and t2).
        
        Steps:
        1. Read metadata and coordinates from HDF5 files.
        2. Determine AOI intersection and calculate bounding box slice.
        3. Efficiently read only the required spatial window from both files.
        4. Convert linear backscatter power to Decibels (dB).
        5. Calculate differential backscatter (Δγ⁰ = γ⁰_t2 - γ⁰_t1).
        6. Compute rigorous quantitative metrics and threshold distributions.
        7. Export georeferenced GeoTIFF and vector GeoJSON if output_dir provided.
        """
        if not os.path.exists(baseline_h5_path):
            raise GCOVProcessingError(f"Baseline GCOV file not found: {baseline_h5_path}")
        if not os.path.exists(secondary_h5_path):
            raise GCOVProcessingError(f"Secondary GCOV file not found: {secondary_h5_path}")

        # Open both files and read spatial coordinate grids
        with h5py.File(baseline_h5_path, "r") as f_base, h5py.File(secondary_h5_path, "r") as f_sec:
            base_grid = self._get_grid_group(f_base)
            sec_grid = self._get_grid_group(f_sec)

            x_coords_base = np.array(base_grid["xCoordinates"][:], dtype=np.float64)
            y_coords_base = np.array(base_grid["yCoordinates"][:], dtype=np.float64)

            epsg_base = self._get_epsg_code(base_grid)
            epsg_sec = self._get_epsg_code(sec_grid)

            if epsg_base != epsg_sec:
                raise GCOVProcessingError(
                    f"Mismatched spatial references between observations: EPSG:{epsg_base} vs EPSG:{epsg_sec}."
                )

            # Determine spatial slicing window based on AOI
            slice_rows, slice_cols, aoi_mask = self._determine_aoi_slice(
                aoi_geojson=aoi_geojson,
                x_coords=x_coords_base,
                y_coords=y_coords_base,
                epsg_code=epsg_base
            )

            # Slice coordinate vectors
            x_sliced = x_coords_base[slice_cols]
            y_sliced = y_coords_base[slice_rows]

            # Read HH co-polarization linear power
            if "HHHH" not in base_grid or "HHHH" not in sec_grid:
                raise GCOVProcessingError("Expected 'HHHH' covariance dataset missing from GCOV product.")

            hh_base_linear = np.array(base_grid["HHHH"][slice_rows, slice_cols], dtype=np.float32)
            hh_sec_linear = np.array(sec_grid["HHHH"][slice_rows, slice_cols], dtype=np.float32)

            # Read HV cross-polarization if available in both products
            hv_base_linear = None
            hv_sec_linear = None
            has_hv = "HVHV" in base_grid and "HVHV" in sec_grid
            if has_hv:
                hv_base_linear = np.array(base_grid["HVHV"][slice_rows, slice_cols], dtype=np.float32)
                hv_sec_linear = np.array(sec_grid["HVHV"][slice_rows, slice_cols], dtype=np.float32)

        # Scientific Computation
        # 1. Mask non-positive values (linear power must be > 0)
        valid_power_mask = (hh_base_linear > 0.0) & (hh_sec_linear > 0.0)
        combined_valid_mask = valid_power_mask & aoi_mask

        # 2. Linear to Decibels: gamma0_dB = 10 * log10(gamma0_linear)
        # Using log-ratio: delta_dB = 10 * log10(sec / base)
        with np.errstate(divide="ignore", invalid="ignore"):
            hh_base_db = 10.0 * np.log10(hh_base_linear)
            hh_sec_db = 10.0 * np.log10(hh_sec_linear)
            delta_hh_db = hh_sec_db - hh_base_db

            delta_hv_db = None
            if has_hv and hv_base_linear is not None and hv_sec_linear is not None:
                hv_valid = (hv_base_linear > 0.0) & (hv_sec_linear > 0.0)
                combined_valid_mask &= hv_valid
                hv_base_db = 10.0 * np.log10(hv_base_linear)
                hv_sec_db = 10.0 * np.log10(hv_sec_linear)
                delta_hv_db = hv_sec_db - hv_base_db

        # Pixel resolution and physical area
        x_res = abs(float(x_sliced[1] - x_sliced[0])) if len(x_sliced) > 1 else 80.0
        y_res = abs(float(y_sliced[1] - y_sliced[0])) if len(y_sliced) > 1 else 80.0
        pixel_area_m2 = x_res * y_res

        # 3. Compute statistical and quantitative metrics
        metrics = compute_backscatter_metrics(
            delta_hh_db=delta_hh_db,
            delta_hv_db=delta_hv_db,
            pixel_area_m2=pixel_area_m2,
            valid_mask=combined_valid_mask
        )

        # 4. Optional file export (GeoTIFF and GeoJSON vector)
        geotiff_path = None
        geojson_path = None
        if output_dir:
            os.makedirs(output_dir, exist_ok=True)
            geotiff_path = os.path.join(output_dir, "nisar_gcov_change_diff_db.tif")
            save_as_geotiff(
                data_array=delta_hh_db,
                x_coords=x_sliced,
                y_coords=y_sliced,
                epsg_code=epsg_base,
                output_path=geotiff_path,
                nodata_value=-9999.0
            )

            geojson_path = os.path.join(output_dir, "nisar_gcov_change_vector.geojson")
            vectorize_change_categories(
                delta_db=delta_hh_db,
                valid_mask=combined_valid_mask,
                x_coords=x_sliced,
                y_coords=y_sliced,
                epsg_code=epsg_base,
                threshold_db=3.0,
                output_geojson_path=geojson_path
            )

        return {
            "processor": "NISAR_L2_GCOV_Processor",
            "frequency_band": "L-band",
            "polarization": "HH" if not has_hv else "HH/HV",
            "spatial_reference": f"EPSG:{epsg_base}",
            "pixel_resolution_m": [round(x_res, 1), round(y_res, 1)],
            "metrics": metrics,
            "artifacts": {
                "geotiff_path": geotiff_path,
                "geojson_path": geojson_path
            }
        }

    def _get_grid_group(self, h5_obj: h5py.File) -> h5py.Group:
        """Navigates to the frequencyA grids group."""
        path = f"science/LSAR/GCOV/grids/{self.frequency_group}"
        if path not in h5_obj:
            raise GCOVProcessingError(f"HDF5 structure does not contain expected grid group: '{path}'.")
        return h5_obj[path]

    def _get_epsg_code(self, grid_group: h5py.Group) -> int:
        """Extracts EPSG code from projection dataset or attributes."""
        if "projection" in grid_group:
            proj = grid_group["projection"]
            if "epsg_code" in proj.attrs:
                return int(proj.attrs["epsg_code"])
            try:
                val = int(proj[()])
                if val > 0:
                    return val
            except Exception:
                pass
        return 32644  # Fallback standard UTM Zone 44N for Uttarakhand

    def _determine_aoi_slice(
        self,
        aoi_geojson: Optional[Dict[str, Any]],
        x_coords: np.ndarray,
        y_coords: np.ndarray,
        epsg_code: int
    ) -> Tuple[slice, slice, np.ndarray]:
        """
        Determines bounding box slice indices and 2D boolean raster mask for the AOI.
        """
        n_rows = len(y_coords)
        n_cols = len(x_coords)

        if not aoi_geojson:
            # Full extent
            return slice(0, n_rows), slice(0, n_cols), np.ones((n_rows, n_cols), dtype=bool)

        # Reproject AOI geometry from EPSG:4326 to target UTM EPSG
        try:
            reprojected_geom_dict = transform_geom("EPSG:4326", f"EPSG:{epsg_code}", aoi_geojson)
            aoi_poly = shape(reprojected_geom_dict)
        except Exception as e:
            raise GCOVProcessingError(f"Failed to reproject AOI to EPSG:{epsg_code}: {str(e)}")

        min_x, min_y, max_x, max_y = aoi_poly.bounds

        gx_min = float(min(x_coords[0], x_coords[-1]))
        gx_max = float(max(x_coords[0], x_coords[-1]))
        gy_min = float(min(y_coords[0], y_coords[-1]))
        gy_max = float(max(y_coords[0], y_coords[-1]))

        # Calculate bounding box intersection
        ix_min = max(min_x, gx_min)
        ix_max = min(max_x, gx_max)
        iy_min = max(min_y, gy_min)
        iy_max = min(max_y, gy_max)

        if ix_min >= ix_max or iy_min >= iy_max:
            raise GCOVProcessingError(
                f"AOI bounds [{min_x:.1f}, {min_y:.1f}, {max_x:.1f}, {max_y:.1f}] do not overlap "
                f"granule extent [{gx_min:.1f}, {gy_min:.1f}, {gx_max:.1f}, {gy_max:.1f}] in EPSG:{epsg_code}."
            )

        # Find column indices (Easting)
        col_start = int(np.clip(np.searchsorted(x_coords, ix_min, side="left"), 0, n_cols - 1))
        col_end = int(np.clip(np.searchsorted(x_coords, ix_max, side="right"), col_start + 1, n_cols))

        # Find row indices (Northing)
        if y_coords[0] > y_coords[-1]:
            # Descending Northing
            row_start = int(np.clip(np.searchsorted(-y_coords, -iy_max, side="left"), 0, n_rows - 1))
            row_end = int(np.clip(np.searchsorted(-y_coords, -iy_min, side="right"), row_start + 1, n_rows))
        else:
            # Ascending Northing
            row_start = int(np.clip(np.searchsorted(y_coords, iy_min, side="left"), 0, n_rows - 1))
            row_end = int(np.clip(np.searchsorted(y_coords, iy_max, side="right"), row_start + 1, n_rows))

        # Ensure at least 2 pixels along each dimension if possible
        if col_end - col_start < 2 and n_cols >= 2:
            if col_start > 0:
                col_start -= 1
            elif col_end < n_cols:
                col_end += 1

        if row_end - row_start < 2 and n_rows >= 2:
            if row_start > 0:
                row_start -= 1
            elif row_end < n_rows:
                row_end += 1

        row_slice = slice(row_start, row_end)
        col_slice = slice(col_start, col_end)

        sliced_rows = row_end - row_start
        sliced_cols = col_end - col_start

        # Create affine transform for the sliced window
        x_sub = x_coords[col_slice]
        y_sub = y_coords[row_slice]
        x_res = abs(float(x_sub[1] - x_sub[0])) if len(x_sub) > 1 else 80.0
        y_res = abs(float(y_sub[1] - y_sub[0])) if len(y_sub) > 1 else 80.0
        west = float(x_sub[0] - (x_res / 2.0))
        north = float(y_sub[0] + (y_res / 2.0))
        transform = from_origin(west, north, x_res, y_res)

        # Generate 2D raster mask (True inside geometry)
        # rasterio geometry_mask returns True for background by default (invert=True makes inside geometry True)
        aoi_mask = geometry_mask(
            geometries=[aoi_poly],
            out_shape=(sliced_rows, sliced_cols),
            transform=transform,
            invert=True
        )

        return row_slice, col_slice, aoi_mask
