export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  quantity: number;
  price: number;
  reorderLevel: number;
  supplier: string;
  lastUpdated: string;
  status: "in-stock" | "low-stock" | "out-of-stock";
}

export interface Purchase {
  id: string;
  itemId: string;
  itemName: string;
  quantity: number;
  totalPrice: number;
  supplier: string;
  purchaseDate: string;
  status: "pending" | "completed" | "cancelled";
  orderBy: string;
  paid: number;
  balance: number;
  paymentStatus: "pending" | "partial" | "paid";
  purchaseStatus: "item-received" | "in-transit" | "pending";
}

export interface StockMovement {
  id: string;
  itemId: string;
  itemName: string;
  type: "in" | "out";
  quantity: number;
  date: string;
  reason: string;
  performedBy: string;
}
