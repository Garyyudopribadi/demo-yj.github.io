"use client"

import type React from "react"

import { usePathname } from "next/navigation"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

interface ConditionalLayoutWrapperProps {
  children: React.ReactNode
}

const ConditionalLayoutWrapper = ({ children }: ConditionalLayoutWrapperProps) => {
  const pathname = usePathname()

  // Define paths that should show header and footer
  const showHeaderFooterPaths = ["/", "/events", "/careers", "/contact", "/internal"]

  // Check if current path should show header and footer
  const shouldShowHeaderFooter = showHeaderFooterPaths.some((path) => {
    if (path === "/") {
      return pathname === "/"
    }
    return pathname.startsWith(path)
  })

  // Don't show header/footer for content management system
  const isContentPath = pathname.startsWith("/content")

  if (isContentPath || !shouldShowHeaderFooter) {
    return <>{children}</>
  }

  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  )
}

export default ConditionalLayoutWrapper
