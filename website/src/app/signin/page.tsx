import type { Metadata } from "next";
import { Suspense } from "react";
import { SignInView } from "@/components/SignInView";
import { PageLoading } from "@/components/Loading";

export const metadata: Metadata = { title: "Sign in" };

export default function Page() {
  return (
    <Suspense fallback={<PageLoading />}>
      <SignInView />
    </Suspense>
  );
}
