import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NodeControl | Technical Infrastructure Excellence",
  description: "Advanced hardware-accelerated web infrastructure and node management.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
