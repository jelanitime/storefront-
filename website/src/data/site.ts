/*
  ─────────────────────────────────────────────────────────────
  ALL THE STORE CONTENT LIVES IN THIS ONE FILE.
  Change a name, price, headline or photo here and the site updates.
  Later, this file gets replaced by a real database.
  ─────────────────────────────────────────────────────────────
*/

/** Builds a sized Unsplash photo link. Swap these for your own photos later. */
const photo = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=75`;

export const site = {
  name: "Pop Shop",
  tagline: "Buy and sell anything",
  description:
    "Pop Shop is the marketplace where anyone can buy and sell electronics, fashion, home goods, collectibles and more.",
};

export type NavLink = { label: string; href: string };

// ── Categories ───────────────────────────────────────────────
export type Category = { slug: string; label: string };

export const categories: Category[] = [
  { slug: "electronics", label: "Electronics" },
  { slug: "fashion", label: "Fashion" },
  { slug: "home-garden", label: "Home & garden" },
  { slug: "collectibles", label: "Collectibles" },
  { slug: "toys", label: "Toys" },
  { slug: "sporting-goods", label: "Sporting goods" },
  { slug: "motors", label: "Motors" },
  { slug: "health-beauty", label: "Health & beauty" },
  { slug: "jewelry-watches", label: "Jewelry & watches" },
];

export const categoryHref = (slug: string) => `/search?cat=${slug}`;
export const categoryLabel = (slug: string) => categories.find((c) => c.slug === slug)?.label ?? "All categories";

/** How many categories show in the menu row before the rest go under "More" */
export const VISIBLE_NAV_CATEGORIES = 7;

/** Links in the thin bar at the very top */
export const topBarLinks: NavLink[] = [
  { label: "Daily Deals", href: "/#deals" },
  { label: "Help & Contact", href: "/help" },
];

// ── Hero slider ──────────────────────────────────────────────
export type HeroSlide = {
  title: string;
  text: string;
  cta: NavLink;
  image: string;
  imageAlt: string;
};

export const heroSlides: HeroSlide[] = [
  {
    title: "New season, new finds",
    text: "Fresh fashion from thousands of sellers, at prices that pop.",
    cta: { label: "Shop fashion", href: categoryHref("fashion") },
    image: photo("1441986300917-64674bd600d8"),
    imageAlt: "Clothing rails and shelves inside a bright boutique",
  },
  {
    title: "Deals that pop, every day",
    text: "Up to 50% off top brands in tech, home and style.",
    cta: { label: "See today's deals", href: "/#deals" },
    image: photo("1607082348824-0a96f2a4b9da"),
    imageAlt: "Colourful shopping bags on a dark background",
  },
  {
    title: "Got stuff? Start selling",
    text: "List your first item in minutes. No listing fees.",
    cta: { label: "List an item", href: "/sell" },
    image: photo("1472851294608-062f824d29cc"),
    imageAlt: "An 'Open' sign hanging in a shop window",
  },
];

// ── Category tiles ───────────────────────────────────────────
export type CategoryTile = { label: string; href: string; image: string };

export const categoryTiles: CategoryTile[] = [
  { label: "Computers", href: categoryHref("electronics"), image: photo("1496181133206-80ce9b88a853") },
  { label: "Phones", href: categoryHref("electronics"), image: photo("1511707171634-5f897ff02aa9") },
  { label: "Drones & tech", href: categoryHref("electronics"), image: photo("1473968512647-3e447244af8f") },
  { label: "Fashion", href: categoryHref("fashion"), image: photo("1445205170230-053b83016050") },
  { label: "Home & garden", href: categoryHref("home-garden"), image: photo("1555041469-a586c61ea9bc") },
  { label: "Collectibles", href: categoryHref("collectibles"), image: photo("1483412033650-1015ddeb83d1") },
  { label: "Toys", href: categoryHref("toys"), image: photo("1587654780291-39c9404d746b") },
  { label: "Motors", href: categoryHref("motors"), image: photo("1503376780353-7e6692767b70") },
];

// ── Products ─────────────────────────────────────────────────
export type Condition = "New" | "Used" | "Refurbished";
export const conditions: Condition[] = ["New", "Used", "Refurbished"];

export type Product = {
  id: string;
  title: string;
  price: number;
  /** Original price. Leave out if the item isn't discounted */
  was?: number;
  /** Photo link. Can be empty for listings without a photo */
  image: string;
  category: string;
  condition: Condition;
  description: string;
  seller: string;
  /** Email of the person who listed it (only for items listed on this site) */
  sellerEmail?: string;
  /** Item qualifies for the POP20 coupon */
  couponEligible?: boolean;
  createdAt?: string;
};

/** The starter catalog. Items people list on the Sell page are added to these. */
export const deals: Product[] = [
  {
    id: "p1",
    title: "Wireless Noise-Cancelling Over-Ear Headphones, 30h Battery",
    price: 179.99,
    was: 249.99,
    image: photo("1505740420928-5e560c06d30e"),
    category: "electronics",
    condition: "New",
    couponEligible: true,
    seller: "SoundHub",
    description:
      "Immersive sound with adaptive noise cancelling, 30 hours of battery life and fast charging: 10 minutes gives you 5 hours of play. Soft memory-foam ear cushions and a foldable design with travel case.",
  },
  {
    id: "p2",
    title: "Smart Watch 44mm, Heart Rate & GPS, Silver",
    price: 129.0,
    was: 199.0,
    image: photo("1523275335684-37898b6baf30"),
    category: "jewelry-watches",
    condition: "New",
    couponEligible: true,
    seller: "TimeWorks",
    description:
      "Track workouts, heart rate, sleep and steps with built-in GPS. Water-resistant to 50m with an always-on display and up to 7 days of battery.",
  },
  {
    id: "p3",
    title: "Lightweight Running Sneakers, Red",
    price: 74.99,
    was: 110.0,
    image: photo("1542291026-7eec264c27ff"),
    category: "fashion",
    condition: "New",
    seller: "StrideStore",
    description:
      "Breathable knit upper, responsive foam cushioning and a grippy rubber outsole. Light enough for race day, comfy enough for every day.",
  },
  {
    id: "p4",
    title: "Mirrorless Camera 24MP with 15-45mm Lens Kit (Refurbished)",
    price: 549.0,
    was: 699.0,
    image: photo("1516035069371-29a1b244cc32"),
    category: "electronics",
    condition: "Refurbished",
    couponEligible: true,
    seller: "LensLoop",
    description:
      "Professionally inspected and restored to full working order. 24MP sensor, 4K video, flip screen and a versatile 15-45mm zoom lens. Includes battery, charger and strap. 1-year warranty.",
  },
  {
    id: "p5",
    title: "Portable Bluetooth Speaker, Waterproof",
    price: 59.99,
    was: 89.99,
    image: photo("1608043152269-423dbba4e7e1"),
    category: "electronics",
    condition: "New",
    seller: "SoundHub",
    description: "Big, punchy sound in a rugged waterproof body. 12-hour battery, pairs two speakers for stereo.",
  },
  {
    id: "p6",
    title: "Polarized Sunglasses, Classic Frame",
    price: 39.99,
    image: photo("1572635196237-14b3f281503f"),
    category: "fashion",
    condition: "New",
    seller: "ShadeCo",
    description: "Classic frame with polarized, UV400 lenses to cut glare. Comes with a hard case and cleaning cloth.",
  },
  {
    id: "p7",
    title: "Wireless Game Controller, Rechargeable",
    price: 44.99,
    was: 64.99,
    image: photo("1606144042614-b2417e99c4e3"),
    category: "toys",
    condition: "Used",
    couponEligible: true,
    seller: "GameGarage",
    description:
      "Gently used and fully tested. Rechargeable battery, responsive triggers and vibration. Works with PC and most consoles via Bluetooth.",
  },
  {
    id: "p8",
    title: "Everyday Laptop Backpack 20L, Water-Resistant",
    price: 49.99,
    was: 79.99,
    image: photo("1553062407-98eeb64c6a62"),
    category: "fashion",
    condition: "New",
    seller: "CarryAll",
    description: "Padded 15\" laptop sleeve, water-resistant fabric, hidden back pocket and luggage strap. Fits under any airline seat.",
  },
  {
    id: "p9",
    title: "Eau de Parfum 100ml, Gift Boxed",
    price: 68.0,
    image: photo("1541643600914-78b084683601"),
    category: "health-beauty",
    condition: "New",
    seller: "ScentStudio",
    description: "A warm, fresh fragrance with notes of citrus, amber and cedar. 100ml bottle, gift boxed and ready to give.",
  },
];

/** Photo for the "Start selling" banner */
export const sellBannerImage = photo("1586953208448-b95a79798f07");

// ── Coupons ──────────────────────────────────────────────────
export const coupons = {
  POP10: { code: "POP10", label: "10% off your order", percent: 10, max: 150, eligibleOnly: false },
  POP20: { code: "POP20", label: "20% off badge deals", percent: 20, max: 200, eligibleOnly: true },
} as const;
export type CouponCode = keyof typeof coupons;

// ── Footer ───────────────────────────────────────────────────
export const footerColumns: { title: string; links: NavLink[] }[][] = [
  [
    {
      title: "Buy",
      links: [
        { label: "Registration", href: "/signin?mode=register" },
        { label: "All items", href: "/search" },
        { label: "Daily deals", href: "/#deals" },
        { label: "Watchlist", href: "/watchlist" },
        { label: "Buying help", href: "/help" },
      ],
    },
  ],
  [
    {
      title: "Sell",
      links: [
        { label: "Start selling", href: "/sell" },
        { label: "How to sell", href: "/help#selling" },
        { label: "Seller fees", href: "/help#fees" },
      ],
    },
    {
      title: "My Pop Shop",
      links: [
        { label: "Account", href: "/account" },
        { label: "Cart", href: "/cart" },
      ],
    },
  ],
  [
    {
      title: "Shop",
      links: categories.slice(0, 5).map((c) => ({ label: c.label, href: categoryHref(c.slug) })),
    },
  ],
  [
    {
      title: "About Pop Shop",
      links: [
        { label: "How it works", href: "/help" },
        { label: "Policies", href: "/help#returns" },
      ],
    },
  ],
  [
    {
      title: "Help & Contact",
      links: [
        { label: "Contact us", href: "/help#contact" },
        { label: "Returns", href: "/help#returns" },
        { label: "Money Back Guarantee", href: "/help#guarantee" },
      ],
    },
  ],
];
