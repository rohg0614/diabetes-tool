from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from backend.models.database import engine
from backend.models import models

# Create tables on startup if they don't exist
@asynccontextmanager
async def lifespan(app: FastAPI):
    models.Base.metadata.create_all(bind=engine)
    yield

app = FastAPI(
    title="Diabetes Risk Assessment & Management API",
    description="ML-powered diabetes screening and patient management platform",
    version="1.0.0",
    lifespan=lifespan
)

# CORS — allow Streamlit frontend and future mobile app
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check
@app.get("/")
def root():
    return {
        "status": "online",
        "app": "Diabetes Tool API",
        "version": "1.0.0"
    }

@app.get("/health")
def health():
    return {"status": "healthy"}

from backend.api.auth import router as auth_router
app.include_router(auth_router)

from backend.api.risk import router as risk_router
app.include_router(risk_router)