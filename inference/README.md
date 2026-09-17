---
title: TerraShift Inference
emoji: 🛰️
colorFrom: green
colorTo: blue
sdk: docker
app_port: 7860
---

# TerraShift inference backend

FastAPI service wrapping the trained RGB ResNet50 checkpoint. This directory is deployed as its
own Hugging Face Space (Docker SDK), separate from the Vercel frontend.

## Deploying to Hugging Face Spaces

1. Create a new Space at huggingface.co/new-space with SDK = **Docker**.
2. Clone that Space's git repo to a fresh local folder (not inside the main TerraShift repo).
3. Copy these files into it: `Dockerfile`, `main.py`, `model.py`, `requirements.txt`,
   `.gitattributes`, this `README.md`.
4. Copy `rgb_best.pth` into a `checkpoints/` folder inside that same clone.
5. `git lfs install`, then `git add . && git commit -m "Deploy TerraShift inference" && git push`.

The Space will build the Dockerfile and serve the API at `https://<your-space>.hf.space`.
`GET /health` reports whether the checkpoint loaded. Once it's live, set
`NEXT_PUBLIC_INFERENCE_API_URL` on the Vercel project to that URL.

## Run locally instead

```
pip install -r requirements.txt
export CHECKPOINT_PATH=/path/to/rgb_best.pth   # not committed to this git repo
uvicorn main:app --reload
```

`GET /health` reports whether a checkpoint is loaded. Until one is, `/predict` returns a 503 with a
"Model inference coming soon" message -- the frontend should treat that as the coming-soon state, never
fabricate a prediction.
