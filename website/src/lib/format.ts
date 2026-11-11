const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export const formatMoney = (n: number) => money.format(n);

export const percentOff = (price: number, was?: number) =>
  was && was > price ? Math.round(((was - price) / was) * 100) : 0;

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

/** Only allow redirects to pages on this site (stops links like ?next=https://evil.com). */
export const safeNext = (next: string | null, fallback = "/") =>
  next && next.startsWith("/") && !next.startsWith("//") ? next : fallback;
