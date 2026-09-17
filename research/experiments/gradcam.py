"""Grad-CAM explainability for TerraShift models.

Visualizes which image regions contributed most to a prediction. Used for correctly classified
examples AND interesting misclassifications (e.g. the documented multispectral Residential -> SeaLake
error at ~95% confidence). Grad-CAM shows what the model attended to -- it does not prove *why* the
model was right or wrong, and is never presented as causal evidence.

Usage:
  python gradcam.py --mode rgb --checkpoint ../results/rgb_best.pth --index 42 --tag correct_forest
  python gradcam.py --mode multispectral --checkpoint ../results/multispectral_best.pth \
      --index 137 --tag error_residential_as_sealake
"""

import argparse
from pathlib import Path

import numpy as np
import torch
from pytorch_grad_cam import GradCAM
from pytorch_grad_cam.utils.image import show_cam_on_image
from pytorch_grad_cam.utils.model_targets import ClassifierOutputTarget

from data import CLASSES, get_rgb_dataloaders, get_multispectral_dataloaders
from models import build_rgb_resnet50, build_multispectral_resnet50


def denormalize_rgb(tensor):
    mean = np.array([0.485, 0.456, 0.406])
    std = np.array([0.229, 0.224, 0.225])
    img = tensor.permute(1, 2, 0).cpu().numpy()
    img = std * img + mean
    return np.clip(img, 0, 1)


def to_display_rgb(tensor, mode: str):
    """Returns an (H, W, 3) float image in [0, 1] for overlay, for either RGB or multispectral input
    (multispectral uses bands 4/3/2 -- Sentinel-2 true-color -- as a visual stand-in)."""
    if mode == "rgb":
        return denormalize_rgb(tensor)
    # Sentinel-2 band order in EuroSATallBands .tif: B1..B12,B8A (13 bands). True color ~ B4,B3,B2 = indices 3,2,1.
    arr = tensor[[3, 2, 1], :, :].cpu().numpy()
    arr = np.transpose(arr, (1, 2, 0))
    arr = np.clip(arr * 3.0, 0, 1)  # simple stretch for visibility
    return arr


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--mode", choices=["rgb", "multispectral"], required=True)
    parser.add_argument("--checkpoint", required=True)
    parser.add_argument("--data-root", default="../data")
    parser.add_argument("--figures-dir", default="../figures/gradcam")
    parser.add_argument("--index", type=int, required=True, help="index into the test set")
    parser.add_argument("--tag", default="example", help="filename tag, e.g. error_residential_as_sealake")
    args = parser.parse_args()

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

    if args.mode == "rgb":
        model = build_rgb_resnet50()
        _, _, test_loader = get_rgb_dataloaders(root=args.data_root, batch_size=1)
    else:
        model = build_multispectral_resnet50()
        _, _, test_loader = get_multispectral_dataloaders(root=args.data_root, batch_size=1)

    model.load_state_dict(torch.load(args.checkpoint, map_location=device))
    model.to(device).eval()
    # Backbone is frozen for training; Grad-CAM needs gradients through layer4.
    for p_ in model.parameters():
        p_.requires_grad_(True)

    dataset = test_loader.dataset
    input_tensor, true_label = dataset[args.index]
    input_batch = input_tensor.unsqueeze(0).to(device)

    with torch.no_grad():
        logits = model(input_batch)
        probs = torch.softmax(logits, dim=1)[0]
        pred_label = int(probs.argmax())
        confidence = float(probs[pred_label])

    target_layer = model.layer4[-1]
    cam = GradCAM(model=model, target_layers=[target_layer])
    grayscale_cam = cam(input_tensor=input_batch, targets=[ClassifierOutputTarget(pred_label)])[0]

    rgb_img = to_display_rgb(input_tensor, args.mode)
    overlay = show_cam_on_image(rgb_img.astype(np.float32), grayscale_cam, use_rgb=True)

    figures_dir = Path(args.figures_dir)
    figures_dir.mkdir(parents=True, exist_ok=True)
    out_path = figures_dir / f"{args.mode}_{args.tag}_idx{args.index}.png"

    import matplotlib.pyplot as plt
    fig, axes = plt.subplots(1, 2, figsize=(8, 4))
    axes[0].imshow(rgb_img)
    axes[0].set_title(f"True: {CLASSES[true_label]}")
    axes[0].axis("off")
    axes[1].imshow(overlay)
    axes[1].set_title(f"Pred: {CLASSES[pred_label]} ({confidence:.1%})\nGrad-CAM")
    axes[1].axis("off")
    plt.tight_layout()
    plt.savefig(out_path, dpi=150)
    plt.close()

    correct = "correct" if pred_label == true_label else "MISCLASSIFIED"
    print(f"[{correct}] true={CLASSES[true_label]} pred={CLASSES[pred_label]} "
          f"confidence={confidence:.4f} -> saved {out_path}")


if __name__ == "__main__":
    main()
