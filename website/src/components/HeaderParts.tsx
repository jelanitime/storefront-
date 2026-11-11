"use client";

/* The interactive bits of the header: greeting, menus, notifications and cart count. */

import Link from "next/link";
import { useRouter } from "next/navigation";
import { categories, categoryHref, VISIBLE_NAV_CATEGORIES } from "@/data/site";
import { signOut, useStore } from "@/lib/store";
import { toast } from "@/lib/toast";
import { useDropdown } from "@/lib/useDropdown";
import { formatDate } from "@/lib/format";
import { BellIcon, CartIcon, ChevronDown, MenuIcon } from "./icons";

const menuPanel =
  "absolute z-40 mt-2 min-w-56 rounded-card border border-line bg-white p-2 text-sm shadow-[0_8px_24px_rgb(0_0_0/0.12)]";
const menuItem = "block rounded-md px-3 py-2 text-ink hover:bg-surface-muted";

/** "Hi! Sign in or register"  →  "Hi, Sam!" once signed in */
export function Greeting() {
  const { user } = useStore();
  if (user) {
    return (
      <span>
        Hi, <Link href="/account" className="font-bold hover:underline">{user.name.split(" ")[0]}</Link>!
      </span>
    );
  }
  return (
    <span>
      Hi! <Link href="/signin" className="text-link underline">Sign in</Link> or{" "}
      <Link href="/signin?mode=register" className="text-link underline">register</Link>
    </span>
  );
}

/** "My Pop Shop" dropdown */
export function AccountMenu() {
  const { user } = useStore();
  const router = useRouter();
  const { open, toggle, close, ref, buttonRef } = useDropdown();
  return (
    <div ref={ref} className="relative">
      <button ref={buttonRef} type="button" onClick={toggle} aria-expanded={open} className="flex items-center gap-0.5 hover:underline">
        My Pop Shop <ChevronDown width={14} height={14} />
      </button>
      {open && (
        <div className={`${menuPanel} right-0`} onClick={close}>
          <Link href="/account" className={menuItem}>Account summary</Link>
          <Link href="/account#orders" className={menuItem}>Purchases</Link>
          <Link href="/account#listings" className={menuItem}>Selling</Link>
          <Link href="/watchlist" className={menuItem}>Watchlist</Link>
          <hr className="my-1 border-line" />
          {user ? (
            <button
              type="button"
              className={`${menuItem} w-full text-left`}
              onClick={() => {
                signOut();
                toast("You've signed out");
                router.push("/");
              }}
            >
              Sign out
            </button>
          ) : (
            <Link href="/signin" className={menuItem}>Sign in</Link>
          )}
        </div>
      )}
    </div>
  );
}

/** Bell icon: shows recent order updates */
export function Notifications() {
  const { orders } = useStore();
  const { open, toggle, close, ref, buttonRef } = useDropdown();
  const recent = orders.slice(0, 3);
  return (
    <div ref={ref} className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-label="Notifications"
        className="relative grid size-8 place-items-center rounded-full hover:bg-tile"
      >
        <BellIcon width={18} height={18} />
        {recent.length > 0 && <span aria-hidden className="absolute top-1 right-1.5 size-2 rounded-full bg-brand" />}
      </button>
      {open && (
        <div className={`${menuPanel} right-0 w-72`}>
          <p className="px-3 py-2 font-bold">Notifications</p>
          {recent.length === 0 ? (
            <p className="px-3 pb-3 text-ink-muted">You&apos;re all caught up.</p>
          ) : (
            recent.map((o) => (
              <Link key={o.id} href="/account#orders" onClick={close} className={menuItem}>
                <span className="block font-medium">Order {o.id} confirmed</span>
                <span className="text-xs text-ink-muted">{formatDate(o.date)} · {o.lines.length} item(s)</span>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}

/** Cart icon with the number of items */
export function CartButton() {
  const { cart } = useStore();
  const count = cart.reduce((n, l) => n + l.qty, 0);
  return (
    <Link
      href="/cart"
      aria-label={`Shopping cart, ${count} item${count === 1 ? "" : "s"}`}
      className="relative grid size-8 place-items-center rounded-full hover:bg-tile"
    >
      <CartIcon width={18} height={18} />
      {count > 0 && (
        <span className="absolute -top-0.5 -right-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-brand px-1 text-[10px] leading-none font-bold text-white">
          {count}
        </span>
      )}
    </Link>
  );
}

/** Phone-only menu button (the top-bar links are hidden on small screens) */
export function MobileMenu() {
  const { user } = useStore();
  const { open, toggle, close, ref, buttonRef } = useDropdown();
  return (
    <div ref={ref} className="relative sm:hidden">
      <button
        ref={buttonRef}
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-label="Menu"
        className="grid size-8 place-items-center rounded-full hover:bg-tile"
      >
        <MenuIcon width={18} height={18} />
      </button>
      {open && (
        <nav aria-label="Mobile" className={`${menuPanel} right-0 w-64`} onClick={close}>
          <Link href="/sell" className={menuItem}>Sell an item</Link>
          <Link href="/watchlist" className={menuItem}>Watchlist</Link>
          <Link href="/account" className={menuItem}>My Pop Shop</Link>
          <Link href="/#deals" className={menuItem}>Daily Deals</Link>
          <Link href="/help" className={menuItem}>Help & Contact</Link>
          {!user && (
            <>
              <hr className="my-1 border-line" />
              <Link href="/signin" className={menuItem}>Sign in</Link>
            </>
          )}
        </nav>
      )}
    </div>
  );
}

/** "Shop by category" button next to the logo */
export function ShopByCategory() {
  const { open, toggle, close, ref, buttonRef } = useDropdown();
  return (
    <div ref={ref} className="relative hidden shrink-0 lg:block">
      <button
        ref={buttonRef}
        type="button"
        onClick={toggle}
        aria-expanded={open}
        className="flex items-center gap-1 text-left text-xs leading-tight text-ink-muted hover:text-ink"
      >
        Shop by
        <br />
        category
        <ChevronDown width={14} height={14} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className={`${menuPanel} left-0 grid w-[420px] grid-cols-2 gap-x-2`} onClick={close}>
          <p className="col-span-2 px-3 pt-1 pb-2 text-xs font-bold tracking-wide text-ink-muted uppercase">
            Shop by category
          </p>
          {categories.map((c) => (
            <Link key={c.slug} href={categoryHref(c.slug)} className={menuItem}>
              {c.label}
            </Link>
          ))}
          <Link href="/search" className={`${menuItem} col-span-2 font-bold text-action`}>
            See all categories
          </Link>
        </div>
      )}
    </div>
  );
}

/** "More" at the end of the category row */
export function MoreCategories() {
  const { open, toggle, close, ref, buttonRef } = useDropdown<HTMLLIElement>();
  const rest = categories.slice(VISIBLE_NAV_CATEGORIES);
  return (
    <li ref={ref}>
      <button
        ref={buttonRef}
        type="button"
        onClick={toggle}
        aria-expanded={open}
        className="flex items-center gap-1 hover:text-action"
      >
        <MenuIcon width={14} height={14} />
        More
      </button>
      {open && (
        <div className={`${menuPanel} right-4 lg:right-6`} onClick={close}>
          {rest.map((c) => (
            <Link key={c.slug} href={categoryHref(c.slug)} className={menuItem}>
              {c.label}
            </Link>
          ))}
          <Link href="/search" className={`${menuItem} font-bold text-action`}>
            All items
          </Link>
        </div>
      )}
    </li>
  );
}
