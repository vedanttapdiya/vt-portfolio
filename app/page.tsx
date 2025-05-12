"use client"

import Link from "next/link"
import { useEffect, useState, useRef } from "react"
import { ArrowRight, Shield, Terminal, FileDigit, Brain, Lock, ChevronDown, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { TypeAnimation } from "react-type-animation"
import { ObfuscatedContact } from "@/components/obfuscated-contact"
import { ContactFormHandler } from "@/components/contact-form-handler"

export default function Home() {
  const { toast } = useToast()
  const router = useRouter()
  const [activeSection, setActiveSection] = useState("home")
  const [scrollY, setScrollY] = useState(0)
  const sectionRefs = {
    home: useRef<HTMLDivElement>(null),
    about: useRef<HTMLDivElement>(null),
    experience: useRef<HTMLDivElement>(null),
    projects: useRef<HTMLDivElement>(null),
    skills: useRef<HTMLDivElement>(null),
    contact: useRef<HTMLDivElement>(null),
  }

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)

      // Determine which section is currently in view
      const currentPosition = window.scrollY + 100

      for (const [section, ref] of Object.entries(sectionRefs)) {
        if (ref.current) {
          const offsetTop = ref.current.offsetTop
          const offsetBottom = offsetTop + ref.current.offsetHeight

          if (currentPosition >= offsetTop && currentPosition < offsetBottom) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId)
    if (section) {
      window.scrollTo({
        top: section.offsetTop - 80,
        behavior: "smooth",
      })
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header/Navigation */}
      <header
        className={`sticky top-0 z-40 w-full border-b backdrop-blur supports-[backdrop-filter]:bg-background/60 ${scrollY > 50 ? "bg-black/95" : "bg-transparent"} transition-all duration-300`}
      >
        <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
          <div className="flex gap-6 md:gap-10">
            <Link href="/" className="flex items-center space-x-2 hover:text-green-500 transition-colors">
              <Shield className="h-6 w-6 text-green-500 hover:scale-110 transition-transform" />
              <span className="inline-block font-bold">Vedant Tapdiya</span>
            </Link>
            <nav className="hidden md:flex gap-6">
              <Link
                href="#home"
                className={`flex items-center text-sm font-medium ${activeSection === "home" ? "text-green-500" : "text-muted-foreground"} hover:text-green-500 transition-colors`}
                onClick={() => scrollToSection("home")}
              >
                Home
              </Link>
              <Link
                href="#about"
                className={`flex items-center text-sm font-medium ${activeSection === "about" ? "text-green-500" : "text-muted-foreground"} hover:text-green-500 transition-colors`}
                onClick={() => scrollToSection("about")}
              >
                About
              </Link>
              <Link
                href="#experience"
                className={`flex items-center text-sm font-medium ${activeSection === "experience" ? "text-green-500" : "text-muted-foreground"} hover:text-green-500 transition-colors`}
                onClick={() => scrollToSection("experience")}
              >
                Experience
              </Link>
              <Link
                href="#projects"
                className={`flex items-center text-sm font-medium ${activeSection === "projects" ? "text-green-500" : "text-muted-foreground"} hover:text-green-500 transition-colors`}
                onClick={() => scrollToSection("projects")}
              >
                Projects
              </Link>
              <Link
                href="#skills"
                className={`flex items-center text-sm font-medium ${activeSection === "skills" ? "text-green-500" : "text-muted-foreground"} hover:text-green-500 transition-colors`}
                onClick={() => scrollToSection("skills")}
              >
                Skills
              </Link>
              <Link
                href="#contact"
                className={`flex items-center text-sm font-medium ${activeSection === "contact" ? "text-green-500" : "text-muted-foreground"} hover:text-green-500 transition-colors`}
                onClick={() => scrollToSection("contact")}
              >
                Contact
              </Link>
            </nav>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <Button
              variant="outline"
              size="sm"
              className="hidden md:flex border-green-600 text-green-500 hover:bg-green-600 hover:text-white transition-colors"
              onClick={() => scrollToSection("contact")}
            >
              Contact Me
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="hidden md:flex hover:bg-zinc-800 transition-colors"
              onClick={() => router.push("/blog")}
            >
              Blog
            </Button>
            <div className="md:hidden">
              <MobileNav scrollToSection={scrollToSection} router={router} />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section
          id="home"
          ref={sectionRefs.home}
          className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-black text-white relative overflow-hidden"
        >
          <div className="container px-4 md:px-6 relative z-10">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <motion.div
                className="flex flex-col justify-center space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">Vedant Tapdiya</h1>
                  <div className="h-8 sm:h-10">
                    <TypeAnimation
                      sequence={[
                        "Cybersecurity Professional",
                        2000,
                        "Digital Forensics Analyst",
                        2000,
                        "Security Operations Specialist",
                        2000,
                        "Incident Response Analyst",
                        2000,
                      ]}
                      wrapper="p"
                      speed={50}
                      className="text-xl text-green-500 font-mono"
                      repeat={Number.POSITIVE_INFINITY}
                    />
                  </div>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Specializing in Digital Forensics and Security Operations with expertise in incident response,
                    threat intelligence, and security monitoring.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button
                    className="bg-green-600 hover:bg-green-700 transition-colors transform hover:scale-105"
                    onClick={() => scrollToSection("contact")}
                  >
                    Get in Touch <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    className="border-green-600 text-green-600 hover:bg-green-950 transition-colors transform hover:scale-105"
                    onClick={() => scrollToSection("projects")}
                  >
                    View Projects <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
              <motion.div
                className="flex items-center justify-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="relative w-full max-w-sm p-4 border rounded-lg bg-black/50 backdrop-blur-sm border-green-600/50 hover:border-green-500 transition-colors">
                  <div className="space-y-2 text-center">
                    <div className="inline-block rounded-full p-2 bg-green-600/10">
                      <Terminal className="h-6 w-6 text-green-600" />
                    </div>
                    <h2 className="text-xl font-bold">Security Operations & Digital Forensics</h2>
                    <p className="text-sm text-muted-foreground">
                      Investigating digital evidence, responding to incidents, and enhancing security posture
                    </p>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2 rounded-md border p-2 hover:bg-green-900/20 transition-colors cursor-pointer">
                      <FileDigit className="h-4 w-4 text-green-600" />
                      <div className="text-xs">Digital Forensics</div>
                    </div>
                    <div className="flex items-center space-x-2 rounded-md border p-2 hover:bg-green-900/20 transition-colors cursor-pointer">
                      <Shield className="h-4 w-4 text-green-600" />
                      <div className="text-xs">Incident Response</div>
                    </div>
                    <div className="flex items-center space-x-2 rounded-md border p-2 hover:bg-green-900/20 transition-colors cursor-pointer">
                      <Brain className="h-4 w-4 text-green-600" />
                      <div className="text-xs">Threat Intelligence</div>
                    </div>
                    <div className="flex items-center space-x-2 rounded-md border p-2 hover:bg-green-900/20 transition-colors cursor-pointer">
                      <Lock className="h-4 w-4 text-green-600" />
                      <div className="text-xs">Security Monitoring</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
          <div className="absolute inset-0 bg-grid-white/5 bg-[size:100px_100px] opacity-10"></div>
          <div className="absolute inset-0 bg-black bg-opacity-80"></div>

          {/* Animated particles */}
          <div className="absolute inset-0 overflow-hidden">
            <CyberParticles />
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <ChevronDown className="h-6 w-6 text-green-500" />
          </div>
        </section>

        {/* About Section */}
        <section id="about" ref={sectionRefs.about} className="w-full py-12 md:py-24 lg:py-32 bg-zinc-950">
          <div className="container px-4 md:px-6">
            <motion.div
              className="flex flex-col items-center justify-center space-y-4 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-green-900/20 px-3 py-1 text-sm text-green-500">About Me</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-white">Professional Summary</h2>
                <p className="max-w-[900px] text-zinc-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Cybersecurity professional with a strong background in Digital Forensics and Incident Response (DFIR),
                  now transitioning into Security Operations (SOC). Experienced in forensic investigations, incident
                  handling, event correlation and log analysis, with a growing focus on SIEM, threat intelligence, and
                  security monitoring.
                </p>
              </div>
            </motion.div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
              <motion.div
                className="flex flex-col justify-center space-y-4"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold tracking-tighter text-white">Education</h3>
                  <ul className="space-y-4">
                    <li className="border-l-2 border-green-600 pl-4 hover:border-green-400 hover:bg-green-900/20 hover:scale-[1.05] hover:shadow-xl hover:shadow-green-900/40 p-2 rounded-md transition-all duration-300 hover:z-10">
                      <h4 className="text-xl font-semibold text-white">
                        B.Tech in Computer Science and Engineering (Cyber Security)
                      </h4>
                      <p className="text-zinc-400">
                        G. H. Raisoni College of Engineering and Management, Pune | 2021 - 2025 | CGPA: 7.55
                      </p>
                    </li>
                    <li className="border-l-2 border-green-600 pl-4 hover:border-green-400 hover:bg-green-900/20 hover:scale-[1.05] hover:shadow-xl hover:shadow-green-900/40 p-2 rounded-md transition-all duration-300 hover:z-10">
                      <h4 className="text-xl font-semibold text-white">
                        Computer Science - Senior Secondary Education (10+2)
                      </h4>
                      <p className="text-zinc-400">
                        Shivaji Junior College of Science and Arts, Hingoli | 2020 - 2021 | 89.33%
                      </p>
                    </li>
                  </ul>
                </div>
              </motion.div>
              <motion.div
                className="flex flex-col justify-center space-y-4"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold tracking-tighter text-white">Leadership & Contributions</h3>
                  <ul className="space-y-4">
                    <li className="border-l-2 border-green-600 pl-4 hover:border-green-400 hover:bg-green-900/20 hover:scale-[1.05] hover:shadow-xl hover:shadow-green-900/40 p-2 rounded-md transition-all duration-300 hover:z-10">
                      <h4 className="text-xl font-semibold text-white">
                        Former President, Society of Cyber Security Advancement and Data Science Excellence (SCADE)
                      </h4>
                      <p className="text-zinc-400">
                        Led the official departmental club for Cyber Security and Data Science at GHRCEM Pune
                      </p>
                    </li>
                    <li className="border-l-2 border-green-600 pl-4 hover:border-green-400 hover:bg-green-900/20 hover:scale-[1.05] hover:shadow-xl hover:shadow-green-900/40 p-2 rounded-md transition-all duration-300 hover:z-10">
                      <h4 className="text-xl font-semibold text-white">Volunteer, Nullcon</h4>
                      <p className="text-zinc-400">
                        Assisted in organizing and managing one of India's premier cybersecurity conferences
                      </p>
                    </li>
                    <li className="border-l-2 border-green-600 pl-4 hover:border-green-400 hover:bg-green-900/20 hover:scale-[1.05] hover:shadow-xl hover:shadow-green-900/40 p-2 rounded-md transition-all duration-300 hover:z-10">
                      <h4 className="text-xl font-semibold text-white">Coordinator, Training and Placement Cell</h4>
                      <p className="text-zinc-400">Facilitated recruitment partnerships at GHRCEM Pune</p>
                    </li>
                  </ul>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Experience Section */}
        <section id="experience" ref={sectionRefs.experience} className="w-full py-12 md:py-24 lg:py-32 bg-black">
          <div className="container px-4 md:px-6">
            <motion.div
              className="flex flex-col items-center justify-center space-y-4 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-green-900/20 px-3 py-1 text-sm text-green-500">
                  Experience
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-white">Professional Experience</h2>
                <p className="max-w-[900px] text-zinc-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  My journey in cybersecurity, digital forensics, and incident response
                </p>
              </div>
            </motion.div>
            <div className="mx-auto grid max-w-5xl gap-8 py-12">
              <div className="overflow-visible">
                <motion.div
                  className="relative pl-8 border-l-2 border-green-600 hover:border-green-400 hover:bg-green-900/20 p-2 rounded-md transition-all duration-300 hover:z-20 transform-gpu"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  style={{
                    transformOrigin: "center left",
                  }}
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 20px 25px -5px rgba(0, 128, 0, 0.1), 0 10px 10px -5px rgba(0, 128, 0, 0.04)",
                    transition: { duration: 0.3 },
                  }}
                >
                  <div className="absolute w-4 h-4 bg-green-600 rounded-full -left-[9px] top-1"></div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold tracking-tighter text-white">
                        Digital Forensics and Incident Response Analyst
                      </h3>
                      <Badge className="bg-green-600">July 2024 - January 2025</Badge>
                    </div>
                    <p className="text-zinc-300">Cyint Technologies [ New Delhi, India ]</p>
                    <ul className="space-y-2 text-zinc-400 list-disc pl-5">
                      <li>
                        Assisted the Income Tax Department in digital forensic operations during high-profile financial
                        fraud investigations.
                      </li>
                      <li>
                        Performed forensic imaging and live data acquisition from seized devices using TX1, TD4, FTK
                        Toolkit, Magnet Axiom, Cellebrite UFED, and MSAB XRY.
                      </li>
                      <li>
                        Conducted forensic analysis on cloud platforms (AWS, Google Cloud, OneDrive) using specialized
                        extraction techniques.
                      </li>
                      <li>
                        Utilized iSCSI protocol-based acquisitions for network storage arrays, RAID systems and
                        enterprise servers, ensuring minimal data loss.
                      </li>
                      <li>
                        Provided on-site technical support and deployment of forensic workstations and servers,
                        configuring specialized forensic software and storage solutions.
                      </li>
                    </ul>
                  </div>
                </motion.div>
              </div>
              <div className="overflow-visible">
                <motion.div
                  className="relative pl-8 border-l-2 border-green-600 hover:border-green-400 hover:bg-green-900/20 p-2 rounded-md transition-all duration-300 hover:z-20 transform-gpu"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  style={{
                    transformOrigin: "center left",
                  }}
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 20px 25px -5px rgba(0, 128, 0, 0.1), 0 10px 10px -5px rgba(0, 128, 0, 0.04)",
                    transition: { duration: 0.3 },
                  }}
                >
                  <div className="absolute w-4 h-4 bg-green-600 rounded-full -left-[9px] top-1"></div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold tracking-tighter text-white">Junior Cyber Crime Investigator</h3>
                      <Badge className="bg-green-600">June 2023 - February 2024</Badge>
                    </div>
                    <p className="text-zinc-300">Maharashtra Police Cyber Crime Department [ Maharashtra, India ]</p>
                    <ul className="space-y-2 text-zinc-400 list-disc pl-5">
                      <li>
                        Assisted senior investigators in analyzing cyber crime cases, including financial fraud,
                        identity theft, and phishing attacks.
                      </li>
                      <li>
                        Conducted preliminary CDR (Call Detail Record) and IPDR (Internet Protocol Detail Record)
                        analysis to identify digital footprints and support investigations.
                      </li>
                      <li>
                        Performed crime pattern analysis, identifying trends and linking digital evidence to ongoing
                        investigations.
                      </li>
                      <li>
                        Utilized OSINT (Open Source Intelligence) and Darknet Intelligence (DARKINT) techniques to
                        gather and analyze actionable intelligence for cyber crime investigations.
                      </li>
                      <li>
                        Supported crime reporting and documentation, ensuring detailed and accurate case records for
                        legal proceedings.
                      </li>
                    </ul>
                  </div>
                </motion.div>
              </div>
              <div className="overflow-visible">
                <motion.div
                  className="relative pl-8 border-l-2 border-green-600 hover:border-green-400 hover:bg-green-900/20 p-2 rounded-md transition-all duration-300 hover:z-20 transform-gpu"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  style={{
                    transformOrigin: "center left",
                  }}
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 20px 25px -5px rgba(0, 128, 0, 0.1), 0 10px 10px -5px rgba(0, 128, 0, 0.04)",
                    transition: { duration: 0.3 },
                  }}
                >
                  <div className="absolute w-4 h-4 bg-green-600 rounded-full -left-[9px] top-1"></div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold tracking-tighter text-white">Cyber Security Intern</h3>
                      <Badge className="bg-green-600">June 2022 - July 2022</Badge>
                    </div>
                    <p className="text-zinc-300">
                      Gurugram Police Cyber Security Summer Internship [ Gurugram, India ]
                    </p>
                    <ul className="space-y-2 text-zinc-400 list-disc pl-5">
                      <li>
                        Participated in a prestigious one-month internship program organized by Haryana Police and Dr.
                        Rakshit Tandon, focusing on cyber crime investigations.
                      </li>
                      <li>
                        Developed a tool for Twitter Hashtags & Sentiment Analysis using Python and NLP techniques,
                        which received an A+ grade and was adopted by the department.
                      </li>
                      <li>
                        Received training from over 20+ industry professionals and law enforcement officers,
                        specializing in cutting-edge Cyber Security techniques.
                      </li>
                      <li>
                        Focused on Cyber Crimes and investigations, developing a solid understanding of the field.
                      </li>
                      <li>
                        Collaborated on various initiatives as a Cyber Crime Incident Responder and Investigator under
                        the guidance of Dr. Rakshit Tandon.
                      </li>
                    </ul>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" ref={sectionRefs.projects} className="w-full py-12 md:py-24 lg:py-32 bg-zinc-950">
          <div className="container px-4 md:px-6">
            <motion.div
              className="flex flex-col items-center justify-center space-y-4 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-green-900/20 px-3 py-1 text-sm text-green-500">Projects</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-white">Featured Projects</h2>
                <p className="max-w-[900px] text-zinc-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Showcasing my technical expertise and problem-solving abilities
                </p>
              </div>
            </motion.div>
            <div className="mx-auto grid max-w-5xl gap-8 py-12 md:grid-cols-2 lg:grid-cols-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                whileHover={{ y: -5 }}
              >
                <Card className="bg-zinc-900 border-green-600/20 text-white h-full overflow-hidden group hover:border-green-500 transition-all">
                  <CardContent className="p-6 flex flex-col space-y-4">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-md bg-green-900/20 group-hover:bg-green-900/40 transition-colors">
                      <Lock className="h-6 w-6 text-green-500" />
                    </div>
                    <h3 className="text-xl font-bold group-hover:text-green-400 transition-colors">
                      Blockchain-Based Facial Sign-On (FSO) Library
                    </h3>
                    <p className="text-zinc-400">
                      Research-oriented decentralized authentication library utilizing blockchain for secure and
                      privacy-preserving facial recognition.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge
                        variant="outline"
                        className="border-green-600/50 text-green-500 hover:bg-green-900/30 transition-colors"
                      >
                        Python
                      </Badge>
                      <Badge
                        variant="outline"
                        className="border-green-600/50 text-green-500 hover:bg-green-900/30 transition-colors"
                      >
                        Python
                      </Badge>
                      <Badge
                        variant="outline"
                        className="border-green-600/50 text-green-500 hover:bg-green-900/30 transition-colors"
                      >
                        TensorFlow
                      </Badge>
                      <Badge
                        variant="outline"
                        className="border-green-600/50 text-green-500 hover:bg-green-900/30 transition-colors"
                      >
                        Solidity
                      </Badge>
                      <Badge
                        variant="outline"
                        className="border-green-600/50 text-green-500 hover:bg-green-900/30 transition-colors"
                      >
                        Ethereum
                      </Badge>
                      <Badge
                        variant="outline"
                        className="border-green-600/50 text-green-500 hover:bg-green-900/30 transition-colors"
                      >
                        Flask
                      </Badge>
                    </div>
                    <div className="mt-auto pt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full border-green-600/50 text-green-500 hover:bg-green-600 hover:text-white transition-colors"
                        onClick={() => router.push("/projects/blockchain-fso")}
                      >
                        View Details <ExternalLink className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className="bg-zinc-900 border-green-600/20 text-white h-full overflow-hidden group hover:border-green-500 transition-all">
                  <CardContent className="p-6 flex flex-col space-y-4">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-md bg-green-900/20 group-hover:bg-green-900/40 transition-colors">
                      <FileDigit className="h-6 w-6 text-green-500" />
                    </div>
                    <h3 className="text-xl font-bold group-hover:text-green-400 transition-colors">
                      Forensics Memory Acquisition Tool
                    </h3>
                    <p className="text-zinc-400">
                      Developed RAMhound, a cross-platform memory acquisition tool enabling forensic acquisition of
                      volatile memory across Windows, Linux, and macOS.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge
                        variant="outline"
                        className="border-green-600/50 text-green-500 hover:bg-green-900/30 transition-colors"
                      >
                        Python
                      </Badge>
                      <Badge
                        variant="outline"
                        className="border-green-600/50 text-green-500 hover:bg-green-900/30 transition-colors"
                      >
                        WinAPI
                      </Badge>
                      <Badge
                        variant="outline"
                        className="border-green-600/50 text-green-500 hover:bg-green-900/30 transition-colors"
                      >
                        Libpcap
                      </Badge>
                      <Badge
                        variant="outline"
                        className="border-green-600/50 text-green-500 hover:bg-green-900/30 transition-colors"
                      >
                        OpenSSL
                      </Badge>
                    </div>
                    <div className="mt-auto pt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full border-green-600/50 text-green-500 hover:bg-green-600 hover:text-white transition-colors"
                        onClick={() => router.push("/projects/ramhound")}
                      >
                        View Details <ExternalLink className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                whileHover={{ y: -5 }}
              >
                <Card className="bg-zinc-900 border-green-600/20 text-white h-full overflow-hidden group hover:border-green-500 transition-all">
                  <CardContent className="p-6 flex flex-col space-y-4">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-md bg-green-900/20 group-hover:bg-green-900/40 transition-colors">
                      <Brain className="h-6 w-6 text-green-500" />
                    </div>
                    <h3 className="text-xl font-bold group-hover:text-green-400 transition-colors">
                      Twitter Hashtags & Sentiment Analysis Tool
                    </h3>
                    <p className="text-zinc-400">
                      Engineered a Python-based sentiment analysis tool to analyze Twitter hashtags in real-time,
                      assisting law enforcement in monitoring public sentiment.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge
                        variant="outline"
                        className="border-green-600/50 text-green-500 hover:bg-green-900/30 transition-colors"
                      >
                        Python
                      </Badge>
                      <Badge
                        variant="outline"
                        className="border-green-600/50 text-green-500 hover:bg-green-900/30 transition-colors"
                      >
                        NLTK
                      </Badge>
                      <Badge
                        variant="outline"
                        className="border-green-600/50 text-green-500 hover:bg-green-900/30 transition-colors"
                      >
                        Tweepy
                      </Badge>
                      <Badge
                        variant="outline"
                        className="border-green-600/50 text-green-500 hover:bg-green-900/30 transition-colors"
                      >
                        Pandas
                      </Badge>
                      <Badge
                        variant="outline"
                        className="border-green-600/50 text-green-500 hover:bg-green-900/30 transition-colors"
                      >
                        Matplotlib
                      </Badge>
                    </div>
                    <div className="mt-auto pt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full border-green-600/50 text-green-500 hover:bg-green-600 hover:text-white transition-colors"
                        onClick={() => router.push("/projects/twitter-sentiment")}
                      >
                        View Details <ExternalLink className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
            <div className="flex justify-center mt-8">
              <Button
                className="bg-green-600 hover:bg-green-700 transition-colors transform hover:scale-105"
                onClick={() => router.push("/projects")}
              >
                View All Projects <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" ref={sectionRefs.skills} className="w-full py-12 md:py-24 lg:py-32 bg-black">
          <div className="container px-4 md:px-6">
            <motion.div
              className="flex flex-col items-center justify-center space-y-4 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-green-900/20 px-3 py-1 text-sm text-green-500">Skills</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-white">Skills & Certifications</h2>
                <p className="max-w-[900px] text-zinc-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Technical expertise and professional qualifications
                </p>
              </div>
            </motion.div>
            <motion.div
              className="mx-auto max-w-5xl py-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Tabs defaultValue="skills" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-zinc-900">
                  <TabsTrigger
                    value="skills"
                    className="data-[state=active]:bg-green-900 data-[state=active]:text-white hover:text-green-400 transition-colors"
                  >
                    Skills
                  </TabsTrigger>
                  <TabsTrigger
                    value="certifications"
                    className="data-[state=active]:bg-green-900 data-[state=active]:text-white hover:text-green-400 transition-colors"
                  >
                    Certifications
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="skills" className="p-4 bg-zinc-900 rounded-b-lg">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold text-white">Digital Forensics & Incident Response</h3>
                      <div className="flex flex-wrap gap-2">
                        <Badge className="bg-green-900/50 text-green-400 hover:bg-green-800/70 transition-colors">
                          Disk Forensics
                        </Badge>
                        <Badge className="bg-green-900/50 text-green-400 hover:bg-green-800/70 transition-colors">
                          Mobile Forensics
                        </Badge>
                        <Badge className="bg-green-900/50 text-green-400 hover:bg-green-800/70 transition-colors">
                          Network Forensics
                        </Badge>
                        <Badge className="bg-green-900/50 text-green-400 hover:bg-green-800/70 transition-colors">
                          Cloud Forensics
                        </Badge>
                        <Badge className="bg-green-900/50 text-green-400 hover:bg-green-800/70 transition-colors">
                          Memory Forensics
                        </Badge>
                        <Badge className="bg-green-900/50 text-green-400 hover:bg-green-800/70 transition-colors">
                          Email Forensics
                        </Badge>
                        <Badge className="bg-green-900/50 text-green-400 hover:bg-green-800/70 transition-colors">
                          Multimedia Forensics
                        </Badge>
                        <Badge className="bg-green-900/50 text-green-400 hover:bg-green-800/70 transition-colors">
                          Evidence Acquisition
                        </Badge>
                        <Badge className="bg-green-900/50 text-green-400 hover:bg-green-800/70 transition-colors">
                          Registry Analysis
                        </Badge>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold text-white">Forensics & Investigation Tools</h3>
                      <div className="flex flex-wrap gap-2">
                        <Badge className="bg-green-900/50 text-green-400 hover:bg-green-800/70 transition-colors">
                          Magnet Axiom Cyber
                        </Badge>
                        <Badge className="bg-green-900/50 text-green-400 hover:bg-green-800/70 transition-colors">
                          Cellebrite UFED
                        </Badge>
                        <Badge className="bg-green-900/50 text-green-400 hover:bg-green-800/70 transition-colors">
                          F-Response
                        </Badge>
                        <Badge className="bg-green-900/50 text-green-400 hover:bg-green-800/70 transition-colors">
                          FTK Toolkit
                        </Badge>
                        <Badge className="bg-green-900/50 text-green-400 hover:bg-green-800/70 transition-colors">
                          MSAB XRY
                        </Badge>
                        <Badge className="bg-green-900/50 text-green-400 hover:bg-green-800/70 transition-colors">
                          OSForensics
                        </Badge>
                        <Badge className="bg-green-900/50 text-green-400 hover:bg-green-800/70 transition-colors">
                          Belkasoft
                        </Badge>
                        <Badge className="bg-green-900/50 text-green-400 hover:bg-green-800/70 transition-colors">
                          Forensic Explorer
                        </Badge>
                        <Badge className="bg-green-900/50 text-green-400 hover:bg-green-800/70 transition-colors">
                          Velociraptor
                        </Badge>
                        <Badge className="bg-green-900/50 text-green-400 hover:bg-green-800/70 transition-colors">
                          Wireshark
                        </Badge>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold text-white">Security Operations & Threat Intelligence</h3>
                      <div className="flex flex-wrap gap-2">
                        <Badge className="bg-green-900/50 text-green-400 hover:bg-green-800/70 transition-colors">
                          SIEM
                        </Badge>
                        <Badge className="bg-green-900/50 text-green-400 hover:bg-green-800/70 transition-colors">
                          Log Analysis
                        </Badge>
                        <Badge className="bg-green-900/50 text-green-400 hover:bg-green-800/70 transition-colors">
                          Incident Handling
                        </Badge>
                        <Badge className="bg-green-900/50 text-green-400 hover:bg-green-800/70 transition-colors">
                          Threat Intelligence
                        </Badge>
                        <Badge className="bg-green-900/50 text-green-400 hover:bg-green-800/70 transition-colors">
                          Event Correlation
                        </Badge>
                        <Badge className="bg-green-900/50 text-green-400 hover:bg-green-800/70 transition-colors">
                          Security Monitoring
                        </Badge>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold text-white">Programming & Scripting</h3>
                      <div className="flex flex-wrap gap-2">
                        <Badge className="bg-green-900/50 text-green-400 hover:bg-green-800/70 transition-colors">
                          Python
                        </Badge>
                        <Badge className="bg-green-900/50 text-green-400 hover:bg-green-800/70 transition-colors">
                          Bash
                        </Badge>
                        <Badge className="bg-green-900/50 text-green-400 hover:bg-green-800/70 transition-colors">
                          C++
                        </Badge>
                        <Badge className="bg-green-900/50 text-green-400 hover:bg-green-800/70 transition-colors">
                          Java
                        </Badge>
                        <Badge className="bg-green-900/50 text-green-400 hover:bg-green-800/70 transition-colors">
                          KQL
                        </Badge>
                        <Badge className="bg-green-900/50 text-green-400 hover:bg-green-800/70 transition-colors">
                          YARA Rules
                        </Badge>
                        <Badge className="bg-green-900/50 text-green-400 hover:bg-green-800/70 transition-colors">
                          Sigma Rules
                        </Badge>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="certifications" className="p-4 bg-zinc-900 rounded-b-lg">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                      <ul className="space-y-4">
                        <li className="flex items-start gap-2 group hover:bg-zinc-800/30 p-2 rounded-md transition-colors">
                          <div className="mt-1 h-2 w-2 rounded-full bg-green-500 group-hover:animate-pulse"></div>
                          <div>
                            <h4 className="font-semibold text-white group-hover:text-green-400 transition-colors">
                              Certified in Cybersecurity (CC)
                            </h4>
                            <p className="text-zinc-400">ISC²</p>
                          </div>
                        </li>
                        <li className="flex items-start gap-2 group hover:bg-zinc-800/30 p-2 rounded-md transition-colors">
                          <div className="mt-1 h-2 w-2 rounded-full bg-green-500 group-hover:animate-pulse"></div>
                          <div>
                            <h4 className="font-semibold text-white group-hover:text-green-400 transition-colors">
                              Practical Ethical Hacking (PEH)
                            </h4>
                            <p className="text-zinc-400">TCM Academy</p>
                          </div>
                        </li>
                        <li className="flex items-start gap-2 group hover:bg-zinc-800/30 p-2 rounded-md transition-colors">
                          <div className="mt-1 h-2 w-2 rounded-full bg-green-500 group-hover:animate-pulse"></div>
                          <div>
                            <h4 className="font-semibold text-white group-hover:text-green-400 transition-colors">
                              Practical Malware Analysis & Triage (PMAT)
                            </h4>
                            <p className="text-zinc-400">TCM Academy</p>
                          </div>
                        </li>
                        <li className="flex items-start gap-2 group hover:bg-zinc-800/30 p-2 rounded-md transition-colors">
                          <div className="mt-1 h-2 w-2 rounded-full bg-green-500 group-hover:animate-pulse"></div>
                          <div>
                            <h4 className="font-semibold text-white group-hover:text-green-400 transition-colors">
                              Digital Forensics Essentials (DFE)
                            </h4>
                            <p className="text-zinc-400">EC-Council</p>
                          </div>
                        </li>
                        <li className="flex items-start gap-2 group hover:bg-zinc-800/30 p-2 rounded-md transition-colors">
                          <div className="mt-1 h-2 w-2 rounded-full bg-green-500 group-hover:animate-pulse"></div>
                          <div>
                            <h4 className="font-semibold text-white group-hover:text-green-400 transition-colors">
                              Ethical Hacking Essentials (EHE)
                            </h4>
                            <p className="text-zinc-400">EC-Council</p>
                          </div>
                        </li>
                      </ul>
                    </div>
                    <div className="space-y-4">
                      <ul className="space-y-4">
                        <li className="flex items-start gap-2 group hover:bg-zinc-800/30 p-2 rounded-md transition-colors">
                          <div className="mt-1 h-2 w-2 rounded-full bg-green-500 group-hover:animate-pulse"></div>
                          <div>
                            <h4 className="font-semibold text-white group-hover:text-green-400 transition-colors">
                              Virtual Industrial Control Systems Cybersecurity (301v)
                            </h4>
                            <p className="text-zinc-400">CISA</p>
                          </div>
                        </li>
                        <li className="flex items-start gap-2 group hover:bg-zinc-800/30 p-2 rounded-md transition-colors">
                          <div className="mt-1 h-2 w-2 rounded-full bg-green-500 group-hover:animate-pulse"></div>
                          <div>
                            <h4 className="font-semibold text-white group-hover:text-green-400 transition-colors">
                              Introduction to KQL for Security Analysis
                            </h4>
                            <p className="text-zinc-400">Blu Raven Academy</p>
                          </div>
                        </li>
                        <li className="flex items-start gap-2 group hover:bg-zinc-800/30 p-2 rounded-md transition-colors">
                          <div className="mt-1 h-2 w-2 rounded-full bg-green-500 group-hover:animate-pulse"></div>
                          <div>
                            <h4 className="font-semibold text-white group-hover:text-green-400 transition-colors">
                              Splunk Fundamentals
                            </h4>
                            <p className="text-zinc-400">Splunk Academy</p>
                          </div>
                        </li>
                        <li className="flex items-start gap-2 group hover:bg-zinc-800/30 p-2 rounded-md transition-colors">
                          <div className="mt-1 h-2 w-2 rounded-full bg-green-500 group-hover:animate-pulse"></div>
                          <div>
                            <h4 className="font-semibold text-white group-hover:text-green-400 transition-colors">
                              Cyber Threat Intelligence 101
                            </h4>
                            <p className="text-zinc-400">arcX</p>
                          </div>
                        </li>
                        <li className="flex items-start gap-2 group hover:bg-zinc-800/30 p-2 rounded-md transition-colors">
                          <div className="mt-1 h-2 w-2 rounded-full bg-green-500 group-hover:animate-pulse"></div>
                          <div>
                            <h4 className="font-semibold text-white group-hover:text-green-400 transition-colors">
                              Android Forensics with Belkasoft
                            </h4>
                            <p className="text-zinc-400">Belkasoft Academy</p>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" ref={sectionRefs.contact} className="w-full py-12 md:py-24 lg:py-32 bg-zinc-950">
          <div className="container px-4 md:px-6">
            <motion.div
              className="flex flex-col items-center justify-center space-y-4 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-green-900/20 px-3 py-1 text-sm text-green-500">Contact</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-white">Get In Touch</h2>
                <p className="max-w-[900px] text-zinc-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Let's connect and discuss how I can contribute to your cybersecurity needs
                </p>
              </div>
            </motion.div>
            <div className="mx-auto grid max-w-5xl gap-8 py-12 md:grid-cols-2">
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold tracking-tighter text-white">Contact Information</h3>
                  <p className="text-zinc-400">Feel free to reach out through any of these channels</p>
                </div>

                <div className="flex items-center gap-2 group hover:bg-zinc-900/50 p-2 rounded-md transition-colors">
                  <div className="h-10 w-10 rounded-full bg-green-900/20 flex items-center justify-center group-hover:bg-green-900/40 transition-colors">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-green-500"
                      aria-hidden="true"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-zinc-400">Phone</p>
                    <ObfuscatedContact
                      type="phone"
                      value="7840960231"
                      className="font-medium text-white hover:text-green-400 transition-colors"
                      id="phone-contact"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 group hover:bg-zinc-900/50 p-2 rounded-md transition-colors">
                  <div className="h-10 w-10 rounded-full bg-green-900/20 flex items-center justify-center group-hover:bg-green-900/40 transition-colors">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-green-500"
                      aria-hidden="true"
                    >
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-zinc-400">Email</p>
                    <ObfuscatedContact
                      type="email"
                      value="contact@vedanttapdiya.me"
                      className="font-medium text-white hover:text-green-400 transition-colors"
                      id="email-contact"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 group hover:bg-zinc-900/50 p-2 rounded-md transition-colors">
                  <div className="h-10 w-10 rounded-full bg-green-900/20 flex items-center justify-center group-hover:bg-green-900/40 transition-colors">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-green-500"
                    >
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                      <rect width="4" height="12" x="2" y="9" />
                      <circle cx="4" cy="4" r="2" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-zinc-400">LinkedIn</p>
                    <a
                      href="https://linkedin.com/in/vedanttapdiya"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-white hover:text-green-400 transition-colors"
                    >
                      in/vedanttapdiya
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-2 group hover:bg-zinc-900/50 p-2 rounded-md transition-colors">
                  <div className="h-10 w-10 rounded-full bg-green-900/20 flex items-center justify-center group-hover:bg-green-900/40 transition-colors">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-green-500"
                    >
                      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                      <path d="M9 18c-4.51 2-5-2-7-2" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-zinc-400">GitHub</p>
                    <a
                      href="https://github.com/vedanttapdiya"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-white hover:text-green-400 transition-colors"
                    >
                      github.com/vedanttapdiya
                    </a>
                  </div>
                </div>
              </motion.div>
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <ContactFormHandler />
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-zinc-800 bg-black py-6">
        <div className="container flex flex-col items-center justify-center gap-4 px-4 md:px-6 md:flex-row md:justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 hover:text-green-500 transition-colors">
              <Shield className="h-6 w-6 text-green-500 hover:scale-110 transition-transform" />
              <span className="text-lg font-bold text-white hover:text-green-500 transition-colors">
                Vedant Tapdiya
              </span>
            </Link>
          </div>
          <p className="text-center text-sm text-zinc-400 md:text-left">
            © {new Date().getFullYear()} Vedant Tapdiya. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a
              href="https://linkedin.com/in/vedanttapdiya"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-white transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect width="4" height="12" x="2" y="9" />
                <circle cx="4" cy="4" r="2" />
              </svg>
              <span className="sr-only">LinkedIn</span>
            </a>
            <a
              href="https://github.com/vedanttapdiya"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-white transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                <path d="M9 18c-4.51 2-5-2-7-2" />
              </svg>
              <span className="sr-only">GitHub</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

