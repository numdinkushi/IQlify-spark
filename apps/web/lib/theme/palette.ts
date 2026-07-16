/**
 * Brand palette — lavender scheme anchored on #9F86C0.
 * Use CSS/Tailwind: `bg-brand-lavender`, `text-brand-soft`, `iqlify-accent-text`.
 */
export const brandPalette = {
  ink: "#231942",
  dusk: "#5E548E",
  lavender: "#9F86C0",
  soft: "#BE95C4",
  mist: "#E0B1CB",
  deep: "#1A1527",
} as const;

export type BrandColor = keyof typeof brandPalette;

export const brandAliases = {
  primary: "lavender",
  accent: "lavender",
  ink: "ink",
  surface: "ink",
  muted: "soft",
  highlight: "mist",
  background: "deep",
} as const satisfies Record<string, BrandColor>;
