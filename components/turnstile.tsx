"use client"

import { useEffect, useRef, useState } from "react"
import Script from "next/script"

// Global script loading state to prevent multiple script loads
let globalScriptLoaded = false

interface TurnstileProps {
  onVerify: (token: string) => void
  onError?: (error?: string) => void
  onExpire?: () => void
  siteKey?: string
  className?: string
  debugMode?: boolean
}

export function Turnstile({
  onVerify,
  onError,
  onExpire,
  siteKey = "1x4AAAAAABcLTw4SgKSL0eV3", // Default fallback
  className = "",
  debugMode = false,
}: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [widgetId, setWidgetId] = useState<string | null>(null)
  const [isLoaded, setIsLoaded] = useState(globalScriptLoaded)
  const [scriptError, setScriptError] = useState<string | null>(null)

  // Function to render the widget
  const renderWidget = () => {
    if (!containerRef.current || !window.turnstile) return null

    try {
      // Clean up any existing widget in this container
      if (widgetId) {
        try {
          window.turnstile.remove(widgetId)
        } catch (e) {
          // Silent fail if widget doesn't exist
        }
      }

      // Render the Turnstile widget
      const id = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        callback: (token: string) => {
          onVerify(token)
        },
        "error-callback": (error: string) => {
          setScriptError(error || "An error occurred with Turnstile")
          if (onError) onError(error)
        },
        "expired-callback": () => {
          if (onExpire) onExpire()
        },
      })

      return id
    } catch (error) {
      console.error("[Turnstile] Render error:", error)
      setScriptError("Failed to render Turnstile widget")
      if (onError) onError("Failed to render Turnstile widget")
      return null
    }
  }

  useEffect(() => {
    // If the script is already loaded, render the widget immediately
    if (isLoaded && window.turnstile) {
      const id = renderWidget()
      if (id) setWidgetId(id)

      // Cleanup function
      return () => {
        if (id && window.turnstile) {
          try {
            window.turnstile.remove(id)
          } catch (error) {
            // Silent fail
          }
        }
      }
    }
  }, [isLoaded, siteKey, onVerify, onError, onExpire, debugMode])

  const handleScriptLoad = () => {
    globalScriptLoaded = true
    setIsLoaded(true)
    setScriptError(null)

    // Render widget after script loads
    const id = renderWidget()
    if (id) setWidgetId(id)
  }

  const handleScriptError = () => {
    console.error("[Turnstile] Failed to load script")
    setScriptError("Failed to load Turnstile script")
    if (onError) onError("Failed to load Turnstile script")
  }

  return (
    <div className="turnstile-container">
      {!globalScriptLoaded && (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js"
          strategy="afterInteractive"
          onLoad={handleScriptLoad}
          onError={handleScriptError}
        />
      )}
      <div ref={containerRef} className={className} />
      {scriptError && <div className="text-red-500 text-sm mt-2 text-center">{scriptError}</div>}
      {!isLoaded && <div className="text-yellow-500 text-sm mt-2 text-center">Loading Turnstile...</div>}
    </div>
  )
}

// Add Turnstile to the global Window interface
declare global {
  interface Window {
    turnstile: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string
          callback: (token: string) => void
          "error-callback"?: (error?: string) => void
          "expired-callback"?: () => void
        },
      ) => string
      reset: (widgetId: string) => void
      remove: (widgetId: string) => void
    }
  }
}
