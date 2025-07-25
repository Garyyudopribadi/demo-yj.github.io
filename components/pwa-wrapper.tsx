"use client"

import type React from "react"
import { useEffect } from "react"
import PWAInstallPrompt from "./pwa-install-prompt"

interface PWAWrapperProps {
  children: React.ReactNode
}

const PWAWrapper = ({ children }: PWAWrapperProps) => {
  useEffect(() => {
    // Register service worker only in production
    if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("SW registered successfully")
        })
        .catch((error) => {
          console.log("SW registration failed:", error)
        })
    }
  }, [])

  return (
    <>
      {children}
      <PWAInstallPrompt />
    </>
  )
}

export default PWAWrapper
