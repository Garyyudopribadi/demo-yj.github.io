import type React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { Inter } from "next/font/google" // Keep if staff section might use a different font or RootLayout doesn't set it globally
import "../globals.css" // Keep if staff section has specific global styles not covered by RootLayout

// If Inter font is already applied globally by RootLayout, this might be redundant
const inter = Inter({ subsets: ["latin"] })

export default function StaffLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    // Remove <html> and <body> tags
    // The ThemeProvider can wrap the staff-specific content if it needs a distinct theme context
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      {/* This div acts as the main container for the staff section.
          Apply body-like styles here, such as min-height and background.
          The className from the original <body> tag can be moved here. */}
      <div className={`${inter.className} antialiased min-h-screen bg-gradient-to-b from-background to-muted/30`}>
        {/* Staff-specific persistent UI (e.g., a dedicated staff sidebar or header) would go here */}
        {children} {/* This is where staff pages like dashboard/page.tsx will be rendered */}
      </div>
    </ThemeProvider>
  )
}