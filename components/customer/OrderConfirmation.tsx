"use client";

interface Props {
  total: number;
  whatsappLink: string | null;
  onNewOrder: () => void;
}

export default function OrderConfirmation({ total, whatsappLink, onNewOrder }: Props) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-espresso/70 p-6">
      <div className="w-full max-w-sm rounded-3xl bg-white p-6 text-center">
        <h2 className="font-serif text-2xl italic text-espresso">Order placed!</h2>
        <p className="mt-2 text-sm text-espresso-light">Total: ${total.toFixed(2)}</p>

        {whatsappLink ? (
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 block rounded-full bg-olive py-3 text-sm font-semibold uppercase tracking-wide text-cream"
          >
            Send to cafe on WhatsApp
          </a>
        ) : (
          <p className="mt-5 rounded-xl bg-cream p-3 text-xs text-espresso-light">
            WhatsApp sending isn&apos;t configured yet — your order was still saved. The cafe will see it in the
            admin dashboard.
          </p>
        )}

        <button
          onClick={onNewOrder}
          className="mt-4 w-full rounded-full border border-gold py-3 text-sm font-semibold uppercase tracking-wide text-gold"
        >
          Start a new order
        </button>
      </div>
    </div>
  );
}
