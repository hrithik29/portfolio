import type { Metadata } from "next";
import localFont from "next/font/local";
import { Suspense } from "react";
import Navbar from "./components/Navbar";
import GoogleAnalytics from "./components/GoogleAnalytics";
import AnalyticsPageView from "./components/AnalyticsPageView";
import ResponsiveFooter from "@/components/ResponsiveFooter";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Hrithik Jain - Portfolio",
  description: "Product Manager Portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-neutral-950 text-white`}
      >
        <GoogleAnalytics />
        <Suspense fallback={null}>
          <AnalyticsPageView />
        </Suspense>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">{children}</main>
          <ResponsiveFooter />
        </div>
      </body>
    </html>
  );
}
