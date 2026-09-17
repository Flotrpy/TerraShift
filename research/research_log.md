# TerraShift Research Log

## 2026-09-16
- Repo scaffolded (app/, inference/, research/, notebooks/).
- No GPU detected in the current build environment — full 10-epoch ResNet50 training runs need to happen
  on a GPU machine (Colab or similar). Training/eval scripts are written so they can be handed to any
  GPU host or run locally (slow on CPU).
- Data download + training + eval + Grad-CAM scripts added under research/experiments/.

## 2026-09-16 — First full training run (Colab T4)
- Ran notebooks/TerraShift_Training.ipynb on a Colab T4 GPU. Multispectral data pulled from the Hugging Face mirror (torchgeo/eurosat) after the DFKI server timed out.
- RGB ResNet50: test accuracy 94.79%, weighted P/R/F1 94.84% / 94.79% / 94.79%, best val 94.07%.
- Multispectral ResNet50 (13-band): test accuracy 87.06%, weighted P/R/F1 87.27% / 87.06% / 86.97%, best val 87.93%.
- Under this configuration the RGB baseline outperformed the multispectral baseline. Not a general claim about RGB vs. multispectral imagery.
- Weakest RGB classes by F1: Highway (0.904), HerbaceousVegetation (0.923), Pasture (0.924), River (0.924). Weakest multispectral: PermanentCrop (0.780), Highway (0.784), Pasture (0.814).
- Grad-CAM fixed (newer pytorch-grad-cam needs explicit `targets`). Error-analysis example: multispectral model predicted Highway for a true Residential patch at 95.65% confidence.
- Full numbers: research/results/run_2026-09-16_colab_t4.json.
- Not persisted: checkpoints (.pth), confusion-matrix/curve/Grad-CAM PNGs. The Drive mount failed and the runtime then reset. A re-run that saves to Drive during training is needed before the live inference backend can serve this model.

## 2026-09-17 — Second full training run (Colab T4, saved to Drive)
- Re-ran notebooks/TerraShift_Training.ipynb with Drive mounted first this time (`research_outputs` written incrementally), so checkpoints and figures were persisted for the first time.
- RGB ResNet50: test accuracy 94.96%, weighted P/R/F1 94.98% / 94.96% / 94.95%, best val 94.27%.
- Multispectral ResNet50 (13-band): test accuracy 88.12%, weighted P/R/F1 88.11% / 88.12% / 87.87%, best val 88.00%.
- Under this configuration the RGB baseline again outperformed the multispectral baseline. Not a general claim about RGB vs. multispectral imagery.
- Weakest RGB classes by F1: Highway (0.908), River (0.914), Pasture (0.922), PermanentCrop (0.935). Weakest multispectral: PermanentCrop (0.749), Highway (0.812), HerbaceousVegetation (0.834).
- Grad-CAM error-analysis example: multispectral model predicted SeaLake for a true Residential patch at ~95% confidence (kept as an error case, not a success).
- Full numbers: research/results/rgb_test_metrics.json, research/results/multispectral_test_metrics.json. Per-epoch history: research/results/rgb_history.json, research/results/multispectral_history.json.
- Persisted this run: rgb_best.pth, multispectral_best.pth (research/checkpoints/, gitignored — not pushed to GitHub); rgb_curves.png, rgb_confusion_matrix.png, multispectral_confusion_matrix.png, gradcam_rgb_example.png, gradcam_multispectral_error_residential.png (research/figures/ and public/figures/, used on the Results page).
- Numbers on the live Results page were updated to this run; the 2026-09-16 run above is kept for comparison.
