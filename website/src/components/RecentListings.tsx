"use client";

import { useStore } from "@/lib/store";
import { DealsRow } from "./DealsRow";
import { ProductCard } from "./ProductCard";

/** "Just listed" row: appears on the homepage once someone lists an item. */
export function RecentListings() {
  const { listings } = useStore();
  if (listings.length === 0) return null;
  return (
    <DealsRow id="just-listed" title="Just listed" subtitle="Fresh items from Pop Shop sellers">
      {[...listings].reverse().map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </DealsRow>
  );
}
