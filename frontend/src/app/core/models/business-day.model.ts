export interface BusinessDay {

  businessDate: string;

  status: 'OPEN' | 'CLOSED';

  openedAt: string;

  closedAt: string | null;

}