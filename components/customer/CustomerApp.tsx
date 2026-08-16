"use client";

import { useMemo, useState } from "react";
import type { Category, MenuItem, CafeSettings } from "@/lib/supabase/types";
import { getItemPhoto } from "@/lib/categoryVisuals";
import { submitOrder } from "@/app/actions/orders";
import type { CheckoutValues } from "./CheckoutForm";
import type { CartLine } from "./cartTypes";
import MainPicScreen from "./MainPicScreen";
import MenuBrowser from "./MenuBrowser";
import ItemDetailSheet from "./ItemDetailSheet";
import CartDrawer from "./CartDrawer";
import CheckoutForm from "./CheckoutForm";
import OrderConfirmation from "./OrderConfirmation";

type Screen = "intro" | "menu";
type Modal = "item" | "cart" | "checkout" | "confirmation" | null;

interface Props {
  categories: Category[];
  menuItems: MenuItem[];
  cafeSettings: CafeSettings;
  initialTableNumber?: string;
}

export default function CustomerApp({ categories, menuItems, cafeSettings, initialTableNumber }: Props) {
  const [screen, setScreen] = useState<Screen>("intro");
  const [modal, setModal] = useState<Modal>(null);
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(categories[0]?.id ?? null);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [cartLines, setCartLines] = useState<CartLine[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<{ total: number; whatsappLink: string | null } | null>(null);

  const cartCount = useMemo(() => cartLines.reduce((sum, l) => sum + l.quantity, 0), [cartLines]);

  function handleSelectItem(item: MenuItem) {
    setSelectedItem(item);
    setModal("item");
  }

  function handleAddToCart(quantity: number, notes: string) {
    if (!selectedItem) return;
    const category = categories.find((c) => c.id === selectedItem.category_id);
    setCartLines((prev) => [
      ...prev,
      {
        key: `${selectedItem.id}-${Date.now()}`,
        menuItemId: selectedItem.id,
        name: selectedItem.name,
        price: selectedItem.price,
        photoUrl: getItemPhoto(selectedItem.photo_url, category?.animation_key ?? ""),
        quantity,
        notes,
      },
    ]);
    setModal(null);
    setSelectedItem(null);
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
        items: cartLines.map((l) => ({
          menuItemId: l.menuItemId,
          name: l.name,
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
    setScreen("menu");
  }

  if (screen === "intro") {
    return (
      <MainPicScreen
        cafeName={cafeSettings.cafe_name}
        mainPictureUrl={cafeSettings.main_picture_url || "/brand/main-pic-placeholder.svg"}
        onEnter={() => setScreen("menu")}
      />
    );
  }

  return (
    <>
      <MenuBrowser
        categories={categories}
        menuItems={menuItems}
        activeCategoryId={activeCategoryId}
        onSelectCategory={setActiveCategoryId}
        onSelectItem={handleSelectItem}
        cafeName={cafeSettings.cafe_name}
        cartCount={cartCount}
        onOpenCart={() => setModal("cart")}
      />

      {modal === "item" && selectedItem && (
        <ItemDetailSheet
          item={selectedItem}
          photoUrl={getItemPhoto(
            selectedItem.photo_url,
            categories.find((c) => c.id === selectedItem.category_id)?.animation_key ?? ""
          )}
          onClose={() => setModal(null)}
          onAdd={handleAddToCart}
        />
      )}

      {modal === "cart" && (
        <CartDrawer
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
          total={confirmation.total}
          whatsappLink={confirmation.whatsappLink}
          onNewOrder={handleNewOrder}
        />
      )}
    </>
  );
}
