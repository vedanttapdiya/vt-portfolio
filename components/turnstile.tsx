"use client"

import { useEffect, useRef, useState } from "react"
import Script from "next/script"

interface TurnstileProps {
  onVerify: (token: string) => void
  onError?: (error?: string) => void
  onExpire?: () => void
  siteKey?: string
  className?: string
}

export function Turnstile({
  onVerify,
  onError,
  onExpire,
  siteKey = "1x4AAAAAABcLTw4SgKSL0eV3", // Default fallback
  className = "",
}: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [widgetId, setWidgetId] = useState<string | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [scriptError, setScriptError] = useState<string | null>(null)

  useEffect(() => {
    // If the script is already loaded, render the widget
    if (isLoaded && containerRef.current && window.turnstile) {
      try {
        // Clean up any existing widget
        if (widgetId) {
          try {
            window.turnstile.remove(widgetId)
          } catch (e) {
            // Silent fail
          }
        }

        // Render the widget
        const id = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          callback: (token: string) => onVerify(token),
          "error-callback": (error: string) => {
            setScriptError(error || "An error occurred with Turnstile")
            if (onError) onError(error)
          },
          "expired-callback": () => {
            if (onExpire) onExpire()
          },
        })

        setWidgetId(id)

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
      } catch (error) {
        setScriptError("Failed to render Turnstile widget")
        if (onError) onError("Failed to render Turnstile widget")
      }
    }
  }, [isLoaded, siteKey, onVerify, onError, onExpire])

  return (
    <div className="turnstile-container">
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        strategy="afterInteractive"
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          setScriptError("Failed to load Turnstile script")
          if (onError) onError("Failed to load Turnstile script")
        }}
      />
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
