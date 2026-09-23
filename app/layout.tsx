import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Curvy Muscle AI",
  description: "AI photo editor for realistic curvy and muscular physique transformations."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}