"""Shared training loop for TerraShift's RGB and multispectral ResNet50 baselines.

Config matches the documented setup for both experiments:
CrossEntropyLoss, Adam(lr=0.001), batch_size=32, 10 epochs, only the unfrozen params trained.
"""

import json
import time
from pathlib import Path

import torch
import torch.nn as nn
from tqdm import tqdm


def run_epoch(model, loader, criterion, optimizer, device, train: bool):
    model.train() if train else model.eval()
    total_loss, correct, total = 0.0, 0, 0
    torch.set_grad_enabled(train)
    for inputs, labels in tqdm(loader, leave=False):
        inputs, labels = inputs.to(device), labels.to(device)
        if train:
            optimizer.zero_grad()
        outputs = model(inputs)
        loss = criterion(outputs, labels)
        if train:
            loss.backward()
            optimizer.step()
        total_loss += loss.item() * inputs.size(0)
        preds = outputs.argmax(dim=1)
        correct += (preds == labels).sum().item()
        total += labels.size(0)
    torch.set_grad_enabled(True)
    return total_loss / total, correct / total


def train_model(model, train_loader, val_loader, device, epochs: int = 10, lr: float = 0.001,
                 run_name: str = "run", results_dir: str = "../results"):
    model.to(device)
    criterion = nn.CrossEntropyLoss()
    trainable_params = [p for p in model.parameters() if p.requires_grad]
    optimizer = torch.optim.Adam(trainable_params, lr=lr)

    results_dir = Path(results_dir)
    results_dir.mkdir(parents=True, exist_ok=True)

    history = {"train_loss": [], "train_acc": [], "val_loss": [], "val_acc": []}
    best_val_acc = 0.0
    best_path = results_dir / f"{run_name}_best.pth"

    for epoch in range(1, epochs + 1):
        t0 = time.time()
        train_loss, train_acc = run_epoch(model, train_loader, criterion, optimizer, device, train=True)
        val_loss, val_acc = run_epoch(model, val_loader, criterion, optimizer, device, train=False)
        history["train_loss"].append(train_loss)
        history["train_acc"].append(train_acc)
        history["val_loss"].append(val_loss)
        history["val_acc"].append(val_acc)
        dt = time.time() - t0
        print(f"[{run_name}] epoch {epoch}/{epochs} "
              f"train_loss={train_loss:.4f} train_acc={train_acc:.4f} "
              f"val_loss={val_loss:.4f} val_acc={val_acc:.4f} ({dt:.1f}s)")

        if val_acc > best_val_acc:
            best_val_acc = val_acc
            torch.save(model.state_dict(), best_path)

    with open(results_dir / f"{run_name}_history.json", "w") as f:
        json.dump({"history": history, "best_val_acc": best_val_acc}, f, indent=2)

    print(f"[{run_name}] best val acc: {best_val_acc:.4f} -> saved to {best_path}")
    return history, best_val_acc, best_path
