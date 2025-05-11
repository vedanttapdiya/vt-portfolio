import { type NextRequest, NextResponse } from "next/server"
import { validateInput, sanitizeInput } from "@/lib/form-validation"
import { sendContactFormEmail } from "@/lib/email-service"

// Cloudflare Turnstile verification endpoint
const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify"

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json()
    const { firstName, lastName, email, message, csrfToken, turnstileToken } = body

    // Verify Turnstile token
    if (!turnstileToken) {
      return NextResponse.json({ success: false, message: "Turnstile verification required" }, { status: 400 })
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
    formData.append("response", turnstileToken)
    formData.append("remoteip", request.headers.get("x-forwarded-for") || "")

    const turnstileResponse = await fetch(TURNSTILE_VERIFY_URL, {
      method: "POST",
      body: formData,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })

    const turnstileData = await turnstileResponse.json()

    if (!turnstileData.success) {
      console.error("Turnstile verification failed:", turnstileData["error-codes"])
      return NextResponse.json(
        { success: false, message: "Human verification failed", errors: turnstileData["error-codes"] },
        { status: 400 },
      )
    }

    // Validate inputs
    const errors: { [key: string]: string } = {}

    // Validate first name
    const firstNameValidation = validateInput(firstName, "text")
    if (!firstNameValidation.isValid) {
      errors.firstName = firstNameValidation.error || "First name is required"
    }

    // Validate last name
    const lastNameValidation = validateInput(lastName, "text")
    if (!lastNameValidation.isValid) {
      errors.lastName = lastNameValidation.error || "Last name is required"
    }

    // Validate email
    const emailValidation = validateInput(email, "email")
    if (!emailValidation.isValid) {
      errors.email = emailValidation.error || "Valid email is required"
    }

    // Validate message
    const messageValidation = validateInput(message, "message")
    if (!messageValidation.isValid) {
      errors.message = messageValidation.error || "Message is required"
    }

    // Return validation errors if any
    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ success: false, errors }, { status: 400 })
    }

    // Sanitize inputs
    const sanitizedData = {
      firstName: sanitizeInput(firstName),
      lastName: sanitizeInput(lastName),
      email: sanitizeInput(email),
      message: sanitizeInput(message),
    }

    // Send the email
    const result = await sendContactFormEmail(sanitizedData)

    // Return success response
    return NextResponse.json({
      success: true,
      message: "Email sent successfully",
      id: result.id,
    })
  } catch (error) {
    console.error("Server error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
