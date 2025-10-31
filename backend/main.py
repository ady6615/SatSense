# main.py
import os, uuid, json
from fastapi import FastAPI, HTTPException, BackgroundTasks, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
from database import SessionLocal, engine
from models import Job, Base
from gee_utils import initialize_ee, fetch_median_composite
from processing import run_change_detection_pipeline
from dotenv import load_dotenv

load_dotenv()
Base.metadata.create_all(bind=engine)

app = FastAPI(title="SatSense Backend")

origins = ["http://localhost:3000"]
app.add_middleware(CORSMiddleware, allow_origins=origins, allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

STATIC_DIR = os.environ.get("STATIC_DIR", "./outputs")
os.makedirs(STATIC_DIR, exist_ok=True)

# initialize EE if possible
SERVICE_ACCOUNT = os.environ.get("GEE_SERVICE_ACCOUNT_JSON")
initialize_ee(SERVICE_ACCOUNT)

class ProcessRequest(BaseModel):
    min_lon: float
    min_lat: float
    max_lon: float
    max_lat: float
    before_start: str  # "YYYY-MM-DD"
    before_end: str
    after_start: str
    after_end: str
    sensor: str = "SENTINEL_2"

def create_job_record(db, job_id, payload):
    j = Job(job_id=job_id, bbox=",".join(map(str, [payload.min_lon,payload.min_lat,payload.max_lon,payload.max_lat])),
            sensor=payload.sensor, start_date=payload.before_start, end_date=payload.after_end, status="pending")
    db.add(j); db.commit(); db.refresh(j)
    return j

@app.post("/api/process")
def process(req: ProcessRequest, background_tasks: BackgroundTasks):
    job_id = uuid.uuid4().hex[:12]
    db = SessionLocal()
    try:
        create_job_record(db, job_id, req)
    finally:
        db.close()

    # enqueue background task
    background_tasks.add_task(process_job, job_id, req)
    return {"job_id": job_id, "status": "started"}

def process_job(job_id, req):
    db = SessionLocal()
    job = db.query(Job).filter(Job.job_id == job_id).first()
    if not job:
        return
    try:
        job.status = "running"
        db.commit()

        bbox = (req.min_lon, req.min_lat, req.max_lon, req.max_lat)
        # get before & after thumb URLs via GEE
        before_url = fetch_median_composite(bbox, req.before_start, req.before_end, sensor=req.sensor)
        after_url = fetch_median_composite(bbox, req.after_start, req.after_end, sensor=req.sensor)

        # run processing
        results = run_change_detection_pipeline(before_url, after_url, job_id)

        job.status = "done"
        job.result_json = json.dumps(results)
        db.commit()
    except Exception as e:
        job.status = "failed"
        job.result_json = str(e)
        db.commit()
    finally:
        db.close()

@app.get("/api/status/{job_id}")
def job_status(job_id: str):
    db = SessionLocal()
    job = db.query(Job).filter(Job.job_id == job_id).first()
    db.close()
    if not job:
        raise HTTPException(404, "Job not found")
    return {"job_id": job.job_id, "status": job.status, "result": json.loads(job.result_json) if job.result_json else None}

@app.get("/assets/{job_id}/{filename}")
def serve_asset(job_id: str, filename: str):
    path = os.path.join(STATIC_DIR, job_id, filename)
    if not os.path.exists(path):
        raise HTTPException(404, "File not found")
    # Let FastAPI stream file
    return FileResponse(path, media_type=None, filename=filename)

@app.get("/api/jobs")
def list_jobs():
    db = SessionLocal()
    rows = db.query(Job).order_by(Job.created_at.desc()).limit(50).all()
    db.close()
    out = []
    for j in rows:
        out.append({
            "job_id": j.job_id,
            "bbox": j.bbox,
            "sensor": j.sensor,
            "status": j.status,
            "result": json.loads(j.result_json) if j.result_json else None,
            "created_at": str(j.created_at)
        })
    return out
