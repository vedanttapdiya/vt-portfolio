"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import Script from "next/script"
import { ChevronRight, Home } from "lucide-react"

interface BreadcrumbsProps {
  homeText?: string
  className?: string
}

export function Breadcrumbs({ homeText = "Home", className = "" }: BreadcrumbsProps) {
  const pathname = usePathname()

  // Skip rendering breadcrumbs on home page
  if (pathname === "/") return null

  // Split the pathname into segments
  const segments = pathname.split("/").filter((segment) => segment !== "")

  // Create breadcrumbs array
  const breadcrumbs = [
    { label: homeText, href: "/" },
    ...segments.map((segment, index) => {
      const href = `/${segments.slice(0, index + 1).join("/")}`

      // Format the label (capitalize and replace hyphens with spaces)
      let label = segment.replace(/-/g, " ")
      label = label.charAt(0).toUpperCase() + label.slice(1)

      return { label, href }
    }),
  ]

  // Create structured data for breadcrumbs
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.label,
      item: `https://vedanttapdiya.com${crumb.href}`,
    })),
  }

  return (
    <>
      <Script
        id="breadcrumbs-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <nav aria-label="Breadcrumbs" className={`text-sm ${className}`}>
        <ol className="flex flex-wrap items-center space-x-1">
          {breadcrumbs.map((crumb, index) => (
            <li key={index} className="flex items-center">
              {index > 0 && <ChevronRight className="h-4 w-4 mx-1 text-zinc-400" />}

              {index === breadcrumbs.length - 1 ? (
                <span className="text-zinc-300 font-medium" aria-current="page">
                  {crumb.label}
                </span>
              ) : (
                <Link href={crumb.href} className="text-zinc-400 hover:text-white flex items-center">
                  {index === 0 ? (
                    <>
                      <Home className="h-4 w-4 mr-1" />
                      <span className="sr-only">{crumb.label}</span>
                    </>
                  ) : (
                    crumb.label
                  )}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  )
}
