"""
Model definition and inference helpers.
Mirrors the architecture from Deforestration_detection_resnet50.ipynb so a
checkpoint saved from the notebook loads here without modification.
"""
import os
import urllib.request

import torch
import torch.nn as nn
from torchvision import models, transforms

# EuroSAT class order (matches torchvision.datasets.EuroSAT.classes)
CLASSES = [
    "AnnualCrop", "Forest", "HerbaceousVegetation", "Highway", "Industrial",
    "Pasture", "PermanentCrop", "Residential", "River", "SeaLake",
]

# Best GA-found config from the README / notebook
UNFREEZE_DEPTH = 2
DROPOUT_RATE = 0.18

MODEL_PATH = os.path.join(os.path.dirname(__file__), "models", "model.pth")
# Set this env var to a direct-download URL (GitHub Release asset or Hugging
# Face Hub file) so the API can fetch the checkpoint at startup instead of
# committing a ~100MB file to the repo. Required on Render, whose disk is
# ephemeral between deploys.
MODEL_URL = os.environ.get("MODEL_URL", "")

TRANSFORM = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])

_model = None  # lazy-loaded singleton


def build_model(num_classes: int = 10) -> nn.Module:
    """Recreate the exact architecture used for the best GA candidate."""
    model = models.resnet50(weights=None)
    in_features = model.fc.in_features
    if DROPOUT_RATE > 0.05:
        model.fc = nn.Sequential(nn.Dropout(p=DROPOUT_RATE), nn.Linear(in_features, num_classes))
    else:
        model.fc = nn.Linear(in_features, num_classes)
    return model


def ensure_weights_downloaded():
    if os.path.exists(MODEL_PATH):
        return
    if not MODEL_URL:
        raise FileNotFoundError(
            f"No checkpoint at {MODEL_PATH} and MODEL_URL is not set. "
            "Add models/model.pth or set the MODEL_URL env var."
        )
    os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
    urllib.request.urlretrieve(MODEL_URL, MODEL_PATH)


def get_model(device: str = "cpu") -> nn.Module:
    """Load once per process and reuse across requests."""
    global _model
    if _model is None:
        ensure_weights_downloaded()
        _model = build_model(num_classes=len(CLASSES))
        state_dict = torch.load(MODEL_PATH, map_location=device)
        _model.load_state_dict(state_dict)
        _model.to(device)
        _model.eval()
    return _model


def predict(image, device: str = "cpu"):
    """image: a PIL.Image (RGB). Returns (class_name, confidence_float_0_1)."""
    model = get_model(device)
    tensor = TRANSFORM(image.convert("RGB")).unsqueeze(0).to(device)
    with torch.no_grad():
        output = model(tensor)
        probs = torch.softmax(output, dim=1)
        confidence, predicted = torch.max(probs, 1)
    return CLASSES[predicted.item()], confidence.item()