"use client"

import { useState, useEffect, useCallback } from "react"
import { Globe, ChevronDown, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

declare global {
  interface Window {
    google: any
    googleTranslateElementInit: () => void
  }
}

const GoogleTranslate = () => {
  const [currentLanguage, setCurrentLanguage] = useState("en")
  const [isTranslating, setIsTranslating] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)

  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "id", name: "Bahasa Indonesia", flag: "🇮🇩" },
    { code: "ko", name: "Korean", flag: "🇰🇷" },
  ]

  const initializeGoogleTranslate = useCallback(() => {
    try {
      if (window.google?.translate?.TranslateElement) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages: "en,id,ko",
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false,
          },
          "google_translate_element",
        )
        setIsLoaded(true)
        setHasError(false)
      }
    } catch (error) {
      console.error("Error initializing Google Translate:", error)
      setHasError(true)
      setIsLoaded(false)
    }
  }, [])

  useEffect(() => {
    // Load saved language preference
    const savedLanguage = localStorage.getItem("preferred-language")
    if (savedLanguage && languages.some((lang) => lang.code === savedLanguage)) {
      setCurrentLanguage(savedLanguage)
    }

    // Check if Google Translate is already loaded
    if (window.google?.translate) {
      initializeGoogleTranslate()
      return
    }

    // Set up the callback function
    window.googleTranslateElementInit = initializeGoogleTranslate

    // Check if script is already present
    const existingScript = document.querySelector('script[src*="translate.google.com"]')
    if (existingScript) {
      return
    }

    // Load Google Translate script with better error handling
    const script = document.createElement("script")
    script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
    script.async = true
    script.defer = true

    script.onload = () => {
      console.log("Google Translate script loaded successfully")
    }

      script.onerror = (error) => {
        console.error("Failed to load Google Translate script:", error, script.src)
        // Error will be hidden from user, dropdown will be disabled
        setHasError(true)
        setIsLoaded(false)
      }

    // Add CSS to hide Google's UI
    const addStyles = () => {
      if (!document.getElementById("google-translate-styles")) {
        const style = document.createElement("style")
        style.id = "google-translate-styles"
        style.textContent = `
          #google_translate_element,
          .goog-te-banner-frame,
          .goog-te-menu-frame,
          .skiptranslate,
          .goog-te-gadget,
          .goog-te-combo {
            display: none !important;
            visibility: hidden !important;
          }
          
          body {
            top: 0 !important;
            position: static !important;
          }
          
          .goog-te-banner-frame {
            display: none !important;
          }
        `
        document.head.appendChild(style)
      }
    }

    addStyles()
    document.head.appendChild(script)

    return () => {
      // Cleanup function
      try {
        const scriptToRemove = document.querySelector('script[src*="translate.google.com"]')
        if (scriptToRemove && scriptToRemove.parentNode) {
          scriptToRemove.parentNode.removeChild(scriptToRemove)
        }
      } catch (error) {
        console.log("Script cleanup error:", error)
      }

      try {
        const styleToRemove = document.getElementById("google-translate-styles")
        if (styleToRemove && styleToRemove.parentNode) {
          styleToRemove.parentNode.removeChild(styleToRemove)
        }
      } catch (error) {
        console.log("Style cleanup error:", error)
      }

  // Clean up global callback
  delete (window as any).googleTranslateElementInit;
    }
  }, [initializeGoogleTranslate])

  const clearGoogTransCookie = () => {
    try {
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=' + window.location.hostname + ';';
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';
    } catch (e) {
      // ignore
    }
  }

  const triggerTranslation = useCallback(
    async (targetLanguage: string) => {
      if (!isLoaded || hasError) {
        console.log("Google Translate not available")
        return
      }

      setIsTranslating(true)

      try {
        // Wait a bit for any pending operations
        await new Promise((resolve) => setTimeout(resolve, 100))

        const selectElement = document.querySelector(".goog-te-combo") as HTMLSelectElement
        if (selectElement) {
          selectElement.value = targetLanguage
          const changeEvent = new Event("change", { bubbles: true })
          selectElement.dispatchEvent(changeEvent)

          // Wait for translation to complete
          setTimeout(() => {
            setIsTranslating(false)
          }, 2000)
          // If switching to English, also clear cookies and reset
          if (targetLanguage === "en") {
            clearGoogTransCookie()
            // Reset select to default
            selectElement.value = "en"
            const changeEvent2 = new Event("change", { bubbles: true })
            selectElement.dispatchEvent(changeEvent2)
          }
          return
        }

        // Method 2: Use URL hash method if select element not found
        if (targetLanguage !== "en") {
          const baseUrl = window.location.href.split("#")[0]
          const newHash = `googtrans(en|${targetLanguage})`

          // Update the URL hash
          window.history.replaceState(null, "", `${baseUrl}#${newHash}`)

          // Reload the page to apply translation
          setTimeout(() => {
            window.location.reload()
          }, 500)
        } else {
          // Reset to original language
          clearGoogTransCookie()
          const baseUrl = window.location.href.split("#")[0]
          window.history.replaceState(null, "", baseUrl)

          setTimeout(() => {
            window.location.reload()
          }, 500)
        }
      } catch (error) {
        console.error("Translation error:", error)
        setIsTranslating(false)
        setHasError(true)
      }
    },
    [isLoaded, hasError],
  )

  const handleLanguageChange = useCallback(
    async (languageCode: string) => {
      if (languageCode === currentLanguage || isTranslating || hasError) return

      // Save language preference
      try {
        localStorage.setItem("preferred-language", languageCode)
        setCurrentLanguage(languageCode)
        await triggerTranslation(languageCode)
      } catch (error) {
        console.error("Error changing language:", error)
        setHasError(true)
      }
    },
    [currentLanguage, isTranslating, hasError, triggerTranslation],
  )

  const currentLang = languages.find((lang) => lang.code === currentLanguage) || languages[0]

  // Hide error message, just disable translation menu/button if error

  return (
    <>
      {/* Hidden Google Translate Element */}
      <div id="google_translate_element" style={{ display: "none" }} />

      {/* Professional Translation Notification - Positioned in Navigation Area */}
      {isTranslating && (
        <div className="fixed top-16 right-4 z-50 animate-in slide-in-from-top-2 fade-in-0 duration-300">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 min-w-[280px] max-w-[320px]">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping"></div>
                  <div className="relative bg-blue-50 dark:bg-blue-900/30 p-2 rounded-full">
                    <Loader2 className="h-4 w-4 animate-spin text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Translating to {currentLang.flag} {currentLang.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Please wait a moment...</p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-3">
              <div className="h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full animate-pulse w-full"></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-9 px-3 gap-2" disabled={isTranslating || !isLoaded || hasError}>
            {isTranslating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Globe className="h-4 w-4" />
                <span className="hidden sm:inline text-xs">{currentLang.flag}</span>
                <ChevronDown className="h-3 w-3" />
              </>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          {languages.map((language) => (
            <DropdownMenuItem
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              className="flex items-center justify-between cursor-pointer py-3"
              disabled={isTranslating || !isLoaded || hasError}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{language.flag}</span>
                <span className="text-sm font-medium">{language.name}</span>
              </div>
              {currentLanguage === language.code && <div className="w-2 h-2 bg-blue-600 rounded-full" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

export default GoogleTranslate
