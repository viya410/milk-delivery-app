export interface OrderItemResponse {
  id?: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  unit?: string;
}

export interface OrderResponse {
  id: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  totalAmount: number;
  status: string;
  orderDate: string;
  items: OrderItemResponse[];
}
