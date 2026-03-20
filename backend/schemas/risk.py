from pydantic import BaseModel, Field
from typing import Optional, Dict
from datetime import datetime

class RiskAssessmentInput(BaseModel):
    age: int = Field(..., ge=1, le=120)
    gender: Optional[float] = None        # 1.0 = Male, 0.0 = Female
    bmi: Optional[float] = Field(None, ge=10, le=80)
    high_bp: Optional[float] = None       # 1.0 = Yes, 0.0 = No
    high_cholesterol: Optional[float] = None
    smoker: Optional[float] = None
    physically_active: Optional[float] = None
    polyuria: Optional[float] = None
    polydipsia: Optional[float] = None
    sudden_weight_loss: Optional[float] = None

class RiskAssessmentResponse(BaseModel):
    risk_score: float
    risk_label: str
    risk_percentage: float
    feature_contributions: Dict[str, float]
    interpretation: str
    disclaimer: str = "This is a screening tool only. Please consult a healthcare professional for diagnosis."

    class Config:
        from_attributes = True