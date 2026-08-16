const PLACEHOLDER_BY_ANIMATION_KEY: Record<string, string> = {
  "hot-drinks": "/brand/placeholder-hot-drinks.svg",
  "cold-drinks": "/brand/placeholder-cold-drinks.svg",
  sandwiches: "/brand/placeholder-sandwiches.svg",
  desserts: "/brand/placeholder-desserts.svg",
};

/** Falls back to the main picture for any future category without a dedicated placeholder. */
export function getCategoryPlaceholder(animationKey: string): string {
  return PLACEHOLDER_BY_ANIMATION_KEY[animationKey] ?? "/brand/main-pic-placeholder.svg";
}

export function getItemPhoto(photoUrl: string | null, animationKey: string): string {
  return photoUrl || getCategoryPlaceholder(animationKey);
}
