export interface AdminProduct {
  id: number;

  name: string;

  description: string;

  price: number;

  maxOrderQuantity: number;

  unit: string;

  imageUrl: string;

  available: boolean;
}