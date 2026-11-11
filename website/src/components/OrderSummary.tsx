"use client";

import { useState } from "react";
import { coupons } from "@/data/site";
import { applyCoupon, removeCoupon } from "@/lib/store";
import { formatMoney } from "@/lib/format";
import { toast } from "@/lib/toast";
import { useCartRows } from "./useCartRows";
import { btn, card, input } from "./ui";

/** Price breakdown box with a coupon code field. Used by the cart and checkout. */
export function OrderSummary({ children }: { children?: React.ReactNode }) {
  const { count, subtotal, discount, total, coupon, couponNote } = useCartRows();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  return (
    <aside className={`${card} flex h-fit flex-col gap-3 p-5 lg:sticky lg:top-4`}>
      <h2 className="text-lg font-bold">Order summary</h2>
      <dl className="flex flex-col gap-2 text-sm">
        <div className="flex justify-between">
          <dt>Items ({count})</dt>
          <dd>{formatMoney(subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt>Shipping</dt>
          <dd className="font-medium text-green-700">Free</dd>
        </div>
        {coupon && (
          <div className="flex justify-between text-sale">
            <dt>Coupon {coupon}</dt>
            <dd>−{formatMoney(discount)}</dd>
          </div>
        )}
        <div className="mt-1 flex justify-between border-t border-line pt-3 text-base font-bold">
          <dt>Total</dt>
          <dd>{formatMoney(total)}</dd>
        </div>
      </dl>

      {coupon ? (
        <div className="rounded-card bg-surface-muted p-3 text-sm">
          <p>
            <span className="font-bold">{coupon}</span>: {coupons[coupon].label} (max {formatMoney(coupons[coupon].max)})
          </p>
          {couponNote && <p className="mt-1 text-sale">{couponNote}</p>}
          <button type="button" onClick={() => removeCoupon()} className="mt-1 text-action hover:underline">
            Remove coupon
          </button>
        </div>
      ) : (
        <form
          className="flex flex-col gap-1"
          onSubmit={(e) => {
            e.preventDefault();
            const applied = applyCoupon(code);
            if (applied) {
              setError("");
              setCode("");
              toast(`Coupon ${applied} applied`);
            } else {
              setError("That code isn't valid. Try POP10 or POP20.");
            }
          }}
        >
          <label htmlFor="coupon" className="text-sm font-medium">Coupon code</label>
          <div className="flex gap-2">
            <input
              id="coupon"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? "coupon-error" : undefined}
              placeholder="e.g. POP10"
              className={`${input} h-9 text-sm uppercase`}
            />
            <button type="submit" className={btn.small} disabled={!code.trim()}>Apply</button>
          </div>
          {error && <p id="coupon-error" className="text-xs text-sale">{error}</p>}
        </form>
      )}

      {children}
    </aside>
  );
}
