"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { deleteListing, signOut, useHydrated, useStore } from "@/lib/store";
import { formatDate, formatMoney } from "@/lib/format";
import { toast } from "@/lib/toast";
import { PageLoading } from "./Loading";
import { ProductImage } from "./ProductImage";
import { btn, card } from "./ui";

/** "My Pop Shop": profile, purchases and your listings. */
export function AccountView() {
  const hydrated = useHydrated();
  const { user, orders, listings, watchlist } = useStore();
  const router = useRouter();

  if (!hydrated) return <PageLoading label="Loading account…" />;

  if (!user) {
    return (
      <div className="mx-auto max-w-md py-16 text-center">
        <h1 className="text-2xl font-bold">My Pop Shop</h1>
        <p className="mt-2 text-ink-muted">Sign in to see your purchases and listings.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/signin?next=/account" className={btn.primary}>Sign in</Link>
          <Link href="/signin?mode=register&next=/account" className={btn.secondary}>Create account</Link>
        </div>
      </div>
    );
  }

  const mine = listings.filter((l) => l.sellerEmail === user.email).reverse();

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="grid size-14 place-items-center rounded-full bg-brand text-xl font-bold text-white" aria-hidden>
            {user.name.charAt(0).toUpperCase()}
          </span>
          <div>
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-sm text-ink-muted">{user.email}</p>
          </div>
        </div>
        <button
          type="button"
          className={btn.small}
          onClick={() => {
            signOut();
            toast("You've signed out");
            router.push("/");
          }}
        >
          Sign out
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3 sm:max-w-lg">
        {[
          { n: orders.length, l: "Orders", href: "#orders" },
          { n: mine.length, l: "Listings", href: "#listings" },
          { n: watchlist.length, l: "Watching", href: "/watchlist" },
        ].map((s) => (
          <Link key={s.l} href={s.href} className={`${card} p-4 text-center hover:bg-surface-muted`}>
            <span className="block text-2xl font-bold">{s.n}</span>
            <span className="text-sm text-ink-muted">{s.l}</span>
          </Link>
        ))}
      </div>

      <section id="orders" className="scroll-mt-4">
        <h2 className="mb-4 text-xl font-bold">Purchases</h2>
        {orders.length === 0 ? (
          <p className="rounded-tile bg-surface-muted p-6 text-sm text-ink-muted">
            No orders yet. <Link href="/#deals" className="text-action hover:underline">Browse today&apos;s deals</Link>
          </p>
        ) : (
          <ul className="flex flex-col gap-4">
            {orders.map((o) => (
              <li key={o.id} className={`${card} p-5`}>
                <div className="mb-3 flex flex-wrap justify-between gap-2 text-sm">
                  <p>
                    <span className="font-bold">Order {o.id}</span>
                    <span className="text-ink-muted"> · {formatDate(o.date)}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-bold text-green-800">Confirmed</span>
                    <span className="font-bold">{formatMoney(o.total)}</span>
                  </p>
                </div>
                <ul className="flex flex-wrap gap-3">
                  {o.lines.map((l) => (
                    <li key={l.id} className="flex items-center gap-2 text-sm">
                      <span className="relative size-12 shrink-0 overflow-hidden rounded-card bg-tile">
                        <ProductImage src={l.image} sizes="48px" size={120} />
                      </span>
                      <span className="line-clamp-2 max-w-48">{l.qty} × {l.title}</span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section id="listings" className="scroll-mt-4">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-xl font-bold">My listings</h2>
          <Link href="/sell" className={btn.small}>+ List an item</Link>
        </div>
        {mine.length === 0 ? (
          <p className="rounded-tile bg-surface-muted p-6 text-sm text-ink-muted">
            You haven&apos;t listed anything yet. <Link href="/sell" className="text-action hover:underline">Sell your first item</Link>
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {mine.map((p) => (
              <li key={p.id} className={`${card} flex items-center gap-4 p-3`}>
                <Link href={`/item/${p.id}`} className="relative size-16 shrink-0 overflow-hidden rounded-card bg-tile">
                  <ProductImage src={p.image} sizes="64px" size={160} />
                </Link>
                <div className="min-w-0 flex-1">
                  <Link href={`/item/${p.id}`} className="line-clamp-1 font-medium hover:underline">{p.title}</Link>
                  <p className="text-sm text-ink-muted">{formatMoney(p.price)} · {p.condition} · Listed {formatDate(p.createdAt!)}</p>
                </div>
                <button
                  type="button"
                  className="text-sm text-sale hover:underline"
                  onClick={() => {
                    if (confirm(`Delete "${p.title}"? This can't be undone.`)) {
                      deleteListing(p.id);
                      toast("Listing deleted");
                    }
                  }}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
