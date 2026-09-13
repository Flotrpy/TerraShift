export type EuroSATClass =
  | 'AnnualCrop'
  | 'Forest'
  | 'HerbaceousVegetation'
  | 'Highway'
  | 'Industrial'
  | 'Pasture'
  | 'PermanentCrop'
  | 'Residential'
  | 'River'
  | 'SeaLake';

export const EUROSAT_CLASSES: EuroSATClass[] = [
  'AnnualCrop',
  'Forest',
  'HerbaceousVegetation',
  'Highway',
  'Industrial',
  'Pasture',
  'PermanentCrop',
  'Residential',
  'River',
  'SeaLake',
];

export const CLASS_DESCRIPTIONS: Record<EuroSATClass, string> = {
  AnnualCrop: 'Agricultural land planted with crops that are harvested yearly (e.g. wheat, maize).',
  Forest: 'Dense tree-covered canopy areas including coniferous and broadleaf forests.',
  HerbaceousVegetation: 'Grasslands, natural meadows, and non-woody vegetation coverage.',
  Highway: 'Major paved transportation corridors, highways, and connecting infrastructure.',
  Industrial: 'Manufacturing facilities, commercial complexes, warehouses, and industrial parks.',
  Pasture: 'Grassy fields managed for livestock grazing and agricultural forage.',
  PermanentCrop: 'Perennial agricultural land such as vineyards, orchards, and olive groves.',
  Residential: 'Urban and suburban residential housing, neighborhood buildings, and domestic structures.',
  River: 'Natural inland waterways, rivers, streams, and connecting water channels.',
  SeaLake: 'Open water bodies including coastal sea waters, bays, natural lakes, and reservoirs.',
};

export interface DatasetItem {
  id: string;
  filename: string;
  trueClass: EuroSATClass;
  imageUrl?: string;
  bands?: 'RGB' | 'MS';
  coordinates?: string;
  acquisitionDate?: string;
}

export interface DatasetManifest {
  version: string;
  totalSamples: number;
  classes: EuroSATClass[];
  isConnected: boolean;
  items: DatasetItem[];
}

export const INITIAL_MANIFEST: DatasetManifest = {
  version: '1.0.0',
  totalSamples: 0,
  classes: EUROSAT_CLASSES,
  isConnected: false,
  items: [],
};
