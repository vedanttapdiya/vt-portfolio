import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token, contactId } = body

    if (!token) {
      return NextResponse.json({ success: false, message: "Turnstile token is required" }, { status: 400 })
    }

    // Get the secret key from environment variables
    const secretKey = process.env.TURNSTILE_SECRET_KEY

    if (!secretKey) {
      console.error("Turnstile secret key is not configured")
      return NextResponse.json({ success: false, message: "Server configuration error" }, { status: 500 })
    }

    // Verify the token with Cloudflare Turnstile
    console.log("[SERVER]\nSending verification request to Cloudflare Turnstile")

    const verificationResponse = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        secret: secretKey,
        response: token,
      }),
    })

    const verificationResult = await verificationResponse.json()

    // Log the verification result (without sensitive data)
    console.log("[SERVER]\nTurnstile verification response:", JSON.stringify(verificationResult))

    if (verificationResult.success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "Turnstile verification failed",
          details: verificationResult["error-codes"]?.join(", "),
        },
        { status: 400 },
      )
    }
  } catch (error) {
    console.error("Error verifying Turnstile token:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
