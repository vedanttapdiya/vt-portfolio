import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Vedant Tapdiya | Cybersecurity Professional & SOC Analyst",
  description:
    "Aspiring Security Operations Center (SOC) Analyst with expertise in cybersecurity, threat detection, incident response, digital forensics, and security monitoring.",
  keywords:
    "SOC Analyst, Cybersecurity, Security Operations, Threat Detection, Incident Response, Security Monitoring, SIEM, Security Researcher, Digital Forensics, Vedant Tapdiya",
  authors: [{ name: "Vedant Tapdiya" }],
  creator: "Vedant Tapdiya",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
