"use client";

import type { CartLine } from "./cartTypes";
import { cartTotal } from "./cartTypes";

interface Props {
  lines: CartLine[];
  onClose: () => void;
  onUpdateQuantity: (key: string, quantity: number) => void;
  onUpdateNotes: (key: string, notes: string) => void;
  onRemove: (key: string) => void;
  onCheckout: () => void;
}

export default function CartDrawer({ lines, onClose, onUpdateQuantity, onUpdateNotes, onRemove, onCheckout }: Props) {
  const total = cartTotal(lines);

  return (
    <div className="fixed inset-0 z-30 flex justify-end bg-espresso/60" onClick={onClose}>
      <div
        className="flex h-full w-full max-w-sm flex-col bg-cream p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif text-xl italic">Your cart</h2>
          <button onClick={onClose} className="text-2xl leading-none text-espresso-light">
            ×
          </button>
        </div>

        {lines.length === 0 ? (
          <p className="mt-10 text-center text-sm text-espresso-light">Your cart is empty.</p>
        ) : (
          <div className="flex-1 space-y-3 overflow-y-auto">
            {lines.map((line) => (
              <div key={line.key} className="rounded-2xl bg-white p-3 shadow-card">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium">{line.name}</p>
                    <p className="text-xs text-gold">${line.price.toFixed(2)}</p>
                  </div>
                  <button
                    onClick={() => onRemove(line.key)}
                    className="text-xs font-medium text-espresso-light underline"
                  >
                    Delete
                  </button>
                </div>

                <input
                  value={line.notes}
                  onChange={(e) => onUpdateNotes(line.key, e.target.value)}
                  placeholder="Notes"
                  className="mt-2 w-full rounded-lg border border-gold-light/30 px-2 py-1 text-xs outline-none focus:border-gold"
                />

                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center gap-2 rounded-full bg-cream px-2 py-1">
                    <button
                      onClick={() => onUpdateQuantity(line.key, Math.max(1, line.quantity - 1))}
                      className="h-6 w-6 rounded-full bg-white text-sm shadow"
                    >
                      −
                    </button>
                    <span className="w-4 text-center text-sm">{line.quantity}</span>
                    <button
                      onClick={() => onUpdateQuantity(line.key, line.quantity + 1)}
                      className="h-6 w-6 rounded-full bg-white text-sm shadow"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-sm font-semibold">${(line.price * line.quantity).toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 border-t border-gold-light/30 pt-4">
          <div className="mb-3 flex items-center justify-between text-sm font-semibold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <button
            onClick={onCheckout}
            disabled={lines.length === 0}
            className="w-full rounded-full bg-espresso py-3 text-sm font-semibold uppercase tracking-wide text-cream disabled:opacity-40"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
