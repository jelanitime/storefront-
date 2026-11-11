import Link from "next/link";
import { btn } from "@/components/ui";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md py-20 text-center">
      <p className="text-6xl font-black text-brand">404</p>
      <h1 className="mt-4 text-2xl font-bold">We looked everywhere…</h1>
      <p className="mt-2 text-ink-muted">This page doesn&apos;t exist or has moved.</p>
      <div className="mt-6 flex justify-center gap-3">
        <Link href="/" className={btn.primary}>Go to homepage</Link>
        <Link href="/search" className={btn.secondary}>Browse all items</Link>
      </div>
    </div>
  );
}
