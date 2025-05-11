"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Calendar, User, Tag, Clock, Share2, Bookmark, ThumbsUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"

// Sample blog post data
const blogPostsData = {
  "understanding-digital-forensics": {
    title: "Understanding Digital Forensics: A Comprehensive Guide",
    excerpt:
      "Digital forensics is the process of uncovering and interpreting electronic data. Learn about the key techniques and tools used in modern digital investigations.",
    date: "August 15, 2023",
    author: "Vedant Tapdiya",
    readTime: "8 min read",
    tags: ["Digital Forensics", "Cybersecurity", "Investigation"],
    content: `
      <h2>Introduction to Digital Forensics</h2>
      <p>Digital forensics is a branch of forensic science that focuses on the recovery and investigation of material found in digital devices. It's often used in relation to computer crime, but it can also be used in civil proceedings. The goal of digital forensics is to examine digital media in a forensically sound manner to identify, preserve, recover, analyze, and present facts about the digital information.</p>
      
      <p>As our world becomes increasingly digital, the importance of digital forensics continues to grow. From criminal investigations to corporate security incidents, digital evidence plays a crucial role in uncovering the truth.</p>
      
      <h2>The Digital Forensics Process</h2>
      <p>The digital forensics process typically follows these key steps:</p>
      
      <h3>1. Identification</h3>
      <p>The first step involves identifying potential sources of digital evidence. This could include computers, mobile devices, storage media, cloud accounts, and network logs. Proper identification ensures that no potential evidence is overlooked.</p>
      
      <h3>2. Preservation</h3>
      <p>Once evidence sources are identified, they must be properly preserved to prevent any alteration or destruction. This often involves creating forensic images (bit-by-bit copies) of storage media, documenting the chain of custody, and ensuring that all evidence handling follows proper legal procedures.</p>
      
      <h3>3. Analysis</h3>
      <p>The analysis phase involves examining the preserved evidence to uncover relevant information. This might include recovering deleted files, analyzing system logs, examining browser history, or reconstructing user activities. Specialized forensic tools and techniques are used to extract and interpret the data.</p>
      
      <h3>4. Documentation</h3>
      <p>Throughout the process, detailed documentation is maintained to record all actions taken, findings discovered, and methodologies used. This documentation is crucial for establishing the credibility of the evidence and the investigation process.</p>
      
      <h3>5. Presentation</h3>
      <p>The final step involves presenting the findings in a clear, understandable manner. This might be in the form of a written report, expert testimony in court, or a presentation to stakeholders. The presentation must be accurate, objective, and accessible to non-technical audiences.</p>
      
      <h2>Key Digital Forensics Specializations</h2>
      
      <h3>Computer Forensics</h3>
      <p>Computer forensics focuses on extracting evidence from computers and storage media. This includes recovering deleted files, analyzing system artifacts, examining email communications, and reconstructing user activities.</p>
      
      <h3>Mobile Device Forensics</h3>
      <p>With the ubiquity of smartphones and tablets, mobile device forensics has become increasingly important. This specialization deals with extracting and analyzing data from mobile devices, including call logs, text messages, location data, and app usage.</p>
      
      <h3>Network Forensics</h3>
      <p>Network forensics involves capturing and analyzing network traffic and logs to investigate security incidents. This can help identify unauthorized access, data exfiltration, or malicious activities on a network.</p>
      
      <h3>Memory Forensics</h3>
      <p>Memory forensics focuses on analyzing the volatile memory (RAM) of a system. This can reveal running processes, open network connections, encryption keys, and malware that might not be visible on disk.</p>
      
      <h3>Cloud Forensics</h3>
      <p>As data increasingly moves to the cloud, cloud forensics has emerged as a critical specialization. This involves investigating data stored in cloud services, which presents unique challenges related to data jurisdiction, access, and preservation.</p>
      
      <h2>Tools of the Trade</h2>
      <p>Digital forensics professionals rely on a variety of specialized tools to conduct their investigations:</p>
      
      <ul>
        <li><strong>Forensic Imaging Tools:</strong> EnCase, FTK Imager, and dd are used to create forensic images of storage media.</li>
        <li><strong>Analysis Suites:</strong> Tools like Autopsy, X-Ways Forensics, and SANS SIFT provide comprehensive analysis capabilities.</li>
        <li><strong>Mobile Forensics Tools:</strong> Cellebrite UFED, Oxygen Forensic Detective, and Magnet AXIOM are specialized for mobile device investigations.</li>
        <li><strong>Memory Analysis Tools:</strong> Volatility Framework and Rekall allow for the examination of memory dumps.</li>
        <li><strong>Network Analysis Tools:</strong> Wireshark, NetworkMiner, and Snort help analyze network traffic and detect anomalies.</li>
      </ul>
      
      <h2>Challenges in Digital Forensics</h2>
      
      <h3>Anti-Forensics Techniques</h3>
      <p>Sophisticated adversaries may employ anti-forensics techniques to hinder investigations. These include data encryption, secure deletion tools, timestamp manipulation, and steganography (hiding data within other files).</p>
      
      <h3>Evolving Technology</h3>
      <p>The rapid pace of technological change presents ongoing challenges. New devices, operating systems, applications, and storage methods require continuous adaptation of forensic techniques and tools.</p>
      
      <h3>Legal and Jurisdictional Issues</h3>
      <p>Digital investigations often cross jurisdictional boundaries, raising complex legal questions about evidence collection, privacy laws, and admissibility in court.</p>
      
      <h3>Data Volume</h3>
      <p>The sheer volume of data in modern systems can be overwhelming. Forensic examiners must develop efficient methods to identify and focus on relevant evidence among terabytes of data.</p>
      
      <h2>The Future of Digital Forensics</h2>
      <p>As technology continues to evolve, so too will digital forensics. Several trends are shaping the future of the field:</p>
      
      <h3>Artificial Intelligence and Machine Learning</h3>
      <p>AI and machine learning are being integrated into forensic tools to automate analysis, identify patterns, and handle large volumes of data more efficiently.</p>
      
      <h3>IoT Forensics</h3>
      <p>The proliferation of Internet of Things (IoT) devices creates new sources of digital evidence. Developing methods to extract and analyze data from smart home devices, wearables, and embedded systems is an emerging area of focus.</p>
      
      <h3>Cloud-Native Forensics</h3>
      <p>As organizations move to cloud-native architectures, forensic techniques must adapt to containerized applications, serverless functions, and distributed systems.</p>
      
      <h3>Quantum Computing Implications</h3>
      <p>The advent of quantum computing will have profound implications for cryptography and, by extension, digital forensics. Preparing for a post-quantum world is becoming an important consideration.</p>
      
      <h2>Conclusion</h2>
      <p>Digital forensics plays a vital role in our increasingly digital world. By understanding the principles, processes, and challenges of digital forensics, organizations and individuals can better prepare for and respond to security incidents, legal disputes, and investigations involving digital evidence.</p>
      
      <p>As technology continues to evolve, so too will the field of digital forensics. Staying current with emerging trends, tools, and techniques is essential for professionals in this dynamic and critical discipline.</p>
    `,
  },
  "evolution-of-security-operations-centers": {
    title: "The Evolution of Security Operations Centers (SOC)",
    excerpt:
      "Security Operations Centers have evolved significantly over the past decade. This article explores the transformation from traditional to modern SOCs and the impact of AI and automation.",
    date: "September 3, 2023",
    author: "Vedant Tapdiya",
    readTime: "12 min read",
    tags: ["SOC", "Security Operations", "SIEM"],
    content: `
      <h2>Introduction</h2>
      <p>Security Operations Centers (SOCs) have undergone a remarkable transformation over the past decade. From traditional monitoring centers focused on perimeter security to sophisticated nerve centers leveraging artificial intelligence and automation, the evolution of SOCs reflects the changing landscape of cybersecurity threats and defensive capabilities.</p>
      
      <p>This article explores the journey of SOCs from their early days to the present, examining how they've adapted to new challenges and technologies, and looking ahead to what the future might hold for security operations.</p>
      
      <h2>The Traditional SOC: Origins and Limitations</h2>
      
      <h3>Early Days of Security Monitoring</h3>
      <p>The concept of a Security Operations Center emerged in the late 1990s and early 2000s as organizations began to recognize the need for dedicated security monitoring. These early SOCs were primarily focused on perimeter security, monitoring firewalls and intrusion detection systems for signs of unauthorized access.</p>
      
      <p>Typically staffed by small teams working in shifts to provide 24/7 coverage, traditional SOCs relied heavily on manual processes and basic correlation rules to identify potential security incidents.</p>
      
      <h3>Limitations of the Traditional Approach</h3>
      <p>While revolutionary for their time, traditional SOCs faced significant limitations:</p>
      
      <ul>
        <li><strong>Alert Fatigue:</strong> Security tools generated overwhelming volumes of alerts, many of which were false positives, leading to analyst burnout and missed threats.</li>
        <li><strong>Siloed Tools:</strong> Security tools operated in isolation, making it difficult to correlate events across different systems and gain a comprehensive view of potential threats.</li>
        <li><strong>Reactive Posture:</strong> Traditional SOCs were primarily reactive, responding to alerts after potential breaches had already occurred.</li>
        <li><strong>Limited Visibility:</strong> Focus on perimeter security meant limited visibility into internal networks, endpoints, and user behavior.</li>
        <li><strong>Manual Processes:</strong> Incident response processes were largely manual, leading to slow response times and inconsistent handling of security events.</li>
      </ul>
      
      <h2>The Modern SOC: Transformation and Capabilities</h2>
      
      <h3>Shift to Intelligence-Driven Operations</h3>
      <p>Modern SOCs have evolved from alert-processing centers to intelligence-driven operations. This transformation has been driven by the recognition that effective security requires not just monitoring but understanding the context of security events, the tactics of threat actors, and the specific risks facing the organization.</p>
      
      <p>Key aspects of this shift include:</p>
      
      <ul>
        <li><strong>Threat Intelligence Integration:</strong> Incorporating external threat feeds and intelligence to provide context for security events and help identify sophisticated attacks.</li>
        <li><strong>Behavioral Analytics:</strong> Moving beyond signature-based detection to identify anomalous behavior that may indicate compromise.</li>
        <li><strong>Proactive Threat Hunting:</strong> Actively searching for signs of compromise rather than waiting for alerts to trigger.</li>
        <li><strong>Risk-Based Approach:</strong> Prioritizing security efforts based on the specific risks and crown jewels of the organization.</li>
      </ul>
      
      <h3>Technological Advancements</h3>
      <p>The evolution of SOCs has been enabled by significant technological advancements:</p>
      
      <h4>SIEM Evolution</h4>
      <p>Security Information and Event Management (SIEM) systems have evolved from simple log aggregation tools to sophisticated platforms that provide real-time analysis, correlation, and visualization of security data from across the enterprise.</p>
      
      <h4>EDR and XDR</h4>
      <p>Endpoint Detection and Response (EDR) and Extended Detection and Response (XDR) solutions have expanded visibility beyond the network perimeter to endpoints and applications, providing rich telemetry and response capabilities.</p>
      
      <h4>SOAR Platforms</h4>
      <p>Security Orchestration, Automation, and Response (SOAR) platforms have enabled SOCs to automate routine tasks, orchestrate complex workflows, and standardize response procedures, significantly improving efficiency and consistency.</p>
      
      <h4>Cloud-Native Security</h4>
      <p>As organizations have moved to the cloud, SOCs have adapted by incorporating cloud-native security tools and practices, enabling visibility and control across hybrid and multi-cloud environments.</p>
      
      <h3>Organizational and Process Changes</h3>
      <p>The evolution of SOCs isn't just about technology—it also involves significant changes to organization and process:</p>
      
      <ul>
        <li><strong>Integration with IT and Business:</strong> Modern SOCs work closely with IT operations and business units to understand the context of security events and align security priorities with business objectives.</li>
        <li><strong>Tiered Response Models:</strong> Many SOCs have adopted tiered response models, with Level 1 analysts handling initial triage, Level 2 analysts conducting deeper investigation, and Level 3 specialists addressing advanced threats.</li>
        <li><strong>Metrics and Continuous Improvement:</strong> Modern SOCs track key performance indicators and continuously refine their processes based on lessons learned and changing threats.</li>
        <li><strong>Skill Development:</strong> Recognizing the importance of human expertise, modern SOCs invest in continuous skill development and specialization for their analysts.</li>
      </ul>
      
      <h2>The Impact of AI and Automation</h2>
      
      <h3>Transformative Potential</h3>
      <p>Artificial intelligence and automation are perhaps the most transformative forces in the evolution of SOCs. These technologies offer the potential to address many of the challenges that have plagued security operations, from alert overload to the cybersecurity skills gap.</p>
      
      <h3>Key Applications</h3>
      
      <h4>Alert Triage and Prioritization</h4>
      <p>AI algorithms can analyze and correlate security alerts, reducing false positives and prioritizing the most critical threats for human attention. This helps address alert fatigue and ensures that analysts focus on the most significant risks.</p>
      
      <h4>Threat Detection</h4>
      <p>Machine learning models can identify subtle patterns and anomalies that might indicate sophisticated attacks, even when those attacks haven't been seen before. This enhances the SOC's ability to detect advanced persistent threats and zero-day exploits.</p>
      
      <h4>Automated Response</h4>
      <p>For well-understood threats, automated response capabilities can take immediate action to contain and remediate issues without human intervention. This reduces response time from hours to seconds for many common scenarios.</p>
      
      <h4>Analyst Augmentation</h4>
      <p>AI tools can augment human analysts by providing context, suggesting next steps, and automating routine tasks. This allows analysts to focus on higher-level investigation and decision-making.</p>
      
      <h3>Challenges and Limitations</h3>
      <p>While AI and automation offer tremendous benefits, they also present challenges:</p>
      
      <ul>
        <li><strong>False Confidence:</strong> Over-reliance on AI can lead to false confidence and missed threats if the models aren't properly trained or validated.</li>
        <li><strong>Explainability:</strong> Many AI models operate as "black boxes," making it difficult to understand why certain decisions were made.</li>
        <li><strong>Adversarial Attacks:</strong> Sophisticated attackers may attempt to evade or manipulate AI-based defenses.</li>
        <li><strong>Integration Complexity:</strong> Integrating AI and automation into existing SOC workflows and technologies can be complex and requires careful planning.</li>
      </ul>
      
      <h2>The Future of SOCs</h2>
      
      <h3>Emerging Trends</h3>
      <p>Looking ahead, several trends are likely to shape the continued evolution of Security Operations Centers:</p>
      
      <h4>Autonomous SOCs</h4>
      <p>The concept of the autonomous SOC envisions security operations that are largely self-driving, with AI systems handling routine detection and response while human analysts focus on strategic decisions and novel threats.</p>
      
      <h4>Distributed Security Operations</h4>
      <p>The traditional model of a centralized SOC is giving way to more distributed approaches, with security operations embedded throughout the organization and supported by cloud-based platforms.</p>
      
      <h4>Collaborative Defense</h4>
      <p>SOCs are increasingly participating in collaborative defense ecosystems, sharing threat intelligence and response strategies with peers and partners to create a more resilient security community.</p>
      
      <h4>Shift-Left Security</h4>
      <p>The integration of security into development and operations processes (DevSecOps) is expanding the role of the SOC to include earlier stages of the technology lifecycle, helping to prevent security issues before they reach production.</p>
      
      <h3>Challenges Ahead</h3>
      <p>Despite these advances, SOCs will continue to face significant challenges:</p>
      
      <ul>
        <li><strong>Talent Shortage:</strong> The cybersecurity skills gap shows no signs of closing, making it difficult for organizations to staff their SOCs with qualified personnel.</li>
        <li><strong>Expanding Attack Surface:</strong> The proliferation of cloud services, IoT devices, and remote work continues to expand the attack surface that SOCs must defend.</li>
        <li><strong>Sophisticated Threats:</strong> Threat actors continue to develop more sophisticated techniques, including AI-powered attacks and supply chain compromises.</li>
        <li><strong>Regulatory Complexity:</strong> An increasingly complex regulatory landscape requires SOCs to adapt their operations to comply with diverse and sometimes conflicting requirements.</li>
      </ul>
      
      <h2>Conclusion</h2>
      <p>The evolution of Security Operations Centers reflects the dynamic nature of the cybersecurity landscape. From their origins as basic monitoring centers to their current state as sophisticated, intelligence-driven operations leveraging advanced technologies, SOCs have continuously adapted to meet new challenges.</p>
      
      <p>As we look to the future, the pace of this evolution is likely to accelerate. Organizations that embrace new technologies and approaches while maintaining a focus on the fundamentals of effective security operations will be best positioned to defend against tomorrow's threats.</p>
      
      <p>The most successful SOCs will be those that find the right balance between technology and human expertise, automation and judgment, standardization and adaptability. By learning from the past while embracing innovation, security operations can continue to evolve to meet the challenges of an increasingly complex and threatening digital landscape.</p>
    `,
  },
}

