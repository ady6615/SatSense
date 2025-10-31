# gee_utils.py
"""
Helpers for Google Earth Engine interactions.
Requires `earthengine-api` (pip install earthengine-api) and prior authentication.
If you don't have GEE access, you can use local tiff images and skip GEE parts.
"""

import os
import json
import numpy as np

try:
    import ee
    EE_AVAILABLE = True
except Exception:
    EE_AVAILABLE = False

def initialize_ee(service_account_json=None):
    """
    Initialize Earth Engine. Either set up by local authentication or service account JSON.
    Returns True if initialized.
    """
    if not EE_AVAILABLE:
        return False
    if service_account_json and os.path.exists(service_account_json):
        credentials = ee.ServiceAccountCredentials(None, key_file=service_account_json)
        ee.Initialize(credentials)
        return True
    else:
        # try default init (assumes user ran `earthengine authenticate`)
        try:
            ee.Initialize()
            return True
        except Exception as e:
            print("GEE init failed:", e)
            return False

def fetch_median_composite(bbox, start_date, end_date, sensor="SENTINEL_2"):
    """
    Returns a numpy RGB array clipped to bbox and scaled to 0-255.
    bbox = (minLon, minLat, maxLon, maxLat)
    sensor: "SENTINEL_2" or "LANDSAT_8"
    """
    if not EE_AVAILABLE:
        raise RuntimeError("earthengine not available")

    minLon, minLat, maxLon, maxLat = bbox
    geom = ee.Geometry.Rectangle([minLon, minLat, maxLon, maxLat])

    if sensor == "SENTINEL_2":
        col = ee.ImageCollection('COPERNICUS/S2_SR') \
            .filterBounds(geom) \
            .filterDate(start_date, end_date) \
            .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 60))
        # choose bands B4 (red), B3 (green), B2 (blue)
        bands = ['B4', 'B3', 'B2']
        scale = 10
        def maskS2clouds(image):
            qa = image.select('QA60')
            cloudBitMask = 1 << 10
            cirrusBitMask = 1 << 11
            mask = qa.bitwiseAnd(cloudBitMask).eq(0).And(qa.bitwiseAnd(cirrusBitMask).eq(0))
            return image.updateMask(mask)
        col = col.map(maskS2clouds)
    else:
        # Landsat 8
        col = ee.ImageCollection('LANDSAT/LC08/C02/T1_SR') \
            .filterBounds(geom) \
            .filterDate(start_date, end_date)
        bands = ['B4', 'B3', 'B2']  # Landsat band numbers for RGB in SR
        scale = 30

    median = col.select(bands).median().clip(geom)
    # scale reflectance to 0-255 for visualization (simple linear scaling)
    vis = median.multiply(0.0001).multiply(255).uint8()

    # get a url to download an image with a reasonable size
    url = vis.getThumbURL({
        'region': geom,
        'dimensions': 1024,
        'format': 'png',
        'min': 0,
        'max': 255
    })
    # We can download via requests in processing; to keep ee usage minimal, return the url
    return url
