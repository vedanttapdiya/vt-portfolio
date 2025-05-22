import { NextResponse } from "next/server"

// Handle GET requests
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

// Handle unsupported methods
export async function POST() {
  return methodNotAllowed()
}

export async function PUT() {
  return methodNotAllowed()
}

export async function DELETE() {
  return methodNotAllowed()
}

export async function PATCH() {
  return methodNotAllowed()
}

// Helper function for method not allowed response
function methodNotAllowed() {
  return NextResponse.json(
    { error: "Method not allowed", message: "This endpoint only supports GET requests" },
    { status: 405, headers: { Allow: "GET" } },
  )
}
