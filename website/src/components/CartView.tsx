"use client";

import Link from "next/link";
import { MAX_QTY, removeFromCart, setQty, toggleWatch, useHydrated, useStore } from "@/lib/store";
import { toast } from "@/lib/toast";
import { formatMoney } from "@/lib/format";
import { PageLoading } from "./Loading";
import { OrderSummary } from "./OrderSummary";
import { ProductImage } from "./ProductImage";
import { btn, card } from "./ui";
import { useCartRows } from "./useCartRows";

export function CartView() {
  const hydrated = useHydrated();
  const { rows } = useCartRows();
  const { watchlist } = useStore();

  if (!hydrated) return <PageLoading label="Loading cart…" />;

  if (rows.length === 0) {
    return (
      <div className="mx-auto max-w-md py-16 text-center">
        <h1 className="text-2xl font-bold">Your cart is empty</h1>
        <p className="mt-2 text-ink-muted">Find something you love and add it here.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/#deals" className={btn.primary}>See today&apos;s deals</Link>
          <Link href="/watchlist" className={btn.secondary}>Watchlist</Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold sm:text-3xl">Shopping cart</h1>
      <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
        <ul className="flex flex-col gap-4">
          {rows.map(({ product: p, qty }) => (
            <li key={p.id} className={`${card} flex gap-4 p-4`}>
              <Link href={`/item/${p.id}`} className="relative size-24 shrink-0 overflow-hidden rounded-card bg-tile sm:size-32">
                <ProductImage src={p.image} sizes="128px" size={300} />
              </Link>
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <div className="flex flex-col justify-between gap-1 sm:flex-row sm:gap-4">
                  <Link href={`/item/${p.id}`} className="line-clamp-2 font-medium hover:underline">{p.title}</Link>
                  <p className="shrink-0 text-lg font-bold">{formatMoney(p.price * qty)}</p>
                </div>
                <p className="text-xs text-ink-muted">
                  {p.condition} · Sold by {p.seller}
                  {qty > 1 && ` · ${formatMoney(p.price)} each`}
                </p>
                {p.couponEligible && <p className="text-xs font-bold text-sale">POP20 eligible</p>}
                <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                  <div className="flex items-center rounded-full border border-line" role="group" aria-label={`Quantity for ${p.title}`}>
                    <button type="button" onClick={() => setQty(p.id, qty - 1)} disabled={qty <= 1} aria-label="Decrease quantity" className="grid size-8 place-items-center rounded-full hover:bg-tile disabled:opacity-40">−</button>
                    <span className="w-8 text-center" aria-live="polite">{qty}</span>
                    <button type="button" onClick={() => setQty(p.id, qty + 1)} disabled={qty >= MAX_QTY} aria-label="Increase quantity" className="grid size-8 place-items-center rounded-full hover:bg-tile disabled:opacity-40">+</button>
                  </div>
                  <button
                    type="button"
                    className="text-action hover:underline"
                    onClick={() => {
                      if (!watchlist.includes(p.id)) toggleWatch(p.id);
                      removeFromCart(p.id);
                      toast({ message: "Moved to your Watchlist", href: "/watchlist", linkLabel: "View" });
                    }}
                  >
                    Save for later
                  </button>
                  <button
                    type="button"
                    className="text-action hover:underline"
                    onClick={() => {
                      removeFromCart(p.id);
                      toast("Removed from cart");
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <OrderSummary>
          <Link href="/checkout" className={`${btn.primary} w-full`}>Go to checkout</Link>
          <Link href="/search" className="text-center text-sm text-action hover:underline">Continue shopping</Link>
        </OrderSummary>
      </div>
    </div>
  );
}
