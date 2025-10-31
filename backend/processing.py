# processing.py
import os, uuid, io, requests, json
from PIL import Image
import numpy as np
import cv2
from moviepy.editor import ImageSequenceClip

from storage import ensure_dir, save_bytes

OUTPUT_DIR = os.environ.get("STATIC_DIR", "./outputs")
ensure_dir(OUTPUT_DIR)

def download_image_from_url(url):
    r = requests.get(url, timeout=120)
    r.raise_for_status()
    return r.content

def png_bytes_to_numpy(png_bytes):
    img = Image.open(io.BytesIO(png_bytes)).convert("RGB")
    arr = np.array(img)  # H x W x 3
    return arr

def compute_change_mask(img_before, img_after, diff_thresh=30, kernel_size=5):
    """
    img_before, img_after: numpy uint8 HxWx3
    returns mask: uint8 HxW (0/255)
    """
    # convert to grayscale
    g1 = cv2.cvtColor(img_before, cv2.COLOR_RGB2GRAY)
    g2 = cv2.cvtColor(img_after, cv2.COLOR_RGB2GRAY)
    # absolute difference
    diff = cv2.absdiff(g1, g2)
    # threshold
    _, th = cv2.threshold(diff, diff_thresh, 255, cv2.THRESH_BINARY)
    # morphological clean
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (kernel_size, kernel_size))
    clean = cv2.morphologyEx(th, cv2.MORPH_OPEN, kernel)
    clean = cv2.morphologyEx(clean, cv2.MORPH_CLOSE, kernel)
    return clean

def save_image_numpy(arr, path):
    # arr is HxWx3 rgb uint8
    img = Image.fromarray(arr)
    img.save(path, format="PNG")

def save_mask_png(mask_arr, path):
    # mask_arr uint8 HxW
    img = Image.fromarray(mask_arr)
    img.save(path, format="PNG")

def create_timelapse_from_images(np_image_list, out_path, fps=6):
    """
    np_image_list: list of HxWx3 arrays (uint8)
    """
    frames = []
    for arr in np_image_list:
        frames.append(Image.fromarray(arr))
    # convert to temporary JPEGs in-memory for MoviePy
    tmp_paths = []
    for i, img in enumerate(frames):
        p = os.path.join(OUTPUT_DIR, f"frame_{uuid.uuid4().hex[:8]}.jpg")
        img.save(p, format="JPEG", quality=85)
        tmp_paths.append(p)
    clip = ImageSequenceClip(tmp_paths, fps=fps)
    clip.write_videofile(out_path, codec="libx264", audio=False, verbose=False, logger=None)
    # remove tmp frames
    for p in tmp_paths:
        try: os.remove(p)
        except: pass

def run_change_detection_pipeline(before_url, after_url, job_id):
    """
    Download two images (thumb URLs), compute mask, save outputs.
    Returns dict with file paths (relative to static dir).
    """
    job_folder = os.path.join(OUTPUT_DIR, job_id)
    os.makedirs(job_folder, exist_ok=True)

    before_bytes = download_image_from_url(before_url)
    after_bytes = download_image_from_url(after_url)

    before_np = png_bytes_to_numpy(before_bytes)
    after_np = png_bytes_to_numpy(after_bytes)

    mask = compute_change_mask(before_np, after_np)

    before_path = os.path.join(job_folder, "before.png")
    after_path = os.path.join(job_folder, "after.png")
    mask_path = os.path.join(job_folder, "mask.png")
    overlay_path = os.path.join(job_folder, "overlay.png")
    video_path = os.path.join(job_folder, "timelapse.mp4")

    save_image_numpy(before_np, before_path)
    save_image_numpy(after_np, after_path)
    save_mask_png(mask, mask_path)

    # overlay mask on after image for visualization (red overlay)
    alpha = 0.5
    overlay = after_np.copy()
    red = np.array([255,0,0], dtype=np.uint8)
    # create boolean mask
    m_bool = (mask > 0)
    overlay[m_bool] = (overlay[m_bool] * (1 - alpha) + red * alpha).astype(np.uint8)
    save_image_numpy(overlay, overlay_path)

    # create a tiny timelapse (just before->after repeated frames)
    frames = []
    frames.append(before_np)
    # add intermediate crossfade frames
    for t in np.linspace(0,1,8):
        blended = (before_np.astype(np.float32) * (1-t) + after_np.astype(np.float32) * t).astype(np.uint8)
        frames.append(blended)
    frames.append(after_np)
    create_timelapse_from_images(frames, video_path, fps=6)

    # return relative URLs
    return {
        "before": f"/assets/{job_id}/before.png",
        "after": f"/assets/{job_id}/after.png",
        "mask": f"/assets/{job_id}/mask.png",
        "overlay": f"/assets/{job_id}/overlay.png",
        "video": f"/assets/{job_id}/timelapse.mp4"
    }
