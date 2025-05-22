/**
 * Global Turnstile Manager
 *
 * This manager handles Turnstile script loading and widget rendering
 * to prevent conflicts and ensure reliable operation.
 */

// Track script loading state
let scriptLoaded = false
let scriptLoading = false
let scriptLoadPromise: Promise<void> | null = null
let scriptLoadError: Error | null = null

// Track rendered widgets
const renderedWidgets = new Map<string, string>()

// Cache for the site key
let cachedSiteKey: string | null = null
let siteKeyPromise: Promise<string> | null = null

/**
 * Fetch the Turnstile site key from the server
 */
export async function fetchSiteKey(): Promise<string> {
  // If we already have the site key, return it
  if (cachedSiteKey) {
    return cachedSiteKey
  }

  // If we're already fetching the site key, return the promise
  if (siteKeyPromise) {
    return siteKeyPromise
  }

  // Fetch the site key from the server
  siteKeyPromise = fetch("/api/turnstile-config")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch Turnstile site key")
      }
      return response.json()
    })
    .then((data) => {
      cachedSiteKey = data.siteKey
      return cachedSiteKey
    })
    .catch((error) => {
      console.error("Error fetching Turnstile site key:", error)
      siteKeyPromise = null
      throw error
    })

  return siteKeyPromise
}

/**
 * Load the Turnstile script if not already loaded
 */
export function loadTurnstileScript(): Promise<void> {
  // If already loaded, return resolved promise
  if (scriptLoaded) {
    return Promise.resolve()
  }

  // If already loading, return the existing promise
  if (scriptLoading && scriptLoadPromise) {
    return scriptLoadPromise
  }

  // If there was a previous error, retry loading
  if (scriptLoadError) {
    scriptLoadError = null
  }

  // Start loading
  scriptLoading = true

  scriptLoadPromise = new Promise<void>((resolve, reject) => {
    try {
      // Create script element
      const script = document.createElement("script")
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onTurnstileLoaded"
      script.async = true
      script.defer = true

      // Define global callback
      window.onTurnstileLoaded = () => {
        scriptLoaded = true
        scriptLoading = false
        resolve()
      }

      // Handle errors
      script.onerror = (error) => {
        scriptLoadError = new Error("Failed to load Turnstile script")
        scriptLoading = false
        reject(scriptLoadError)
      }

      // Add to document
      document.head.appendChild(script)
    } catch (error) {
      scriptLoadError = error instanceof Error ? error : new Error("Unknown error loading Turnstile script")
      scriptLoading = false
      reject(scriptLoadError)
    }
  })

  return scriptLoadPromise
}

/**
 * Render a Turnstile widget in the specified container
 */
export async function renderTurnstileWidget(
  container: HTMLElement,
  options: {
    callback: (token: string) => void
    "error-callback"?: (error: string) => void
    "expired-callback"?: () => void
    widgetId?: string
    siteKey?: string
  },
): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      // Get the site key
      const siteKey = options.siteKey || (await fetchSiteKey())

      // Load script first
      await loadTurnstileScript()

      try {
        // Clean up existing widget if any
        if (options.widgetId && renderedWidgets.has(options.widgetId)) {
          const existingWidgetId = renderedWidgets.get(options.widgetId)
          if (existingWidgetId) {
            try {
              window.turnstile.remove(existingWidgetId)
            } catch (e) {
              // Silent fail on cleanup
            }
          }
          renderedWidgets.delete(options.widgetId)
        }

        // Clear container
        container.innerHTML = ""

        // Render new widget
        const widgetId = window.turnstile.render(container, {
          sitekey: siteKey,
          callback: (token) => {
            options.callback(token)
          },
          "error-callback": (error) => {
            if (options["error-callback"]) {
              options["error-callback"](error)
            }
          },
          "expired-callback": () => {
            if (options["expired-callback"]) {
              options["expired-callback"]()
            }
          },
          theme: "dark",
          "refresh-expired": "auto",
        })

        // Store widget ID
        if (options.widgetId) {
          renderedWidgets.set(options.widgetId, widgetId)
        }

        resolve(widgetId)
      } catch (error) {
        reject(error instanceof Error ? error : new Error("Failed to render Turnstile widget"))
      }
    } catch (error) {
      reject(error)
    }
  })
}

/**
 * Remove a Turnstile widget
 */
export function removeTurnstileWidget(widgetId: string): void {
  if (scriptLoaded && window.turnstile) {
    try {
      window.turnstile.remove(widgetId)
    } catch (e) {
      // Silent fail
    }
  }
}

/**
 * Reset a Turnstile widget
 */
export function resetTurnstileWidget(widgetId: string): void {
  if (scriptLoaded && window.turnstile) {
    try {
      window.turnstile.reset(widgetId)
    } catch (e) {
      // Silent fail
    }
  }
}

// Add to Window interface
declare global {
  interface Window {
    turnstile: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string
          callback: (token: string) => void
          "error-callback"?: (error: string) => void
          "expired-callback"?: () => void
          theme?: "light" | "dark" | "auto"
          "refresh-expired"?: string
        },
      ) => string
      reset: (widgetId: string) => void
      remove: (widgetId: string) => void
    }
    onTurnstileLoaded?: () => void
  }
}
