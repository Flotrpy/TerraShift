export const EUROSAT_CLASSES = [
  "AnnualCrop",
  "Forest",
  "HerbaceousVegetation",
  "Highway",
  "Industrial",
  "Pasture",
  "PermanentCrop",
  "Residential",
  "River",
  "SeaLake",
] as const;

export type EuroSatClass = (typeof EUROSAT_CLASSES)[number];
