import ClientThemeProvider from "@/components/ClientThemeProvider";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import WhatsAppButton from "@/components/WhatsAppButton";
import { WHATSAPP_NUMBER } from "@/lib/constants";
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
  title: "Travels Puri 13 | Affordable Stays & Travel Packages in Puri",
  description: "Book affordable stays and explore Puri with our curated travel packages. Your best travel partner in Puri.",
  keywords: ["Puri", "Hotel Booking", "Travel Packages", "Travels Puri 13", "Odisha Tourism"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-black flex flex-col">
        <ClientThemeProvider>
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
          <WhatsAppButton phoneNumber={WHATSAPP_NUMBER} />
        </ClientThemeProvider>
      </body>
    </html>
  );
}
