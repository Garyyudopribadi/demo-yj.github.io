"use client"

import { WifiOff, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center p-8 max-w-md mx-auto">
        <WifiOff className="w-24 h-24 text-gray-400 mx-auto mb-8" />

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">You're Offline</h1>

        <p className="text-gray-600 dark:text-gray-400 mb-8">Please check your internet connection and try again.</p>

        <Button onClick={() => window.location.reload()} className="inline-flex items-center gap-2">
          <RefreshCw className="w-4 h-4" />
          Try Again
        </Button>
      </div>
    </div>
  )
}
