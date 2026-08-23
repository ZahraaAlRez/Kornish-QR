"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll } from "framer-motion";
import type { Category, MenuItem, CafeSettings } from "@/lib/supabase/types";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { SPLASH_SEEN_KEY } from "@/lib/introSeen";
import { useLenis } from "@/components/motion/LenisProvider";
import { submitOrder } from "@/app/actions/orders";
import type { CheckoutValues } from "./CheckoutForm";
import type { CartLine } from "./cartTypes";
import { dropStaleLines, loadStoredCart, resolveOrderName, saveStoredCart } from "./cartTypes";
import Hero from "./Hero";
import StickyNav from "./StickyNav";
import MenuBrowser from "./MenuBrowser";
import ItemDetailSheet from "./ItemDetailSheet";
import CartDrawer from "./CartDrawer";
import CheckoutForm from "./CheckoutForm";
import OrderConfirmation from "./OrderConfirmation";
import FlyingPhoto from "./FlyingPhoto";
import WelcomeSplash from "./WelcomeSplash";

type Modal = "item" | "cart" | "checkout" | "confirmation" | null;

interface Props {
  categories: Category[];
  menuItems: MenuItem[];
  cafeSettings: CafeSettings;
  initialTableNumber?: string;
}

export default function CustomerApp({ categories, menuItems, cafeSettings, initialTableNumber }: Props) {
  const { locale } = useLocale();
  const lenis = useLenis();
  const [modal, setModal] = useState<Modal>(null);
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(categories[0]?.id ?? null);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [cartLines, setCartLines] = useState<CartLine[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<{ total: number; whatsappLink: string | null } | null>(null);
  const [flight, setFlight] = useState<{ src: string | null; from: DOMRect; to: DOMRect } | null>(null);
  const [cartNotice, setCartNotice] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [fading, setFading] = useState(false);
  const hydrated = useRef(false);
  const cartButtonRect = useRef<DOMRect | null>(null);

  const heroRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });

  const cartCount = useMemo(() => cartLines.reduce((sum, l) => sum + l.quantity, 0), [cartLines]);

  // Splash uses its own session flag, separate from Hero's — Hero only
  // mounts once this phase reaches "ready" (never during "splash"), so on a
  // genuine first visit Hero's own returning-visitor flag is still unset
  // when it mounts and its full entrance animation plays normally after the
  // splash hands off. On a same-session reload both the splash and Hero's
  // animation are skipped, since both flags are already set from earlier.
  const [visitPhase, setVisitPhase] = useState<"pending" | "splash" | "ready">("pending");
  const introChecked = useRef(false);

  useEffect(() => {
    if (introChecked.current) return;
    introChecked.current = true;
    const seen = window.sessionStorage.getItem(SPLASH_SEEN_KEY) === "1";
    if (seen) {
      setVisitPhase("ready");
      return;
    }
    window.sessionStorage.setItem(SPLASH_SEEN_KEY, "1");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setVisitPhase(reduceMotion ? "ready" : "splash");
  }, []);

  // Hydrate cart from localStorage on mount, dropping any line whose menu
  // item no longer exists (stale reference from before a menu reset).
  useEffect(() => {
    const stored = loadStoredCart();
    const { kept, droppedAny } = dropStaleLines(stored, menuItems);
    setCartLines(kept);
    if (droppedAny) setCartNotice(true);
    hydrated.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist cart to localStorage on every change, once hydration has run
  // (skips the initial mount so we don't clobber storage with `[]` first).
  useEffect(() => {
    if (!hydrated.current) return;
    saveStoredCart(cartLines);
  }, [cartLines]);

  useEffect(() => {
    if (!cartNotice) return;
    const timer = setTimeout(() => setCartNotice(false), 4000);
    return () => clearTimeout(timer);
  }, [cartNotice]);

  // Language switching: text fades and shifts a few px rather than jump-cutting (spec §3.11).
  useEffect(() => {
    setFading(true);
    const timer = setTimeout(() => setFading(false), 180);
    return () => clearTimeout(timer);
  }, [locale]);

  // Routed through the single site-wide Lenis instance (never a second,
  // competing scroll driver) so this and the hero/nav scroll-progress
  // choreography above are reading the same scroll position, not two
  // systems independently fighting to own it. On touch devices Lenis is
  // intentionally never created (see LenisProvider), so these fall back to
  // an immediate native jump rather than a native `smooth` animation that
  // would itself become a second competing scroll driver.
  function scrollToMenu() {
    if (!menuRef.current) return;
    if (lenis) {
      lenis.scrollTo(menuRef.current, {
        offset: -72,
        duration: 1.05,
        easing: (t: number) => 1 - Math.pow(1 - t, 4),
      });
    } else {
      menuRef.current.scrollIntoView();
    }
  }

  function scrollToTop() {
    if (lenis) {
      lenis.scrollTo(heroRef.current ?? 0, { offset: 0, duration: 1 });
    } else {
      heroRef.current?.scrollIntoView();
    }
  }

  function handleSelectItem(item: MenuItem) {
    setSelectedItem(item);
    setModal("item");
  }

  function addLine(item: MenuItem, quantity: number, notes: string, sourceRect: DOMRect | null) {
    setCartLines((prev) => [
      ...prev,
      {
        key: `${item.id}-${Date.now()}`,
        menuItemId: item.id,
        nameEn: item.name_en,
        nameAr: item.name_ar,
        price: item.price,
        photoUrl: item.photo_url,
        quantity,
        notes,
      },
    ]);
    if (sourceRect && cartButtonRect.current) {
      setFlight({ src: item.photo_url, from: sourceRect, to: cartButtonRect.current });
    }
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(10);
    }
  }

  function handleAddToCart(quantity: number, notes: string, sourceRect: DOMRect | null) {
    if (!selectedItem) return;
    addLine(selectedItem, quantity, notes, sourceRect);
    setModal(null);
    setSelectedItem(null);
  }

  function handleQuickAdd(item: MenuItem, sourceRect: DOMRect | null) {
    addLine(item, 1, "", sourceRect);
  }

  function updateQuantity(key: string, quantity: number) {
    setCartLines((prev) => prev.map((l) => (l.key === key ? { ...l, quantity } : l)));
  }

  function updateNotes(key: string, notes: string) {
    setCartLines((prev) => prev.map((l) => (l.key === key ? { ...l, notes } : l)));
  }

  function removeLine(key: string) {
    setCartLines((prev) => prev.filter((l) => l.key !== key));
  }

  async function handleCheckout(values: CheckoutValues) {
    // Re-validate right before submission — the menu can change between
    // opening the app and placing the order.
    const { kept, droppedAny } = dropStaleLines(cartLines, menuItems);
    if (droppedAny) {
      setCartLines(kept);
      setCartNotice(true);
      if (kept.length === 0) return;
    }

    setSubmitting(true);
    setSubmitError(null);
    try {
      const result = await submitOrder({
        orderType: values.orderType,
        tableNumber: values.tableNumber,
        customerName: values.customerName,
        phone: values.phone,
        deliveryAddress: values.deliveryAddress,
        deliveryLocationUrl: values.deliveryLocationUrl,
        items: kept.map((l) => ({
          menuItemId: l.menuItemId,
          name: resolveOrderName(l),
          price: l.price,
          quantity: l.quantity,
          notes: l.notes,
        })),
      });
      setConfirmation({ total: result.total, whatsappLink: result.whatsappLink });
      setModal("confirmation");
      setCartLines([]);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function handleNewOrder() {
    setConfirmation(null);
    setModal(null);
  }

  return (
    <>
      <StickyNav
        cartCount={cartCount}
        onOpenCart={() => setModal("cart")}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        progress={scrollYProgress}
        onLogoClick={scrollToTop}
        onCartButtonRectChange={(rect) => {
          cartButtonRect.current = rect;
        }}
      />

      {visitPhase === "ready" && (
        <div className={`transition-all duration-200 ${fading ? "translate-y-1 opacity-0" : "translate-y-0 opacity-100"}`}>
          <Hero ref={heroRef} cafeName={cafeSettings.cafe_name} onViewMenu={scrollToMenu} scrollProgress={scrollYProgress} />

          <MenuBrowser
            ref={menuRef}
            categories={categories}
            menuItems={menuItems}
            activeCategoryId={activeCategoryId}
            onSelectCategory={setActiveCategoryId}
            onSelectItem={handleSelectItem}
            onQuickAdd={handleQuickAdd}
            searchQuery={searchQuery}
          />
        </div>
      )}

      {visitPhase === "splash" && <WelcomeSplash onDone={() => setVisitPhase("ready")} />}

      {flight && <FlyingPhoto src={flight.src} from={flight.from} to={flight.to} onComplete={() => setFlight(null)} />}

      <AnimatePresence>
        {cartNotice && <CartNotice key="notice" onDismiss={() => setCartNotice(false)} />}
      </AnimatePresence>

      <AnimatePresence>
        {modal === "item" && selectedItem && (
          <ItemDetailSheet key="item" item={selectedItem} onClose={() => setModal(null)} onAdd={handleAddToCart} />
        )}

        {modal === "cart" && (
          <CartDrawer
            key="cart"
            lines={cartLines}
            onClose={() => setModal(null)}
            onUpdateQuantity={updateQuantity}
            onUpdateNotes={updateNotes}
            onRemove={removeLine}
            onCheckout={() => setModal("checkout")}
          />
        )}

        {modal === "checkout" && (
          <CheckoutForm
            key="checkout"
            lines={cartLines}
            initialTableNumber={initialTableNumber}
            submitting={submitting}
            error={submitError}
            onClose={() => setModal("cart")}
            onSubmit={handleCheckout}
          />
        )}

        {modal === "confirmation" && confirmation && (
          <OrderConfirmation
            key="confirmation"
            total={confirmation.total}
            whatsappLink={confirmation.whatsappLink}
            onNewOrder={handleNewOrder}
          />
        )}
      </AnimatePresence>
    </>
  );
}

function CartNotice({ onDismiss }: { onDismiss: () => void }) {
  const { t } = useLocale();
  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      className="fixed inset-x-0 top-16 z-50 flex justify-center px-4"
    >
      <button
        onClick={onDismiss}
        className="max-w-sm rounded-2xl bg-navy px-4 py-3 text-center font-sans text-xs text-cream shadow-card"
      >
        {t("cart.staleItemsRemoved")}
      </button>
    </motion.div>
  );
}
