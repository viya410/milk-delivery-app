export interface ProductSize {
  id?: number;
  size: string;
  price: number;
}

export type ProductCategory = 'DAIRY' | 'POULTRY' | 'VEGETABLES';

export interface Product {

  id: number;

  category?: ProductCategory;

  name: string;

  description: string;

  price: number; // keep temporarily

  imageUrl: string;

  unit: string;

  sizes: ProductSize[];

}