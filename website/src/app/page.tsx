import { HeroCarousel } from "@/components/HeroCarousel";
import { CategoryTiles } from "@/components/CategoryTiles";
import { CouponStrip, GiftPromo, SellBanner } from "@/components/PromoBanners";
import { DealsRow } from "@/components/DealsRow";
import { ProductCard } from "@/components/ProductCard";
import { RecentListings } from "@/components/RecentListings";
import { categoryTiles, deals, heroSlides } from "@/data/site";

/** The homepage. Each line below is one section, top to bottom. */
export default function Home() {
  return (
    <div className="flex flex-col gap-10 sm:gap-12">
      <HeroCarousel slides={heroSlides} />
      <CategoryTiles title="Shop by category" tiles={categoryTiles} />
      <CouponStrip />
      <GiftPromo />
      <SellBanner />
      <DealsRow id="deals" title="Today's Deals" subtitle="All with free shipping">
        {deals.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </DealsRow>
      <RecentListings />
    </div>
  );
}
