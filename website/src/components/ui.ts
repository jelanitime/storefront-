/** Shared button and form styles so every page looks consistent. */

const btnBase =
  "inline-flex items-center justify-center gap-2 rounded-full font-bold transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50";

export const btn = {
  primary: `${btnBase} bg-action px-6 h-11 text-[15px] text-white hover:bg-action-hover`,
  secondary: `${btnBase} border border-action px-6 h-11 text-[15px] text-action hover:bg-action/5`,
  ghost: `${btnBase} px-4 h-9 text-sm text-ink hover:bg-tile`,
  small: `${btnBase} border border-line px-4 h-9 text-sm text-ink hover:bg-surface-muted`,
};

export const input =
  "h-11 w-full rounded-card border border-ink-muted/60 bg-white px-3 text-[15px] outline-none transition-colors placeholder:text-ink-muted/80 focus:border-action focus:ring-2 focus:ring-action/20 aria-[invalid=true]:border-sale";

export const label = "mb-1 block text-sm font-medium";

export const card = "rounded-tile border border-line bg-white";
