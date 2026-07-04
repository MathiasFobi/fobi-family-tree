import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Fobi Family Tree",
  description:
    "A living family tree of the descendants of Vincent and Barbara Fobi — honoring those who have passed and keeping the living connected.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
