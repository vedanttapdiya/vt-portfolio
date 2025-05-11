"use client"

import { useEffect, useRef, useState } from "react"
import Script from "next/script"

interface TurnstileProps {
  onVerify: (token: string) => void
  onError?: () => void
  onExpire?: () => void
  siteKey?: string
  className?: string
}

export function Turnstile({
  onVerify,
  onError,
  onExpire,
  siteKey = "1x4AAAAAABcLTw4SgKSL0eV3", // Default fallback value
  className = "",
}: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [widgetId, setWidgetId] = useState<string | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (!isLoaded || !containerRef.current) return

    // Reset any existing widget
    if (widgetId && window.turnstile) {
      window.turnstile.remove(widgetId)
    }

    // Render the Turnstile widget
    const id = window.turnstile.render(containerRef.current, {
      sitekey: siteKey,
      callback: (token: string) => {
        onVerify(token)
      },
      "error-callback": () => {
        if (onError) onError()
      },
      "expired-callback": () => {
        if (onExpire) onExpire()
      },
    })

    setWidgetId(id)

    // Cleanup function
    return () => {
      if (id && window.turnstile) {
        window.turnstile.remove(id)
      }
    }
  }, [isLoaded, siteKey, onVerify, onError, onExpire])

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        async
        defer
        onLoad={() => setIsLoaded(true)}
      />
      <div ref={containerRef} className={className} />
    </>
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
          "error-callback"?: () => void
          "expired-callback"?: () => void
        },
      ) => string
      reset: (widgetId: string) => void
      remove: (widgetId: string) => void
    }
  }
}
