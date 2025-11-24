export interface Price {
  id: string | number;
  unit: 'ton' | 'kg' | 'bags';
  price: number;
}