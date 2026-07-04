export interface InventoryTransaction {

  id: number;

  productId: number;

  productName: string;

  type: string;

  quantity: number;

  remarks: string;

  reference: string | null;

  businessDate: string;

  transactionDate: string;

}