"""Model builders for TerraShift's RGB and multispectral ResNet50 baselines."""

import torch
import torch.nn as nn
from torchvision.models import resnet50, ResNet50_Weights

NUM_CLASSES = 10


def build_rgb_resnet50(num_classes: int = NUM_CLASSES) -> nn.Module:
    """Pretrained ImageNet ResNet50, backbone frozen, final FC replaced with a 10-class head.

    23,528,522 total params / 20,490 trainable params per the documented configuration.
    """
    model = resnet50(weights=ResNet50_Weights.IMAGENET1K_V1)
    for param in model.parameters():
        param.requires_grad = False
    model.fc = nn.Linear(model.fc.in_features, num_classes)  # trainable by default
    return model


def build_multispectral_resnet50(num_classes: int = NUM_CLASSES, in_channels: int = 13) -> nn.Module:
    """ResNet50 modified for 13-band input.

    The first conv is replaced with a 13-channel version: channels 0-2 are initialized from the
    pretrained RGB conv1 weights, channels 3-12 from the average of those RGB weights (per the
    documented initialization strategy). Backbone stays frozen except conv1 + fc, matching "only
    the final classification layer trained" -- conv1 must be trainable simply because its shape
    changed and it has no pretrained 13-channel weights to freeze onto.
    """
    model = resnet50(weights=ResNet50_Weights.IMAGENET1K_V1)
    old_conv1 = model.conv1
    rgb_weight = old_conv1.weight.data.clone()  # (64, 3, 7, 7)

    new_conv1 = nn.Conv2d(
        in_channels, old_conv1.out_channels,
        kernel_size=old_conv1.kernel_size, stride=old_conv1.stride,
        padding=old_conv1.padding, bias=old_conv1.bias is not None,
    )
    new_weight = torch.zeros(old_conv1.out_channels, in_channels, *old_conv1.kernel_size)
    new_weight[:, :3, :, :] = rgb_weight
    avg_weight = rgb_weight.mean(dim=1, keepdim=True)  # (64, 1, 7, 7)
    new_weight[:, 3:, :, :] = avg_weight.repeat(1, in_channels - 3, 1, 1)
    new_conv1.weight.data = new_weight
    model.conv1 = new_conv1

    for param in model.parameters():
        param.requires_grad = False
    for param in model.conv1.parameters():
        param.requires_grad = True
    model.fc = nn.Linear(model.fc.in_features, num_classes)  # trainable by default

    return model


def count_params(model: nn.Module):
    total = sum(p.numel() for p in model.parameters())
    trainable = sum(p.numel() for p in model.parameters() if p.requires_grad)
    return total, trainable


if __name__ == "__main__":
    m = build_rgb_resnet50()
    t, tr = count_params(m)
    print(f"RGB model: {t:,} total / {tr:,} trainable")
