from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# -------------------------------------------------------
# DATABASE CONFIGURATION
# - Locally: uses SQLite (no setup needed)
# - On Railway: set DATABASE_URL env var to your PostgreSQL connection string
# -------------------------------------------------------

SQLALCHEMY_DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "sqlite:///./flipkart.db"  # fallback for local dev
)

# SQLite needs check_same_thread=False; PostgreSQL does not need it
connect_args = {"check_same_thread": False} if SQLALCHEMY_DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
