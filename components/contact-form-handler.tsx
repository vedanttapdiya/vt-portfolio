"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { validateInput } from "@/lib/form-validation"
import { Turnstile } from "@/components/turnstile"

interface ContactFormHandlerProps {
  className?: string
}

export function ContactFormHandler({ className = "" }: ContactFormHandlerProps) {
  const { toast } = useToast()
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [csrfToken, setCsrfToken] = useState("")
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const [showTurnstile, setShowTurnstile] = useState(false)

  // Generate CSRF token on component mount
  useState(() => {
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    setCsrfToken(token)
  })

  const validateForm = () => {
    // Reset errors
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

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!validateForm()) {
      return
    }

    // Show Turnstile if form is valid
    if (!turnstileToken) {
      setShowTurnstile(true)
      return
    }

    // If we have a token, proceed with submission
    submitForm()
  }

  const handleTurnstileVerify = (token: string) => {
    setTurnstileToken(token)
    // Automatically submit the form after verification
    submitForm(token)
  }

  const submitForm = async (token: string = turnstileToken!) => {
    setIsSubmitting(true)

    try {
      // Prepare data for submission
      const formData = {
        firstName,
        lastName,
        email,
        message,
        csrfToken,
        turnstileToken: token,
      }

      // Send the form data to the API
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to send message")
      }

      toast({
        title: "Message sent successfully!",
        description: "Thank you for reaching out. I'll get back to you soon.",
      })

      // Reset form
      setFirstName("")
      setLastName("")
      setEmail("")
      setMessage("")
      setTurnstileToken(null)
      setShowTurnstile(false)

      // Generate new CSRF token for next submission
      const newToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
      setCsrfToken(newToken)
    } catch (error) {
      console.error("Error sending message:", error)
      toast({
        title: "Error sending message",
        description: error instanceof Error ? error.message : "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="firstName" className="text-sm font-medium text-white">
            First Name
          </label>
          <input
            id="firstName"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className={`flex h-10 w-full rounded-md border ${
              formErrors.firstName ? "border-red-500" : "border-zinc-800"
            } bg-zinc-950 px-3 py-2 text-sm text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent`}
            placeholder="John"
            required
          />
          {formErrors.firstName && <p className="text-xs text-red-500 mt-1">{formErrors.firstName}</p>}
        </div>
        <div className="space-y-2">
          <label htmlFor="lastName" className="text-sm font-medium text-white">
            Last Name
          </label>
          <input
            id="lastName"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className={`flex h-10 w-full rounded-md border ${
              formErrors.lastName ? "border-red-500" : "border-zinc-800"
            } bg-zinc-950 px-3 py-2 text-sm text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent`}
            placeholder="Doe"
            required
          />
          {formErrors.lastName && <p className="text-xs text-red-500 mt-1">{formErrors.lastName}</p>}
        </div>
      </div>
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-white">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`flex h-10 w-full rounded-md border ${
            formErrors.email ? "border-red-500" : "border-zinc-800"
          } bg-zinc-950 px-3 py-2 text-sm text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent`}
          placeholder="john.doe@example.com"
          required
        />
        {formErrors.email && <p className="text-xs text-red-500 mt-1">{formErrors.email}</p>}
      </div>
      <div className="space-y-2">
        <label htmlFor="message" className="text-sm font-medium text-white">
          Message
        </label>
        <textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={`flex min-h-[120px] w-full rounded-md border ${
            formErrors.message ? "border-red-500" : "border-zinc-800"
          } bg-zinc-950 px-3 py-2 text-sm text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent`}
          placeholder="Your message"
          required
        />
        {formErrors.message && <p className="text-xs text-red-500 mt-1">{formErrors.message}</p>}
      </div>

      {showTurnstile && !turnstileToken && (
        <div className="flex flex-col items-center justify-center py-4 border border-zinc-800 rounded-md bg-zinc-900/50">
          <p className="text-sm text-zinc-400 mb-4">Please verify you're human:</p>
          <Turnstile onVerify={handleTurnstileVerify} className="mx-auto" />
        </div>
      )}

      <input type="hidden" name="csrf_token" value={csrfToken} />
      <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white" disabled={isSubmitting}>
        {isSubmitting ? (
          <div className="flex items-center justify-center">
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Sending...
          </div>
        ) : turnstileToken ? (
          "Send Message"
        ) : (
          "Continue"
        )}
      </Button>
    </form>
  )
}
