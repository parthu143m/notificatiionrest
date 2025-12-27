// app/layout.js

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

export const viewport = {
  themeColor: "#000000",
};

export const metadata = {
  title: "RealDel – Restaurant Dashboard",
  description: "Manage your restaurant orders with instant notifications",
  icons: [
    { rel: "icon", url: "/icons/icon-192x192.png" },
    { rel: "apple-touch-icon", url: "/icons/icon-192x192.png" },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 6000,
            style: {
              background: "#333",
              color: "#fff",
              fontSize: "16px",
              padding: "16px",
              borderRadius: "8px",
            },
            success: { icon: "🛎" },
          }}
        />
      </body>
    </html>
  );
}