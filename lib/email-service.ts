import { Resend } from "resend"

// Initialize Resend with API key
const RESEND_API_KEY = process.env.RESEND_API_KEY

/**
 * Sends an email using the Resend API
 */
export async function sendEmail(options: {
  from: string
  to: string
  subject: string
  html: string
  replyTo?: string
}) {
  if (!RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not set")
  }

  try {
    const resend = new Resend(RESEND_API_KEY)

    const { data, error } = await resend.emails.send({
      from: options.from,
      to: options.to,
      subject: options.subject,
      html: options.html,
      reply_to: options.replyTo,
    })

    if (error) {
      console.error("Resend API error:", error)
      throw new Error(`Resend API error: ${error.message}`)
    }

    return { success: true, id: data?.id }
  } catch (error) {
    console.error("Error sending email:", error)
    throw error
  }
}

/**
 * Formats a date to a readable format
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

/**
 * Sends a contact form email
 */
export async function sendContactFormEmail(data: {
  firstName: string
  lastName: string
  email: string
  message: string
}) {
  const { firstName, lastName, email, message } = data

  const htmlContent = `
    <h2>New Contact Form Submission</h2>
    <p><strong>Name:</strong> ${firstName} ${lastName}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Message:</strong></p>
    <p>${message.replace(/\n/g, "<br>")}</p>
    <hr>
    <p><small>This message was sent from the contact form on vedanttapdiya.me</small></p>
  `

  return sendEmail({
    from: "webmaster@vedanttapdiya.me",
    to: "contact@vedanttapdiya.me",
    subject: `Contact Form: ${firstName} ${lastName}`,
    html: htmlContent,
    replyTo: email,
  })
}
