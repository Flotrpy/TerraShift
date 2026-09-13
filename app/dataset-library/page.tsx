import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DatasetLibraryClient from '@/components/DatasetLibraryClient';

export const metadata = {
  title: 'Dataset Library | TerraShift',
  description: 'Interactive EuroSAT 10-class dataset library and sample manifest architecture.',
};

export default function DatasetLibraryPage() {
  return <DatasetLibraryClient />;
}
