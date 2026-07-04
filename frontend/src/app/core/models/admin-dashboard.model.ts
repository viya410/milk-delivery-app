import { AdminOrder } from './admin-order.model';
import { AdminProduct } from './admin-product.model';

export interface AdminDashboard {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalRevenue: number;
  recentOrders: AdminOrder[];
  unavailableProducts: AdminProduct[];
}