# Diabetes Risk Assessment & Management Platform

A full-stack, ML-powered diabetes screening and chronic disease management platform built for academic research. Designed with a HIPAA-aligned architecture and intended for future clinical and mobile deployment.

---

## Project Goals

- **Risk Assessment** — Users enter health metrics and receive an ML-generated diabetes risk score with explainable AI (SHAP) showing which factors contributed most
- **Patient Management** — Confirmed diabetics can log glucose readings, track medications, monitor hypo/hyperglycemic episodes, and export clinical PDF reports
- **Research Grade** — Rigorous model training on harmonized multi-source datasets with demographic subgroup analysis and a published model card

---

## ML Model

Trained on a harmonized dataset stitched from four sources:

| Dataset | Size | Contribution |
|---|---|---|
| PIMA Indians Diabetes | 768 rows | Clean baseline, well-studied |
| CDC BRFSS Health Indicators | ~250k rows | Large, diverse, US population |
| Sylhet Diabetes Dataset | 520 rows | South Asian demographic representation |
| 130-US Hospitals | ~100k rows | Clinical inpatient data |

Model: XGBoost with SHAP explainability
Evaluation: Stratified k-fold, ROC-AUC, precision-recall, demographic subgroup analysis

---

## Architecture
```
Frontend  →  Streamlit (Phase 1)  →  React (Phase 2)
Backend   →  FastAPI
Database  →  PostgreSQL on Neon (cloud)
Auth      →  JWT with refresh tokens
PDF       →  ReportLab
Mobile    →  Kotlin (Phase 3)
```

---

## Features

- ML-powered diabetes risk scoring with per-feature explanation
- Blood glucose logging with context (fasting, pre/post meal, bedtime)
- Automatic hypo/hyperglycemic episode detection
- Medication scheduling, logging and adherence tracking
- Doctor-facing PDF reports with time-in-range, HbA1c estimates and trend charts
- HIPAA-aligned architecture with audit logging and encrypted sensitive fields

---

## Tech Stack

- **Language** — Python 3.11
- **API** — FastAPI, Uvicorn
- **Database** — PostgreSQL, SQLAlchemy, Alembic
- **ML** — XGBoost, scikit-learn, SHAP, pandas, numpy
- **Frontend** — Streamlit
- **Auth** — JWT, bcrypt, python-jose
- **PDF** — ReportLab
- **Environment** — Miniforge, conda

---

## Project Structure
```
diabetes-tool/
├── backend/
│   ├── api/              # FastAPI route handlers
│   ├── models/           # SQLAlchemy DB models
│   ├── ml/               # Training scripts, saved models
│   ├── services/         # Business logic
│   ├── schemas/          # Pydantic schemas
│   └── main.py
├── frontend/             # Streamlit app
├── data/                 # Raw and processed datasets
├── notebooks/            # EDA and model training
├── alembic/              # Database migrations
└── requirements.txt
```

---

## Setup
```bash
# Clone the repo
git clone https://github.com/rohg0614/diabetes-tool.git
cd diabetes-tool

# Create and activate conda environment
conda create -n diabetes-tool python=3.11
conda activate diabetes-tool

# Install scientific stack
conda install numpy pandas scikit-learn matplotlib seaborn jupyter -y

# Install remaining dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Fill in your DATABASE_URL and SECRET_KEY

# Run database migrations
alembic upgrade head

# Start the API
uvicorn backend.main:app --reload

# Start the frontend
streamlit run frontend/app.py
```

---

## Status

Currently in active development.

- [x] Project scaffold
- [x] Database schema and migrations
- [x] Dataset acquisition
- [x] EDA and dataset harmonization
- [x] Model training and evaluation
- [x] FastAPI backend
- [x] Streamlit frontend
- [x] Auth layer
- [x] Risk assessment endpoint with SHAP
- [x] Patient management — glucose logging, episode detection
- [x] Medication tracking and adherence
- [x] PDF report generation
- [ ] Patient profile setup flow in frontend
- [ ] Homepage / landing page
- [ ] Prominent disclaimer on risk assessment
- [ ] Dark mode toggle
- [ ] UI polish pass
- [ ] React frontend (Phase 2)
- [ ] Kotlin mobile app (Phase 3)
---

## Academic Context

Built as a data science and ML portfolio project. Intended for review and extension in collaboration with university faculty across DBMS, Algorithms, and AI domains.

---

## Author

Rohin Gupta