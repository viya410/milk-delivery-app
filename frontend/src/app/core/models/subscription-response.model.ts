export interface SubscriptionResponse {

  id: number;

  productId: number;

  productName: string;

  quantity: number;

  unit: string;

  frequency: string;

  status: string;

  startDate: string;

  endDate: string | null;

}