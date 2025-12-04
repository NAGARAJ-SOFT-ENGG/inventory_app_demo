export interface Item {
  id: string | number;
  productName: string;
  qty: number;
  price: number;
  batchNo: string;
  expiryDate?: string;
  pack?: string;
  supplierTax?: string;
}