# database.py
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

from os import environ
from dotenv import load_dotenv
load_dotenv()

DATABASE_URL = environ.get("DATABASE_URL", "sqlite:///./satsense_jobs.db")

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
Base = declarative_base()
