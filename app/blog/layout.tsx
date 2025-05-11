import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Cybersecurity Blog | Vedant Tapdiya",
  description:
    "Explore cybersecurity insights, digital forensics techniques, and security operations best practices from Vedant Tapdiya.",
  robots: {
    index: true,
    follow: true,
  },
}

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
