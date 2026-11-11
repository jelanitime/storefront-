"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { categories, conditions, type Condition } from "@/data/site";
import { addListing, useHydrated, useStore } from "@/lib/store";
import { toast } from "@/lib/toast";
import { PageLoading } from "./Loading";
import { btn, card, input, label } from "./ui";

type Field = "title" | "category" | "price" | "was" | "description";
type Errors = Partial<Record<Field | "photo", string>>;

/** Shrinks an uploaded photo so it fits in browser storage (max 640px, JPEG). */
function resizePhoto(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const scale = Math.min(1, 640 / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.78));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("bad image"));
    };
    img.src = url;
  });
}

/** "List an item" form. The new listing appears in search, categories and on the homepage. */
export function SellView() {
  const hydrated = useHydrated();
  const { user } = useStore();
  const router = useRouter();
  const [photo, setPhoto] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [saving, setSaving] = useState(false);

  if (!hydrated) return <PageLoading label="Loading…" />;

  if (!user) {
    return (
      <div className="mx-auto max-w-md py-16 text-center">
        <h1 className="text-2xl font-bold">Sell on Pop Shop</h1>
        <p className="mt-2 text-ink-muted">Sign in or create a free account to list your first item. No listing fees.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/signin?next=/sell" className={btn.primary}>Sign in</Link>
          <Link href="/signin?mode=register&next=/sell" className={btn.secondary}>Create account</Link>
        </div>
      </div>
    );
  }

  const onPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return setErrors((x) => ({ ...x, photo: "Please choose an image file (JPG, PNG, WebP)." }));
    try {
      setPhoto(await resizePhoto(file));
      setErrors((x) => ({ ...x, photo: undefined }));
    } catch {
      setErrors((x) => ({ ...x, photo: "That image couldn't be read. Try another one." }));
    }
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const get = (k: string) => String(d.get(k) ?? "").trim();
    const title = get("title");
    const category = get("category");
    const price = parseFloat(get("price"));
    const wasRaw = get("was");
    const was = wasRaw ? parseFloat(wasRaw) : undefined;
    const description = get("description");

    const errs: Errors = {};
    if (title.length < 5) errs.title = "Give your item a title of at least 5 characters.";
    if (!category) errs.category = "Choose a category.";
    if (!(price > 0)) errs.price = "Enter a price above $0.";
    if (was !== undefined && !(was > price)) errs.was = "The original price should be higher than your price (or leave it empty).";
    if (description.length < 10) errs.description = "Describe your item in at least 10 characters.";
    setErrors(errs);
    const first = Object.keys(errs)[0];
    if (first) return document.getElementById(`sell-${first}`)?.focus();

    setSaving(true);
    const product = addListing({
      title,
      category,
      condition: get("condition") as Condition,
      price: Math.round(price * 100) / 100,
      was: was ? Math.round(was * 100) / 100 : undefined,
      description,
      image: photo,
      seller: user.name,
      sellerEmail: user.email,
    });
    setSaving(false);
    if (!product) {
      toast({ message: "Your browser's storage is full. Try a smaller photo or delete an old listing.", tone: "error" });
      return;
    }
    toast({ message: "Your item is live!", href: "/account#listings", linkLabel: "My listings" });
    router.push(`/item/${product.id}`);
  };

  const err = (k: keyof Errors) =>
    errors[k] ? <p id={`sell-${k}-err`} className="mt-1 text-xs text-sale">{errors[k]}</p> : null;
  const aria = (k: Field) => ({ "aria-invalid": Boolean(errors[k]), "aria-describedby": errors[k] ? `sell-${k}-err` : undefined });

  return (
    <div className="mx-auto w-full max-w-3xl">
      <h1 className="text-2xl font-bold sm:text-3xl">List an item</h1>
      <p className="mt-1 mb-6 text-sm text-ink-muted">Selling as {user.name}. No listing fees.</p>

      <form noValidate onSubmit={onSubmit} className="flex flex-col gap-6">
        <section className={`${card} p-5`}>
          <h2 className="mb-3 text-lg font-bold">Photo</h2>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative grid size-40 shrink-0 place-items-center overflow-hidden rounded-tile border-2 border-dashed border-line bg-surface-muted text-center text-xs text-ink-muted">
              {photo ? <Image src={photo} alt="Preview of your item photo" fill unoptimized className="object-cover" /> : "No photo yet"}
            </div>
            <div>
              <label htmlFor="sell-photo" className={`${btn.secondary} cursor-pointer`}>
                {photo ? "Change photo" : "Add a photo"}
              </label>
              <input id="sell-photo" type="file" accept="image/*" onChange={onPhoto} className="sr-only" />
              {photo && (
                <button type="button" onClick={() => setPhoto("")} className="ml-3 text-sm text-action hover:underline">
                  Remove
                </button>
              )}
              <p className="mt-2 text-xs text-ink-muted">Optional, but listings with photos sell faster. JPG, PNG or WebP.</p>
              {err("photo")}
            </div>
          </div>
        </section>

        <section className={`${card} grid gap-4 p-5 sm:grid-cols-2`}>
          <h2 className="text-lg font-bold sm:col-span-2">Details</h2>
          <div className="sm:col-span-2">
            <label htmlFor="sell-title" className={label}>Title</label>
            <input id="sell-title" name="title" maxLength={80} placeholder="e.g. Vintage leather jacket, size M" className={input} {...aria("title")} />
            {err("title")}
          </div>
          <div>
            <label htmlFor="sell-category" className={label}>Category</label>
            <select id="sell-category" name="category" defaultValue="" className={input} {...aria("category")}>
              <option value="" disabled>Choose a category</option>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>{c.label}</option>
              ))}
            </select>
            {err("category")}
          </div>
          <div>
            <label htmlFor="sell-condition" className={label}>Condition</label>
            <select id="sell-condition" name="condition" defaultValue="Used" className={input}>
              {conditions.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="sell-description" className={label}>Description</label>
            <textarea
              id="sell-description"
              name="description"
              rows={5}
              maxLength={2000}
              placeholder="Size, colour, brand, any wear or flaws, what's included…"
              className={`${input} h-auto py-2`}
              {...aria("description")}
            />
            {err("description")}
          </div>
        </section>

        <section className={`${card} grid gap-4 p-5 sm:grid-cols-2`}>
          <h2 className="text-lg font-bold sm:col-span-2">Price</h2>
          <div>
            <label htmlFor="sell-price" className={label}>Your price ($)</label>
            <input id="sell-price" name="price" inputMode="decimal" placeholder="0.00" className={input} {...aria("price")} />
            {err("price")}
          </div>
          <div>
            <label htmlFor="sell-was" className={label}>Original price ($), optional</label>
            <input id="sell-was" name="was" inputMode="decimal" placeholder="Shows a crossed-out price" className={input} {...aria("was")} />
            {err("was")}
          </div>
        </section>

        <div className="flex flex-wrap gap-3">
          <button type="submit" disabled={saving} className={btn.primary}>
            {saving ? "Listing…" : "List it for free"}
          </button>
          <Link href="/account#listings" className={btn.secondary}>Cancel</Link>
        </div>
      </form>
    </div>
  );
}
