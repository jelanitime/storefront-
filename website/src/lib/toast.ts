"use client";

import { useSyncExternalStore } from "react";

/** Small pop-up messages ("Added to cart", etc.) shown at the bottom of the screen. */
export type Toast = { id: number; message: string; href?: string; linkLabel?: string; tone?: "default" | "error" };

let toasts: Toast[] = [];
let nextId = 1;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export function toast(t: Omit<Toast, "id"> | string) {
  const item: Toast = typeof t === "string" ? { id: nextId++, message: t } : { ...t, id: nextId++ };
  toasts = [...toasts.slice(-2), item];
  emit();
  setTimeout(() => dismissToast(item.id), 4000);
}

export function dismissToast(id: number) {
  toasts = toasts.filter((t) => t.id !== id);
  emit();
}

const EMPTY: Toast[] = [];
export function useToasts() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => toasts,
    () => EMPTY,
  );
}
