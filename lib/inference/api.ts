export interface ClassProbability {
  className: string;
  probability: number;
}

export interface GradCAMData {
  overlayUrl?: string;
  heatmapData?: number[][];
  explanationNote?: string;
}

export interface PredictionResponse {
  success: boolean;
  modelName: string;
  predictedClass?: string;
  confidence?: number;
  probabilities?: ClassProbability[];
  gradCam?: GradCAMData;
  error?: string;
  message?: string;
}

export async function predictRGBImage(file: File): Promise<PredictionResponse> {
  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await fetch('/api/predict', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        modelName: 'ResNet50 (RGB)',
        error: data.error || `HTTP ${response.status}: Model inference service unavailable`,
        message: data.message || 'Model backend is coming soon.',
      };
    }

    return data as PredictionResponse;
  } catch (err) {
    return {
      success: false,
      modelName: 'ResNet50 (RGB)',
      error: err instanceof Error ? err.message : 'Network error during prediction request.',
      message: 'Unable to connect to model inference endpoint.',
    };
  }
}
