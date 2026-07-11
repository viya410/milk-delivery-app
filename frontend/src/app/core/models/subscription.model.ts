export interface Subscription {

  id: number;

  productId: number;

  productName: string;

  quantity: number;

  unit: string;

  frequency: 'DAILY' | 'ALTERNATE_DAY' | 'WEEKLY';

  status: 'ACTIVE' | 'PAUSED' | 'CANCELLED';

  startDate: string;

  endDate: string | null;

}