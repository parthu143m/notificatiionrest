// app/layout.js  (JavaScript file)

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "RealDel – Restaurant Dashboard",
  description: "Manage your restaurant orders with instant notifications",
  manifest: "/manifest.webmanifest",
  icons: [
    { rel: "icon", url: "/icon-192x192.png" },
    { rel: "apple-touch-icon", url: "/icon-192x192.png" },
  ],
  themeColor: "#000000",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head />
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        <Toaster
          position="top-center"
          reverseOrder={false}
          gutter={12}
          toastOptions={{
            duration: 6000,
            style: {
              background: "#333",
              color: "#fff",
              fontSize: "16px",
              padding: "16px",
              borderRadius: "8px",
            },
            success: {
              icon: "🛎",
              duration: 7000,
            },
          }}
        />
      </body>
    </html>
  );
}