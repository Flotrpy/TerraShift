# TerraShift inference backend

FastAPI service wrapping the trained RGB ResNet50 checkpoint.

## Run locally

```
pip install -r requirements.txt
export CHECKPOINT_PATH=/path/to/rgb_best.pth   # not committed to git
uvicorn main:app --reload
```

`GET /health` reports whether a checkpoint is loaded. Until one is, `/predict` returns a 503 with a
"Model inference coming soon" message -- the frontend should treat that as the coming-soon state, never
fabricate a prediction.

## Deploy

Deploy this directory to a Python host separate from the Vercel frontend (Render, Railway, Fly.io, etc.).
Set `CHECKPOINT_PATH` to wherever the checkpoint is stored on that host, and `ALLOWED_ORIGINS` to the
deployed frontend's origin.
