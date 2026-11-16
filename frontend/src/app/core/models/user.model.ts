export interface User {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: 'ROLE_ADMIN' | 'ROLE_USER' | 'ROLE_DELIVERY_PARTNER';
  token?: string;
}