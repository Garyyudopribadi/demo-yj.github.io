"use client"

import type React from "react"
import { useState, useEffect } from "react"
import LoadingScreen from "./loading-screen"

interface AppWrapperProps {
  children: React.ReactNode
}

const AppWrapper = ({ children }: AppWrapperProps) => {
  const [showLoading, setShowLoading] = useState(true)
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    // Simple timeout to ensure loading completes
    const timer = setTimeout(() => {
      setShowLoading(false)
    }, 2500) // Maximum 2.5 seconds

    return () => clearTimeout(timer)
  }, [])

  const handleLoadingComplete = () => {
    setShowLoading(false)
    // Small delay to ensure smooth transition
    setTimeout(() => {
      setShowContent(true)
    }, 100)
  }

  // Show loading screen
  if (showLoading) {
    return <LoadingScreen onLoadingComplete={handleLoadingComplete} />
  }

  // Show content after loading is complete
  return <div className={showContent ? "opacity-100" : "opacity-0"}>{children}</div>
}

export default AppWrapper
