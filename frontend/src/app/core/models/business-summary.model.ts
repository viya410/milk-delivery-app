export interface ProductBusinessSummary {
  productId: number;
  productName: string;

  currentStock: number;
  reservedStock: number;
  availableStock: number;

  stockAdded: number;
  stockRemoved: number;
  quantitySold: number;

  revenue: number;
}

export interface BusinessSummary {
  businessDate: string;

  totalOrders: number;
  deliveredOrders: number;
  pendingOrders: number;
  cancelledOrders: number;

  totalRevenue: number;
  totalCustomers: number;

  openingStock: number;
  reservedStock: number;
  availableStock: number;

  products: ProductBusinessSummary[];
}