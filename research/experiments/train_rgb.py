"""Train the TerraShift RGB ResNet50 baseline.

Reproduces the documented experiment: pretrained ResNet50, frozen backbone, 10-class head,
224x224 ImageNet-normalized input, Adam lr=0.001, batch_size=32, 10 epochs, CrossEntropyLoss.

Target (from the original documented run -- treat your own run's output as source of truth):
~93.48% test accuracy, ~94.02-94.22% best val accuracy.
"""

import argparse

import torch

from data import get_rgb_dataloaders
from models import build_rgb_resnet50, count_params
from train_common import train_model


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--data-root", default="../data")
    parser.add_argument("--results-dir", default="../results")
    parser.add_argument("--epochs", type=int, default=10)
    parser.add_argument("--batch-size", type=int, default=32)
    parser.add_argument("--lr", type=float, default=0.001)
    args = parser.parse_args()

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"Device: {device}")

    model = build_rgb_resnet50()
    total, trainable = count_params(model)
    print(f"Params: {total:,} total / {trainable:,} trainable")

    train_loader, val_loader, test_loader = get_rgb_dataloaders(
        root=args.data_root, batch_size=args.batch_size)

    history, best_val_acc, best_path = train_model(
        model, train_loader, val_loader, device,
        epochs=args.epochs, lr=args.lr, run_name="rgb", results_dir=args.results_dir)


if __name__ == "__main__":
    main()
