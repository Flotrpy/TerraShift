"""Evaluate a trained TerraShift checkpoint: accuracy, weighted precision/recall/F1,
confusion matrix, per-class report, and a saved list of misclassified examples.

Usage:
  python evaluate.py --mode rgb --checkpoint ../results/rgb_best.pth
  python evaluate.py --mode multispectral --checkpoint ../results/multispectral_best.pth
"""

import argparse
import json
from pathlib import Path

import matplotlib.pyplot as plt
import numpy as np
import seaborn as sns
import torch
from sklearn.metrics import (
    accuracy_score, precision_recall_fscore_support, confusion_matrix, classification_report,
)

from data import CLASSES, get_rgb_dataloaders, get_multispectral_dataloaders
from models import build_rgb_resnet50, build_multispectral_resnet50


@torch.no_grad()
def collect_predictions(model, loader, device):
    model.eval()
    all_labels, all_preds, all_probs = [], [], []
    for inputs, labels in loader:
        inputs = inputs.to(device)
        outputs = model(inputs)
        probs = torch.softmax(outputs, dim=1)
        preds = probs.argmax(dim=1).cpu().numpy()
        all_labels.extend(labels.numpy().tolist())
        all_preds.extend(preds.tolist())
        all_probs.extend(probs.cpu().numpy().tolist())
    return np.array(all_labels), np.array(all_preds), np.array(all_probs)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--mode", choices=["rgb", "multispectral"], required=True)
    parser.add_argument("--checkpoint", required=True)
    parser.add_argument("--data-root", default="../data")
    parser.add_argument("--results-dir", default="../results")
    parser.add_argument("--figures-dir", default="../figures")
    args = parser.parse_args()

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

    if args.mode == "rgb":
        model = build_rgb_resnet50()
        _, _, test_loader = get_rgb_dataloaders(root=args.data_root)
    else:
        model = build_multispectral_resnet50()
        _, _, test_loader = get_multispectral_dataloaders(root=args.data_root)

    model.load_state_dict(torch.load(args.checkpoint, map_location=device))
    model.to(device)

    labels, preds, probs = collect_predictions(model, test_loader, device)

    acc = accuracy_score(labels, preds)
    precision, recall, f1, _ = precision_recall_fscore_support(labels, preds, average="weighted", zero_division=0)
    cm = confusion_matrix(labels, preds)
    report = classification_report(labels, preds, target_names=CLASSES, output_dict=True, zero_division=0)

    print(f"[{args.mode}] test accuracy={acc:.4f} precision={precision:.4f} recall={recall:.4f} f1={f1:.4f}")

    results_dir = Path(args.results_dir)
    figures_dir = Path(args.figures_dir)
    results_dir.mkdir(parents=True, exist_ok=True)
    figures_dir.mkdir(parents=True, exist_ok=True)

    with open(results_dir / f"{args.mode}_test_metrics.json", "w") as f:
        json.dump({
            "accuracy": acc, "weighted_precision": precision,
            "weighted_recall": recall, "weighted_f1": f1,
            "per_class_report": report,
        }, f, indent=2)

    # Confusion matrix figure
    plt.figure(figsize=(9, 7))
    sns.heatmap(cm, annot=True, fmt="d", cmap="viridis", xticklabels=CLASSES, yticklabels=CLASSES)
    plt.xlabel("Predicted")
    plt.ylabel("True")
    plt.title(f"TerraShift {args.mode} confusion matrix (test set)")
    plt.tight_layout()
    plt.savefig(figures_dir / f"{args.mode}_confusion_matrix.png", dpi=150)
    plt.close()

    # Misclassified examples (indices into the test set, for later Grad-CAM / inspection)
    misclassified = [
        {"index": int(i), "true": CLASSES[int(t)], "pred": CLASSES[int(p)], "confidence": float(probs[i][p])}
        for i, (t, p) in enumerate(zip(labels, preds)) if t != p
    ]
    with open(results_dir / f"{args.mode}_misclassified.json", "w") as f:
        json.dump(misclassified, f, indent=2)

    print(f"Saved metrics -> {results_dir}, confusion matrix -> {figures_dir}, "
          f"{len(misclassified)} misclassified examples logged.")


if __name__ == "__main__":
    main()
