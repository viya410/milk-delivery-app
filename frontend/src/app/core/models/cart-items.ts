import { ProductCategory } from '../../features/products/models/product';

export interface CartItem {

  id: number;

  productId: number;

  category: ProductCategory;

  productSizeId?: number;

  productName: string;

  price: number;

  imageUrl: string;

  quantity: number;

  unit: string;

  maxOrderQuantity: number;

}