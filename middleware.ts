import { type NextRequest, NextResponse } from "next/server"

export function middleware(request: NextRequest) {
  // Check if the request is already using HTTPS or if it's a localhost request
  const isHttps =
    request.headers.get("x-forwarded-proto")?.includes("https") ||
    request.nextUrl.protocol === "https:" ||
    request.headers.get("host")?.includes("localhost") ||
    request.headers.get("host")?.includes("127.0.0.1")

  // If not HTTPS, redirect to HTTPS
  if (!isHttps) {
    // Create the HTTPS URL from the original request
    const httpsUrl = `https://${request.headers.get("host")}${request.nextUrl.pathname}${request.nextUrl.search}`

    // Return a permanent redirect (301)
    return NextResponse.redirect(httpsUrl, {
      status: 301,
      headers: {
        "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
      },
    })
  }

  // Add HSTS header to all responses
  const response = NextResponse.next()
  response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload")

  return response
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
}
