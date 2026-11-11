import Image from "next/image";
import Link from "next/link";
import { GiftIcon, ShieldIcon, TagIcon } from "./icons";
import { sellBannerImage } from "@/data/site";
import { CouponButton } from "./CouponButton";

/** Thin lime coupon strip */
export function CouponStrip() {
  return (
    <section className="flex flex-col gap-4 rounded-tile bg-lime px-6 py-6 text-lime-ink sm:flex-row sm:items-center sm:justify-between sm:px-8">
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight">Make it pop for 10% off</h2>
        <p className="mt-1 text-sm">
          Score savings on the things you love.{" "}
          <span className="mt-1 block text-xs opacity-80 sm:ml-2 sm:inline sm:border-l sm:border-lime-ink/40 sm:pl-2">
            Ends 12/31. Max $150 off. Select items.
          </span>
        </p>
      </div>
      <CouponButton
        code="POP10"
        className="w-fit shrink-0 rounded-full bg-lime-ink px-5 py-2.5 text-sm font-bold text-lime transition-opacity hover:opacity-90"
      />
    </section>
  );
}

/** Big pink promo with three illustrated "cards" on the right (no photo needed) */
export function GiftPromo() {
  return (
    <section className="relative grid overflow-hidden rounded-tile bg-candy text-candy-ink md:grid-cols-2">
      <div className="flex flex-col justify-center gap-3 px-6 py-10 sm:px-12">
        <h2 className="text-[28px] leading-tight font-extrabold tracking-tight sm:text-[34px]">
          20% off badge deals
        </h2>
        <p className="text-[15px]">Look for the POP20 badge on tech, watches and more. Perfect for gifting.</p>
        <CouponButton
          code="POP20"
          className="mt-2 w-fit rounded-full bg-candy-ink px-5 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90"
        />
        <p className="mt-6 text-xs opacity-80">Ends 12/8. Max $200 off. Select items. 2x use.</p>
      </div>

      <div aria-hidden className="relative hidden h-full min-h-[260px] items-center justify-center md:flex">
        <div className="flex h-44 w-32 -rotate-6 flex-col items-center justify-center gap-4 rounded-2xl bg-pink-100 shadow-raise">
          <span className="text-xl font-extrabold">Gifting</span>
          <GiftIcon width={52} height={52} strokeWidth={1.75} />
        </div>
        <div className="z-10 -mx-3 flex h-44 w-32 rotate-3 flex-col items-center justify-center gap-4 rounded-2xl bg-pink-300 shadow-raise">
          <span className="text-xl font-extrabold">Coupon</span>
          <TagIcon width={52} height={52} strokeWidth={1.75} />
        </div>
        <div className="z-20 flex h-48 w-36 -rotate-2 flex-col items-center justify-center rounded-2xl bg-candy-ink text-pink-200 shadow-raise">
          <span className="text-5xl leading-none font-black">20%</span>
          <span className="text-5xl leading-none font-black">OFF</span>
        </div>
      </div>
    </section>
  );
}

/** Dark green "start selling" banner. This is where marketplace sellers sign up. */
export function SellBanner() {
  return (
    <section id="sell" className="grid scroll-mt-4 overflow-hidden rounded-tile bg-forest text-forest-ink md:grid-cols-2">
      <div className="flex flex-col justify-center gap-3 px-6 py-10 sm:px-12">
        <p className="flex items-center gap-2 text-sm">
          <ShieldIcon width={18} height={18} /> Seller protection included
        </p>
        <h2 className="text-[28px] leading-tight font-extrabold tracking-tight sm:text-[34px]">
          Sell anything for free
        </h2>
        <p className="text-[15px] opacity-90">
          Zero listing fees. Reach millions of buyers and get paid fast.
        </p>
        <Link
          href="/sell"
          className="mt-2 w-fit rounded-full bg-lime px-5 py-2.5 text-sm font-bold text-lime-ink transition-opacity hover:opacity-90"
        >
          List an item
        </Link>
        <Link href="/help#fees" className="mt-6 text-xs underline opacity-80 hover:opacity-100">
          Limited time. Fees apply when your item sells.
        </Link>
      </div>
      <div className="relative min-h-[220px] md:m-8 md:min-h-0 md:overflow-hidden md:rounded-tile">
        <Image
          src={`${sellBannerImage}&w=900`}
          alt="A phone showing an online shop listing"
          fill
          sizes="(min-width: 768px) 600px, 100vw"
          className="object-cover"
        />
      </div>
    </section>
  );
}
