"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Github, ExternalLink, Calendar, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"

// Sample project data
const projectsData = {
  "blockchain-fso": {
    title: "Blockchain-Based Facial Sign-On (FSO) Library",
    description:
      "A research-oriented decentralized authentication library utilizing blockchain for secure and privacy-preserving facial recognition.",
    fullDescription: `
      <p>The Blockchain-Based Facial Sign-On (FSO) Library is a cutting-edge authentication solution that combines facial recognition technology with blockchain security to create a decentralized, privacy-preserving authentication system.</p>
      
      <h3>Key Features</h3>
      <ul>
        <li>Decentralized identity verification using Ethereum blockchain</li>
        <li>Privacy-preserving facial recognition that doesn't store actual facial images</li>
        <li>Zero-knowledge proof implementation for enhanced security</li>
        <li>Cross-platform support with mobile and web interfaces</li>
        <li>Biometric template protection using homomorphic encryption</li>
      </ul>
      
      <h3>Technical Implementation</h3>
      <p>The system uses TensorFlow and FaceNet for facial feature extraction, converting facial features into secure embeddings. These embeddings are then hashed and stored on the Ethereum blockchain, with the actual verification process happening through smart contracts.</p>
      
      <p>The library includes a comprehensive API that allows developers to integrate this authentication method into their applications with minimal configuration.</p>
      
      <h3>Research Impact</h3>
      <p>This project addresses several critical challenges in biometric authentication:</p>
      <ul>
        <li>Eliminates central points of failure by distributing identity data</li>
        <li>Prevents replay attacks through blockchain-based challenge-response mechanisms</li>
        <li>Ensures user privacy by never storing actual facial images</li>
        <li>Provides non-repudiation through blockchain's immutable ledger</li>
      </ul>
    `,
    date: "January 2023 - June 2023",
    tags: ["Python", "TensorFlow", "Solidity", "Ethereum", "Flask", "REST API"],
    githubUrl: "https://github.com/username/blockchain-fso",
    demoUrl: "https://demo-blockchain-fso.example.com",
    images: ["/placeholder.svg?height=400&width=600", "/placeholder.svg?height=400&width=600"],
  },
  ramhound: {
    title: "Forensics Memory Acquisition Tool (RAMhound)",
    description:
      "A cross-platform memory acquisition tool enabling forensic acquisition of volatile memory across Windows, Linux, and macOS.",
    fullDescription: `
      <p>RAMhound is a specialized digital forensics tool designed for memory acquisition across multiple operating systems. It allows investigators to capture volatile memory (RAM) for forensic analysis, preserving critical evidence that would otherwise be lost when a system powers down.</p>
      
      <h3>Key Features</h3>
      <ul>
        <li>Cross-platform support for Windows, Linux, and macOS</li>
        <li>Minimal system footprint to prevent evidence contamination</li>
        <li>Multiple acquisition methods including direct memory access and hibernation file parsing</li>
        <li>Memory integrity verification using cryptographic hashing</li>
        <li>Integrated memory analysis capabilities for quick triage</li>
        <li>Command-line and GUI interfaces for different operational needs</li>
      </ul>
      
      <h3>Technical Implementation</h3>
      <p>RAMhound leverages low-level system APIs to access physical memory. On Windows, it uses the Windows Management Instrumentation (WMI) and direct physical memory access through device drivers. On Linux and macOS, it utilizes /dev/mem, /proc/kcore, and other platform-specific methods.</p>
      
      <p>The tool implements a modular architecture that allows for easy extension with new acquisition methods and analysis capabilities. All memory dumps are secured with strong encryption to maintain chain of custody.</p>
      
      <h3>Forensic Applications</h3>
      <p>RAMhound has been successfully used in several digital forensic investigations to recover:</p>
      <ul>
        <li>Encryption keys and passwords from memory</li>
        <li>Evidence of malware and rootkits</li>
        <li>Network connections and socket information</li>
        <li>Process information and loaded modules</li>
        <li>Recently accessed files and user activity</li>
      </ul>
    `,
    date: "March 2023 - August 2023",
    tags: ["Python", "WinAPI", "Libpcap", "OpenSSL", "Memory Forensics"],
    githubUrl: "https://github.com/username/ramhound",
    demoUrl: null,
    images: ["/placeholder.svg?height=400&width=600", "/placeholder.svg?height=400&width=600"],
  },
  "twitter-sentiment": {
    title: "Twitter Hashtags & Sentiment Analysis Tool",
    description:
      "A Python-based sentiment analysis tool to analyze Twitter hashtags in real-time, assisting law enforcement in monitoring public sentiment and emerging trends.",
    fullDescription: `
      <p>This Twitter Hashtags & Sentiment Analysis Tool was developed during my internship with Gurugram Police to help law enforcement monitor public sentiment and identify emerging trends on social media platforms.</p>
      
      <h3>Key Features</h3>
      <ul>
        <li>Real-time monitoring of Twitter hashtags and keywords</li>
        <li>Advanced sentiment analysis using natural language processing</li>
        <li>Trend identification and anomaly detection</li>
        <li>Geospatial visualization of tweet origins</li>
        <li>Customizable alerting system for specific sentiment thresholds</li>
        <li>Historical data analysis and pattern recognition</li>
      </ul>
      
      <h3>Technical Implementation</h3>
      <p>The tool uses the Twitter API via Tweepy to collect real-time data based on configurable keywords, hashtags, and geographic regions. Natural Language Processing (NLP) techniques are applied using NLTK and custom-trained models to analyze sentiment, extract entities, and identify emerging topics.</p>
      
      <p>Data visualization is implemented using Matplotlib and Plotly to provide intuitive dashboards for monitoring trends and sentiment shifts over time. The system includes a database backend for historical analysis and pattern recognition.</p>
      
      <h3>Law Enforcement Applications</h3>
      <p>This tool has been successfully deployed to assist law enforcement in:</p>
      <ul>
        <li>Monitoring public sentiment during major events and protests</li>
        <li>Identifying potential threats and security concerns through social media analysis</li>
        <li>Tracking the spread of misinformation during crisis situations</li>
        <li>Gauging public response to law enforcement initiatives and policies</li>
        <li>Early detection of emerging social issues and community concerns</li>
      </ul>
      
      <h3>Recognition</h3>
      <p>This project received an A+ grade and was adopted by the department for ongoing social media strategy assessments. It has since been enhanced with additional features based on operational feedback from law enforcement users.</p>
    `,
    date: "June 2022 - July 2022",
    tags: ["Python", "NLTK", "Tweepy", "Pandas", "Matplotlib", "NLP"],
    githubUrl: "https://github.com/username/twitter-sentiment",
    demoUrl: "https://demo-twitter-sentiment.example.com",
    images: ["/placeholder.svg?height=400&width=600", "/placeholder.svg?height=400&width=600"],
  },
}

