from sqlalchemy import create_engine, Column, Integer, String, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import uuid
DB_URL = "sqlite:///./nagarik_seva_v4.db"
engine = create_engine(DB_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class Complaint(Base):
    __tablename__ = "complaints"
    id = Column(Integer, primary_key=True, index=True)
    reg_id = Column(String, unique=True)
    title = Column(String)
    description = Column(Text)
    category = Column(String)
    status = Column(String, default="Pending")

Base.metadata.create_all(bind=engine)