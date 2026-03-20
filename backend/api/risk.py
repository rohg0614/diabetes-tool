from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.models.database import get_db
from backend.models.models import RiskAssessment
from backend.schemas.risk import RiskAssessmentInput, RiskAssessmentResponse
from backend.services.risk_service import assess_risk
from backend.api.auth import get_current_user
from typing import Optional

router = APIRouter(prefix="/risk", tags=["Risk Assessment"])

@router.post("/assess", response_model=RiskAssessmentResponse)
def assess(
    input_data: RiskAssessmentInput,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    # Run model
    result = assess_risk(input_data.model_dump())

    # Save to database
    assessment = RiskAssessment(
        user_id=current_user.id,
        age=input_data.age,
        gender=str(input_data.gender),
        bmi=input_data.bmi,
        blood_pressure_systolic=None,
        family_history=None,
        physically_active=input_data.physically_active,
        risk_score=result['risk_score'],
        risk_label=result['risk_label']
    )
    db.add(assessment)
    db.commit()

    return result