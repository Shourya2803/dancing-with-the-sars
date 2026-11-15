"""
Object Storage Service (Cloudflare R2 / AWS S3 abstraction).
Uploads processed scientific artifacts (GeoTIFFs, vector GeoJSONs) to Cloudflare R2,
with automatic fallback to local directory storage for local development.
"""

import os
import shutil
import json
from typing import Optional, Dict, Any
import boto3
from botocore.config import Config
from botocore.exceptions import ClientError

from app.config.settings import settings


class StorageService:
    """
    Manages storage of processed scientific artifacts in Cloudflare R2 or local storage.
    """

    def __init__(self):
        self.r2_enabled = bool(
            settings.R2_ACCOUNT_ID and
            settings.R2_ACCESS_KEY_ID and
            settings.R2_SECRET_ACCESS_KEY and
            settings.R2_BUCKET
        )
        self.local_storage_dir = settings.STORAGE_LOCAL_DIR
        os.makedirs(self.local_storage_dir, exist_ok=True)

        self._s3_client = None
        if self.r2_enabled:
            self._s3_client = boto3.client(
                "s3",
                endpoint_url=settings.r2_endpoint_url,
                aws_access_key_id=settings.R2_ACCESS_KEY_ID,
                aws_secret_access_key=settings.R2_SECRET_ACCESS_KEY,
                config=Config(signature_version="s3v4")
            )

    def upload_file(
        self,
        local_file_path: str,
        object_key: str,
        content_type: Optional[str] = None
    ) -> Dict[str, str]:
        """
        Uploads a local file to Cloudflare R2 or local static directory.
        Returns dictionary with object_key, public_url, and storage_type.
        """
        if not os.path.exists(local_file_path):
            raise FileNotFoundError(f"File to upload does not exist: {local_file_path}")

        # Guess content type if omitted
        if not content_type:
            if object_key.endswith(".tif") or object_key.endswith(".tiff"):
                content_type = "image/tiff"
            elif object_key.endswith(".geojson") or object_key.endswith(".json"):
                content_type = "application/geo+json"
            elif object_key.endswith(".png"):
                content_type = "image/png"
            else:
                content_type = "application/octet-stream"

        if self.r2_enabled and self._s3_client:
            try:
                extra_args = {"ContentType": content_type}
                self._s3_client.upload_file(
                    Filename=local_file_path,
                    Bucket=settings.R2_BUCKET,
                    Key=object_key,
                    ExtraArgs=extra_args
                )
                
                # Format public URL
                if settings.R2_PUBLIC_URL:
                    url = f"{settings.R2_PUBLIC_URL.rstrip('/')}/{object_key}"
                else:
                    url = f"https://{settings.R2_BUCKET}.r2.dev/{object_key}"

                return {
                    "storage_type": "cloudflare_r2",
                    "bucket": settings.R2_BUCKET,
                    "object_key": object_key,
                    "url": url
                }
            except ClientError as e:
                # If R2 upload fails, fall back to local storage
                print(f"[StorageService Warning] R2 upload failed ({str(e)}), falling back to local storage.")

        # Local storage fallback
        dest_local_path = os.path.join(self.local_storage_dir, object_key)
        os.makedirs(os.path.dirname(dest_local_path), exist_ok=True)
        shutil.copy2(local_file_path, dest_local_path)

        local_url = f"/storage/{object_key.replace(os.sep, '/')}"
        return {
            "storage_type": "local",
            "bucket": "local_storage",
            "object_key": object_key,
            "url": local_url,
            "local_path": dest_local_path
        }

    def upload_json_data(self, data: Dict[str, Any], object_key: str) -> Dict[str, str]:
        """
        Uploads a Python dictionary directly as a JSON object.
        """
        temp_path = os.path.join(self.local_storage_dir, "temp_" + os.path.basename(object_key))
        with open(temp_path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)

        try:
            res = self.upload_file(temp_path, object_key, content_type="application/json")
        finally:
            if os.path.exists(temp_path):
                os.remove(temp_path)

        return res
