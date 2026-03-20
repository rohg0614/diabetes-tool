from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from backend.models.models import GlucoseContext, DiabetesType, EpisodeType

class PatientProfileCreate(BaseModel):
    diabetes_type: DiabetesType
    date_of_birth: datetime
    gender: str
    weight_kg: Optional[float] = None
    height_cm: Optional[float] = None
    target_glucose_min: float = 70.0
    target_glucose_max: float = 180.0
    diagnosis_date: Optional[datetime] = None
    doctor_name: Optional[str] = None
    doctor_contact: Optional[str] = None

class PatientProfileResponse(BaseModel):
    id: int
    user_id: int
    diabetes_type: DiabetesType
    gender: str
    weight_kg: Optional[float]
    height_cm: Optional[float]
    target_glucose_min: float
    target_glucose_max: float
    doctor_name: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True

class GlucoseLogCreate(BaseModel):
    glucose_value: float = Field(..., ge=20, le=600)
    context: GlucoseContext
    notes: Optional[str] = None
    logged_at: datetime

class EpisodeResponse(BaseModel):
    id: int
    episode_type: str
    glucose_value: float
    severity: Optional[str]
    occurred_at: datetime

    class Config:
        from_attributes = True

class GlucoseLogResponse(BaseModel):
    id: int
    glucose_value: float
    context: GlucoseContext
    notes: Optional[str]
    logged_at: datetime
    episode: Optional[EpisodeResponse] = None

    class Config:
        from_attributes = True

class MedicationCreate(BaseModel):
    name: str
    dosage: str
    frequency: str
    scheduled_time: Optional[str] = None
    prescribed_by: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None

class MedicationResponse(BaseModel):
    id: int
    name: str
    dosage: str
    frequency: str
    scheduled_time: Optional[str]
    is_active: bool
    prescribed_by: Optional[str]
    start_date: Optional[datetime]

    class Config:
        from_attributes = True

class MedicationAdherenceCreate(BaseModel):
    medication_id: int
    scheduled_time: datetime
    taken_at: Optional[datetime] = None
    was_taken: bool = False
    notes: Optional[str] = None

class MedicationAdherenceResponse(BaseModel):
    id: int
    medication_id: int
    scheduled_time: datetime
    taken_at: Optional[datetime]
    was_taken: bool

    class Config:
        from_attributes = True