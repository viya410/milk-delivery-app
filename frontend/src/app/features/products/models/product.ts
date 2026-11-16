export interface ProductSize {
  id?: number;
  size: string;
  price: number;
}

export interface Product {

  id: number;

  name: string;

  description: string;

  price: number; // keep temporarily

  imageUrl: string;

  unit: string;

  category?: string;

  sizes: ProductSize[];

}