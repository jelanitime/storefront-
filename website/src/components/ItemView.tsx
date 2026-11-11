"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { categoryHref, categoryLabel } from "@/data/site";
import { addToCart, findProduct, MAX_QTY, toggleWatch, useHydrated, useProducts, useStore } from "@/lib/store";
import { toast } from "@/lib/toast";
import { formatMoney, percentOff } from "@/lib/format";
import { DealsRow } from "./DealsRow";
import { HeartIcon, ShieldIcon } from "./icons";
import { PageLoading } from "./Loading";
import { ProductCard } from "./ProductCard";
import { ProductImage } from "./ProductImage";
import { btn } from "./ui";

/** Full product page: photo, price, quantity, Buy It Now, Add to cart, Watchlist. */
export function ItemView({ id }: { id: string }) {
  const hydrated = useHydrated();
  const products = useProducts();
  const { watchlist, user } = useStore();
  const router = useRouter();
  const [qty, setQty] = useState(1);

  const product = findProduct(products, id);

  if (!product) {
    // Items listed on this site only exist once saved data has loaded
    if (!hydrated) return <PageLoading label="Loading item…" />;
    return (
      <div className="mx-auto max-w-md py-16 text-center">
        <h1 className="text-2xl font-bold">This item isn&apos;t available</h1>
        <p className="mt-2 text-ink-muted">It may have sold or been removed by the seller.</p>
        <Link href="/search" className={`${btn.primary} mt-6`}>Keep shopping</Link>
      </div>
    );
  }

  const saved = watchlist.includes(product.id);
  const off = percentOff(product.price, product.was);
  const isMine = Boolean(user && product.sellerEmail === user.email);
  const similar = products.filter((p) => p.id !== product.id && p.category === product.category);
  const more = similar.length > 0 ? similar : products.filter((p) => p.id !== product.id).slice(0, 8);

  const add = () => {
    addToCart(product.id, qty);
    toast({ message: `Added ${qty} to your cart`, href: "/cart", linkLabel: "View cart" });
  };

  return (
    <div className="flex flex-col gap-12">
      <div>
        <nav aria-label="Breadcrumb" className="mb-4 text-xs text-ink-muted">
          <Link href="/" className="hover:underline">Home</Link> <span aria-hidden>›</span>{" "}
          <Link href={categoryHref(product.category)} className="hover:underline">{categoryLabel(product.category)}</Link>
        </nav>

        <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
          {/* Photo */}
          <div className="relative aspect-square overflow-hidden rounded-tile bg-tile">
            <ProductImage src={product.image} alt={product.title} size={1000} sizes="(min-width: 768px) 50vw, 100vw" eager />
            {product.couponEligible && (
              <p className="absolute top-3 left-3 rounded-full bg-white px-3 py-1 text-xs font-extrabold text-sale shadow-raise">
                20% OFF: POP20
              </p>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col gap-5">
            <div>
              <h1 className="text-2xl leading-tight font-bold sm:text-[28px]">{product.title}</h1>
              <p className="mt-2 text-sm text-ink-muted">
                Sold by <span className="font-medium text-ink">{product.seller}</span>
                {isMine && <span className="ml-2 rounded-full bg-tile px-2 py-0.5 text-xs">Your listing</span>}
              </p>
            </div>

            <div className="border-y border-line py-4">
              <p className="text-sm text-ink-muted">
                Condition: <span className="font-bold text-ink">{product.condition}</span>
              </p>
              <p className="mt-3 flex flex-wrap items-baseline gap-2">
                <span className="text-3xl font-bold">{formatMoney(product.price)}</span>
                {off > 0 && (
                  <>
                    <s className="text-ink-muted">{formatMoney(product.was!)}</s>
                    <span className="text-sm font-bold text-sale">{off}% off</span>
                  </>
                )}
              </p>
              {product.couponEligible && (
                <p className="mt-1 text-sm text-sale">Extra 20% off with code POP20 in your cart</p>
              )}
            </div>

            <label className="flex items-center gap-3 text-sm">
              Quantity:
              <select
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
                className="h-10 rounded-card border border-line bg-white px-3"
              >
                {Array.from({ length: MAX_QTY }, (_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}</option>
                ))}
              </select>
            </label>

            <div className="flex flex-col gap-3 sm:max-w-sm">
              <button
                type="button"
                className={btn.primary}
                onClick={() => {
                  addToCart(product.id, qty);
                  router.push("/checkout");
                }}
              >
                Buy It Now
              </button>
              <button type="button" className={btn.secondary} onClick={add}>
                Add to cart
              </button>
              <button
                type="button"
                aria-pressed={saved}
                className={btn.secondary}
                onClick={() => {
                  const now = toggleWatch(product.id);
                  toast(now ? "Saved to your Watchlist" : "Removed from your Watchlist");
                }}
              >
                <HeartIcon width={16} height={16} filled={saved} className={saved ? "text-brand" : ""} />
                {saved ? "Watching" : "Add to Watchlist"}
              </button>
            </div>

            <ul className="flex flex-col gap-2 rounded-tile bg-surface-muted p-4 text-sm">
              <li><span className="font-bold">Shipping:</span> Free standard shipping. Arrives in 3–5 business days.</li>
              <li><span className="font-bold">Returns:</span> 30 days. Buyer pays return shipping.</li>
              <li className="flex items-start gap-2">
                <ShieldIcon width={18} height={18} className="mt-0.5 shrink-0 text-action" />
                <span><span className="font-bold">Pop Shop Money Back Guarantee:</span> get the item you ordered or your money back.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <section aria-labelledby="about">
        <h2 id="about" className="mb-3 text-xl font-bold">About this item</h2>
        <p className="max-w-3xl leading-relaxed whitespace-pre-line text-ink">{product.description}</p>
      </section>

      {more.length > 0 && (
        <DealsRow id="similar" title={similar.length > 0 ? "Similar items" : "You may also like"}>
          {more.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </DealsRow>
      )}
    </div>
  );
}
