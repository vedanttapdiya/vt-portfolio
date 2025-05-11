import { type NextRequest, NextResponse } from "next/server"

// Cloudflare Turnstile verification endpoint
const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify"

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json({ success: false, message: "Token is required" }, { status: 400 })
    }

    // Get the secret key from environment variables
    const secretKey = process.env.TURNSTILE_SECRET_KEY

    // Check if the secret key is available
    if (!secretKey) {
      console.error("TURNSTILE_SECRET_KEY environment variable is not set")
      return NextResponse.json(
        { success: false, message: "Server configuration error: Missing secret key" },
        { status: 500 },
      )
    }

    // Verify the token with Cloudflare Turnstile
    const formData = new URLSearchParams()
    formData.append("secret", secretKey)
    formData.append("response", token)
    formData.append("remoteip", request.headers.get("x-forwarded-for") || "")

    const result = await fetch(TURNSTILE_VERIFY_URL, {
      method: "POST",
      body: formData,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })

    const data = await result.json()

    if (data.success) {
      return NextResponse.json({ success: true })
    } else {
      console.error("Turnstile verification failed:", data["error-codes"])
      return NextResponse.json(
        { success: false, message: "Verification failed", errors: data["error-codes"] },
        { status: 400 },
      )
    }
  } catch (error) {
    console.error("Error verifying Turnstile token:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
