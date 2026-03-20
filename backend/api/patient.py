from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.models.database import get_db
from backend.schemas.patient import (
    PatientProfileCreate, PatientProfileResponse,
    GlucoseLogCreate, GlucoseLogResponse,
    MedicationCreate, MedicationResponse,
    MedicationAdherenceCreate, MedicationAdherenceResponse
)
from backend.services.patient_service import (
    get_or_create_patient_profile, get_patient_profile,
    log_glucose, get_glucose_logs, get_episodes,
    add_medication, get_medications,
    log_adherence, get_adherence_rate
)
from backend.api.auth import get_current_user
from typing import List

router = APIRouter(prefix="/patient", tags=["Patient Management"])

def get_patient_or_404(db, user_id):
    profile = get_patient_profile(db, user_id)
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient profile not found. Please create one first."
        )
    return profile

# --- Profile ---
@router.post("/profile", response_model=PatientProfileResponse)
def create_profile(
    data: PatientProfileCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    profile = get_or_create_patient_profile(
        db, current_user.id, data.model_dump()
    )
    return profile

@router.get("/profile", response_model=PatientProfileResponse)
def get_profile(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    return get_patient_or_404(db, current_user.id)

# --- Glucose Logging ---
@router.post("/glucose", response_model=GlucoseLogResponse)
def log_glucose_reading(
    data: GlucoseLogCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    profile = get_patient_or_404(db, current_user.id)
    log = log_glucose(
        db=db,
        patient_id=profile.id,
        glucose_value=data.glucose_value,
        context=data.context,
        logged_at=data.logged_at,
        notes=data.notes,
        target_min=profile.target_glucose_min,
        target_max=profile.target_glucose_max
    )
    return log

@router.get("/glucose", response_model=List[GlucoseLogResponse])
def get_glucose_history(
    limit: int = 30,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    profile = get_patient_or_404(db, current_user.id)
    return get_glucose_logs(db, profile.id, limit)

# --- Episodes ---
@router.get("/episodes")
def get_glucose_episodes(
    limit: int = 20,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    profile = get_patient_or_404(db, current_user.id)
    episodes = get_episodes(db, profile.id, limit)
    return [
        {
            "id": e.id,
            "episode_type": e.episode_type.value,
            "glucose_value": e.glucose_value,
            "severity": e.severity,
            "occurred_at": e.occurred_at
        }
        for e in episodes
    ]

# --- Medications ---
@router.post("/medications", response_model=MedicationResponse)
def add_medication_route(
    data: MedicationCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    profile = get_patient_or_404(db, current_user.id)
    return add_medication(db, profile.id, data.model_dump())

@router.get("/medications", response_model=List[MedicationResponse])
def get_medications_route(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    profile = get_patient_or_404(db, current_user.id)
    return get_medications(db, profile.id)

# --- Adherence ---
@router.post("/adherence", response_model=MedicationAdherenceResponse)
def log_adherence_route(
    data: MedicationAdherenceCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    return log_adherence(db, data.model_dump())

@router.get("/adherence/summary")
def get_adherence_summary(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    profile = get_patient_or_404(db, current_user.id)
    return get_adherence_rate(db, profile.id)