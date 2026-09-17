# TerraShift inference backend

FastAPI service wrapping the trained RGB ResNet50 checkpoint. Deployed as its own Render web
service (Docker), separate from the Vercel frontend. The checkpoint is never committed to any
git repo -- the container downloads it at startup from a public URL.

## Deploying to Render (free tier)

1. Upload `rgb_best.pth` to a public Hugging Face **model** repo (huggingface.co/new, type
   "Model" -- this is free even without a Pro plan; only Spaces compute is paywalled). Drag and
   drop the file in the web UI. Grab its direct URL:
   `https://huggingface.co/<user>/<repo>/resolve/main/rgb_best.pth`
2. On render.com: New -> Web Service -> connect the `Flotrpy/TerraShift` GitHub repo.
3. Set **Root Directory** to `inference`, **Runtime** to Docker, **Instance Type** to Free.
4. Add environment variables:
   - `CHECKPOINT_URL` = the Hugging Face file URL from step 1
   - `ALLOWED_ORIGINS` = `https://terra-shift.vercel.app`
5. Deploy. `GET /health` reports whether the checkpoint downloaded and loaded.

Render's free tier spins the service down after inactivity, so the first request after a while
can take 30-60 seconds to cold-start -- normal, not an error.

Once it's live, set `NEXT_PUBLIC_INFERENCE_API_URL` on the Vercel project to the Render URL
(`https://<service-name>.onrender.com`).

## Run locally instead

```
pip install -r requirements.txt
export CHECKPOINT_PATH=/path/to/rgb_best.pth   # not committed to this repo
uvicorn main:app --reload
```

`GET /health` reports whether a checkpoint is loaded. Until one is, `/predict` returns a 503 with a
"Model inference coming soon" message -- the frontend should treat that as the coming-soon state,
never fabricate a prediction.
