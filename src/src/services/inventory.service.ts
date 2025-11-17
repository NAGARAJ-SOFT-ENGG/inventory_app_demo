import { InventoryItem, Purchase, StockMovement } from "../models/inventory.model";
import { mockInventory, mockPurchases, mockStockMovements } from "../data/mockData";

export class InventoryService {
  private static readonly API_BASE = "/api/inventory";

  static async getInventoryItems(): Promise<InventoryItem[]> {
    // TODO: Replace with actual API call
    // const response = await fetch(`${this.API_BASE}/items`);
    // return response.json();

    // Mock response using mock data
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockInventory);
      }, 500);
    });
  }

  static async getPurchases(): Promise<Purchase[]> {
    // TODO: Replace with actual API call
    // const response = await fetch(`${this.API_BASE}/purchases`);
    // return response.json();

    // Mock response using mock data
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockPurchases);
      }, 500);
    });
  }

  static async getStockMovements(): Promise<StockMovement[]> {
    // TODO: Replace with actual API call
    // const response = await fetch(`${this.API_BASE}/stock-movements`);
    // return response.json();

    // Mock response using mock data
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockStockMovements);
      }, 500);
    });
  }

  static async createPurchase(purchase: Omit<Purchase, "id">): Promise<Purchase> {
    // TODO: Replace with actual API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: Math.random().toString(36).substr(2, 9),
          ...purchase,
        });
      }, 500);
    });
  }

  static async updateInventoryItem(
    id: string,
    updates: Partial<InventoryItem>
  ): Promise<InventoryItem> {
    // TODO: Replace with actual API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const item = mockInventory.find((i) => i.id === id);
        resolve({ ...item!, ...updates });
      }, 500);
    });
  }
}
