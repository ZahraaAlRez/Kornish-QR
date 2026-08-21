import type { MenuItem } from "@/lib/supabase/types";

export interface CartLine {
  key: string;
  menuItemId: string;
  nameEn: string;
  nameAr: string | null;
  price: number;
  photoUrl: string | null;
  quantity: number;
  notes: string;
}

export function cartTotal(lines: CartLine[]): number {
  return lines.reduce((sum, l) => sum + l.price * l.quantity, 0);
}

/** English-first snapshot name for order_items — independent of the customer's current UI locale. */
export function resolveOrderName(line: CartLine): string {
  return line.nameEn || line.nameAr || "";
}

const CART_STORAGE_KEY = "sultana-cart";

export function loadStoredCart(): CartLine[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveStoredCart(lines: CartLine[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(lines));
}

/** Drops cart lines whose menu_item_id no longer resolves to a real, available item. */
export function dropStaleLines(
  lines: CartLine[],
  menuItems: MenuItem[]
): { kept: CartLine[]; droppedAny: boolean } {
  const validIds = new Set(menuItems.map((item) => item.id));
  const kept = lines.filter((line) => validIds.has(line.menuItemId));
  return { kept, droppedAny: kept.length !== lines.length };
}
