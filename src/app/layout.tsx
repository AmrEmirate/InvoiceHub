import type React from "react";
import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import ErrorBoundary from "@/components/error-boundary";

export const metadata: Metadata = {
  title: "InvoiceHub - Invoice Management System",
  description: "Modern invoice management for small businesses and freelancers",
  keywords: [
    "invoice",
    "management",
    "billing",
    "freelancer",
    "small business",
  ],
  authors: [{ name: "InvoiceHub" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ErrorBoundary>{children}</ErrorBoundary>
        <Toaster />
      </body>
    </html>
  );
}
