import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchView } from "@/components/SearchView";
import { PageLoading } from "@/components/Loading";

export const metadata: Metadata = { title: "Search" };

export default function SearchPage() {
  return (
    <Suspense fallback={<PageLoading label="Loading results…" />}>
      <SearchView />
    </Suspense>
  );
}
