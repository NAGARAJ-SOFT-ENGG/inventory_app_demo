export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  description: string;
  price: number;
  oldPrice?: number;
  coupon?: string;
  visibility: "published" | "scheduled" | "hidden";
  sizes?: string[];
  stock: number;
  supplier: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}
