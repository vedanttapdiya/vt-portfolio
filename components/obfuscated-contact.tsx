"use client"

import { useState } from "react"
import { Copy, Check, Lock } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Turnstile } from "@/components/turnstile"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface ObfuscatedContactProps {
  type: "email" | "phone"
  value: string
  className?: string
}

export function ObfuscatedContact({ type, value, className = "" }: ObfuscatedContactProps) {
  const { toast } = useToast()
  const [revealed, setRevealed] = useState(false)
  const [copied, setCopied] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [verificationError, setVerificationError] = useState<string | null>(null)

  // Obfuscate the value
  const obfuscateValue = () => {
    if (type === "email") {
      const [username, domain] = value.split("@")
      return `${username.substring(0, 2)}***@${domain}`
    } else if (type === "phone") {
      return `${value.substring(0, 2)}*****${value.substring(value.length - 2)}`
    }
    return "***"
  }

  const handleRevealRequest = () => {
    setDialogOpen(true)
    setVerificationError(null)
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
        body: JSON.stringify({ token }),
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
        setVerificationError(data.message || "Verification failed. Please try again.")
        toast({
          title: "Verification failed",
          description: data.message || "Please try again.",
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

  const handleCopy = () => {
    navigator.clipboard.writeText(value)
    setCopied(true)

    toast({
      title: "Copied to clipboard",
      description: `${type === "email" ? "Email address" : "Phone number"} copied to clipboard.`,
    })

    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }

  return (
    <div className="flex items-center gap-2">
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <button
            onClick={handleRevealRequest}
            className={`${className} hover:underline focus:outline-none flex items-center gap-1`}
            aria-label={`Reveal ${type}`}
          >
            {revealed ? (
              value
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
            <Turnstile onVerify={handleVerify} className="mx-auto" />
            {verificationError && <p className="text-red-500 text-sm mt-2">{verificationError}</p>}
            {isVerifying && <p className="text-zinc-400 text-sm mt-2">Verifying...</p>}
          </div>
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
