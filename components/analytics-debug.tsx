"use client"

import { useEffect } from "react"
import { debugAnalytics } from "@/lib/analytics-debug"

export function AnalyticsDebug() {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      debugAnalytics()
    }
  }, [])

  return null
}
