import type { Metadata } from "next";
import { SellView } from "@/components/SellView";

export const metadata: Metadata = { title: "List an item" };

export default function Page() {
  return <SellView />;
}
