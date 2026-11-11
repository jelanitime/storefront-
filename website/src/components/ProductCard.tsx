import Link from "next/link";
import type { Product } from "@/data/site";
import { formatMoney } from "@/lib/format";
import { ProductImage } from "./ProductImage";
import { WatchButton } from "./WatchButton";

/** One product: photo, save-heart, optional deal badge, title and price. */
export function ProductCard({ product, fluid = false }: { product: Product; fluid?: boolean }) {
  const { id, title, price, was, image, couponEligible, condition } = product;
  return (
    <article className={`group relative ${fluid ? "w-full" : "w-[168px] shrink-0 snap-start sm:w-[200px]"}`}>
      <div className="relative aspect-square overflow-hidden rounded-tile bg-tile">
        <ProductImage
          src={image}
          sizes={fluid ? "(min-width: 1024px) 240px, 50vw" : "200px"}
          className="transition-transform duration-[220ms] group-hover:scale-105"
        />
        {couponEligible && (
          <p className="absolute inset-x-0 bottom-0 bg-white/90 py-1.5 text-center text-[13px] font-extrabold text-sale">
            20% OFF: POP20
          </p>
        )}
        <WatchButton id={id} title={title} />
      </div>
      <h3 className="mt-2 line-clamp-2 text-[13px] leading-[18px]">
        {/* The whole card is clickable via this link's stretched area */}
        <Link href={`/item/${id}`} className="after:absolute after:inset-0 hover:underline">
          {title}
        </Link>
      </h3>
      {condition !== "New" && <p className="text-xs text-ink-muted">{condition}</p>}
      <p className="mt-1 flex items-baseline gap-1.5">
        <span className="text-base font-bold">{formatMoney(price)}</span>
        {was && was > price && (
          <s className="text-xs text-ink-muted">
            <span className="sr-only">was </span>
            {formatMoney(was)}
          </s>
        )}
      </p>
    </article>
  );
}
