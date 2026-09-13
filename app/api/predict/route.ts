import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json(
    {
      success: false,
      modelName: 'ResNet50 (RGB)',
      error: 'Model inference backend is not connected.',
      message: 'Connect a standalone PyTorch inference service with pre-trained ResNet50 weights to enable live predictions.',
    },
    { status: 501 }
  );
}
