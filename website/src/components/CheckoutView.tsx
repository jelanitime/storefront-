"use client";

import Link from "next/link";
import { useState } from "react";
import { placeOrder, useHydrated, useStore, type Order } from "@/lib/store";
import { formatMoney } from "@/lib/format";
import { PageLoading } from "./Loading";
import { OrderSummary } from "./OrderSummary";
import { ProductImage } from "./ProductImage";
import { btn, card, input, label } from "./ui";
import { useCartRows } from "./useCartRows";
import { ShieldIcon } from "./icons";

type Field = "name" | "email" | "address" | "city" | "zip" | "country";

const fields: { name: Field; label: string; type?: string; autoComplete: string; half?: boolean }[] = [
  { name: "name", label: "Full name", autoComplete: "name" },
  { name: "email", label: "Email", type: "email", autoComplete: "email" },
  { name: "address", label: "Street address", autoComplete: "street-address" },
  { name: "city", label: "City", autoComplete: "address-level2", half: true },
  { name: "zip", label: "ZIP / Postal code", autoComplete: "postal-code", half: true },
  { name: "country", label: "Country", autoComplete: "country-name" },
];

const payments = [
  { value: "card", label: "Credit or debit card" },
  { value: "paypal", label: "PayPal" },
  { value: "cod", label: "Pay on delivery" },
];

function validate(v: Record<Field, string>) {
  const errors: Partial<Record<Field, string>> = {};
  for (const f of fields) if (!v[f.name].trim()) errors[f.name] = `Please enter your ${f.label.toLowerCase()}.`;
  if (v.email && !/^\S+@\S+\.\S+$/.test(v.email)) errors.email = "Please enter a valid email, like name@example.com.";
  return errors;
}

