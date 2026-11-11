"use client";

import { useMemo } from "react";
import { cartTotals, useProducts, useStore, type CartRow } from "@/lib/store";

/** Cart lines joined with their product details, plus totals. */
export function useCartRows() {
  const { cart, coupon } = useStore();
  const products = useProducts();
  const rows = useMemo(
    () =>
      cart.flatMap((l): CartRow[] => {
        const product = products.find((p) => p.id === l.id);
        return product ? [{ product, qty: l.qty }] : [];
      }),
    [cart, products],
  );
  return { rows, coupon, ...cartTotals(rows, coupon) };
}
