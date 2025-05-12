import { type NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"
import { validateInput } from "@/lib/form-validation"

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    // Get the origin of the request
    const origin = request.headers.get("origin") || "Unknown origin"
    console.log("[SERVER]\nContact form submission from:", origin)

    // Parse the request body
    const body = await request.json()
    const { firstName, lastName, email, message, csrfToken, turnstileToken } = body

    // Validate required fields
    if (!firstName || !lastName || !email || !message || !csrfToken) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 })
    }

    // Validate Turnstile token
    if (!turnstileToken) {
      return NextResponse.json({ success: false, message: "Turnstile verification required" }, { status: 400 })
    }

    // Verify the Turnstile token
    console.log("[SERVER]\nSending verification request to Cloudflare Turnstile")

    const verificationResponse = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        secret: process.env.TURNSTILE_SECRET_KEY,
        response: turnstileToken,
      }),
    })

    const verificationResult = await verificationResponse.json()

    // Log the verification result (without sensitive data)
    console.log("[SERVER]\nTurnstile verification response:", JSON.stringify(verificationResult))

    if (!verificationResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Turnstile verification failed",
          details: verificationResult["error-codes"]?.join(", "),
        },
        { status: 400 },
      )
    }

    // Validate input fields
    const firstNameValidation = validateInput(firstName, "text")
    const lastNameValidation = validateInput(lastName, "text")
    const emailValidation = validateInput(email, "email")
    const messageValidation = validateInput(message, "message")

    if (
      !firstNameValidation.isValid ||
      !lastNameValidation.isValid ||
      !emailValidation.isValid ||
      !messageValidation.isValid
    ) {
      return NextResponse.json({ success: false, message: "Invalid input data" }, { status: 400 })
    }

    // Prepare email content
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #1e293b; color: white; padding: 20px; border-radius: 5px 5px 0 0; }
            .content { padding: 20px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 5px 5px; }
            .footer { margin-top: 20px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>New Contact Form Submission</h2>
            </div>
            <div class="content">
              <p><strong>Name:</strong> ${firstName} ${lastName}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Message:</strong></p>
              <p>${message.replace(/\n/g, "<br>")}</p>
            </div>
            <div class="footer">
              <p>This email was sent from the contact form on your portfolio website.</p>
            </div>
          </div>
        </body>
      </html>
    `

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: "webmaster@vedanttapdiya.me",
      to: "contact@vedanttapdiya.me",
      subject: `Contact Form: ${firstName} ${lastName}`,
      html: htmlContent,
      reply_to: email,
    })

    if (error) {
      console.error("Error sending email:", error)
      return NextResponse.json({ success: false, message: "Failed to send email" }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Error processing contact form:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
