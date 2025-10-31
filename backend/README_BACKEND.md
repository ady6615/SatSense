SatSense Backend README

1) Create virtual environment
   python -m venv venv
   source venv/bin/activate   (Windows: venv\Scripts\activate)

2) Install
   pip install -r requirements.txt

3) Configure:
   - copy .env.example -> .env and edit if needed
   - If using GEE: authenticate:
     a) For interactive: run `earthengine authenticate` and follow steps.
     b) Or create service account and set GEE_SERVICE_ACCOUNT_JSON to key file.

4) Run:
   uvicorn main:app --reload --port 8000

Endpoints:
POST /api/process    -> JSON body {min_lon,min_lat,max_lon,max_lat,before_start,before_end,after_start,after_end,sensor}
GET  /api/status/{job_id}
GET  /api/jobs
GET  /assets/{job_id}/{filename}  (files: before.png, after.png, mask.png, overlay.png, timelapse.mp4)
