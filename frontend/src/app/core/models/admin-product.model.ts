export interface ProductSize {

  id?: number;

  size: string;

  price: number;

}

export type ProductCategory = 'DAIRY' | 'POULTRY' | 'VEGETABLES';

export interface AdminProduct {

  id: number;

  name: string;

  category: ProductCategory;

  description: string;

  price: number;

  maxOrderQuantity: number;

  unit: string;

  category?: string;

  imageUrl: string;

  available: boolean;

  hasSizeSelection?: boolean;

  sizes: ProductSize[];

}