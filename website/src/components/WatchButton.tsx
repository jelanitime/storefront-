"use client";

import { toggleWatch, useStore } from "@/lib/store";
import { toast } from "@/lib/toast";
import { HeartIcon } from "./icons";

/** Heart button that saves an item to the Watchlist (remembered after reload). */
export function WatchButton({ id, title }: { id: string; title: string }) {
  const saved = useStore().watchlist.includes(id);
  const onClick = () => {
    const nowSaved = toggleWatch(id);
    toast(
      nowSaved
        ? { message: "Saved to your Watchlist", href: "/watchlist", linkLabel: "View" }
        : "Removed from your Watchlist",
    );
  };
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${title} from watchlist` : `Add ${title} to watchlist`}
      className={`absolute top-2 right-2 z-10 grid size-8 place-items-center rounded-full bg-white shadow-raise transition-transform duration-150 hover:scale-110 ${saved ? "text-brand" : "text-ink"}`}
    >
      <HeartIcon width={16} height={16} filled={saved} />
    </button>
  );
}
