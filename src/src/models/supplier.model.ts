export interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  productsSupplied: string[];
  rating: number;
  totalOrders: number;
  status: "active" | "inactive";
  createdAt: string;
}
