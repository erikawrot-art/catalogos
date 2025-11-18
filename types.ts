
export type Category = 'Vehiculos' | 'Maquinarias';

export interface Item {
  id: number;
  category: Category;
  brand: string;
  model: string;
  type: string;
  year: number;
  domain: string;
  rastreoSatelital: 'activo' | 'N/A' | '-';
  fuel: 'Diesel' | 'Nafta';
  capacity: string;
  equipment: string;
  images: string[];
  technicalSheet?: string; // Base64 string of the PDF or Image
}
