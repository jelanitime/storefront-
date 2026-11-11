import { Suspense } from "react";
import { ItemView } from "@/components/ItemView";
import { PageLoading } from "@/components/Loading";
import { deals } from "@/data/site";

/** Pre-build the starter products' pages so they open instantly. */
export function generateStaticParams() {
  return deals.map((p) => ({ id: p.id }));
}

export default function ItemPage({ params }: PageProps<"/item/[id]">) {
  return (
    <Suspense fallback={<PageLoading label="Loading item…" />}>
      {params.then(({ id }) => (
        <ItemView id={id} />
      ))}
    </Suspense>
  );
}