export default function BlogPostPage() {
  const params = useParams()
  const router = useRouter()
  const [post, setPost] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [liked, setLiked] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)

  useEffect(() => {
    // Get the slug from the URL
    const { slug } = params

    // Fetch blog post data based on slug
    if (typeof slug === "string" && blogPostsData[slug]) {
      setPost(blogPostsData[slug])
    } else {
      // Redirect to blog page if post not found
      router.push("/blog")
    }

    setLoading(false)
  }, [params, router])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="text-green-500 text-xl">Loading article...</div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="text-red-500 text-xl">Article not found</div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-black">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
          <Link href="/blog" className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="gap-1">
              <ArrowLeft className="h-4 w-4" />
              Back to Blog
            </Button>
          </Link>
          <div className="flex flex-1 items-center justify-end">
            <h1 className="text-xl font-bold text-white">Cybersecurity Blog</h1>
          </div>
        </div>
      </header>

      <main className="flex-1 py-12">
        <div className="container px-4 md:px-6">
          <motion.article
            className="max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-6 flex flex-wrap items-center gap-2">
              <div className="inline-block rounded-lg bg-green-900/20 px-3 py-1 text-sm text-green-500">Blog</div>
              <div className="flex items-center text-sm text-zinc-400">
                <Calendar className="h-4 w-4 mr-1" />
                {post.date}
              </div>
              <div className="flex items-center text-sm text-zinc-400">
                <Clock className="h-4 w-4 mr-1" />
                {post.readTime}
              </div>
            </div>

            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white mb-6">
              {post.title}
            </h1>

            <div className="flex items-center gap-3 mb-8">
              <div className="h-10 w-10 rounded-full bg-green-900/50 flex items-center justify-center">
                <User className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="font-medium text-white">{post.author}</p>
                <p className="text-sm text-zinc-400">Cybersecurity Professional</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-8">
              {post.tags.map((tag: string, index: number) => (
                <Badge key={index} className="bg-green-900/50 text-green-400">
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="prose prose-invert max-w-none mb-8">
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </div>

            <div className="border-t border-zinc-800 pt-6 mt-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`gap-2 ${liked ? "text-green-500" : "text-zinc-400"}`}
                    onClick={() => setLiked(!liked)}
                  >
                    <ThumbsUp className="h-4 w-4" />
                    {liked ? "Liked" : "Like"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`gap-2 ${bookmarked ? "text-green-500" : "text-zinc-400"}`}
                    onClick={() => setBookmarked(!bookmarked)}
                  >
                    <Bookmark className="h-4 w-4" />
                    {bookmarked ? "Saved" : "Save"}
                  </Button>
                </div>
                <Button variant="ghost" size="sm" className="gap-2 text-zinc-400">
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
              </div>
            </div>
          </motion.article>
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
