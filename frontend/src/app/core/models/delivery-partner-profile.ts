export interface DeliveryPartnerProfile {
  id: number;
  fullName: string;
  email: string | null;
  phoneNumber: string;
  employeeCode: string | null;
  routeId: number | null;
  routeName: string | null;
  status: 'ACTIVE' | 'INACTIVE' | string;
}
