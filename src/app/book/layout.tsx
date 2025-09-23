import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | E-Library",
    default: "Book Details | E-Library"
  },
  description: "Explore book details, read reviews, and discover your next favorite book.",
};

export default function BookLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
