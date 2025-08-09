import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Psycare Blog",
    template: "%s | Psycare Blog"
  },
  description: "Expert insights and articles about psychological care and mental health",
  keywords: ["psychology", "mental health", "therapy", "counseling", "psycare"],
  authors: [{ name: "Psycare Team" }],
  creator: "Psycare",
  publisher: "Psycare",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://epsilonelias.github.io/Connection/',
    siteName: 'Psycare Blog',
    title: 'Psycare Blog',
    description: 'Expert insights and articles about psychological care and mental health',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Psycare Blog',
    description: 'Expert insights and articles about psychological care and mental health',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
