import Image from "next/image";
import Link from "next/link";
import type { CategoryTile } from "@/data/site";

/** Row of rounded picture tiles. Swipes sideways on phones, fits in one row on desktop. */
export function CategoryTiles({ title, tiles }: { title: string; tiles: CategoryTile[] }) {
  return (
    <section aria-labelledby="cat-title">
      <h2 id="cat-title" className="mb-4 text-xl font-bold sm:text-2xl">
        {title}
      </h2>
      <ul className="no-scrollbar -mx-4 flex snap-x scroll-px-4 gap-3 overflow-x-auto px-4 lg:mx-0 lg:grid lg:grid-cols-8 lg:gap-4 lg:px-0">
        {tiles.map((t) => (
          <li key={t.label} className="w-32 shrink-0 snap-start sm:w-36 lg:w-auto">
            <Link href={t.href} className="group block">
              <div className="relative aspect-square overflow-hidden rounded-tile bg-tile">
                <Image
                  src={`${t.image}&w=400&h=400`}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 150px, 144px"
                  className="object-cover transition-transform duration-[220ms] group-hover:scale-105"
                />
              </div>
              <p className="mt-2 text-sm group-hover:underline">{t.label}</p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
