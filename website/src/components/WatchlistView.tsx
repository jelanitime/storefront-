"use client";

import Link from "next/link";
import { addToCart, useHydrated, useProducts, useStore } from "@/lib/store";
import { toast } from "@/lib/toast";
import { PageLoading } from "./Loading";
import { ProductCard } from "./ProductCard";
import { btn } from "./ui";

export function WatchlistView() {
  const hydrated = useHydrated();
  const { watchlist } = useStore();
  const products = useProducts();
  const items = watchlist.flatMap((id) => products.filter((p) => p.id === id));

  if (!hydrated) return <PageLoading label="Loading watchlist…" />;

  return (
    <div>
      <h1 className="text-2xl font-bold sm:text-3xl">Watchlist</h1>
      <p className="mt-1 mb-6 text-sm text-ink-muted">
        {items.length} saved {items.length === 1 ? "item" : "items"}. Tap the heart on any item to save or remove it.
      </p>

      {items.length === 0 ? (
        <div className="rounded-tile bg-surface-muted px-6 py-14 text-center">
          <p className="text-lg font-bold">Nothing saved yet</p>
          <p className="mt-1 text-sm text-ink-muted">Tap the ♡ on any item to keep an eye on it.</p>
          <Link href="/#deals" className={`${btn.primary} mt-5`}>Browse deals</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-5">
          {items.map((p) => (
            <div key={p.id} className="flex flex-col gap-2">
              <ProductCard product={p} fluid />
              <button
                type="button"
                className={`${btn.small} mt-auto`}
                onClick={() => {
                  addToCart(p.id);
                  toast({ message: "Added to your cart", href: "/cart", linkLabel: "View cart" });
                }}
              >
                Add to cart
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
