export interface Quantity {
  id: string | number;
  unit: 'Ton' | 'Kg' | '25 bag' | '50 bag';
  value: number;
}