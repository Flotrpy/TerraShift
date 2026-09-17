"""TerraShift inference backend.

FastAPI service that wraps the trained RGB ResNet50 checkpoint. Deployed separately from the
Vercel frontend (see README.md). Exposes:

  GET  /health
  POST /predict   (multipart image upload -> prediction, confidence, per-class probabilities)

The checkpoint file is never committed to git -- point CHECKPOINT_PATH at wherever it's stored
(local disk on the inference host, a mounted volume, or downloaded at startup from object storage).
"""

import io
import os
import urllib.request

import torch
import torch.nn.functional as F
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
from torchvision import transforms

from model import CLASSES, load_model

CHECKPOINT_PATH = os.environ.get("CHECKPOINT_PATH", "./checkpoints/rgb_best.pth")
# Public URL to download the checkpoint from at startup if it isn't already on disk
# (e.g. a Hugging Face model repo's resolve URL). Keeps the ~90MB weight file out of
# every git repo -- it's fetched once when the container boots.
CHECKPOINT_URL = os.environ.get("CHECKPOINT_URL", "")
ALLOWED_ORIGINS = os.environ.get("ALLOWED_ORIGINS", "*").split(",")


def ensure_checkpoint() -> None:
    if os.path.exists(CHECKPOINT_PATH):
        return
    if not CHECKPOINT_URL:
        return
    os.makedirs(os.path.dirname(CHECKPOINT_PATH) or ".", exist_ok=True)
    print(f"Downloading checkpoint from {CHECKPOINT_URL} -> {CHECKPOINT_PATH}")
    urllib.request.urlretrieve(CHECKPOINT_URL, CHECKPOINT_PATH)

IMAGENET_MEAN = [0.485, 0.456, 0.406]
IMAGENET_STD = [0.229, 0.224, 0.225]

preprocess = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=IMAGENET_MEAN, std=IMAGENET_STD),
])

app = FastAPI(title="TerraShift Inference API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = None
model_load_error = None

try:
    ensure_checkpoint()
    if os.path.exists(CHECKPOINT_PATH):
        model = load_model(CHECKPOINT_PATH, device)
    else:
        model_load_error = f"Checkpoint not found at {CHECKPOINT_PATH} and CHECKPOINT_URL is not set"
except Exception as e:  # noqa: BLE001
    model_load_error = str(e)


@app.get("/health")
def health():
    return {
        "status": "ok" if model is not None else "model_not_loaded",
        "model_loaded": model is not None,
        "detail": model_load_error,
        "device": str(device),
    }


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    if model is None:
        raise HTTPException(
            status_code=503,
            detail=f"Model checkpoint not available yet ({model_load_error}). "
                   "Model inference coming soon.",
        )
    if file.content_type not in ("image/jpeg", "image/jpg", "image/png"):
        raise HTTPException(status_code=400, detail="Only JPG/JPEG/PNG uploads are supported.")

    raw = await file.read()
    try:
        img = Image.open(io.BytesIO(raw)).convert("RGB")
    except Exception:
        raise HTTPException(status_code=400, detail="Could not read the uploaded image.")

    tensor = preprocess(img).unsqueeze(0).to(device)
    with torch.no_grad():
        logits = model(tensor)
        probs = F.softmax(logits, dim=1)[0].cpu().tolist()

    pred_idx = int(torch.tensor(probs).argmax())
    return {
        "prediction": CLASSES[pred_idx],
        "confidence": probs[pred_idx],
        "probabilities": {c: p for c, p in zip(CLASSES, probs)},
        "model": "TerraShift RGB ResNet50",
        "note": "Uploaded images outside the EuroSAT training distribution are experimental predictions.",
    }
