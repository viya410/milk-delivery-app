export interface Review {
  id: number;
  customerName: string;
  rating: number;
  comment: string;
  approved: boolean;
  createdAt: string;
}

export interface ReviewRequest {
  rating: number;
  comment: string;
}