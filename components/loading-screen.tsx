"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2 } from "lucide-react"

interface LoadingScreenProps {
  onLoadingComplete: () => void
}

const LoadingScreen = ({ onLoadingComplete }: LoadingScreenProps) => {
  const [progress, setProgress] = useState(0)
  const [loadingText, setLoadingText] = useState("Initializing...")

  useEffect(() => {
    let progressTimer: NodeJS.Timeout
    let textTimer: NodeJS.Timeout
    let completionTimer: NodeJS.Timeout

    const loadingSteps = [
      { text: "Initializing...", delay: 0 },
      { text: "Loading resources...", delay: 500 },
      { text: "Preparing content...", delay: 1000 },
      { text: "Almost ready...", delay: 1300 },
      { text: "Welcome to YONGJIN!", delay: 1600 },
    ]

    // Update progress smoothly
    progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressTimer)
          return 100
        }
        return prev + 2
      })
    }, 30)

    // Update loading text
    loadingSteps.forEach((step, index) => {
      textTimer = setTimeout(() => {
        setLoadingText(step.text)
      }, step.delay)
    })

    // Force completion after 2 seconds maximum
    completionTimer = setTimeout(() => {
      setProgress(100)
      setTimeout(() => {
        onLoadingComplete()
      }, 300)
    }, 2000)

    // Cleanup function
    return () => {
      if (progressTimer) clearInterval(progressTimer)
      if (textTimer) clearTimeout(textTimer)
      if (completionTimer) clearTimeout(completionTimer)
    }
  }, [onLoadingComplete])

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="loading-screen"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-900 dark:to-gray-900"
      >
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#374151_1px,transparent_1px),linear-gradient(to_bottom,#374151_1px,transparent_1px)] bg-[size:20px_20px] opacity-30" />

          {/* Floating orbs */}
          <motion.div
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
            }}
            transition={{
              duration: 8,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500/10 dark:bg-blue-400/10 rounded-full blur-xl"
          />
          <motion.div
            animate={{
              x: [0, -100, 0],
              y: [0, 100, 0],
            }}
            transition={{
              duration: 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-gray-500/10 dark:bg-gray-400/10 rounded-full blur-xl"
          />
        </div>

        {/* Loading content */}
        <div className="relative z-10 text-center">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">YONGJIN</h1>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300">Premium Quality Manufacturing</p>
          </motion.div>

          {/* Loading spinner */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            className="mb-6"
          >
            <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 text-blue-600 dark:text-blue-400 mx-auto" />
          </motion.div>

          {/* Progress bar */}
          <div className="w-64 sm:w-80 mx-auto mb-4">
            <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
              <motion.div
                className="h-full bg-blue-600 dark:bg-blue-400 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              />
            </div>
            <div className="flex justify-between text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-2">
              <span>0%</span>
              <span>{Math.round(progress)}%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Loading text */}
          <motion.p
            key={loadingText}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="text-gray-600 dark:text-gray-300 text-base sm:text-lg"
          >
            {loadingText}
          </motion.p>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default LoadingScreen
