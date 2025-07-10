import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ShiftFlow - Smart Shift Management for Coffee Shops & Restaurants",
  description:
    "Streamline your team scheduling with our intuitive shift management platform designed for coffee shops and small restaurants.",
  keywords: "shift management, employee scheduling, restaurant software, coffee shop management",
  authors: [{ name: "ShiftFlow Team" }],
  openGraph: {
    title: "ShiftFlow - Smart Shift Management",
    description: "Streamline your team scheduling with our intuitive shift management platform.",
    type: "website",
    locale: "en_US",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  )
}
