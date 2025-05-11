import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Cybersecurity Projects | Vedant Tapdiya",
  description:
    "Explore cybersecurity projects including blockchain authentication, forensic tools, and security analysis applications developed by Vedant Tapdiya.",
  robots: {
    index: true,
    follow: true,
  },
}

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
