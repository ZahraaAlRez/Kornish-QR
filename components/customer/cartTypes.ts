export interface CartLine {
  key: string;
  menuItemId: string;
  name: string;
  price: number;
  photoUrl: string;
  quantity: number;
  notes: string;
}

export function cartTotal(lines: CartLine[]): number {
  return lines.reduce((sum, l) => sum + l.price * l.quantity, 0);
}
