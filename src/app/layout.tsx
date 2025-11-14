import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./Providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "KSG LISTEN - Digital Feedback & Engagement",
  description: "Turn every comment into action. KSG LISTEN captures and routes feedback across channels with AI prioritization.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} antialiased min-h-screen bg-white overflow-x-hidden`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
