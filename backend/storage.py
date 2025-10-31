# storage.py
import os, shutil

def ensure_dir(path):
    os.makedirs(path, exist_ok=True)

def save_bytes(path, b):
    ensure_dir(os.path.dirname(path))
    with open(path, "wb") as f:
        f.write(b)

def list_job_files(job_dir):
    files = {}
    if not os.path.exists(job_dir): return files
    for nm in os.listdir(job_dir):
        files[nm] = os.path.join(job_dir, nm)
    return files
