export interface Supplier {
  id: string;
  supplierCode?: string;
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
