from sqlalchemy import (Column, Integer, String, Float, Boolean, 
                        DateTime, ForeignKey, Text, Enum)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base
import enum

# --- Enums ---
class GlucoseContext(enum.Enum):
    fasting = "fasting"
    pre_meal = "pre_meal"
    post_meal = "post_meal"
    random = "random"
    bedtime = "bedtime"

class DiabetesType(enum.Enum):
    type1 = "type1"
    type2 = "type2"
    gestational = "gestational"
    prediabetes = "prediabetes"

class EpisodeType(enum.Enum):
    hypoglycemia = "hypoglycemia"      # below 70 mg/dL
    hyperglycemia = "hyperglycemia"    # above 180 mg/dL

# --- Tables ---
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    is_patient = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    patient_profile = relationship("PatientProfile", back_populates="user", uselist=False)
    audit_logs = relationship("AuditLog", back_populates="user")


class PatientProfile(Base):
    __tablename__ = "patient_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    diabetes_type = Column(Enum(DiabetesType), nullable=False)
    date_of_birth = Column(DateTime, nullable=False)
    gender = Column(String, nullable=False)
    weight_kg = Column(Float)
    height_cm = Column(Float)
    target_glucose_min = Column(Float, default=70.0)   # mg/dL
    target_glucose_max = Column(Float, default=180.0)  # mg/dL
    diagnosis_date = Column(DateTime)
    doctor_name = Column(String)
    doctor_contact = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="patient_profile")
    glucose_logs = relationship("GlucoseLog", back_populates="patient")
    medications = relationship("Medication", back_populates="patient")
    episodes = relationship("GlucoseEpisode", back_populates="patient")


class GlucoseLog(Base):
    __tablename__ = "glucose_logs"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patient_profiles.id"), nullable=False)
    glucose_value = Column(Float, nullable=False)       # mg/dL
    context = Column(Enum(GlucoseContext), nullable=False)
    notes = Column(Text)
    logged_at = Column(DateTime(timezone=True), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    patient = relationship("PatientProfile", back_populates="glucose_logs")
    episode = relationship("GlucoseEpisode", back_populates="glucose_log", uselist=False)


class GlucoseEpisode(Base):
    __tablename__ = "glucose_episodes"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patient_profiles.id"), nullable=False)
    glucose_log_id = Column(Integer, ForeignKey("glucose_logs.id"), nullable=False)
    episode_type = Column(Enum(EpisodeType), nullable=False)
    glucose_value = Column(Float, nullable=False)
    severity = Column(String)                           # mild, moderate, severe
    notes = Column(Text)
    occurred_at = Column(DateTime(timezone=True), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    patient = relationship("PatientProfile", back_populates="episodes")
    glucose_log = relationship("GlucoseLog", back_populates="episode")


class Medication(Base):
    __tablename__ = "medications"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patient_profiles.id"), nullable=False)
    name = Column(String, nullable=False)
    dosage = Column(String, nullable=False)             # e.g. "500mg"
    frequency = Column(String, nullable=False)          # e.g. "twice daily"
    scheduled_time = Column(String)                     # e.g. "08:00,20:00"
    is_active = Column(Boolean, default=True)
    prescribed_by = Column(String)
    start_date = Column(DateTime)
    end_date = Column(DateTime)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    patient = relationship("PatientProfile", back_populates="medications")
    adherence_logs = relationship("MedicationAdherence", back_populates="medication")


class MedicationAdherence(Base):
    __tablename__ = "medication_adherence"

    id = Column(Integer, primary_key=True, index=True)
    medication_id = Column(Integer, ForeignKey("medications.id"), nullable=False)
    scheduled_time = Column(DateTime(timezone=True), nullable=False)
    taken_at = Column(DateTime(timezone=True))          # null means missed
    was_taken = Column(Boolean, default=False)
    notes = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    medication = relationship("Medication", back_populates="adherence_logs")


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    action = Column(String, nullable=False)             # e.g. "CREATE_GLUCOSE_LOG"
    table_affected = Column(String)
    record_id = Column(Integer)
    ip_address = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="audit_logs")


class RiskAssessment(Base):
    __tablename__ = "risk_assessments"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)  # can be anonymous
    age = Column(Integer)
    gender = Column(String)
    bmi = Column(Float)
    glucose_fasting = Column(Float)
    hba1c = Column(Float)
    blood_pressure_systolic = Column(Integer)
    family_history = Column(Boolean)
    physically_active = Column(Boolean)
    risk_score = Column(Float)                          # 0.0 - 1.0
    risk_label = Column(String)                         # low, moderate, high
    created_at = Column(DateTime(timezone=True), server_default=func.now())