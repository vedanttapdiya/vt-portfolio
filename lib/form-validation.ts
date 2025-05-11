/**
 * Validates an email address
 * @param email Email address to validate
 * @returns Boolean indicating if the email is valid
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return emailRegex.test(email)
}

/**
 * Sanitizes user input to prevent XSS attacks
 * @param input User input to sanitize
 * @returns Sanitized input string
 */
export function sanitizeInput(input: string): string {
  if (!input) return ""

  // Replace potentially dangerous characters with HTML entities
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
    .trim()
}

/**
 * Comprehensive input validation
 * @param input User input to validate
 * @param type Type of validation to perform
 * @returns Object with validation result and error message
 */
export function validateInput(
  input: string,
  type: "text" | "email" | "phone" | "url" | "message",
): { isValid: boolean; error?: string } {
  // Check for empty input
  if (!input || input.trim() === "") {
    return { isValid: false, error: "This field is required" }
  }

  // Perform type-specific validation
  switch (type) {
    case "email":
      if (!validateEmail(input)) {
        return { isValid: false, error: "Please enter a valid email address" }
      }
      break
    case "text":
      if (input.length > 100) {
        return { isValid: false, error: "Please enter valid text (max 100 characters)" }
      }
      break
    case "message":
      if (input.length > 1000) {
        return { isValid: false, error: "Please enter valid text (max 1000 characters)" }
      }
      break
  }

  return { isValid: true }
}
