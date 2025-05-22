import { type NextRequest, NextResponse } from "next/server"

// Keep track of verified tokens to prevent reuse
const verifiedTokens = new Map<string, { timestamp: number; contactType?: string; contactId?: string }>()

// Clean up old tokens periodically
const CLEANUP_INTERVAL = 1000 * 60 * 60 // 1 hour
const TOKEN_EXPIRY = 1000 * 60 * 15 // 15 minutes

// Clean up old tokens
function cleanupOldTokens() {
  const now = Date.now()
  for (const [token, data] of verifiedTokens.entries()) {
    if (now - data.timestamp > TOKEN_EXPIRY) {
      verifiedTokens.delete(token)
    }
  }
}

// Set up periodic cleanup
if (typeof setInterval !== "undefined") {
  setInterval(cleanupOldTokens, CLEANUP_INTERVAL)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token, contactId, contactType } = body

    if (!token) {
      return NextResponse.json({ success: false, message: "Turnstile token is required" }, { status: 400 })
    }

    // Check if token has already been verified
    if (verifiedTokens.has(token)) {
      const tokenData = verifiedTokens.get(token)!

      // If the token was used for the same contact, allow it
      if (tokenData.contactId === contactId && tokenData.contactType === contactType) {
        return NextResponse.json({
          success: true,
          message: "Token already verified for this contact",
          contactId,
          contactType,
        })
      }

      // Otherwise, reject it
      return NextResponse.json(
        {
          success: false,
          message: "This verification token has already been used",
          details: "Please complete the verification again",
        },
        { status: 400 },
      )
    }

    // Get the secret key from environment variables
    const secretKey = process.env.TURNSTILE_SECRET_KEY

    if (!secretKey) {
      console.error("Turnstile secret key is not configured")
      return NextResponse.json({ success: false, message: "Server configuration error" }, { status: 500 })
    }

    // Verify the token with Cloudflare Turnstile
    console.log(
      `[SERVER] Sending verification request to Cloudflare Turnstile for ${contactType || "unknown"} (${contactId || "unknown"})`,
    )

    const formData = new URLSearchParams()
    formData.append("secret", secretKey)
    formData.append("response", token)

    // Add the IP address if available
    const ip = request.headers.get("x-forwarded-for") || request.ip
    if (ip) {
      formData.append("remoteip", ip)
    }

    const verificationResponse = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    })

    const verificationResult = await verificationResponse.json()

    // Log the verification result (without sensitive data)
    console.log(
      `[SERVER] Turnstile verification response for ${contactType || "unknown"} (${contactId || "unknown"}):`,
      JSON.stringify({
        success: verificationResult.success,
        errorCodes: verificationResult["error-codes"],
        hostname: verificationResult.hostname,
        challenge_ts: verificationResult.challenge_ts,
      }),
    )

    if (verificationResult.success) {
      // Store the token to prevent reuse
      verifiedTokens.set(token, {
        timestamp: Date.now(),
        contactType,
        contactId,
      })

      // Clean up old tokens if there are too many
      if (verifiedTokens.size > 1000) {
        cleanupOldTokens()
      }

      return NextResponse.json({
        success: true,
        contactType,
        contactId,
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "Turnstile verification failed",
          details: verificationResult["error-codes"]?.join(", "),
          code: verificationResult["error-codes"]?.[0] || "unknown",
          contactType,
          contactId,
        },
        { status: 400 },
      )
    }
  } catch (error) {
    console.error("Error verifying Turnstile token:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
