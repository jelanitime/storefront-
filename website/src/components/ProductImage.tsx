import Image from "next/image";
import { TagIcon } from "./icons";

/**
 * Product photo that fills its box. Handles stock photos, photos people
 * uploaded on the Sell page, and items with no photo at all.
 */
export function ProductImage({
  src,
  alt = "",
  size = 500,
  sizes = "200px",
  className = "",
  eager = false,
}: {
  src: string;
  alt?: string;
  size?: number;
  sizes?: string;
  className?: string;
  eager?: boolean;
}) {
  if (!src) {
    return (
      <div className="absolute inset-0 grid place-items-center bg-tile text-ink-muted">
        <TagIcon width={36} height={36} strokeWidth={1.5} />
      </div>
    );
  }
  const uploaded = src.startsWith("data:");
  return (
    <Image
      src={uploaded ? src : `${src}&w=${size}&h=${size}`}
      alt={alt}
      fill
      sizes={sizes}
      unoptimized={uploaded}
      loading={eager ? "eager" : "lazy"}
      className={`object-cover ${className}`}
    />
  );
}
