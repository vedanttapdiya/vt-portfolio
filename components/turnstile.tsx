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
  siteKey, // Allow passing a site key directly for flexibility
  className = "",
  debugMode = false,
}: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [widgetId, setWidgetId] = useState<string | null>(null)
  const [isLoaded, setIsLoaded] = useState(globalScriptLoaded)
  const [scriptError, setScriptError] = useState<string | null>(null)
  const [turnstileSiteKey, setTurnstileSiteKey] = useState<string>(siteKey || "1x4AAAAAABcLTw4SgKSL0eV3") // Default fallback
  const [isConfigLoaded, setIsConfigLoaded] = useState(!!siteKey) // If siteKey is provided, we don't need to fetch

  // Fetch the site key from the API if not provided
  useEffect(() => {
    if (!siteKey) {
      const fetchSiteKey = async () => {
        try {
          const response = await fetch("/api/turnstile-config")
          const data = await response.json()
          if (data.siteKey) {
            setTurnstileSiteKey(data.siteKey)
          }
          setIsConfigLoaded(true)
        } catch (error) {
          console.error("Failed to fetch Turnstile configuration:", error)
          setIsConfigLoaded(true) // Continue with default key
        }
      }

      fetchSiteKey()
    }
  }, [siteKey])

  // Function to render the widget
  const renderWidget = () => {
    if (!containerRef.current || !window.turnstile || !isConfigLoaded) return null

    try {
      // Only log in debug mode
      if (debugMode) console.log("[Turnstile] Rendering widget...")

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
        sitekey: turnstileSiteKey,
        callback: (token: string) => {
          // Only log in debug mode
          if (debugMode) console.log("[Turnstile] Token received:", token.substring(0, 10) + "...")
          onVerify(token)
        },
        "error-callback": (error: string) => {
          // Only log in debug mode
          if (debugMode) console.log("[Turnstile] Error:", error)
          setScriptError(error || "An error occurred with Turnstile")
          if (onError) onError(error)
        },
        "expired-callback": () => {
          // Only log in debug mode
          if (debugMode) console.log("[Turnstile] Token expired")
          if (onExpire) onExpire()
        },
      })

      // Only log in debug mode
      if (debugMode) console.log("[Turnstile] Widget rendered with ID:", id)
      return id
    } catch (error) {
      // Always log errors
      console.error("[Turnstile] Render error:", error)
      setScriptError("Failed to render Turnstile widget")
      if (onError) onError("Failed to render Turnstile widget")
      return null
    }
  }

  useEffect(() => {
    // Only log in debug mode
    if (debugMode) {
      console.log("[Turnstile] Debug mode enabled")
      console.log("[Turnstile] Site key:", turnstileSiteKey.substring(0, 5) + "...")
      console.log("[Turnstile] Script loaded:", isLoaded)
    }

    // If the script is already loaded and config is loaded, render the widget immediately
    if (isLoaded && window.turnstile && isConfigLoaded) {
      const id = renderWidget()
      if (id) setWidgetId(id)

      // Cleanup function
      return () => {
        if (id && window.turnstile) {
          try {
            // Only log in debug mode
            if (debugMode) console.log("[Turnstile] Removing widget:", id)
            window.turnstile.remove(id)
          } catch (error) {
            // Silent fail if widget doesn't exist
          }
        }
      }
    }
  }, [isLoaded, turnstileSiteKey, onVerify, onError, onExpire, debugMode, isConfigLoaded])

  const handleScriptLoad = () => {
    // Only log in debug mode
    if (debugMode) console.log("[Turnstile] Script loaded successfully")
    globalScriptLoaded = true
    setIsLoaded(true)
    setScriptError(null)

    // Render widget after script loads if config is loaded
    if (isConfigLoaded) {
      const id = renderWidget()
      if (id) setWidgetId(id)
    }
  }

  const handleScriptError = () => {
    // Always log errors
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
      {(!isLoaded || !isConfigLoaded) && (
        <div className="text-yellow-500 text-sm mt-2 text-center">Loading Turnstile...</div>
      )}
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
