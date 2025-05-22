"use client"

import { useState } from "react"
import { Copy, Check, Lock, AlertCircle, RefreshCw } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Turnstile } from "@/components/turnstile"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface ObfuscatedContactProps {
  type: "email" | "phone"
  value: string
  className?: string
  id?: string
}

export function ObfuscatedContact({ type, value, className = "", id = "default" }: ObfuscatedContactProps) {
  const { toast } = useToast()
  const [revealed, setRevealed] = useState(false)
  const [copied, setCopied] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [verificationError, setVerificationError] = useState<string | null>(null)
  const [turnstileInstanceId, setTurnstileInstanceId] = useState<string>(`${type}-${id}-${Date.now()}`)

  // Format the phone number for display
  const formatPhoneNumber = (phone: string): string => {
    // Assuming the phone number is 10 digits (Indian format)
    if (phone.length === 10) {
      return `+91 ${phone.substring(0, 5)} ${phone.substring(5)}`
    }
    return phone
  }

  // Get the formatted value for display
  const getFormattedValue = (): string => {
    if (type === "phone") {
      return formatPhoneNumber(value)
    }
    return value
  }

  // Obfuscate the value
  const obfuscateValue = () => {
    if (type === "email") {
      const [username, domain] = value.split("@")
      return `${username.substring(0, 2)}***@${domain}`
    } else if (type === "phone") {
      // Format for Indian phone number
      return `+91 XXXXX XXX${value.substring(value.length - 2)}`
    }
    return "***"
  }

  const handleRevealRequest = () => {
    if (revealed) {
      // If already revealed, no need to verify again
      return
    }

    // Generate a new instance ID to force a fresh Turnstile widget
    setTurnstileInstanceId(`${type}-${id}-${Date.now()}`)
    setDialogOpen(true)
    setVerificationError(null)
    setTurnstileToken(null)
  }

  const handleVerify = async (token: string) => {
    setTurnstileToken(token)
    setIsVerifying(true)
    setVerificationError(null)

    try {
      // Verify the token with your server
      const response = await fetch("/api/verify-turnstile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          contactId: id,
          contactType: type,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setRevealed(true)
        setDialogOpen(false)
        toast({
          title: "Verification successful",
          description: "Contact information revealed.",
        })
      } else {
        const errorMessage = data.message || "Verification failed. Please try again."
        const errorDetails = data.details ? ` (${data.details})` : ""
        setVerificationError(`${errorMessage}${errorDetails}`)

        toast({
          title: "Verification failed",
          description: errorMessage,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Verification error:", error)
      setVerificationError("An error occurred during verification. Please try again.")
      toast({
        title: "Verification error",
        description: "An error occurred during verification.",
        variant: "destructive",
      })
    } finally {
      setIsVerifying(false)
    }
  }

  const handleTurnstileError = (error?: string) => {
    setVerificationError(`Turnstile error: ${error || "Unknown error"}`)
  }

  const resetTurnstile = () => {
    // Generate a new instance ID to force a fresh Turnstile widget
    setTurnstileInstanceId(`${type}-${id}-${Date.now()}`)
    setVerificationError(null)
  }

  const handleCopy = () => {
    // Copy the formatted value for phone numbers
    const textToCopy = type === "phone" ? formatPhoneNumber(value) : value

    navigator.clipboard.writeText(textToCopy)
    setCopied(true)

    toast({
      title: "Copied to clipboard",
      description: `${type === "email" ? "Email address" : "Phone number"} copied to clipboard.`,
    })

    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }

  // For development/testing only - bypass verification
  const handleBypassVerification = () => {
    if (process.env.NODE_ENV === "development") {
      setRevealed(true)
      setDialogOpen(false)
      toast({
        title: "Development mode",
        description: "Verification bypassed in development mode.",
      })
    }
  }

  // Get the href for the contact link
  const getContactHref = (): string => {
    if (type === "email") {
      return `mailto:${value}`
    } else if (type === "phone") {
      return `tel:+91${value}`
    }
    return "#"
  }

  return (
    <div className="flex items-center gap-2">
      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open)
          if (!open) {
            // Reset state when dialog is closed
            setTurnstileToken(null)
            setVerificationError(null)
          }
        }}
      >
        <DialogTrigger asChild>
          <button
            onClick={handleRevealRequest}
            className={`${className} hover:underline focus:outline-none flex items-center gap-1`}
            aria-label={`Reveal ${type}`}
          >
            {revealed ? (
              <a href={getContactHref()} className="hover:text-green-400 transition-colors">
                {getFormattedValue()}
              </a>
            ) : (
              <>
                {obfuscateValue()} <Lock className="h-3 w-3 text-zinc-400" />
              </>
            )}
          </button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verify you're human</DialogTitle>
            <DialogDescription>
              Please complete the security check below to reveal the contact information.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-4">
            <Turnstile
              instanceId={turnstileInstanceId}
              onVerify={handleVerify}
              onError={handleTurnstileError}
              className="mx-auto"
              debugMode={false}
            />

            {verificationError && (
              <div className="flex items-center gap-2 text-red-500 text-sm mt-4 p-2 border border-red-300 rounded bg-red-950 border-red-800">
                <AlertCircle className="h-4 w-4" />
                <p>{verificationError}</p>
                <Button variant="ghost" size="icon" className="h-6 w-6 ml-2" onClick={resetTurnstile} title="Try again">
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            )}

            {isVerifying && (
              <div className="flex items-center text-zinc-400 text-sm mt-2">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-zinc-400"
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
                Verifying...
              </div>
            )}
          </div>

          <DialogFooter className="flex justify-between items-center">
            {process.env.NODE_ENV === "development" && (
              <Button variant="outline" size="sm" onClick={handleBypassVerification} className="text-xs">
                Dev: Bypass Verification
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {revealed && (
        <button
          onClick={handleCopy}
          className="text-zinc-400 hover:text-white transition-colors"
          aria-label={`Copy ${type} to clipboard`}
        >
          {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
        </button>
      )}
    </div>
  )
}
