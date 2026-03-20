from sqlalchemy.orm import Session
from sqlalchemy import func
from backend.models.models import (
    PatientProfile, GlucoseLog, GlucoseEpisode,
    Medication, MedicationAdherence, EpisodeType
)
from datetime import datetime
from typing import Optional, List

def get_or_create_patient_profile(db: Session, user_id: int, data: dict) -> PatientProfile:
    profile = db.query(PatientProfile).filter(
        PatientProfile.user_id == user_id
    ).first()
    if profile:
        return profile
    profile = PatientProfile(user_id=user_id, **data)
    db.add(profile)
    db.commit()
    db.refresh(profile)
    return profile

def get_patient_profile(db: Session, user_id: int) -> Optional[PatientProfile]:
    return db.query(PatientProfile).filter(
        PatientProfile.user_id == user_id
    ).first()

def log_glucose(db: Session, patient_id: int, 
                glucose_value: float, context, 
                logged_at: datetime,
                notes: Optional[str] = None,
                target_min: float = 70.0,
                target_max: float = 180.0) -> GlucoseLog:

    # Create glucose log
    log = GlucoseLog(
        patient_id=patient_id,
        glucose_value=glucose_value,
        context=context,
        notes=notes,
        logged_at=logged_at
    )
    db.add(log)
    db.flush()  # get log.id before committing

    # Auto-detect episode
    episode = None
    if glucose_value < target_min:
        episode_type = EpisodeType.hypoglycemia
        if glucose_value < 54:
            severity = "severe"
        elif glucose_value < 70:
            severity = "moderate"
        else:
            severity = "mild"
    elif glucose_value > target_max:
        episode_type = EpisodeType.hyperglycemia
        if glucose_value > 300:
            severity = "severe"
        elif glucose_value > 240:
            severity = "moderate"
        else:
            severity = "mild"
    else:
        episode_type = None
        severity = None

    if episode_type:
        episode = GlucoseEpisode(
            patient_id=patient_id,
            glucose_log_id=log.id,
            episode_type=episode_type,
            glucose_value=glucose_value,
            severity=severity,
            occurred_at=logged_at
        )
        db.add(episode)

    db.commit()
    db.refresh(log)
    return log

def get_glucose_logs(db: Session, patient_id: int, 
                     limit: int = 30) -> List[GlucoseLog]:
    return db.query(GlucoseLog).filter(
        GlucoseLog.patient_id == patient_id
    ).order_by(GlucoseLog.logged_at.desc()).limit(limit).all()

def get_episodes(db: Session, patient_id: int,
                 limit: int = 20) -> List[GlucoseEpisode]:
    return db.query(GlucoseEpisode).filter(
        GlucoseEpisode.patient_id == patient_id
    ).order_by(GlucoseEpisode.occurred_at.desc()).limit(limit).all()

def add_medication(db: Session, patient_id: int, 
                   data: dict) -> Medication:
    med = Medication(patient_id=patient_id, **data)
    db.add(med)
    db.commit()
    db.refresh(med)
    return med

def get_medications(db: Session, patient_id: int) -> List[Medication]:
    return db.query(Medication).filter(
        Medication.patient_id == patient_id,
        Medication.is_active == True
    ).all()

def log_adherence(db: Session, data: dict) -> MedicationAdherence:
    adherence = MedicationAdherence(**data)
    db.add(adherence)
    db.commit()
    db.refresh(adherence)
    return adherence

def get_adherence_rate(db: Session, patient_id: int) -> dict:
    meds = get_medications(db, patient_id)
    results = {}
    for med in meds:
        total = db.query(MedicationAdherence).filter(
            MedicationAdherence.medication_id == med.id
        ).count()
        taken = db.query(MedicationAdherence).filter(
            MedicationAdherence.medication_id == med.id,
            MedicationAdherence.was_taken == True
        ).count()
        results[med.name] = {
            "total_scheduled": total,
            "taken": taken,
            "adherence_rate": round(taken/total*100, 1) if total > 0 else 0
        }
    return results