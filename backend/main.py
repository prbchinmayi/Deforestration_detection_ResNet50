import io
import os

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image

from model_utils import predict, CLASSES

app = FastAPI(title="Deforestation Detection API")

# Restrict this to your deployed Next.js URL in production via env var.
FRONTEND_ORIGIN = os.environ.get("FRONTEND_ORIGIN", "*")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_ORIGIN] if FRONTEND_ORIGIN != "*" else ["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/overview")
def overview():
    """Static project metrics for the dashboard's overview page."""
    return {
        "dataset_size": 27000,
        "classes": CLASSES,
        "baseline_accuracy": 93.31,
        "optimized_accuracy": 98.10,
        "improvement_pp": 4.79,
        "best_hyperparameters": {
            "unfreeze_depth": "2 (layer3 + layer4)",
            "head_lr": 0.004625,
            "backbone_lr": 0.0000917,
            "dropout": 0.18,
            "weight_decay": 0.00068,
        },
    }


def _read_image(file: UploadFile) -> Image.Image:
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail=f"{file.filename} is not an image")
    return Image.open(io.BytesIO(file.file.read()))


@app.post("/predict")
async def predict_single(image: UploadFile = File(...)):
    """Classify one satellite image."""
    img = _read_image(image)
    label, confidence = predict(img)
    return {"class": label, "confidence": confidence}


@app.post("/detect")
async def detect_deforestation(before: UploadFile = File(...), after: UploadFile = File(...)):
    """Classify a before/after pair and flag a possible deforestation transition."""
    before_img = _read_image(before)
    after_img = _read_image(after)

    before_class, before_conf = predict(before_img)
    after_class, after_conf = predict(after_img)

    deforestation_detected = before_class == "Forest" and after_class != "Forest"

    return {
        "before": {"class": before_class, "confidence": before_conf},
        "after": {"class": after_class, "confidence": after_conf},
        "deforestation_detected": deforestation_detected,
    }