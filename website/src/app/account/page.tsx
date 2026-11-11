import type { Metadata } from "next";
import { AccountView } from "@/components/AccountView";

export const metadata: Metadata = { title: "My Pop Shop" };

export default function Page() {
  return <AccountView />;
}
