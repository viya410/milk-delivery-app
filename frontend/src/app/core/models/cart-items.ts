export interface CartItem {

  id: number;

  productId: number;

  productSizeId?: number;

  productName: string;

  price: number;

  imageUrl: string;

  quantity: number;

  unit: string;

  maxOrderQuantity: number;

}