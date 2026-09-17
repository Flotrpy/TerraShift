"""
TerraShift data pipeline.

- EuroSAT RGB: loaded via torchvision.datasets.EuroSAT (auto-downloads the RGB JPEG version).
- EuroSAT multispectral (13-band Sentinel-2 .tif): downloaded from the DLR mirror
  (https://madm.dfki.de/files/sentinel/EuroSATallBands.zip) and read with rasterio.

Both datasets share the same class list and the same deterministic 70/15/15 split (seed=42), so RGB and
multispectral experiments train/val/test on the same underlying scenes.
"""

import os
import random
import zipfile
from pathlib import Path

import numpy as np
import torch
from torch.utils.data import Dataset, DataLoader, Subset
from torchvision import datasets, transforms

CLASSES = [
    "AnnualCrop", "Forest", "HerbaceousVegetation", "Highway", "Industrial",
    "Pasture", "PermanentCrop", "Residential", "River", "SeaLake",
]

SEED = 42
TRAIN_FRAC, VAL_FRAC, TEST_FRAC = 0.70, 0.15, 0.15

IMAGENET_MEAN = [0.485, 0.456, 0.406]
IMAGENET_STD = [0.229, 0.224, 0.225]

MS_ZIP_URL = "https://madm.dfki.de/files/sentinel/EuroSATallBands.zip"


def split_indices(n: int, seed: int = SEED):
    """Deterministic 70/15/15 split shared by RGB and multispectral experiments."""
    rng = random.Random(seed)
    idx = list(range(n))
    rng.shuffle(idx)
    n_train = int(round(n * TRAIN_FRAC))
    n_val = int(round(n * VAL_FRAC))
    train_idx = idx[:n_train]
    val_idx = idx[n_train:n_train + n_val]
    test_idx = idx[n_train + n_val:]
    return train_idx, val_idx, test_idx


# ---------------------------------------------------------------------------
# RGB (3-channel)
# ---------------------------------------------------------------------------

def get_rgb_transforms():
    return transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(mean=IMAGENET_MEAN, std=IMAGENET_STD),
    ])


def get_rgb_datasets(root: str = "./data"):
    """Downloads EuroSAT RGB (if needed) and returns (train, val, test) Subsets."""
    tfm = get_rgb_transforms()
    full = datasets.EuroSAT(root=root, download=True, transform=tfm)
    assert list(full.classes) == CLASSES, f"Unexpected class order: {full.classes}"
    train_idx, val_idx, test_idx = split_indices(len(full))
    return Subset(full, train_idx), Subset(full, val_idx), Subset(full, test_idx)


def get_rgb_dataloaders(root: str = "./data", batch_size: int = 32, num_workers: int = 4):
    train, val, test = get_rgb_datasets(root)
    return (
        DataLoader(train, batch_size=batch_size, shuffle=True, num_workers=num_workers),
        DataLoader(val, batch_size=batch_size, shuffle=False, num_workers=num_workers),
        DataLoader(test, batch_size=batch_size, shuffle=False, num_workers=num_workers),
    )


# ---------------------------------------------------------------------------
# Multispectral (13-band)
# ---------------------------------------------------------------------------

def download_multispectral(root: str = "./data"):
    """Downloads + extracts EuroSATallBands.zip if not already present. Run manually first
    (large download) rather than relying on this happening implicitly during training."""
    import urllib.request

    root = Path(root)
    root.mkdir(parents=True, exist_ok=True)
    extracted = root / "EuroSATallBands" / "ds" / "images" / "remote_sensing" / "otherDatasets" / "sentinel_2" / "tif"
    if extracted.exists():
        return extracted
    zip_path = root / "EuroSATallBands.zip"
    if not zip_path.exists():
        print(f"Downloading {MS_ZIP_URL} -> {zip_path} (large file, may take a while)")
        urllib.request.urlretrieve(MS_ZIP_URL, zip_path)
    print("Extracting...")
    with zipfile.ZipFile(zip_path) as zf:
        zf.extractall(root / "EuroSATallBands")
    return extracted


class EuroSATMultispectralDataset(Dataset):
    """Reads 13-band Sentinel-2 .tif patches. Input scaled by /10000 per the project spec."""

    def __init__(self, tif_root: str):
        import rasterio  # imported lazily so RGB-only runs don't need it installed

        self.rasterio = rasterio
        self.samples = []
        tif_root = Path(tif_root)
        for cls_idx, cls in enumerate(CLASSES):
            cls_dir = tif_root / cls
            for f in sorted(cls_dir.glob("*.tif")):
                self.samples.append((str(f), cls_idx))

    def __len__(self):
        return len(self.samples)

    def __getitem__(self, i):
        path, label = self.samples[i]
        with self.rasterio.open(path) as src:
            arr = src.read().astype(np.float32)  # (13, H, W)
        arr = arr / 10000.0
        tensor = torch.from_numpy(arr)
        return tensor, label


def get_multispectral_dataloaders(root: str = "./data", batch_size: int = 32, num_workers: int = 4):
    tif_root = download_multispectral(root)
    full = EuroSATMultispectralDataset(tif_root)
    train_idx, val_idx, test_idx = split_indices(len(full))
    train, val, test = Subset(full, train_idx), Subset(full, val_idx), Subset(full, test_idx)
    return (
        DataLoader(train, batch_size=batch_size, shuffle=True, num_workers=num_workers),
        DataLoader(val, batch_size=batch_size, shuffle=False, num_workers=num_workers),
        DataLoader(test, batch_size=batch_size, shuffle=False, num_workers=num_workers),
    )


if __name__ == "__main__":
    print("Downloading/verifying EuroSAT RGB...")
    tr, va, te = get_rgb_datasets()
    print(f"RGB split -> train={len(tr)} val={len(va)} test={len(te)}")
