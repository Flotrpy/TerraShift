"""Self-contained RGB ResNet50 model definition for the inference service (mirrors
research/experiments/models.py so this service can be deployed independently of the
research code)."""

import torch
import torch.nn as nn
from torchvision.models import resnet50

NUM_CLASSES = 10
CLASSES = [
    "AnnualCrop", "Forest", "HerbaceousVegetation", "Highway", "Industrial",
    "Pasture", "PermanentCrop", "Residential", "River", "SeaLake",
]


def build_rgb_resnet50(num_classes: int = NUM_CLASSES) -> nn.Module:
    model = resnet50(weights=None)  # weights come from the TerraShift checkpoint, not ImageNet, at inference time
    model.fc = nn.Linear(model.fc.in_features, num_classes)
    return model


def load_model(checkpoint_path: str, device: torch.device) -> nn.Module:
    model = build_rgb_resnet50()
    state_dict = torch.load(checkpoint_path, map_location=device)
    model.load_state_dict(state_dict)
    model.to(device)
    model.eval()
    return model
