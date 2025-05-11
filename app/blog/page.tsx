"use client"

import Link from "next/link"
import { ArrowLeft, Calendar, Tag, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
// Add import for Breadcrumbs component
import { Breadcrumbs } from "@/components/breadcrumbs"

export default function BlogPage() {
  const router = useRouter()

  // Sample blog posts data
  const blogPosts = [
    {
      id: 1,
      title: "Understanding Digital Forensics: A Comprehensive Guide",
      excerpt:
        "Digital forensics is the process of uncovering and interpreting electronic data. Learn about the key techniques and tools used in modern digital investigations.",
      date: "August 15, 2023",
      author: "Vedant Tapdiya",
      readTime: "8 min read",
      tags: ["Digital Forensics", "Cybersecurity", "Investigation"],
      slug: "understanding-digital-forensics",
    },
    {
      id: 2,
      title: "The Evolution of Security Operations Centers (SOC)",
      excerpt:
        "Security Operations Centers have evolved significantly over the past decade. This article explores the transformation from traditional to modern SOCs and the impact of AI and automation.",
      date: "September 3, 2023",
      author: "Vedant Tapdiya",
      readTime: "12 min read",
      tags: ["SOC", "Security Operations", "SIEM"],
      slug: "evolution-of-security-operations-centers",
    },
    {
      id: 3,
      title: "Memory Forensics: Extracting Evidence from Volatile Memory",
      excerpt:
        "Memory forensics is a critical component of modern digital investigations. Learn how to capture and analyze RAM to uncover malware, encryption keys, and other artifacts.",
      date: "October 10, 2023",
      author: "Vedant Tapdiya",
      readTime: "10 min read",
      tags: ["Memory Forensics", "Volatility", "RAM Analysis"],
      slug: "memory-forensics-extracting-evidence",
    },
    {
      id: 4,
      title: "Threat Hunting Techniques for Security Analysts",
      excerpt:
        "Proactive threat hunting is essential for detecting advanced persistent threats. This guide covers methodologies, tools, and best practices for effective threat hunting.",
      date: "November 5, 2023",
      author: "Vedant Tapdiya",
      readTime: "15 min read",
      tags: ["Threat Hunting", "APT", "Security Analysis"],
      slug: "threat-hunting-techniques",
    },
    {
      id: 5,
      title: "Blockchain Security: Protecting Decentralized Systems",
      excerpt:
        "Blockchain technology introduces unique security challenges. Explore common vulnerabilities in blockchain implementations and strategies for securing decentralized applications.",
      date: "December 12, 2023",
      author: "Vedant Tapdiya",
      readTime: "11 min read",
      tags: ["Blockchain", "Smart Contracts", "DeFi Security"],
      slug: "blockchain-security-protecting-decentralized-systems",
    },
    {
      id: 6,
      title: "OSINT Techniques for Cybersecurity Professionals",
      excerpt:
        "Open Source Intelligence (OSINT) is a powerful tool for security professionals. Learn how to ethically gather and analyze publicly available information for security purposes.",
      date: "January 20, 2024",
      author: "Vedant Tapdiya",
      readTime: "9 min read",
      tags: ["OSINT", "Intelligence Gathering", "Reconnaissance"],
      slug: "osint-techniques-for-cybersecurity",
    },
  ]

  const handlePostClick = (slug: string) => {
    router.push(`/blog/${slug}`)
  }

  return (
    <div className="flex min-h-screen flex-col bg-black">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
          <Link href="/" className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="gap-1">
              <ArrowLeft className="h-4 w-4" />
              Back to Portfolio
            </Button>
          </Link>
          <div className="flex flex-1 items-center justify-end">
            <h1 className="text-xl font-bold text-white">Cybersecurity Blog</h1>
          </div>
        </div>
      </header>

      {/* Inside the return statement, after the header and before the main content, add: */}
      <Breadcrumbs className="container mt-4 mb-2" />

      <main className="flex-1 py-12">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-green-900/20 px-3 py-1 text-sm text-green-500">Blog</div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-white">Cybersecurity Insights</h2>
              <p className="max-w-[700px] text-zinc-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Exploring digital forensics, security operations, and the evolving threat landscape
              </p>
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map((post) => (
              <Card
                key={post.id}
                className="bg-zinc-900 border-green-600/20 text-white overflow-hidden flex flex-col cursor-pointer hover:border-green-500 transition-all"
                onClick={() => handlePostClick(post.slug)}
              >
                <CardHeader className="pb-0">
                  <CardTitle className="text-xl hover:text-green-400 transition-colors">{post.title}</CardTitle>
                </CardHeader>
                <CardContent className="py-4 flex-grow">
                  <p className="text-zinc-400 text-sm">{post.excerpt}</p>
                </CardContent>
                <CardFooter className="flex flex-col items-start space-y-2 pt-0">
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center text-xs bg-green-900/20 text-green-400 px-2 py-1 rounded"
                      >
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between w-full text-xs text-zinc-500 pt-2">
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {post.date}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {post.readTime}
                    </div>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-zinc-800 bg-black py-6">
        <div className="container flex flex-col items-center justify-center gap-4 px-4 md:px-6">
          <p className="text-center text-sm text-zinc-400">
            © {new Date().getFullYear()} Vedant Tapdiya. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
