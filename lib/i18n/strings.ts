export type Locale = "en" | "ar";

// Fixed UI string table (spec §2). Keyed by dot-path, `t()` in
// LocaleContext.tsx looks strings up here. Content fields (menu item/category
// names) are NOT here — those live on the row as `_en`/`_ar` columns.
const strings = {
  "lang.en": { en: "EN", ar: "EN" },
  "lang.ar": { en: "عربي", ar: "عربي" },

  "hero.tagline": { en: "Scan · Browse · Order", ar: "امسح · تصفح · اطلب" },
  "hero.cta": { en: "View Menu", ar: "عرض القائمة" },
  "hero.swipeUp": { en: "Swipe up to explore", ar: "مرر لأعلى للاستكشاف" },

  "menu.title": { en: "Our Menu", ar: "قائمتنا" },
  "menu.cartView": { en: "View cart", ar: "عرض السلة" },
  "menu.noItems": { en: "No items in this category yet.", ar: "لا توجد عناصر في هذا القسم بعد." },
  "menu.searchPlaceholder": { en: "Search the menu…", ar: "ابحث في القائمة…" },
  "menu.noResults": { en: "No items match your search.", ar: "لا توجد عناصر مطابقة لبحثك." },

  "cart.staleItemsRemoved": {
    en: "One or more items in your cart are no longer available and were removed.",
    ar: "تمت إزالة عنصر أو أكثر من سلتك لأنها لم تعد متوفرة.",
  },

  "item.quantity": { en: "Quantity", ar: "الكمية" },
  "item.notes": { en: "Notes", ar: "ملاحظات" },
  "item.notesHint": { en: "(e.g. no tomato)", ar: "(مثال: بدون طماطم)" },
  "item.addToCart": { en: "Add to cart", ar: "أضف إلى السلة" },

  "cart.title": { en: "Your cart", ar: "سلتك" },
  "cart.empty": { en: "Your cart is empty.", ar: "سلتك فارغة." },
  "cart.delete": { en: "Delete", ar: "حذف" },
  "cart.notesPlaceholder": { en: "Notes", ar: "ملاحظات" },
  "cart.total": { en: "Total", ar: "الإجمالي" },
  "cart.checkout": { en: "Checkout", ar: "إتمام الطلب" },

  "checkout.title": { en: "Checkout", ar: "إتمام الطلب" },
  "checkout.dineIn": { en: "Dine-in", ar: "تناول في المكان" },
  "checkout.delivery": { en: "Delivery", ar: "توصيل" },
  "checkout.tableNumber": { en: "Table number", ar: "رقم الطاولة" },
  "checkout.name": { en: "Name", ar: "الاسم" },
  "checkout.optional": { en: "(optional)", ar: "(اختياري)" },
  "checkout.phone": { en: "Phone", ar: "رقم الهاتف" },
  "checkout.shareLocation": { en: "Share my location", ar: "مشاركة موقعي" },
  "checkout.gettingLocation": { en: "Getting location…", ar: "جارِ تحديد الموقع…" },
  "checkout.locationShared": { en: "Location shared ✓", ar: "تم مشاركة الموقع ✓" },
  "checkout.locationError": {
    en: "Couldn't get your location. You can still type your address below.",
    ar: "تعذر تحديد موقعك. يمكنك كتابة عنوانك أدناه.",
  },
  "checkout.address": { en: "Address", ar: "العنوان" },
  "checkout.addressHint": { en: "(or as a fallback)", ar: "(أو كبديل)" },
  "checkout.placeOrder": { en: "Place order", ar: "إرسال الطلب" },
  "checkout.placingOrder": { en: "Placing order…", ar: "جارٍ إرسال الطلب…" },

  "confirmation.title": { en: "Order placed!", ar: "تم إرسال الطلب!" },
  "confirmation.sendWhatsapp": { en: "Send to cafe on WhatsApp", ar: "إرسال إلى المقهى عبر واتساب" },
  "confirmation.notConfigured": {
    en: "WhatsApp sending isn't configured yet — your order was still saved. The cafe will see it in the admin dashboard.",
    ar: "لم يتم تفعيل الإرسال عبر واتساب بعد — تم حفظ طلبك على أي حال، وسيظهر في لوحة التحكم.",
  },
  "confirmation.newOrder": { en: "Start a new order", ar: "بدء طلب جديد" },

  "loading.menu": { en: "Loading menu…", ar: "جارٍ تحميل القائمة…" },

  "footer.poweredBy": { en: "Powered by NEXERA", ar: "بدعم من NEXERA" },

  "admin.subtitle": { en: "Sultana Restocafe — Admin", ar: "مطعم سلطانة — لوحة التحكم" },
  "admin.dashboardTitle": { en: "Admin", ar: "لوحة التحكم" },
  "admin.password": { en: "Password", ar: "كلمة المرور" },
  "admin.login": { en: "Log in", ar: "تسجيل الدخول" },
  "admin.wrongPassword": { en: "Wrong password. Try again.", ar: "كلمة مرور خاطئة، حاول مرة أخرى." },
  "admin.forgotPassword": { en: "Forgot password?", ar: "نسيت كلمة المرور؟" },
  "admin.logout": { en: "Log out", ar: "تسجيل الخروج" },

  "admin.nav.orders": { en: "Orders", ar: "الطلبات" },
  "admin.nav.menu": { en: "Menu", ar: "القائمة" },
  "admin.nav.settings": { en: "Settings", ar: "الإعدادات" },

  "admin.menu.title": { en: "Menu", ar: "القائمة" },
  "admin.menu.addItem": { en: "+ Add item", ar: "+ إضافة عنصر" },
  "admin.menu.addCategory": { en: "+ Add category", ar: "+ إضافة قسم" },
  "admin.menu.editCategory": { en: "Edit category", ar: "تعديل القسم" },
  "admin.menu.editCategoryTitle": { en: "Edit category", ar: "تعديل القسم" },
  "admin.menu.deleteCategory": { en: "Delete category", ar: "حذف القسم" },
  "admin.menu.removePhoto": { en: "Remove", ar: "إزالة" },
  "admin.menu.noItems": { en: "No items yet.", ar: "لا توجد عناصر بعد." },
  "admin.menu.available": { en: "Available", ar: "متوفر" },
  "admin.menu.soldOut": { en: "Sold out", ar: "غير متوفر" },
  "admin.menu.edit": { en: "Edit", ar: "تعديل" },
  "admin.menu.delete": { en: "Delete", ar: "حذف" },
  "admin.menu.save": { en: "Save", ar: "حفظ" },
  "admin.menu.cancel": { en: "Cancel", ar: "إلغاء" },
  "admin.menu.addItemTitle": { en: "Add item", ar: "إضافة عنصر" },
  "admin.menu.editItemTitle": { en: "Edit item", ar: "تعديل عنصر" },
  "admin.menu.nameEn": { en: "Name (English)", ar: "الاسم (إنجليزي)" },
  "admin.menu.nameAr": { en: "Name (Arabic)", ar: "الاسم (عربي)" },
  "admin.menu.descriptionEn": { en: "Description (English)", ar: "الوصف (إنجليزي)" },
  "admin.menu.descriptionAr": { en: "Description (Arabic)", ar: "الوصف (عربي)" },
  "admin.menu.price": { en: "Price", ar: "السعر" },
  "admin.menu.category": { en: "Category", ar: "القسم" },
  "admin.menu.photo": { en: "Photo", ar: "الصورة" },
  "admin.menu.categoryPhoto": { en: "Category banner photo", ar: "صورة غلاف القسم" },
  "admin.menu.arabicOptionalHint": { en: "English required, Arabic optional", ar: "الإنجليزي مطلوب، العربي اختياري" },

  "admin.orders.wholeMonth": { en: "Whole month", ar: "الشهر كاملاً" },
  "admin.orders.day": { en: "Day", ar: "اليوم" },
  "admin.orders.orders": { en: "orders", ar: "طلبات" },
  "admin.orders.noOrders": { en: "No orders for this period.", ar: "لا توجد طلبات لهذه الفترة." },
  "admin.orders.prev": { en: "Prev", ar: "السابق" },
  "admin.orders.next": { en: "Next", ar: "التالي" },
  "admin.orders.selectYear": { en: "Select year", ar: "اختر السنة" },
  "admin.orders.go": { en: "Go", ar: "انتقال" },
  "admin.orders.status.new": { en: "new", ar: "جديد" },
  "admin.orders.status.preparing": { en: "preparing", ar: "قيد التحضير" },
  "admin.orders.status.done": { en: "done", ar: "منتهي" },

  "admin.settings.title": { en: "Settings", ar: "الإعدادات" },
  "admin.settings.cafeName": { en: "Cafe name", ar: "اسم المقهى" },
  "admin.settings.logo": { en: "Logo", ar: "الشعار" },
  "admin.settings.whatsappNumber": { en: "WhatsApp number", ar: "رقم واتساب" },
  "admin.settings.whatsappHint": { en: "(digits only, with country code)", ar: "(أرقام فقط، مع رمز الدولة)" },
  "admin.settings.whatsappNotConfigured": {
    en: "Not configured — orders won't offer WhatsApp sending yet.",
    ar: "غير مفعّل — لن تظهر خاصية الإرسال عبر واتساب بعد.",
  },
  "admin.settings.webhookUrl": { en: "Cafe system webhook URL", ar: "رابط ربط نظام المقهى" },
  "admin.settings.webhookHint": { en: "(optional, fill in once chosen)", ar: "(اختياري، يُملأ لاحقًا)" },
  "admin.settings.apiKey": { en: "Cafe system API key", ar: "مفتاح API لنظام المقهى" },
  "admin.settings.primaryColor": { en: "Primary", ar: "اللون الأساسي" },
  "admin.settings.accentColor": { en: "Accent", ar: "لون التمييز" },
  "admin.settings.secondaryColor": { en: "Secondary", ar: "اللون الثانوي" },
  "admin.settings.save": { en: "Save settings", ar: "حفظ الإعدادات" },
  "admin.settings.saved": { en: "Saved ✓", ar: "تم الحفظ ✓" },

  "admin.settings.changePassword": { en: "Change password", ar: "تغيير كلمة المرور" },
  "admin.settings.currentPassword": { en: "Current password", ar: "كلمة المرور الحالية" },
  "admin.settings.newPassword": { en: "New password", ar: "كلمة المرور الجديدة" },
  "admin.settings.updatePassword": { en: "Update password", ar: "تحديث كلمة المرور" },
  "admin.settings.passwordUpdated": { en: "Password updated ✓", ar: "تم تحديث كلمة المرور ✓" },
  "admin.settings.recoveryEmail": { en: "Recovery email", ar: "بريد الاسترداد" },
  "admin.settings.recoveryEmailHint": {
    en: "(required — used to send password-reset links)",
    ar: "(مطلوب — يُستخدم لإرسال روابط استرداد كلمة المرور)",
  },
  "admin.settings.recoveryEmailRequired": {
    en: "A recovery email is required so you can always get back into the dashboard.",
    ar: "بريد الاسترداد مطلوب حتى تتمكن دائمًا من الدخول إلى لوحة التحكم.",
  },

  "admin.reset.title": { en: "Reset admin password", ar: "إعادة تعيين كلمة مرور المشرف" },
  "admin.reset.emailHint": {
    en: "We'll send a password reset link to the recovery email on file.",
    ar: "سنرسل رابط إعادة تعيين كلمة المرور إلى بريد الاسترداد المسجّل.",
  },
  "admin.reset.sendLink": { en: "Send reset link", ar: "إرسال رابط إعادة التعيين" },
  "admin.reset.sending": { en: "Sending…", ar: "جارٍ الإرسال…" },
  "admin.reset.linkSent": { en: "Reset link sent to", ar: "تم إرسال رابط إعادة التعيين إلى" },
  "admin.reset.emailNotConfigured": {
    en: "Email sending isn't configured on this server yet. Use the recovery key below instead.",
    ar: "لم يتم إعداد إرسال البريد الإلكتروني على هذا الخادم بعد. استخدم مفتاح الاسترداد أدناه بدلاً من ذلك.",
  },
  "admin.reset.noRecoveryEmail": {
    en: "No recovery email is on file yet. Use the recovery key below instead.",
    ar: "لا يوجد بريد استرداد مسجّل بعد. استخدم مفتاح الاسترداد أدناه بدلاً من ذلك.",
  },
  "admin.reset.useKeyInstead": { en: "Use the recovery key instead", ar: "استخدام مفتاح الاسترداد بدلاً من ذلك" },
  "admin.reset.tokenHint": {
    en: "You've followed a password reset link. Choose a new password below.",
    ar: "لقد اتبعت رابط إعادة تعيين كلمة المرور. اختر كلمة مرور جديدة أدناه.",
  },
  "admin.reset.recoveryKey": { en: "Recovery key", ar: "مفتاح الاسترداد" },
  "admin.reset.newPassword": { en: "New password", ar: "كلمة المرور الجديدة" },
  "admin.reset.submit": { en: "Reset password", ar: "إعادة تعيين كلمة المرور" },
  "admin.reset.hint": {
    en: "Ask whoever manages the server for the recovery key (set as the ADMIN_RECOVERY_KEY environment variable).",
    ar: "اطلب مفتاح الاسترداد ممن يدير الخادم (المعرّف كمتغير بيئة ADMIN_RECOVERY_KEY).",
  },

  "qr.title": { en: "QR code generator", ar: "مولّد رمز QR" },
  "qr.description": {
    en: "Leave table number blank for one generic QR (works for dine-in or delivery). Fill it in to generate a per-table code that pre-fills the table number at checkout.",
    ar: "اترك رقم الطاولة فارغًا لإنشاء رمز عام (يصلح للتناول في المكان أو التوصيل). أو أدخله لإنشاء رمز خاص بطاولة معينة يملأ رقمها تلقائيًا عند الدفع.",
  },
  "qr.siteUrl": { en: "Site URL", ar: "رابط الموقع" },
  "qr.tableNumber": { en: "Table number", ar: "رقم الطاولة" },
  "qr.generate": { en: "Generate QR code", ar: "إنشاء رمز QR" },
  "qr.download": { en: "Download PNG", ar: "تنزيل PNG" },
} as const;

export type StringKey = keyof typeof strings;

export function lookup(key: StringKey, locale: Locale): string {
  return strings[key][locale];
}
