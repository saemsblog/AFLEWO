import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientLayout from "./client-layout";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "AFLEWO — Africa Let's Worship",
    template: "%s | AFLEWO",
  },
  description:
    "Africa Let's Worship (AFLEWO) — A continental interdenominational worship movement bringing thousands together since 2004. Join the choir, partner with us, or attend our all-night worship events across East Africa.",
  keywords: ["AFLEWO", "Africa worship", "choir", "East Africa", "worship movement", "Nairobi"],
  authors: [{ name: "AFLEWO" }],
  creator: "AFLEWO",
  openGraph: {
    type: "website",
    locale: "en_KE",
    url: "https://aflewo.org",
    siteName: "AFLEWO",
    title: "AFLEWO — Africa Let's Worship",
    description: "A continental interdenominational worship movement since 2004.",
  },
  twitter: {
    card: "summary_large_image",
    title: "AFLEWO — Africa Let's Worship",
    description: "A continental interdenominational worship movement since 2004.",
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://aflewo.org"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={`${inter.variable} font-sans bg-background text-foreground antialiased selection:bg-gold/30 selection:text-white overflow-x-hidden`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
