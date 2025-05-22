"use client"

import { useEffect, useRef, useState } from "react"
import { renderTurnstileWidget, removeTurnstileWidget } from "@/lib/turnstile-manager"

interface TurnstileProps {
  onVerify: (token: string) => void
  onError?: (error?: string) => void
  onExpire?: () => void
  siteKey?: string
  className?: string
  debugMode?: boolean
  instanceId?: string
}

export function Turnstile({
  onVerify,
  onError,
  onExpire,
  siteKey,
  className = "",
  debugMode = false,
  instanceId = "default",
}: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [widgetId, setWidgetId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [renderAttempt, setRenderAttempt] = useState(0)
  const verifyCallbackRef = useRef(onVerify)
  const errorCallbackRef = useRef(onError)
  const expireCallbackRef = useRef(onExpire)

  // Update callback refs when props change
  useEffect(() => {
    verifyCallbackRef.current = onVerify
    errorCallbackRef.current = onError
    expireCallbackRef.current = onExpire
  }, [onVerify, onError, onExpire])

  // Generate a unique ID for this instance
  const uniqueId = `turnstile-${instanceId}-${renderAttempt}`

  useEffect(() => {
    let mounted = true
    let timeoutId: NodeJS.Timeout | null = null

    async function initializeTurnstile() {
      if (!containerRef.current) {
        return
      }

      try {
        setIsLoading(true)
        setError(null)

        // Set a timeout to detect if loading takes too long
        timeoutId = setTimeout(() => {
          if (mounted && isLoading) {
            setError("Turnstile is taking too long to load. Please refresh the page.")
            if (debugMode) {
              console.warn("Turnstile loading timeout")
            }
          }
        }, 10000) // 10 second timeout

        // Render the widget
        const newWidgetId = await renderTurnstileWidget(containerRef.current, {
          callback: (token) => {
            if (mounted && verifyCallbackRef.current) {
              verifyCallbackRef.current(token)
            }
          },
          "error-callback": (errorMsg) => {
            if (mounted) {
              const errorMessage = errorMsg || "An error occurred with Turnstile"
              setError(errorMessage)
              if (errorCallbackRef.current) errorCallbackRef.current(errorMessage)
              if (debugMode) {
                console.error("Turnstile error:", errorMessage)
              }
            }
          },
          "expired-callback": () => {
            if (mounted && expireCallbackRef.current) {
              expireCallbackRef.current()
            }
          },
          widgetId: uniqueId,
          siteKey, // This will be passed to renderTurnstileWidget, which will use fetchSiteKey() if not provided
        })

        if (mounted) {
          setWidgetId(newWidgetId)
          setIsLoading(false)

          if (debugMode) {
            console.log(`Turnstile widget rendered successfully: ${newWidgetId}`)
          }
        }
      } catch (err) {
        if (mounted) {
          const errorMessage = err instanceof Error ? err.message : "Failed to render Turnstile widget"
          setError(errorMessage)
          setIsLoading(false)

          if (errorCallbackRef.current) errorCallbackRef.current(errorMessage)
          if (debugMode) {
            console.error("Turnstile initialization error:", err)
          }

          // Try to re-render after a delay if there was an error
          setTimeout(() => {
            if (mounted) {
              setRenderAttempt((prev) => prev + 1)
            }
          }, 2000)
        }
      } finally {
        if (timeoutId) {
          clearTimeout(timeoutId)
          timeoutId = null
        }
      }
    }

    initializeTurnstile()

    // Cleanup function
    return () => {
      mounted = false
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      if (widgetId) {
        removeTurnstileWidget(widgetId)
      }
    }
  }, [siteKey, debugMode, renderAttempt, uniqueId, isLoading])

  // Force re-render if container becomes available after initial render
  useEffect(() => {
    if (containerRef.current && !widgetId && error) {
      setRenderAttempt((prev) => prev + 1)
    }
  }, [containerRef.current, widgetId, error])

  return (
    <div className="turnstile-wrapper">
      <div
        ref={containerRef}
        className={`${className} min-h-[65px]`}
        data-instance-id={instanceId}
        data-render-attempt={renderAttempt}
      />

      {error && (
        <div className="text-red-500 text-sm mt-2 text-center">
          {error}
          <button onClick={() => setRenderAttempt((prev) => prev + 1)} className="ml-2 underline hover:text-red-400">
            Retry
          </button>
        </div>
      )}

      {isLoading && !error && (
        <div className="text-zinc-400 text-sm mt-2 text-center flex items-center justify-center">
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-zinc-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Loading Turnstile...
        </div>
      )}
    </div>
  )
}
