# TerraShift
TerraShift uses machine learning and satellite imagery to classify land cover and detect environmental changes. Using EuroSAT and ResNet50, it compares RGB and multispectral imagery before analyzing satellite data from different years to identify potential land-cover changes and validate findings with independent environmental data.

## Website

The website is a Next.js App Router application designed for Vercel. It keeps the frontend separate from the future PyTorch inference service.

### Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000` in a browser. Use `npm run build` to create the production build and `npm start` to serve it locally.

### Deploy to Vercel

Import the repository into Vercel. Vercel detects Next.js automatically; the default build command and output settings are sufficient. No dataset, checkpoint, credential, or secret is required for the current static research experience.

### Research assets

The Results page uses the figures currently present in `TerraShift_research/figures`. Metrics come from `TerraShift_research/results/model_comparison.json` and the accompanying CSV files. The repository does not currently include EuroSAT sample images, a trained checkpoint, or a live inference backend.

### Inference boundary

The frontend reserves `POST /api/predict` for an RGB inference integration. It currently returns HTTP `501` with an explanatory error. Connect a separate PyTorch service that owns model loading and preprocessing before enabling predictions. Ordinary RGB uploads must not be routed to the 13-band multispectral model.
