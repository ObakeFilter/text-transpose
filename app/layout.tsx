import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Text Transpose",
  description: "Turn a list of lines into one row, or swap the rows and columns of a table.",
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
