import Link from "next/link";
import { site } from "@/data/site";

/** Text logo: "pop" in brand pink, "shop" in ink, with a pink dot. Swap for an image logo later. */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label={`${site.name} home`}
      className={`inline-flex items-baseline text-[28px] leading-none font-extrabold tracking-tight sm:text-[34px] ${className}`}
    >
      <span className="text-brand">pop</span>
      <span className="text-ink">shop</span>
      <span aria-hidden className="ml-0.5 inline-block size-2 rounded-full bg-brand sm:size-2.5" />
    </Link>
  );
}
