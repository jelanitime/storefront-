import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/ContactForm";
import { card } from "@/components/ui";

export const metadata: Metadata = { title: "Help & Contact" };

const faqs = [
  {
    id: "buying",
    q: "How do I buy an item?",
    a: "Open any item, choose a quantity and tap Buy It Now, or Add to cart to keep shopping. At checkout, enter your shipping address and confirm.",
  },
  {
    id: "coupons",
    q: "How do coupons work?",
    a: "Tap “Get the coupon” on a banner, or type a code in your cart. POP10 takes 10% off your order (up to $150). POP20 takes 20% off items with the POP20 badge (up to $200).",
  },
  {
    id: "selling",
    q: "How do I sell something?",
    a: "Create a free account, then go to Sell. Add a photo, title, category, condition, description and price, and your listing goes live straight away.",
  },
  {
    id: "fees",
    q: "Are there seller fees?",
    a: "Listing is free. When the real payment system launches, a small fee will apply only when your item sells.",
  },
  {
    id: "returns",
    q: "What is the return policy?",
    a: "Most items can be returned within 30 days. Start a return from your Purchases page and send the item back in its original condition.",
  },
  {
    id: "guarantee",
    q: "What is the Money Back Guarantee?",
    a: "If your item doesn't arrive, or isn't as described, we'll make it right with a replacement or a full refund.",
  },
];

export default function HelpPage() {
  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
      <section>
        <h1 className="text-2xl font-bold sm:text-3xl">Help & Contact</h1>
        <p className="mt-1 mb-6 text-sm text-ink-muted">
          Answers to common questions. Can&apos;t find what you need? <Link href="#contact" className="text-action hover:underline">Contact us</Link>.
        </p>
        <div className="flex flex-col gap-3">
          {faqs.map((f) => (
            <details key={f.id} id={f.id} className={`${card} group scroll-mt-4 p-5`}>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold [&::-webkit-details-marker]:hidden">
                {f.q}
                <span aria-hidden className="text-xl text-ink-muted transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-ink">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section id="contact" className={`${card} h-fit scroll-mt-4 p-6`}>
        <h2 className="mb-4 text-xl font-bold">Contact us</h2>
        <ContactForm />
      </section>
    </div>
  );
}
