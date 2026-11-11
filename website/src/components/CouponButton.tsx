"use client";

import type { CouponCode } from "@/data/site";
import { applyCoupon, useStore } from "@/lib/store";
import { toast } from "@/lib/toast";

/** "Get the coupon" button: saves the code so it's applied in the cart. */
export function CouponButton({ code, className }: { code: CouponCode; className: string }) {
  const active = useStore().coupon === code;
  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        applyCoupon(code);
        toast({ message: `Coupon ${code} added. It applies in your cart.`, href: "/cart", linkLabel: "Cart" });
      }}
    >
      {active ? `✓ ${code} added` : "Get the coupon"}
    </button>
  );
}
