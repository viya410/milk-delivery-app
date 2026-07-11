export interface AdminOrder {

  id: number;

  totalAmount: number;

  status: string;

  orderDate: string;

  user: {

    fullName: string;

    phoneNumber: string;

  };

  address: {

    customerName: string;

    houseNo: string;

    street: string;

    city: string;

  };

}