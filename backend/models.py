# models.py
from sqlalchemy import Column, Integer, String, DateTime, Text
from sqlalchemy.sql import func
from database import Base

class Job(Base):
    __tablename__ = "jobs"
    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(String, unique=True, index=True)
    bbox = Column(String)  # "minLon,minLat,maxLon,maxLat"
    sensor = Column(String)
    start_date = Column(String)
    end_date = Column(String)
    status = Column(String, default="pending")  # pending, running, done, failed
    result_json = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
