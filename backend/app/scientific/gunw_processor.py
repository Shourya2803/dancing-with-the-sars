"""
NISAR Level-2 GUNW (Geocoded Unwrapped Interferogram) Scientific Processor.
Processes interferometric phase, Line-of-Sight (LOS) surface displacement,
and interferometric coherence across repeat-pass acquisitions.
"""

import os
from typing import Dict, Any, Optional, Tuple
import numpy as np
import h5py
from shapely.geometry import shape
import rasterio
from rasterio.transform import from_origin
from rasterio.features import geometry_mask
from rasterio.warp import transform_geom

from app.scientific.metrics import compute_insar_metrics
from app.scientific.rasters import save_as_geotiff


class GUNWProcessingError(Exception):
    """Raised when GUNW reading or interferometric processing fails."""
    pass


class GUNWProcessor:
    """
    Standard scientific processor for NISAR Level-2 GUNW products.
    """

    def __init__(self, frequency_group: str = "frequencyA"):
        self.frequency_group = frequency_group

    def process_granule(
        self,
        gunw_h5_path: str,
        aoi_geojson: Optional[Dict[str, Any]] = None,
        output_dir: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Processes a single NISAR GUNW interferometric pair product.
        """
        if not os.path.exists(gunw_h5_path):
            raise GUNWProcessingError(f"GUNW file not found: {gunw_h5_path}")

        with h5py.File(gunw_h5_path, "r") as f:
            grid_path = f"science/LSAR/GUNW/grids/{self.frequency_group}"
            if grid_path not in f:
                raise GUNWProcessingError(f"HDF5 does not contain expected grid group: '{grid_path}'.")
            
            grid = f[grid_path]
            x_coords = np.array(grid["xCoordinates"][:], dtype=np.float64)
            y_coords = np.array(grid["yCoordinates"][:], dtype=np.float64)

            # Extract projection
            epsg_code = 32644
            if "projection" in grid:
                proj = grid["projection"]
                if "epsg_code" in proj.attrs:
                    epsg_code = int(proj.attrs["epsg_code"])

            # Slice AOI
            slice_rows, slice_cols, aoi_mask = self._determine_aoi_slice(
                aoi_geojson=aoi_geojson,
                x_coords=x_coords,
                y_coords=y_coords,
                epsg_code=epsg_code
            )

            x_sliced = x_coords[slice_cols]
            y_sliced = y_coords[slice_rows]

            # Read LOS deformation and coherence
            if "losDeformation" not in grid or "coherenceMagnitude" not in grid:
                raise GUNWProcessingError("Required InSAR datasets (losDeformation or coherenceMagnitude) missing.")

            los_disp_m = np.array(grid["losDeformation"][slice_rows, slice_cols], dtype=np.float32)
            coherence = np.array(grid["coherenceMagnitude"][slice_rows, slice_cols], dtype=np.float32)

            # Metadata
            ident = f.get("science/LSAR/identification")
            ref_date = ident.attrs.get("reference_zero_doppler_start_time", "Unknown") if ident else "Unknown"
            sec_date = ident.attrs.get("secondary_zero_doppler_start_time", "Unknown") if ident else "Unknown"
            wavelength_m = float(grid["projection"].attrs.get("wavelength", 0.24)) if "projection" in grid else 0.24

        x_res = abs(float(x_sliced[1] - x_sliced[0])) if len(x_sliced) > 1 else 80.0
        y_res = abs(float(y_sliced[1] - y_sliced[0])) if len(y_sliced) > 1 else 80.0
        pixel_area_m2 = x_res * y_res

        valid_mask = np.isfinite(los_disp_m) & np.isfinite(coherence) & aoi_mask

        metrics = compute_insar_metrics(
            los_disp_m=los_disp_m,
            coherence=coherence,
            pixel_area_m2=pixel_area_m2,
            valid_mask=valid_mask,
            wavelength_m=wavelength_m
        )

        geotiff_disp_path = None
        if output_dir:
            os.makedirs(output_dir, exist_ok=True)
            # Export displacement in centimeters
            disp_cm = los_disp_m * 100.0
            geotiff_disp_path = os.path.join(output_dir, "nisar_gunw_displacement_cm.tif")
            save_as_geotiff(
                data_array=disp_cm,
                x_coords=x_sliced,
                y_coords=y_sliced,
                epsg_code=epsg_code,
                output_path=geotiff_disp_path,
                nodata_value=-9999.0
            )

        return {
            "processor": "NISAR_L2_GUNW_Processor",
            "temporal_pair": {
                "reference_pass": str(ref_date),
                "secondary_pass": str(sec_date)
            },
            "spatial_reference": f"EPSG:{epsg_code}",
            "pixel_resolution_m": [round(x_res, 1), round(y_res, 1)],
            "metrics": metrics,
            "artifacts": {
                "geotiff_path": geotiff_disp_path
            }
        }

    def _determine_aoi_slice(
        self,
        aoi_geojson: Optional[Dict[str, Any]],
        x_coords: np.ndarray,
        y_coords: np.ndarray,
        epsg_code: int
    ) -> Tuple[slice, slice, np.ndarray]:
        n_rows = len(y_coords)
        n_cols = len(x_coords)

        if not aoi_geojson:
            return slice(0, n_rows), slice(0, n_cols), np.ones((n_rows, n_cols), dtype=bool)

        try:
            reprojected = transform_geom("EPSG:4326", f"EPSG:{epsg_code}", aoi_geojson)
            aoi_poly = shape(reprojected)
        except Exception as e:
            raise GUNWProcessingError(f"Failed to reproject AOI: {str(e)}")

        min_x, min_y, max_x, max_y = aoi_poly.bounds

        gx_min = float(min(x_coords[0], x_coords[-1]))
        gx_max = float(max(x_coords[0], x_coords[-1]))
        gy_min = float(min(y_coords[0], y_coords[-1]))
        gy_max = float(max(y_coords[0], y_coords[-1]))

        ix_min = max(min_x, gx_min)
        ix_max = min(max_x, gx_max)
        iy_min = max(min_y, gy_min)
        iy_max = min(max_y, gy_max)

        if ix_min >= ix_max or iy_min >= iy_max:
            raise GUNWProcessingError(
                f"AOI bounds [{min_x:.1f}, {min_y:.1f}, {max_x:.1f}, {max_y:.1f}] do not overlap "
                f"granule extent [{gx_min:.1f}, {gy_min:.1f}, {gx_max:.1f}, {gy_max:.1f}] in EPSG:{epsg_code}."
            )

        col_start = int(np.clip(np.searchsorted(x_coords, ix_min, side="left"), 0, n_cols - 1))
        col_end = int(np.clip(np.searchsorted(x_coords, ix_max, side="right"), col_start + 1, n_cols))

        if y_coords[0] > y_coords[-1]:
            row_start = int(np.clip(np.searchsorted(-y_coords, -iy_max, side="left"), 0, n_rows - 1))
            row_end = int(np.clip(np.searchsorted(-y_coords, -iy_min, side="right"), row_start + 1, n_rows))
        else:
            row_start = int(np.clip(np.searchsorted(y_coords, iy_min, side="left"), 0, n_rows - 1))
            row_end = int(np.clip(np.searchsorted(y_coords, iy_max, side="right"), row_start + 1, n_rows))

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

        x_sub = x_coords[col_slice]
        y_sub = y_coords[row_slice]
        x_res = abs(float(x_sub[1] - x_sub[0])) if len(x_sub) > 1 else 80.0
        y_res = abs(float(y_sub[1] - y_sub[0])) if len(y_sub) > 1 else 80.0
        transform = from_origin(float(x_sub[0] - x_res/2.0), float(y_sub[0] + y_res/2.0), x_res, y_res)

        aoi_mask = geometry_mask(
            geometries=[aoi_poly],
            out_shape=(sliced_rows, sliced_cols),
            transform=transform,
            invert=True
        )

        return row_slice, col_slice, aoi_mask
