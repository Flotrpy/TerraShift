# TerraShift

Transfer learning on Sentinel-2 satellite imagery (EuroSAT) for land-cover classification, with an interactive
research website that lets visitors run real inference against the trained model.

## Research questions

- **Main:** How effectively can transfer learning using Sentinel-2 satellite imagery classify land-cover types,
  and can these classifications be used to identify potential land-cover changes?
- **Secondary:** Does multispectral Sentinel-2 imagery improve land-cover classification performance compared
  with RGB imagery?

## Repository structure

```
TerraShift/
├── app/            # Next.js frontend (Home, Dataset Library, Upload & Predict, Model Demo, Research, Methodology, Results, GitHub)
├── components/     # Shared React components
├── lib/            # Frontend utilities (API client, types)
├── public/         # Static assets
├── inference/      # FastAPI inference backend (GET /health, POST /predict)
├── research/
│   ├── experiments/  # Training + evaluation scripts
│   ├── results/       # Metrics, logs (no raw images)
│   ├── figures/        # Confusion matrices, curves, Grad-CAM
│   ├── prompts/
│   └── research_log.md
└── notebooks/      # Exploratory notebooks
```

## Dataset

[EuroSAT](https://github.com/phelber/EuroSAT) — 27,000 labeled Sentinel-2 patches across 10 land-cover classes
(AnnualCrop, Forest, HerbaceousVegetation, Highway, Industrial, Pasture, PermanentCrop, Residential, River,
SeaLake), in both RGB and 13-band multispectral form. Not committed to this repo — see `research/experiments/data.py`
for the download + split (70/15/15, seed 42).

## Models

- **RGB baseline:** ResNet50 (ImageNet-pretrained), frozen backbone, 10-class head. See `research/experiments/train_rgb.py`.
- **Multispectral baseline:** ResNet50 with a 13-channel first convolution, initialized from RGB weights.
  See `research/experiments/train_multispectral.py`.

Reported accuracy/precision/recall/F1 numbers always come from actual experiment runs logged under
`research/results/` — never hardcoded.

## Inference backend

```
cd inference
pip install -r requirements.txt
uvicorn main:app --reload
```

`GET /health`, `POST /predict` (multipart image upload → prediction, confidence, per-class probabilities).

## Frontend

```
npm install
npm run dev
```

## Status

Early scaffold — see `research/research_log.md` for progress notes.
