import Link from "next/link";
import { footerColumns, site } from "@/data/site";
import { ChevronUp } from "./icons";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-line bg-surface-muted">
      <div className="shell relative py-10">
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-5">
          {footerColumns.map((col) => (
            <div key={col[0].title} className="flex flex-col gap-6">
              {col.map((group) => (
                <nav key={group.title} aria-label={group.title}>
                  <h2 className="mb-2 text-xs font-bold">{group.title}</h2>
                  <ul className="flex flex-col gap-1.5">
                    {group.links.map((l) => (
                      <li key={l.label}>
                        <Link href={l.href} className="text-xs text-ink-muted hover:text-ink hover:underline">
                          {l.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              ))}
            </div>
          ))}
        </div>

        <a
          href="#top"
          aria-label="Back to top"
          className="absolute right-4 bottom-4 grid size-10 place-items-center rounded-full bg-white shadow-raise hover:bg-tile lg:right-6"
        >
          <ChevronUp width={18} height={18} />
        </a>

        <p className="mt-10 pr-14 text-[11px] text-ink-muted">
          Copyright © 2026 {site.name}. All Rights Reserved.{" "}
          <Link href="/help#returns" className="text-link underline">Policies</Link>,{" "}
          <Link href="/help#contact" className="text-link underline">Contact</Link>
        </p>
      </div>
    </footer>
  );
}
