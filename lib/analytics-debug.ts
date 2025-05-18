// This file is only for debugging analytics
// It will log when analytics events are sent
// You can remove this file after confirming analytics works

export function debugAnalytics() {
  if (typeof window !== "undefined") {
    console.log("Analytics debug script loaded")

    // Listen for page views
    const originalPushState = history.pushState
    history.pushState = function () {
      originalPushState.apply(this, arguments)
      console.log("Analytics: Page view tracked", window.location.pathname)
    }

    // Listen for navigation events
    window.addEventListener("popstate", () => {
      console.log("Analytics: Navigation event tracked", window.location.pathname)
    })

    console.log("Analytics should be tracking page:", window.location.pathname)
  }
}
