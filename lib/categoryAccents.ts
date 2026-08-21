/**
 * Categories are admin-created, not a fixed set — so accent tones and the
 * kinetic-typography phrases behind each category are mapped by *position*
 * (cycling through a small preset) rather than hardcoded by name. The four
 * phrase sets below match the spec's seed suggestions and simply repeat for
 * a fifth+ category so nothing breaks when the admin adds one we didn't
 * anticipate.
 */
export const CATEGORY_ACCENTS = [
  { name: "caramel", bg: "#E8B978", tint: "rgba(232,185,120,0.16)" }, // warm caramel
  { name: "citrus", bg: "#D9CC6A", tint: "rgba(217,204,106,0.16)" }, // pale citrus
  { name: "olive", bg: "#93A06A", tint: "rgba(147,160,106,0.16)" }, // soft olive
  { name: "rose", bg: "#C98A93", tint: "rgba(201,138,147,0.16)" }, // muted rose
];

// One quiet line per category — kept to a phrase or two so the backdrop
// stays a texture, never a headline-sized crop that competes with the cards.
export const CATEGORY_KINETIC_PHRASES = ["ROASTED · WARM", "FRESH · CHILLED", "GRILLED · MADE FRESH", "SWEET · DELICATE"];

export function accentForIndex(index: number) {
  return CATEGORY_ACCENTS[index % CATEGORY_ACCENTS.length];
}

export function kineticPhraseForIndex(index: number) {
  return CATEGORY_KINETIC_PHRASES[index % CATEGORY_KINETIC_PHRASES.length];
}
