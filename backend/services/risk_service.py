import joblib
import numpy as np
import pandas as pd
import shap
from pathlib import Path

# Load model artifacts
MODEL_DIR = Path(__file__).resolve().parent.parent / 'ml'

xgb_model = joblib.load(MODEL_DIR / 'xgb_diabetes_model.pkl')
imputer = joblib.load(MODEL_DIR / 'imputer.pkl')
features = joblib.load(MODEL_DIR / 'features.pkl')

# SHAP explainer
explainer = shap.TreeExplainer(xgb_model)

def assess_risk(input_data: dict) -> dict:
    # Build input dataframe in correct feature order
    row = {f: input_data.get(f, np.nan) for f in features}
    df = pd.DataFrame([row])

    # Impute missing values
    df_imputed = pd.DataFrame(
        imputer.transform(df),
        columns=features
    )

    # Predict risk score
    risk_score = float(xgb_model.predict_proba(df_imputed)[0][1])

    # SHAP values for this prediction
    shap_values = explainer.shap_values(df_imputed)
    feature_contributions = {
        features[i]: round(float(shap_values[0][i]), 4)
        for i in range(len(features))
    }

    # Risk label
    if risk_score < 0.2:
        risk_label = "low"
        interpretation = "Your risk indicators suggest a low probability of diabetes. Maintain a healthy lifestyle."
    elif risk_score < 0.5:
        risk_label = "moderate"
        interpretation = "Your risk indicators suggest a moderate probability. Consider consulting a healthcare provider."
    else:
        risk_label = "high"
        interpretation = "Your risk indicators suggest a high probability. Please consult a healthcare provider promptly."

    return {
        "risk_score": round(risk_score, 4),
        "risk_label": risk_label,
        "risk_percentage": round(risk_score * 100, 1),
        "feature_contributions": feature_contributions,
        "interpretation": interpretation
    }