export default function ProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [project, setProject] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get the slug from the URL
    const { slug } = params

    // Fetch project data based on slug
    if (typeof slug === "string" && projectsData[slug]) {
      setProject(projectsData[slug])
    } else {
      // Redirect to projects page if project not found
      router.push("/projects")
    }

    setLoading(false)
  }, [params, router])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="text-green-500 text-xl">Loading project details...</div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="text-red-500 text-xl">Project not found</div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-black">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
          <Link href="/projects" className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="gap-1">
              <ArrowLeft className="h-4 w-4" />
              Back to Projects
            </Button>
          </Link>
          <div className="flex flex-1 items-center justify-end">
            <h1 className="text-xl font-bold text-white">Project Details</h1>
          </div>
        </div>
      </header>

      <main className="flex-1 py-12">
        <div className="container px-4 md:px-6">
          <motion.div
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-6 flex items-center gap-2">
              <div className="inline-block rounded-lg bg-green-900/20 px-3 py-1 text-sm text-green-500">Project</div>
              <div className="flex items-center text-sm text-zinc-400">
                <Calendar className="h-4 w-4 mr-1" />
                {project.date}
              </div>
            </div>

            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white mb-6">
              {project.title}
            </h1>

            <div className="flex flex-wrap gap-2 mb-8">
              {project.tags.map((tag: string, index: number) => (
                <Badge key={index} className="bg-green-900/50 text-green-400">
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>

            <p className="text-xl text-zinc-300 mb-8">{project.description}</p>

            <div className="grid gap-8 md:grid-cols-2 mb-8">
              {project.images.map((image: string, index: number) => (
                <motion.div
                  key={index}
                  className="border border-zinc-800 rounded-lg overflow-hidden"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                >
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`${project.title} screenshot ${index + 1}`}
                    className="w-full h-auto"
                  />
                </motion.div>
              ))}
            </div>

            <div className="prose prose-invert max-w-none mb-8">
              <div dangerouslySetInnerHTML={{ __html: project.fullDescription }} />
            </div>

            <div className="flex flex-wrap gap-4">
              {project.githubUrl && (
                <Button className="bg-zinc-800 hover:bg-zinc-700 gap-2">
                  <Github className="h-4 w-4" />
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                    View on GitHub
                  </a>
                </Button>
              )}

              {project.demoUrl && (
                <Button className="bg-green-600 hover:bg-green-700 gap-2">
                  <ExternalLink className="h-4 w-4" />
                  <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                    Live Demo
                  </a>
                </Button>
              )}
            </div>
          </motion.div>
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
