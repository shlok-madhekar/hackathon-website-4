import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import type { Metadata } from 'next'

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: 'Hackathon Website',
  description: 'A modern hackathon website',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
