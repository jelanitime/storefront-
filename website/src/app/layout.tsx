import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { site } from "@/data/site";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Toaster } from "@/components/Toaster";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: { default: `${site.name} | ${site.tagline}`, template: `%s | ${site.name}` },
  description: site.description,
};

/** Shared frame for every page: header on top, footer at the bottom. */
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body id="top" className="flex min-h-full flex-col font-sans">
        <Header />
        <main id="main" className="shell flex flex-1 flex-col py-6">
          {children}
        </main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
