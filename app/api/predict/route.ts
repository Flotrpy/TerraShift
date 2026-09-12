import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json({ error: 'Model inference is not connected. Add the separate PyTorch backend before enabling predictions.' }, { status: 501 });
}