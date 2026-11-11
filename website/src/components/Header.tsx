import Link from "next/link";
import Form from "next/form";
import { Logo } from "./Logo";
import { SearchIcon } from "./icons";
import { categories, categoryHref, topBarLinks, VISIBLE_NAV_CATEGORIES } from "@/data/site";
import {
  AccountMenu,
  CartButton,
  Greeting,
  MobileMenu,
  MoreCategories,
  Notifications,
  ShopByCategory,
} from "./HeaderParts";

/** Top bar + logo/search row + category links (shown on every page) */
export function Header() {
  return (
    <header className="border-b border-line">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-full focus:bg-action focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to main content
      </a>

      {/* ── Thin top bar ───────────────────────────── */}
      <div className="border-b border-line">
        <nav aria-label="Account" className="shell flex h-10 items-center justify-between text-xs">
          <ul className="flex items-center gap-4">
            <li>
              <Greeting />
            </li>
            {topBarLinks.map((l) => (
              <li key={l.label} className="hidden md:block">
                <Link href={l.href} className="hover:underline">{l.label}</Link>
              </li>
            ))}
          </ul>
          <ul className="flex items-center gap-3 sm:gap-4">
            <li className="hidden sm:block">
              <Link href="/sell" className="hover:underline">Sell</Link>
            </li>
            <li className="hidden sm:block">
              <Link href="/watchlist" className="hover:underline">Watchlist</Link>
            </li>
            <li className="hidden sm:block">
              <AccountMenu />
            </li>
            <li>
              <Notifications />
            </li>
            <li>
              <CartButton />
            </li>
            <li>
              <MobileMenu />
            </li>
          </ul>
        </nav>
      </div>

      {/* ── Logo + search ──────────────────────────── */}
      <div className="shell flex flex-wrap items-center gap-x-4 gap-y-3 py-3 md:flex-nowrap md:py-4">
        <Logo />
        <ShopByCategory />

        <Form action="/search" role="search" className="order-last flex w-full items-center gap-2 md:order-none md:flex-1">
          <div className="flex h-11 min-w-0 flex-1 items-center rounded-full border-2 border-ink bg-white focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-action">
            <SearchIcon className="ml-4 shrink-0 text-ink-muted" width={18} height={18} />
            <label htmlFor="q" className="sr-only">Search for anything</label>
            <input
              id="q"
              name="q"
              type="search"
              placeholder="Search for anything"
              autoComplete="off"
              className="h-full min-w-0 flex-1 bg-transparent px-3 text-[15px] outline-none placeholder:text-ink-muted"
            />
            <label htmlFor="cat" className="sr-only">Category</label>
            <select
              id="cat"
              name="cat"
              className="hidden h-full w-44 cursor-pointer rounded-r-full border-l border-line bg-transparent px-3 text-xs text-ink-muted outline-none sm:block"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>{c.label}</option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="h-11 shrink-0 rounded-full bg-action px-6 text-[15px] font-bold text-white transition-colors duration-200 hover:bg-action-hover active:scale-[0.98] md:px-12"
          >
            Search
          </button>
        </Form>

        <Link href="/search" className="hidden shrink-0 text-xs text-ink-muted hover:underline xl:block">
          Advanced
        </Link>
      </div>

      {/* ── Category links ─────────────────────────── */}
      <nav aria-label="Categories" className="shell relative">
        <ul className="no-scrollbar flex items-center gap-6 overflow-x-auto pb-3 text-[13px] whitespace-nowrap md:overflow-visible">
          <li>
            <Link
              href="/search"
              className="flex items-center gap-1.5 rounded-full bg-surface-muted px-3 py-1.5 font-medium hover:bg-tile"
            >
              <span aria-hidden className="size-1.5 rounded-full bg-brand" />
              All items
            </Link>
          </li>
          <li>
            <Link href="/watchlist" className="text-ink hover:text-action hover:underline">Saved</Link>
          </li>
          {categories.slice(0, VISIBLE_NAV_CATEGORIES).map((c) => (
            <li key={c.slug}>
              <Link href={categoryHref(c.slug)} className="text-ink hover:text-action hover:underline">
                {c.label}
              </Link>
            </li>
          ))}
          <MoreCategories />
        </ul>
      </nav>
    </header>
  );
}
