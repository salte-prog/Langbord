import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Langbord \u2014 Nettverk. Kunnskap. Bordet som samler.",
  description:
    "Langbord er en eksklusiv n\u00e6ringslivsklubb for unge og ambisi\u00f8se fagpersoner fra vidt forskjellige bransjer.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="no" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
