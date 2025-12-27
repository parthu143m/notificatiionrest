// app/layout.js

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

// Fonts
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ✅ Required in Next.js 14+: themeColor goes here (fixes the warning)
export const viewport = {
  themeColor: "#000000", // change to your brand color if needed
};

// Metadata – keep manifest reference (but we'll fix loading below)
export const metadata = {
  title: "RealDel – Restaurant Dashboard",
  description: "Manage your restaurant orders with instant notifications",
  manifest: "/manifest.webmanifest",
  icons: [
    { rel: "icon", url: "/icons/icon-192x192.png" },
    { rel: "apple-touch-icon", url: "/icons/icon-192x192.png" },
    { rel: "icon", url: "/icons/icon-512x512.png", sizes: "512x512" },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Optional: Force PWA install prompt in some cases */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}

        {/* Toast notifications */}
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