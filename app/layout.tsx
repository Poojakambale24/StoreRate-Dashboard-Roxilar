import type React from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { AuthProvider } from "@/contexts/auth-context";
import { StoreProvider } from "@/contexts/store-context";
import { RatingProvider } from "@/contexts/rating-context";
import { Star } from "lucide-react";

export const metadata: Metadata = {
  title: "StoreRate - Store Rating Platform",
  description: "Rate and review stores in your area",
  icons: {
    icon: "/favicon-blue-star.svg",
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable}`} 
    >
      <body>
        <AuthProvider>
          <StoreProvider>
            <RatingProvider>{children}</RatingProvider>
          </StoreProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