// Mobile Navigation Component
function MobileNav({ scrollToSection, router }: { scrollToSection: (section: string) => void; router: any }) {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const handleNavClick = (section: string) => {
    scrollToSection(section)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleMenu}
        aria-label="Toggle menu"
        className="hover:bg-zinc-800 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-6 w-6"
        >
          {isOpen ? <path d="M18 6 6 18M6 6l12 12" /> : <path d="M4 12h16M4 6h16M4 18h16" />}
        </svg>
      </Button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md bg-zinc-900 border border-zinc-800 shadow-lg z-50">
          <div className="py-1">
            <button
              onClick={() => handleNavClick("home")}
              className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-zinc-800 hover:text-green-500 transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick("about")}
              className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-zinc-800 hover:text-green-500 transition-colors"
            >
              About
            </button>
            <button
              onClick={() => handleNavClick("experience")}
              className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-zinc-800 hover:text-green-500 transition-colors"
            >
              Experience
            </button>
            <button
              onClick={() => handleNavClick("projects")}
              className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-zinc-800 hover:text-green-500 transition-colors"
            >
              Projects
            </button>
            <button
              onClick={() => handleNavClick("skills")}
              className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-zinc-800 hover:text-green-500 transition-colors"
            >
              Skills
            </button>
            <button
              onClick={() => handleNavClick("contact")}
              className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-zinc-800 hover:text-green-500 transition-colors"
            >
              Contact
            </button>

            <button
              onClick={() => {
                router.push("/blog")
                setIsOpen(false)
              }}
              className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-zinc-800 hover:text-green-500 transition-colors"
            >
              Blog
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// Cyber Particles Animation Component
function CyberParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    setCanvasDimensions()
    window.addEventListener("resize", setCanvasDimensions)

    // Particle class
    class Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      color: string

      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 3 + 1
        this.speedX = (Math.random() - 0.5) * 0.5
        this.speedY = (Math.random() - 0.5) * 0.5
        this.color = `rgba(0, ${Math.floor(Math.random() * 100) + 155}, 0, ${Math.random() * 0.5 + 0.2})`
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY

        if (this.x > canvas.width) this.x = 0
        else if (this.x < 0) this.x = canvas.width

        if (this.y > canvas.height) this.y = 0
        else if (this.y < 0) this.y = canvas.height
      }

      draw() {
        if (!ctx) return
        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    // Create particles
    const particles: Particle[] = []
    const particleCount = Math.min(100, Math.floor((window.innerWidth * window.innerHeight) / 10000))

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle())
    }

    // Animation loop
    const animate = () => {
      if (!ctx) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update and draw particles
      particles.forEach((particle) => {
        particle.update()
        particle.draw()
      })

      // Draw connections
      ctx.strokeStyle = "rgba(0, 255, 0, 0.05)"
      ctx.lineWidth = 0.5

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 100) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 z-0" />
}
