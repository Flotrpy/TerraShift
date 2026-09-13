import UploadClient from '@/components/UploadClient';

export const metadata = {
  title: 'Try the Model | TerraShift',
  description: 'Upload RGB satellite imagery for TerraShift ResNet50 model inference and analysis.',
};

export default function UploadPage() {
  return <UploadClient />;
}
