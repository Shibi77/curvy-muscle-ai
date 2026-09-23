import "./globals.css";

export const metadata = {
  title: "Curvy Muscle AI",
  description: "AI physique transformation",
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
