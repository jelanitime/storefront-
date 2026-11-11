"use client";

import Link from "next/link";
import { dismissToast, useToasts } from "@/lib/toast";

/** Shows the little pop-up messages at the bottom of the screen. */
export function Toaster() {
  const toasts = useToasts();
  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex flex-col items-center gap-2 px-4"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-full py-2.5 pr-2.5 pl-5 text-sm text-white shadow-raise ${t.tone === "error" ? "bg-sale" : "bg-ink"}`}
        >
          <span className="flex-1">{t.message}</span>
          {t.href && (
            <Link href={t.href} onClick={() => dismissToast(t.id)} className="font-bold underline">
              {t.linkLabel ?? "View"}
            </Link>
          )}
          <button
            type="button"
            onClick={() => dismissToast(t.id)}
            aria-label="Dismiss message"
            className="grid size-7 place-items-center rounded-full text-white/70 hover:bg-white/15 hover:text-white"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
