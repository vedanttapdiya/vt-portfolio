import { NextResponse } from "next/server"

export async function GET() {
  // Return only the site key, which is safe to expose to the client
  return NextResponse.json({
    siteKey: process.env.TURNSTILE_SITE_KEY || "1x4AAAAAABcLTw4SgKSL0eV3",
  })
}
