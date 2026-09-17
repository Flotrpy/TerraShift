"""Train the TerraShift multispectral (13-band) ResNet50 baseline.

Same split, batch size, optimizer, loss, and epoch count as the RGB run. Conv1 is expanded to
13 channels (RGB weights copied into the first 3, averaged RGB weights into the rest) and input
is scaled by /10000, per the documented multispectral experiment.

Target (from the original documented run -- treat your own run's output as source of truth):
~85.93% test accuracy, ~87.04% best val accuracy. This is one experimental configuration, not
evidence that RGB is universally better than multispectral imagery.
"""

import argparse

import torch

from data import get_multispectral_dataloaders
from models import build_multispectral_resnet50, count_params
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

    model = build_multispectral_resnet50()
    total, trainable = count_params(model)
    print(f"Params: {total:,} total / {trainable:,} trainable")

    train_loader, val_loader, test_loader = get_multispectral_dataloaders(
        root=args.data_root, batch_size=args.batch_size)

    history, best_val_acc, best_path = train_model(
        model, train_loader, val_loader, device,
        epochs=args.epochs, lr=args.lr, run_name="multispectral", results_dir=args.results_dir)


if __name__ == "__main__":
    main()
