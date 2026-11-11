"use client";

/*
  The site's memory: cart, watchlist, account, listings and orders.
  Everything is saved in this browser (localStorage) so it survives a reload.
  When we add a real back end, only this file needs to change.
*/

import { useMemo, useSyncExternalStore } from "react";
import { coupons, deals, type CouponCode, type Product } from "@/data/site";

export type CartLine = { id: string; qty: number };
export type User = { name: string; email: string };
export type OrderLine = { id: string; title: string; price: number; qty: number; image: string };
export type Order = {
  id: string;
  date: string;
  lines: OrderLine[];
  subtotal: number;
  discount: number;
  total: number;
  coupon: CouponCode | null;
  shipTo: { name: string; address: string; city: string; zip: string; country: string };
  email: string;
  payment: string;
};

export type State = {
  cart: CartLine[];
  watchlist: string[];
  user: User | null;
  accounts: User[];
  listings: Product[];
  orders: Order[];
  coupon: CouponCode | null;
};

const EMPTY: State = { cart: [], watchlist: [], user: null, accounts: [], listings: [], orders: [], coupon: null };
const KEY = "popshop:v1";
export const MAX_QTY = 10;

let state: State = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function readStorage(): State {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...EMPTY, ...JSON.parse(raw) } : EMPTY;
  } catch {
    return EMPTY;
  }
}

function ensureLoaded() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  state = readStorage();
}

const emit = () => listeners.forEach((l) => l());

/** Applies a change and saves it. Returns false if the browser storage is full. */
function update(fn: (s: State) => State): boolean {
  ensureLoaded();
  const next = fn(state);
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    return false;
  }
  state = next;
  emit();
  return true;
}

function subscribe(cb: () => void) {
  ensureLoaded();
  listeners.add(cb);
  // Keep several open tabs in sync
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      state = readStorage();
      emit();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

const getSnapshot = () => {
  ensureLoaded();
  return state;
};

// ── Hooks ────────────────────────────────────────────────────

/** The whole saved state. On the server (and the very first paint) it is empty. */
export function useStore(): State {
  return useSyncExternalStore(subscribe, getSnapshot, () => EMPTY);
}

const noop = () => () => {};
/** False during the first paint, true once the browser has loaded saved data. */
export function useHydrated(): boolean {
  return useSyncExternalStore(noop, () => true, () => false);
}

/** Starter catalog + items people listed on this site (newest listings first). */
export function useProducts(): Product[] {
  const { listings } = useStore();
  return useMemo(() => [...[...listings].reverse(), ...deals], [listings]);
}

export function findProduct(products: Product[], id: string) {
  return products.find((p) => p.id === id);
}

// ── Cart ─────────────────────────────────────────────────────

export function addToCart(id: string, qty = 1) {
  return update((s) => {
    const line = s.cart.find((l) => l.id === id);
    const cart = line
      ? s.cart.map((l) => (l.id === id ? { ...l, qty: Math.min(MAX_QTY, l.qty + qty) } : l))
      : [...s.cart, { id, qty: Math.min(MAX_QTY, qty) }];
    return { ...s, cart };
  });
}

export function setQty(id: string, qty: number) {
  return update((s) => ({
    ...s,
    cart: s.cart.map((l) => (l.id === id ? { ...l, qty: Math.max(1, Math.min(MAX_QTY, qty)) } : l)),
  }));
}

export function removeFromCart(id: string) {
  return update((s) => ({ ...s, cart: s.cart.filter((l) => l.id !== id) }));
}

export type CartRow = { product: Product; qty: number };

/** Prices for a cart, including any coupon discount. */
export function cartTotals(rows: CartRow[], code: CouponCode | null) {
  const subtotal = round(rows.reduce((sum, r) => sum + r.product.price * r.qty, 0));
  const count = rows.reduce((n, r) => n + r.qty, 0);
  let discount = 0;
  let couponNote: string | null = null;
  if (code) {
    const c = coupons[code];
    const base = c.eligibleOnly
      ? rows.filter((r) => r.product.couponEligible).reduce((sum, r) => sum + r.product.price * r.qty, 0)
      : subtotal;
    discount = round(Math.min(c.max, (base * c.percent) / 100));
    if (discount === 0 && c.eligibleOnly) couponNote = "Add an item with the POP20 badge to use this coupon.";
  }
  return { subtotal, discount, total: round(subtotal - discount), count, couponNote };
}

const round = (n: number) => Math.round(n * 100) / 100;

// ── Coupons ──────────────────────────────────────────────────

export function applyCoupon(code: string): CouponCode | null {
  const key = code.trim().toUpperCase();
  if (!(key in coupons)) return null;
  update((s) => ({ ...s, coupon: key as CouponCode }));
  return key as CouponCode;
}

export function removeCoupon() {
  return update((s) => ({ ...s, coupon: null }));
}

// ── Watchlist ────────────────────────────────────────────────

/** Adds or removes an item. Returns true if it's now saved. */
export function toggleWatch(id: string): boolean {
  let saved = false;
  update((s) => {
    saved = !s.watchlist.includes(id);
    return { ...s, watchlist: saved ? [...s.watchlist, id] : s.watchlist.filter((w) => w !== id) };
  });
  return saved;
}

// ── Account (pretend accounts for now: no passwords are stored) ─

export function register(user: User): "ok" | "exists" {
  const email = user.email.trim().toLowerCase();
  ensureLoaded();
  if (state.accounts.some((a) => a.email === email)) return "exists";
  const u = { name: user.name.trim(), email };
  update((s) => ({ ...s, accounts: [...s.accounts, u], user: u }));
  return "ok";
}

export function signIn(email: string): "ok" | "not-found" {
  ensureLoaded();
  const found = state.accounts.find((a) => a.email === email.trim().toLowerCase());
  if (!found) return "not-found";
  update((s) => ({ ...s, user: found }));
  return "ok";
}

export function signOut() {
  return update((s) => ({ ...s, user: null }));
}

// ── Selling ──────────────────────────────────────────────────

export function addListing(p: Omit<Product, "id" | "createdAt">): Product | null {
  const product: Product = { ...p, id: `u${Date.now().toString(36)}`, createdAt: new Date().toISOString() };
  return update((s) => ({ ...s, listings: [...s.listings, product] })) ? product : null;
}

export function deleteListing(id: string) {
  return update((s) => ({
    ...s,
    listings: s.listings.filter((l) => l.id !== id),
    cart: s.cart.filter((l) => l.id !== id),
    watchlist: s.watchlist.filter((w) => w !== id),
  }));
}

// ── Orders ───────────────────────────────────────────────────

export function placeOrder(order: Omit<Order, "id" | "date">): Order {
  const full: Order = {
    ...order,
    id: `PS-${Math.floor(100000 + Math.random() * 900000)}`,
    date: new Date().toISOString(),
  };
  update((s) => ({ ...s, orders: [full, ...s.orders], cart: [], coupon: null }));
  return full;
}
