import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import ConditionalLayoutWrapper from "@/components/conditional-layout-wrapper"
import PWAWrapper from "@/components/pwa-wrapper"
import AppWrapper from "@/components/app-wrapper"
import ErrorBoundary from "@/components/error-boundary"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "PT.YONGJIN JAVASUKA GARMENT",
  description: "Improve quality of life by manufacturing premium quality products",
  generator: "garyyudo.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2563eb" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="YONGJIN" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        {/* Favicon for browser tab */}
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/icon-16x16.png" />
        <link rel="shortcut icon" href="/icons/icon-192x192.png" />

        {/* Google Translate Meta */}
        <meta name="google-translate-customization" content="9f841e7780177523-3214ceb76f765f38-gc38c6fe6f9d06436-c" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <ErrorBoundary>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            <PWAWrapper>
              <AppWrapper>
                <ConditionalLayoutWrapper>{children}</ConditionalLayoutWrapper>
              </AppWrapper>
            </PWAWrapper>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
