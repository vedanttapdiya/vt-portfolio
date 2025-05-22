import { NextResponse } from "next/server"

export async function GET() {
  // Get the site key from environment variables
  const siteKey = process.env.TURNSTILE_SITE_KEY

  if (!siteKey) {
    console.error("Turnstile site key is not configured")
    return NextResponse.json({ error: "Turnstile site key is not configured" }, { status: 500 })
  }

  // Return the site key
  return NextResponse.json({ siteKey })
}
