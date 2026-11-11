"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { categories, categoryLabel, conditions, type Product } from "@/data/site";
import { useProducts } from "@/lib/store";
import { ProductCard } from "./ProductCard";
import { btn, input } from "./ui";

const sorts = {
  best: "Best match",
  "price-asc": "Price: lowest first",
  "price-desc": "Price: highest first",
  newest: "Newly listed",
} as const;
type Sort = keyof typeof sorts;

function matches(p: Product, words: string[]) {
  const hay = `${p.title} ${p.description} ${categoryLabel(p.category)} ${p.seller}`.toLowerCase();
  return words.every((w) => hay.includes(w));
}

/** Search + category results with filters. Everything is kept in the web address so links can be shared. */
export function SearchView() {
  const params = useSearchParams();
  const router = useRouter();
  const products = useProducts();

  const q = params.get("q")?.trim() ?? "";
  const cat = params.get("cat") ?? "";
  const cond = params.get("cond") ?? "";
  const min = params.get("min") ?? "";
  const max = params.get("max") ?? "";
  const sort = (params.get("sort") as Sort) in sorts ? (params.get("sort") as Sort) : "best";
  const dealsOnly = params.get("deals") === "1";

  const setParams = (changes: Record<string, string>) => {
    const next = new URLSearchParams(params.toString());
    for (const [k, v] of Object.entries(changes)) {
      if (v) next.set(k, v);
      else next.delete(k);
    }
    router.replace(`/search?${next.toString()}`, { scroll: false });
  };

  const results = useMemo(() => {
    const words = q.toLowerCase().split(/\s+/).filter(Boolean);
    const lo = parseFloat(min);
    const hi = parseFloat(max);
    const list = products.filter(
      (p) =>
        (!cat || p.category === cat) &&
        (!cond || p.condition === cond) &&
        (!dealsOnly || (p.was && p.was > p.price) || p.couponEligible) &&
        (isNaN(lo) || p.price >= lo) &&
        (isNaN(hi) || p.price <= hi) &&
        matches(p, words),
    );
    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    if (sort === "newest") list.sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""));
    return list;
  }, [products, q, cat, cond, min, max, sort, dealsOnly]);

  const heading = q ? `Results for “${q}”` : cat ? categoryLabel(cat) : "All items";
  const filtersOn = Boolean(cat || cond || min || max || dealsOnly);

  return (
    <div>
      <nav aria-label="Breadcrumb" className="mb-3 text-xs text-ink-muted">
        <Link href="/" className="hover:underline">Home</Link> <span aria-hidden>›</span>{" "}
        {cat ? categoryLabel(cat) : "Search"}
      </nav>

      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">{heading}</h1>
          <p className="mt-1 text-sm text-ink-muted" aria-live="polite">
            {results.length} {results.length === 1 ? "result" : "results"}
            {q && cat ? ` in ${categoryLabel(cat)}` : ""}
          </p>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <span className="text-ink-muted">Sort:</span>
          <select
            value={sort}
            onChange={(e) => setParams({ sort: e.target.value === "best" ? "" : e.target.value })}
            className="h-9 rounded-full border border-line bg-white px-3 text-sm"
          >
            {Object.entries(sorts).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
        {/* ── Filters ── */}
        <details className="group rounded-tile border border-line p-4 lg:border-0 lg:p-0" open>
          <summary className="flex cursor-pointer items-center justify-between font-bold lg:pointer-events-none lg:mb-2 [&::-webkit-details-marker]:hidden">
            Filters
            <span className="text-xs font-normal text-ink-muted lg:hidden">tap to show/hide</span>
          </summary>
          <div className="mt-4 flex flex-col gap-6 text-sm lg:mt-0">
            <fieldset>
              <legend className="mb-2 font-bold">Category</legend>
              <ul className="flex flex-col gap-1">
                <li>
                  <button type="button" onClick={() => setParams({ cat: "" })} className={`hover:underline ${!cat ? "font-bold" : ""}`}>
                    All categories
                  </button>
                </li>
                {categories.map((c) => (
                  <li key={c.slug}>
                    <button
                      type="button"
                      onClick={() => setParams({ cat: c.slug })}
                      aria-current={cat === c.slug}
                      className={`text-left hover:underline ${cat === c.slug ? "font-bold text-action" : ""}`}
                    >
                      {c.label}
                    </button>
                  </li>
                ))}
              </ul>
            </fieldset>

            <fieldset>
              <legend className="mb-2 font-bold">Condition</legend>
              {["", ...conditions].map((c) => (
                <label key={c || "any"} className="flex cursor-pointer items-center gap-2 py-0.5">
                  <input type="radio" name="cond" checked={cond === c} onChange={() => setParams({ cond: c })} className="accent-action" />
                  {c || "Any condition"}
                </label>
              ))}
            </fieldset>

            <PriceFilter key={`${min}-${max}`} min={min} max={max} onApply={(lo, hi) => setParams({ min: lo, max: hi })} />

            <label className="flex cursor-pointer items-center gap-2">
              <input type="checkbox" checked={dealsOnly} onChange={(e) => setParams({ deals: e.target.checked ? "1" : "" })} className="accent-action" />
              Deals & discounts only
            </label>

            {filtersOn && (
              <button type="button" onClick={() => setParams({ cat: "", cond: "", min: "", max: "", deals: "" })} className="w-fit text-action hover:underline">
                Clear all filters
              </button>
            )}
          </div>
        </details>

        {/* ── Results ── */}
        <section aria-label="Results">
          {results.length === 0 ? (
            <div className="rounded-tile bg-surface-muted px-6 py-14 text-center">
              <p className="text-lg font-bold">No items found</p>
              <p className="mt-1 text-sm text-ink-muted">
                {cat ? `Nobody is selling in ${categoryLabel(cat)} yet. Be the first!` : "Try different words or clear your filters."}
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-3">
                <Link href="/search" className={btn.secondary}>See all items</Link>
                <Link href="/sell" className={btn.primary}>Sell an item</Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 xl:grid-cols-4">
              {results.map((p) => (
                <ProductCard key={p.id} product={p} fluid />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function PriceFilter({ min, max, onApply }: { min: string; max: string; onApply: (lo: string, hi: string) => void }) {
  const [lo, setLo] = useState(min);
  const [hi, setHi] = useState(max);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onApply(lo, hi);
      }}
    >
      <fieldset>
        <legend className="mb-2 font-bold">Price</legend>
        <div className="flex items-center gap-2">
          <label className="sr-only" htmlFor="min">Minimum price</label>
          <input id="min" inputMode="decimal" placeholder="$ Min" value={lo} onChange={(e) => setLo(e.target.value.replace(/[^\d.]/g, ""))} className={`${input} h-9 text-sm`} />
          <span aria-hidden>–</span>
          <label className="sr-only" htmlFor="max">Maximum price</label>
          <input id="max" inputMode="decimal" placeholder="$ Max" value={hi} onChange={(e) => setHi(e.target.value.replace(/[^\d.]/g, ""))} className={`${input} h-9 text-sm`} />
        </div>
        <button type="submit" className={`${btn.small} mt-2`}>Apply</button>
      </fieldset>
    </form>
  );
}
