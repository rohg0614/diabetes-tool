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

## Frontend

The production frontend is built with Vite + React + TypeScript, replacing the Streamlit prototype. It features the GlucoPulse dark theme design system with the following pages:

- Landing page with real model metrics, bento grid feature layout, and dataset links
- Risk assessment with SHAP contribution visualization
- Patient dashboard with glucose trends and episode history
- Medication tracking and adherence
- Clinical PDF report generation and download

The Streamlit prototype remains functional and is used for rapid feature validation.

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

- **Language** — Python 3.11 (backend), TypeScript (frontend)
- **API** — FastAPI, Uvicorn
- **Database** — PostgreSQL on Neon, SQLAlchemy, Alembic
- **ML** — XGBoost, scikit-learn, SHAP, pandas, numpy
- **Frontend** — Vite + React + TypeScript (Phase 2), Streamlit (Phase 1 prototype)
- **Auth** — JWT, bcrypt, python-jose
- **PDF** — ReportLab
- **Environment** — Miniforge, conda (backend), Node.js + npm (frontend)

---

## Project Structure
```
diabetes-tool/
├── backend/          ← FastAPI + all endpoints
├── frontend_streamlit/ ← Working Streamlit prototype
├── frontend_react/   ← Vite + React (in progress)
├── notebooks/        ← EDA + harmonization + model training
├── data/            ← processed datasets
├── alembic/         ← DB migrations
└── README.md
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
- [x] Streamlit frontend (Phase 1 — functional prototype)
- [x] Auth layer
- [x] Risk assessment endpoint with SHAP
- [x] Patient management — glucose logging, episode detection
- [x] Medication tracking and adherence
- [x] PDF report generation
- [x] Vite + React frontend (Phase 2 — in progress)
- [x] Landing page with GlucoPulse branding
- [ ] Login and Register pages
- [ ] Risk assessment page with SHAP visualization
- [ ] Patient dashboard
- [ ] Medications and adherence UI
- [ ] Reports page
- [ ] Google OAuth
- [ ] Flutter mobile app (Phase 3)
- [ ] Production deployment
---

## Academic Context

Built as a data science and ML portfolio project. Intended for review and extension in collaboration with university faculty across DBMS, Algorithms, and AI domains.


---

## Author

Rohin Gupta — [github.com/rohg0614](https://github.com/rohg0614)