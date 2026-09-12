# TerraShift Research Log

## Project

TerraShift is a machine-learning research project using Sentinel-2 satellite imagery for land-cover classification and investigation of potential land-cover changes.

## Research Question

How effectively can transfer learning using Sentinel-2 satellite imagery classify land-cover types, and can these classifications be used to identify potential land-cover changes?

## Secondary Research Question

Does multispectral Sentinel-2 imagery improve land-cover classification performance compared with RGB imagery?

---

# Dataset

## EuroSAT

Total images: 27,000

Classes:

- AnnualCrop: 3,000
- Forest: 3,000
- HerbaceousVegetation: 3,000
- Highway: 2,500
- Industrial: 2,500
- Pasture: 2,000
- PermanentCrop: 2,500
- Residential: 3,000
- River: 2,500
- SeaLake: 3,000

Train/validation/test split:

- Training: 18,900
- Validation: 4,050
- Test: 4,050

Random seed: 42

---

# RGB Experiment

Model: ResNet50 transfer learning

Input: RGB imagery

Trainable component: final classification layer

Epochs: 10

Optimizer: Adam

Learning rate: 0.001

Loss: CrossEntropyLoss

Best validation accuracy: 94.02%

Best epoch: 9

Test accuracy: 93.48%

Test precision: 93.47%

Test recall: 93.48%

Test F1: 93.46%

---

# Multispectral Experiment

Model: ResNet50 transfer learning

Input: 13-band Sentinel-2 imagery

Original image shape: 64 x 64 x 13

PyTorch tensor shape: 13 x 64 x 64

Data type: uint16

Observed raw value range in inspected sample: 12 to 3794

Training configuration:

- Epochs: 10
- Optimizer: Adam
- Learning rate: 0.001
- Loss: CrossEntropyLoss
- Random seed: 42

Best validation accuracy: 87.04%

Best epoch: 3

Test accuracy: 85.93%

Test precision: 85.82%

Test recall: 85.93%

Test F1: 85.81%

---

# RGB vs Multispectral

RGB test accuracy: 93.48%

Multispectral test accuracy: 85.93%

Difference: -7.55 percentage points

The current experiment shows that RGB outperformed the current multispectral baseline under the tested transfer-learning configuration.

This result should not be generalized to all multispectral models because the current multispectral experiment used a limited fine-tuning strategy.

---

# Geospatial Metadata

Sample file:

EuroSAT_MS/Residential/Residential_2169.tif

Shape:

64 x 64 x 13

Coordinate reference information:

WGS 84 / UTM zone 35N

ModelPixelScaleTag:

Approximately 10 meter pixel scale

ModelTiepointTag:

Contains projected coordinate information.

The geospatial metadata will be investigated further for potential temporal satellite analysis.

---

# Research Integrity

The EuroSAT dataset is a land-cover classification dataset and is not itself a time-series change-detection dataset.

Future change-detection analysis will require satellite imagery from different dates.

Model classifications will be described as potential land-cover changes rather than automatically confirmed environmental changes.

No research results should be fabricated.

The test set should remain untouched for model tuning.

