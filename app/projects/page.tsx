import Link from "next/link"
import { ArrowLeft, ArrowRight, Lock, FileDigit, Brain, Shield, Code, Database, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Breadcrumbs } from "@/components/breadcrumbs"

export default function ProjectsPage() {
  // Sample projects data - keeping all projects in the data but will filter for display
  const allProjects = [
    {
      id: 1,
      title: "Blockchain-Based Facial Sign-On (FSO) Library",
      description:
        "Research-oriented decentralized authentication library utilizing blockchain for secure and privacy-preserving facial recognition.",
      icon: <Lock className="h-6 w-6 text-green-500" />,
      tags: ["Python", "TensorFlow", "Solidity", "Ethereum", "Flask"],
      slug: "blockchain-fso",
      hidden: false,
    },
    {
      id: 2,
      title: "Forensics Memory Acquisition Tool",
      description:
        "Developed RAMhound, a cross-platform memory acquisition tool enabling forensic acquisition of volatile memory across Windows, Linux, and macOS.",
      icon: <FileDigit className="h-6 w-6 text-green-500" />,
      tags: ["Python", "WinAPI", "Libpcap", "OpenSSL"],
      slug: "ramhound",
      hidden: false,
    },
    {
      id: 3,
      title: "Twitter Hashtags & Sentiment Analysis Tool",
      description:
        "Engineered a Python-based sentiment analysis tool to analyze Twitter hashtags in real-time, assisting law enforcement in monitoring public sentiment.",
      icon: <Brain className="h-6 w-6 text-green-500" />,
      tags: ["Python", "NLTK", "Tweepy", "Pandas", "Matplotlib"],
      slug: "twitter-sentiment",
      hidden: false,
    },
    {
      id: 4,
      title: "Network Traffic Analyzer",
      description:
        "Built a real-time network traffic analysis tool that detects anomalies and potential security threats using machine learning algorithms.",
      icon: <Shield className="h-6 w-6 text-green-500" />,
      tags: ["Python", "Scapy", "TensorFlow", "Pandas", "Flask"],
      slug: "network-analyzer",
      hidden: true, // Hidden as requested
    },
    {
      id: 5,
      title: "Secure File Encryption System",
      description:
        "Developed a file encryption system with multi-factor authentication and secure key management for sensitive document protection.",
      icon: <Lock className="h-6 w-6 text-green-500" />,
      tags: ["C++", "OpenSSL", "Qt", "SQLite"],
      slug: "secure-encryption",
      hidden: true, // Hidden as requested
    },
    {
      id: 6,
      title: "YARA Rule Generator",
      description:
        "Created an automated tool that generates YARA rules from malware samples to improve threat detection capabilities.",
      icon: <Code className="h-6 w-6 text-green-500" />,
      tags: ["Python", "YARA", "Machine Learning", "Flask"],
      slug: "yara-generator",
      hidden: true, // Hidden as requested
    },
    {
      id: 7,
      title: "Vulnerability Database API",
      description:
        "Built a RESTful API that aggregates and normalizes vulnerability data from multiple sources for security researchers.",
      icon: <Database className="h-6 w-6 text-green-500" />,
      tags: ["Node.js", "MongoDB", "Express", "Docker"],
      slug: "vulnerability-db",
      hidden: true, // Hidden as requested
    },
    {
      id: 8,
      title: "OSINT Automation Framework",
      description:
        "Developed a framework for automating open-source intelligence gathering and analysis for cybersecurity investigations.",
      icon: <Search className="h-6 w-6 text-green-500" />,
      tags: ["Python", "Selenium", "BeautifulSoup", "MongoDB", "FastAPI"],
      slug: "osint-framework",
      hidden: true, // Hidden as requested
    },
  ]

  // Filter out hidden projects
  const visibleProjects = allProjects.filter((project) => !project.hidden)

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
            <h1 className="text-xl font-bold text-white">Projects</h1>
          </div>
        </div>
      </header>

      <Breadcrumbs className="container mt-4 mb-2" />

      <main className="flex-1 py-12">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-green-900/20 px-3 py-1 text-sm text-green-500">Projects</div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-white">My Cybersecurity Projects</h2>
              <p className="max-w-[700px] text-zinc-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Showcasing my technical expertise in digital forensics, security operations, and cybersecurity research
              </p>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visibleProjects.map((project) => (
              <Card
                key={project.id}
                className="bg-zinc-900 border-green-600/20 text-white h-full overflow-hidden group"
              >
                <CardContent className="p-6 flex flex-col space-y-4">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-md bg-green-900/20">
                    {project.icon}
                  </div>
                  <h3 className="text-xl font-bold group-hover:text-green-400 transition-colors">
                    <Link href={`/projects/${project.slug}`}>{project.title}</Link>
                  </h3>
                  <p className="text-zinc-400 flex-grow">{project.description}</p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {project.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="border-green-600/50 text-green-500">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="p-6 pt-0">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-green-600/50 text-green-500 hover:bg-green-600 hover:text-white transition-colors"
                  >
                    <Link href={`/projects/${project.slug}`} className="flex items-center w-full justify-center">
                      View Details <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
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
