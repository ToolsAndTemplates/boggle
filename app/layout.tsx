import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Boggle - Word Grid Game",
  description: "Find words in a letter grid before time runs out!",
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
  },
  themeColor: '#7c3aed',
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
