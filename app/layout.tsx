'use client'

import { AuthProvider } from '@/contexts/auth'
import isMobile from 'is-mobile'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      {isMobile() ? (
        <body className="antialiased flex justify-center items-center text-center h-screen overflow-hidden">
          <p>
            This app does not support mobile devices just yet. Please try again
            on a desktop device.
          </p>
        </body>
      ) : (
        <AuthProvider>
          <body className={`${inter.className} antialiased`}>{children}</body>
        </AuthProvider>
      )}
    </html>
  )
}