export function CheckoutView() {
  const hydrated = useHydrated();
  const { user } = useStore();
  const { rows, subtotal, discount, total, coupon } = useCartRows();
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [done, setDone] = useState<Order | null>(null);
  const [placing, setPlacing] = useState(false);

  if (!hydrated) return <PageLoading label="Loading checkout…" />;

  if (done) {
    return (
      <div className="mx-auto max-w-xl py-10 text-center">
        <div className="mx-auto grid size-16 place-items-center rounded-full bg-green-100 text-3xl text-green-700" aria-hidden>✓</div>
        <h1 className="mt-4 text-3xl font-bold">Thanks, your order is in!</h1>
        <p className="mt-2 text-ink-muted">
          Order <span className="font-bold text-ink">{done.id}</span> · A confirmation would be sent to {done.email}.
        </p>
        <div className={`${card} mt-8 p-5 text-left`}>
          {done.lines.map((l) => (
            <p key={l.id} className="flex justify-between gap-4 py-1 text-sm">
              <span className="line-clamp-1">{l.qty} × {l.title}</span>
              <span className="shrink-0">{formatMoney(l.price * l.qty)}</span>
            </p>
          ))}
          {done.discount > 0 && (
            <p className="flex justify-between py-1 text-sm text-sale">
              <span>Coupon {done.coupon}</span>
              <span>−{formatMoney(done.discount)}</span>
            </p>
          )}
          <p className="mt-2 flex justify-between border-t border-line pt-3 font-bold">
            <span>Total paid</span>
            <span>{formatMoney(done.total)}</span>
          </p>
          <p className="mt-3 text-sm text-ink-muted">
            Shipping to {done.shipTo.name}, {done.shipTo.address}, {done.shipTo.city} {done.shipTo.zip}, {done.shipTo.country}
          </p>
        </div>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/account#orders" className={btn.secondary}>View my orders</Link>
          <Link href="/" className={btn.primary}>Keep shopping</Link>
        </div>
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <div className="mx-auto max-w-md py-16 text-center">
        <h1 className="text-2xl font-bold">Nothing to check out</h1>
        <p className="mt-2 text-ink-muted">Your cart is empty.</p>
        <Link href="/" className={`${btn.primary} mt-6`}>Start shopping</Link>
      </div>
    );
  }

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const values = Object.fromEntries(fields.map((f) => [f.name, String(data.get(f.name) ?? "")])) as Record<Field, string>;
    const found = validate(values);
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) {
      document.getElementById(`co-${first}`)?.focus();
      return;
    }
    setPlacing(true);
    // Short pause so it feels like a real payment step
    setTimeout(() => {
      const order = placeOrder({
        lines: rows.map(({ product: p, qty }) => ({ id: p.id, title: p.title, price: p.price, qty, image: p.image })),
        subtotal,
        discount,
        total,
        coupon,
        email: values.email.trim(),
        payment: String(data.get("payment")),
        shipTo: { name: values.name, address: values.address, city: values.city, zip: values.zip, country: values.country },
      });
      setDone(order);
      setPlacing(false);
      window.scrollTo({ top: 0 });
    }, 700);
  };

  const defaults: Partial<Record<Field, string>> = { name: user?.name, email: user?.email, country: "United States" };

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold sm:text-3xl">Checkout</h1>
      <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
        <form id="checkout" noValidate onSubmit={onSubmit} className="flex flex-col gap-8">
          <section className={`${card} p-5`}>
            <h2 className="mb-4 text-lg font-bold">Ship to</h2>
            <div className="grid grid-cols-2 gap-4">
              {fields.map((f) => (
                <div key={f.name} className={f.half ? "col-span-2 sm:col-span-1" : "col-span-2"}>
                  <label htmlFor={`co-${f.name}`} className={label}>{f.label}</label>
                  <input
                    id={`co-${f.name}`}
                    name={f.name}
                    type={f.type ?? "text"}
                    autoComplete={f.autoComplete}
                    defaultValue={defaults[f.name]}
                    aria-invalid={Boolean(errors[f.name])}
                    aria-describedby={errors[f.name] ? `co-${f.name}-err` : undefined}
                    className={input}
                  />
                  {errors[f.name] && <p id={`co-${f.name}-err`} className="mt-1 text-xs text-sale">{errors[f.name]}</p>}
                </div>
              ))}
            </div>
          </section>

          <section className={`${card} p-5`}>
            <h2 className="mb-1 text-lg font-bold">Pay with</h2>
            <p className="mb-4 flex items-center gap-1.5 text-xs text-ink-muted">
              <ShieldIcon width={14} height={14} /> Demo store: no payment details are collected and nothing is charged.
            </p>
            <fieldset className="flex flex-col gap-2">
              <legend className="sr-only">Payment method</legend>
              {payments.map((p, i) => (
                <label key={p.value} className="flex cursor-pointer items-center gap-3 rounded-card border border-line px-4 py-3 has-checked:border-action has-checked:bg-action/5">
                  <input type="radio" name="payment" value={p.value} defaultChecked={i === 0} className="accent-action" />
                  {p.label}
                </label>
              ))}
            </fieldset>
          </section>

          <section className={`${card} p-5`}>
            <h2 className="mb-3 text-lg font-bold">Review items</h2>
            <ul className="flex flex-col gap-3">
              {rows.map(({ product: p, qty }) => (
                <li key={p.id} className="flex items-center gap-3 text-sm">
                  <span className="relative size-14 shrink-0 overflow-hidden rounded-card bg-tile">
                    <ProductImage src={p.image} sizes="56px" size={150} />
                  </span>
                  <span className="line-clamp-2 flex-1">{p.title}</span>
                  <span className="shrink-0 text-ink-muted">× {qty}</span>
                  <span className="w-20 shrink-0 text-right font-bold">{formatMoney(p.price * qty)}</span>
                </li>
              ))}
            </ul>
            <Link href="/cart" className="mt-3 inline-block text-sm text-action hover:underline">Edit cart</Link>
          </section>
        </form>

        <OrderSummary>
          <button type="submit" form="checkout" disabled={placing} className={`${btn.primary} w-full`}>
            {placing ? "Placing order…" : `Confirm and pay ${formatMoney(total)}`}
          </button>
        </OrderSummary>
      </div>
    </div>
  );
}
