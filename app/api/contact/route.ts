import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import Joi from "joi"
import { Resend } from "resend"
import DOMPurify from "dompurify"
import { JSDOM } from "jsdom"

// Create a DOMPurify instance for server-side sanitization
const window = new JSDOM("").window
const serverDOMPurify = DOMPurify(window)

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY)

// Rate limiting configuration
const MAX_REQUESTS_PER_MINUTE = 5
const requestCounts = new Map<string, { count: number; timestamp: number }>()

export async function POST(request: NextRequest) {
  try {
    // Get the origin of the request
    const origin = request.headers.get("origin") || "Unknown origin"
    console.log("[SERVER]\nContact form submission from:", origin)

    // Rate limiting
    const ip = request.headers.get("x-forwarded-for") || request.ip || "Unknown IP"
    const now = Date.now()
    const minuteStart = now - 60 * 1000

    // Clean up old entries
    for (const [key, data] of requestCounts.entries()) {
      if (data.timestamp < minuteStart) {
        requestCounts.delete(key)
      }
    }

    // Get or initialize request count for this IP
    const ipData = requestCounts.get(ip) || { count: 0, timestamp: now }
    ipData.count += 1
    ipData.timestamp = now
    requestCounts.set(ip, ipData)

    if (ipData.count > MAX_REQUESTS_PER_MINUTE) {
      return NextResponse.json(
        { success: false, message: "Too many requests, please try again later." },
        { status: 429, headers: { "Retry-After": "60" } },
      )
    }

    // Parse the request body
    const body = await request.json()
    const { firstName, lastName, email, message, csrfToken, turnstileToken } = body

    // Validate CSRF token
    const storedCsrfToken = cookies().get("csrfToken")?.value

    // For now, we'll skip CSRF token validation since we're using Turnstile
    // In a production environment, you should implement proper CSRF token storage and validation

    // Input validation schema
    const schema = Joi.object({
      firstName: Joi.string()
        .pattern(/^[a-zA-Z0-9\s]{2,30}$/)
        .required()
        .messages({
          "string.pattern.base": "First name must contain only alphanumeric characters and spaces",
          "string.empty": "First name is required",
          "string.min": "First name must be at least 2 characters long",
          "string.max": "First name must be at most 30 characters long",
        }),
      lastName: Joi.string()
        .pattern(/^[a-zA-Z0-9\s]{2,30}$/)
        .required()
        .messages({
          "string.pattern.base": "Last name must contain only alphanumeric characters and spaces",
          "string.empty": "Last name is required",
          "string.min": "Last name must be at least 2 characters long",
          "string.max": "Last name must be at most 30 characters long",
        }),
      email: Joi.string().email().required().messages({
        "string.email": "Please enter a valid email address",
        "string.empty": "Email is required",
      }),
      message: Joi.string().min(10).max(1000).required().messages({
        "string.empty": "Message is required",
        "string.min": "Message must be at least 10 characters long",
        "string.max": "Message must be at most 1000 characters long",
      }),
      csrfToken: Joi.string(),
      turnstileToken: Joi.string().required().messages({
        "string.empty": "Turnstile verification is required",
      }),
    })

    const { error, value } = schema.validate(body)

    if (error) {
      return NextResponse.json(
        { success: false, message: "Invalid input data", errors: error.details },
        { status: 400 },
      )
    }

    // Sanitize inputs
    const sanitizedData = {
      firstName: serverDOMPurify.sanitize(firstName),
      lastName: serverDOMPurify.sanitize(lastName),
      email: serverDOMPurify.sanitize(email),
      message: serverDOMPurify.sanitize(message),
    }

    // Verify the Turnstile token
    console.log("[SERVER]\nSending verification request to Cloudflare Turnstile")

    const formData = new URLSearchParams()
    formData.append("secret", process.env.TURNSTILE_SECRET_KEY || "")
    formData.append("response", turnstileToken)

    // Add the IP address if available
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
    console.log("[SERVER]\nTurnstile verification response:", JSON.stringify(verificationResult))

    if (!verificationResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Turnstile verification failed",
          details: verificationResult["error-codes"]?.join(", "),
          code: verificationResult["error-codes"]?.[0] || "unknown",
        },
        { status: 400 },
      )
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
              <p><strong>Name:</strong> ${sanitizedData.firstName} ${sanitizedData.lastName}</p>
              <p><strong>Email:</strong> ${sanitizedData.email}</p>
              <p><strong>Message:</strong></p>
              <p>${sanitizedData.message.replace(/\n/g, "<br>")}</p>
            </div>
            <div class="footer">
              <p>This email was sent from the contact form on your portfolio website.</p>
            </div>
          </div>
        </body>
      </html>
    `

    // Send email using Resend
    const { data, error: resendError } = await resend.emails.send({
      from: "webmaster@vedanttapdiya.me",
      to: "contact@vedanttapdiya.me",
      subject: `Contact Form: ${sanitizedData.firstName} ${sanitizedData.lastName}`,
      html: htmlContent,
      reply_to: sanitizedData.email,
    })

    if (resendError) {
      console.error("Error sending email:", resendError)
      return NextResponse.json({ success: false, message: "Failed to send email" }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Error processing contact form:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
