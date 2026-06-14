import {
  Code2,
  Smartphone,
  ShieldCheck,
  User,
  Bug,
  Globe,
  Palette,
  Search,
  Server,
  Rocket,
  Users,
  Layers,
  Sparkles,
  Shield,
  Zap,
  Workflow,
  LineChart,
  ShoppingBag,
  Building2,
  HeartPulse,
  Banknote,
  GraduationCap,
  Briefcase,
  Check,
  Twitter,
  Github,
  Linkedin,
  Youtube,
  LayoutDashboard,
  ShoppingCart,
  BarChart2,
  Settings2,
  Filter,
  Radio,
  GitBranch,
  Database,
  Cloud,
  LockIcon,
  Monitor,
  KeyRound,
  Network,
  BarChart3,
  ClipboardList,
  RefreshCw,
  Microscope,
  TrendingUp,
  Pencil,
  Bell,
  MessageCircle,
} from "lucide-react";
import { Activity } from "react";

export const meetlink = "https://calendly.com/pudhutech/30min";
export const whatsappURL =
  "https://wa.me/916380076528?text=Hi%20PudhuTech,%20I%20have%20a%20quick%20question%20about%20your%20services.";

export const features = [
  {
    icon: Code2,
    title: "Secure Web Development",
    desc: "We build scalable, production-ready web applications with security integrated from architecture to deployment.",
  },

  {
    icon: ShieldCheck,
    title: "Secure by Design",
    desc: "Security is integrated into architecture from day one—not patched later.",
  },
  {
    icon: Palette,
    title: "Product & Interface Design",
    desc: "Clean, intuitive interfaces designed to support user growth and system clarity.",
  },
  {
    icon: Smartphone,
    title: "Mobile Responsive & PWA-Ready",
    desc: "All applications are built mobile-responsive by default, with optional Progressive Web App capabilities when required.",
  },
  {
    icon: Zap,
    title: "Structured Development Process",
    desc: "Milestone-based execution with clear communication, timelines, and documentation.",
  },
  {
    icon: Server,
    title: "Maintainable & Scalable Architecture",
    desc: "Clean, modular code with long-term maintainability and secure deployment practices.",
  },
];

export const services = [
  {
    icon: Code2,
    title: "Secure Web Application Development",
    desc: "Custom web applications built with scalable architecture and security integrated from day one.",
    features: [
      "static and dynamic web applications",
      "authentication & role-based access control",
      "secure API & database integration",
      "production-ready deployment",
    ],
    cta: "Start a Project",
    detailLink: "/services/secure-web-development",
  },
  {
    icon: ShieldCheck,
    title: "Web Application Security Testing",
    desc: "Manual testing of authentication, APIs, and business logic vulnerabilities with detailed reporting.",
    features: [
      "OWASP Top 10 aligned testing",
      "business logic & access control testing",
      "authenticated and unauthenticated assessments",
      "severity-ranked findings with remediation guidance",
    ],
    cta: "Start a Security Review",
    detailLink: "/services/security-testing",
  },
  {
    icon: Layers,
    title: "Post‑Launch Support",
    desc: "Ongoing assistance with updates, renewals, and general website management after deployment.",
    features: [
      "Domain & Hosting coordination",
      "Content updates (limited scope)",
      "Renewal reminders",
      "General technical guidance",
    ],
    cta: "Get Post-Launch Support",
    detailLink: "/services/post-launch-support",
  },
];

export const stats = [
  { value: "20+", label: "Projects Completed" },
  { value: "10+", label: "Client Engagements" },
  { value: "3+", label: "Years in Dev & Security" },
  { value: "100+", label: "Security Issues Analyzed" },
];

export const floatCards = [
  {
    pos: "top-[14%] left-[2%]",
    delay: 0,
    label: "Performance",
    val: "90+",
    Icon: Zap,
    tint: "from-blue-500/20 to-blue-500/5",
  },
  {
    pos: "top-[68%] left-[0%]",
    delay: 1.5,
    label: "Security",
    val: "A+",
    Icon: ShieldCheck,
    tint: "from-emerald-500/20 to-emerald-500/5",
  },
  {
    pos: "top-[10%] right-[2%]",
    delay: 0.8,
    label: "Delivery",
    val: "6–8w",
    Icon: Rocket,
    tint: "from-purple/30 to-purple/5",
  },
  {
    pos: "top-[68%] right-[0%]",
    delay: 2,
    label: "Support",
    val: "30d",
    Icon: Check,
    tint: "from-cyan/30 to-cyan/5",
  },
];

export const tags = [
  { pos: "bottom-[32%] left-[14%]", label: "Burpsuite" },
  { pos: "top-[36%] left-[12%]", label: "Node.js" },
  { pos: "bottom-[30%] right-[18%]", label: "React" },
  { pos: "top-[38%] right-[12%]", label: "Nuclei" },
  { pos: "top-[5%] right-[50%]", label: "Supabase" },
  { pos: "bottom-[5%] right-[45%]", label: "Mongo DB" },
];

export const heroStats = [
  { n: "20+", label: "Projects Delivered" },
  { n: "30+", label: "Verified Security Findings" },
  { n: "3+", label: "Years in Dev & Security" },
];

export const testimonials = [
  {
    name: "Boopathy",
    role: "Retail Business Owner",
    quote:
      "Pudhu Tech built a responsive PWA for our shop’s profit analysis system. It’s fast, reliable, and works seamlessly across devices.",
    avatar: "B",
  },
  {
    name: "Logashree",
    role: "Frontend Engineer",
    quote:
      "Their security audit identified critical issues that two other vendors overlooked. The clarity and depth of the report were exceptional.",
    avatar: "L",
  },
  {
    name: "Sudhakar",
    role: "Full Stack Developer",
    quote:
      "They uncovered critical vulnerabilities in our ticket booking system that could have caused major issues. Highly detailed and professional testing.",
    avatar: "S",
  },
  {
    name: "Sam",
    role: "Content Writer & Speaker",
    quote:
      "Clear communication, clean code, and on-time delivery. One of the most structured development experiences we've had.",
    avatar: "S",
  },
  {
    name: "Ragul Gandhi",
    role: "Computer Science Student",
    quote:
      "They delivered my Complaint Management System with all required features in a short timeframe while maintaining code quality.",
    avatar: "RG",
  },
  {
    name: "Mohan",
    role: "Operations Manager",
    quote:
      "Impressed by their ability to deliver a complete web application within two weeks without compromising quality.",
    avatar: "M",
  },
];
export const devPlans = [
  {
    name: "Starter",
    price: "₹10,000",
    desc: "Ideal for business websites and simple web presence projects.",
    features: [
      "Up to 5 responsive pages",
      "Mobile-first design",
      "Basic SEO configuration",
      "Secure deployment setup",
      "30-day post-launch support",
    ],
    cta: "Start a Project",
    highlighted: false,
  },
  {
    name: "Growth",
    price: "₹30,000",
    desc: "Designed for dynamic web applications and early-stage SaaS platforms.",
    features: [
      "Full-stack web application",
      "Authentication & role-based access",
      "Secure API & database integration",
      "Production-ready deployment",
      "Basic security review included",
    ],
    cta: "Start a Project",
    highlighted: true,
  },
  {
    name: "Scale",
    price: "₹70,000",
    desc: "Advanced systems built for growing businesses with complex workflows.",
    features: [
      "Custom dashboards & admin systems",
      "Payment gateway integration",
      "Scalable backend architecture",
      "Advanced security hardening",
      "Performance optimization",
    ],
    cta: "Start a Project",
    highlighted: false,
  },
];
export const securityPlans = [
  {
    name: "Essential Review",
    price: "₹25,000",
    desc: "Focused security testing for early-stage web applications.",
    features: [
      "Authentication & access control testing",
      "OWASP Top 10 checks",
      "Basic business logic review",
      "Summary report with remediation guidance",
      "One retest included",
    ],
    cta: "Start a Security Review",
    highlighted: false,
  },
  {
    name: "Advanced Assessment",
    price: "₹50,000",
    desc: "In-depth manual testing for SaaS and revenue-generating platforms.",
    features: [
      "Full manual vulnerability assessment",
      "Business logic & API abuse testing",
      "Authenticated & unauthenticated testing",
      "Detailed severity-ranked report",
      "Retest included",
    ],
    cta: "Start a Security Review",
    highlighted: true,
  },
];
export const maintenancePlans = [
  {
    name: "Basic Support",
    price: "₹2,000",
    desc: "Lightweight ongoing support for small business websites.",
    features: [
      "Domain & hosting coordination",
      "Renewal reminders",
      "Basic content updates (limited scope)",
      "Email-based support",
    ],
    cta: "Request Support Plan",
    highlighted: false,
  },
  {
    name: "Extended Support",
    price: "₹4,000",
    desc: "Structured post-launch assistance for dynamic web applications.",
    features: [
      "All Basic features included",
      "Minor feature adjustments",
      "Plugin & dependency updates",
      "Priority email support",
    ],
    cta: "Request Support Plan",
    highlighted: true,
  },
];
export const faqs = [
  {
    q: "What services does Pudhu Tech offer?",
    a: "We specialize in secure web application development and web application security testing. UI/UX design, SEO fundamentals, and performance optimization are included where relevant to the project scope.",
  },
  {
    q: "How long does a typical project take?",
    a: "Simple websites typically take 1–2 weeks. Dynamic web applications range from 4–10 weeks depending on complexity. Security audits are usually completed within 1–2 weeks based on scope.",
  },
  {
    q: "Do you sign NDAs?",
    a: "Yes. We’re happy to sign an NDA before discussing sensitive product details.",
  },
  {
    q: "What does a security test include?",
    a: "Our security testing covers authentication flaws, API vulnerabilities, business logic issues, and OWASP Top 10 risks. You receive a detailed report with severity-ranked findings and a re-test after fixes.",
  },
  {
    q: "Do you work with startups or established businesses?",
    a: "Both. We work with early-stage founders as well as growing companies looking to scale securely.",
  },
  {
    q: "Will we own the code after delivery?",
    a: "Yes. You receive full source code, documentation, and a structured handover at the end of the engagement.",
  },
  {
    q: "How do you approach security during development?",
    a: "Security is integrated from the architecture stage. We implement proper authentication, access controls, input validation, and secure deployment practices from day one.",
  },
  {
    q: "Do you provide post-launch support?",
    a: "Yes. We offer structured post-launch support and optional maintenance plans depending on your needs.",
  },
];

//process
export const process = [
  {
    step: "01",
    title: "Discover",
    desc: "We understand your product goals, users, and technical requirements before defining scope.",
  },
  {
    step: "02",
    title: "Architect",
    desc: "We design a secure and scalable solution aligned with your timeline and budget.",
  },
  {
    step: "03",
    title: "Build",
    desc: "We develop with clean, maintainable code and structured testing throughout.",
  },
  {
    step: "04",
    title: "Deploy & Scale",
    desc: "We launch securely and support performance, stability, and future growth.",
  },
];

export const industries = [
  { icon: Banknote, name: "Small & Medium Businesses" }, //
  { icon: ShoppingBag, name: "Retail & Commerce" }, //
  { icon: Building2, name: "SaaS & Technology" }, //
  { icon: GraduationCap, name: "Education" }, //
  { icon: Briefcase, name: "Professional services" }, //
];
export const partners = [
  "Northwind",
  "Helios",
  "Lumen",
  "Atlas",
  "Vertex",
  "Quanta",
  "Orbital",
  "Forge",
];

export const team = [
  { name: "Madhan Mohan", role: "Founder & CEO", avatar: "M" },
  { name: "Saravanan", role: "Client Relations Manager", avatar: "S" },
  { name: "Sanjay", role: "Full Stack Developer", avatar: "M" },
  { name: "Kamesh Gunal", role: "Security Researcher", avatar: "K" },
  { name: "Ayesha", role: "Frontend Developer", avatar: "A" },
  { name: "Merlyn Natasha", role: "Backend Developer", avatar: "M" },
];

export const values = [
  {
    icon: Rocket,
    title: "Deliver with Discipline",
    desc: "We commit to realistic timelines and deliver through structured execution.",
  },
  {
    icon: Users,
    title: "Ownership Mindset",
    desc: "We treat every project with responsibility and long-term thinking.",
  },
  {
    icon: Layers,
    title: "Engineering Craft",
    desc: "Clean code, thoughtful design, and attention to technical detail.",
  },
  {
    icon: Globe,
    title: "Built for Maintainability",
    desc: "We build systems your future engineers can extend with confidence.",
  },
];

export const timeline = [
  {
    year: "2022",
    title: "PudhuTech Founded",
    desc: "The idea began with a focus on secure web development and practical engineering.",
  },
  {
    year: "2023",
    title: "Development Expansion",
    desc: "Delivered early web projects and strengthened backend architecture expertise.",
  },
  {
    year: "2024",
    title: "Security-Focused Direction",
    desc: "Shifted focus toward application security testing and secure development practices.",
  },
  {
    year: "2025",
    title: "Project Growth",
    desc: "Completed multiple web development and security engagements for growing businesses.",
  },
  {
    year: "2026",
    title: "Structured Studio Approach",
    desc: "Transitioned from freelance projects to a focused, process-driven development studio.",
  },
];

export const benefits = [
  {
    icon: Sparkles,
    title: "Profit sharing",
    desc: "Every team member shares in the upside of the projects they ship.",
  },
  {
    icon: Globe,
    title: "Remote-first",
    desc: "Work from anywhere with quarterly in-person off-sites.",
  },
  {
    icon: Shield,
    title: "Health coverage",
    desc: "Premium medical, dental, and vision worldwide.",
  },
  {
    icon: Rocket,
    title: "Learning budget",
    desc: "$2K annually for courses, books, and conferences.",
  },
];

export const socialLinks = [
  { icon: Twitter, href: "https://twitter.com/pudhutech" },
  { icon: Github, href: "https://github.com/pudhutech" },
  { icon: Linkedin, href: "https://linkedin.com/company/pudhutech" },
  { icon: Youtube, href: "https://youtube.com/@pudhutech" },
];

export const terms_conditions = [
  {
    h: "Acceptance of Terms",
    p: "By accessing PudhuTech's website or engaging our services, you agree to be bound by these Terms & Conditions. If you do not agree, please refrain from using our services. These terms apply to all clients, visitors, and users worldwide.",
  },
  {
    h: "Services Provided",
    p: "PudhuTech offers web development and security testing services including, but not limited to: custom web application development, front-end and back-end engineering, vulnerability assessments, penetration testing, and security audits. The scope of each engagement is defined in a separate project agreement or proposal shared with the client.",
  },
  {
    h: "Client Responsibilities",
    p: "Clients must provide accurate information, timely feedback, and all necessary access or credentials required to complete the project. For security testing engagements, clients must confirm in writing that they have legal authorization over all systems to be tested. PudhuTech will not be held liable for any unauthorized testing conducted based on false or incomplete information provided by the client.",
  },
  {
    h: "Intellectual Property",
    p: "Upon full payment, clients receive ownership of all custom deliverables created specifically for their project. PudhuTech retains ownership of any proprietary tools, frameworks, templates, or methodologies used during the engagement. We reserve the right to showcase completed work in our portfolio unless the client requests confidentiality in writing.",
  },
  {
    h: "Payment Terms",
    p: "Project fees, milestones, and payment schedules are outlined in the individual project proposal or contract. PudhuTech typically requires a deposit before work begins. Late payments may result in a pause of services. All fees are non-refundable once work on a milestone has commenced, unless otherwise agreed in writing.",
  },
  {
    h: "Confidentiality",
    p: "PudhuTech treats all client data, business information, and security findings as strictly confidential. We do not share, sell, or disclose any client information to third parties without explicit written consent. Security reports and vulnerability findings will only be shared with authorized representatives of the client.",
  },
  {
    h: "Limitation of Liability",
    p: "PudhuTech is not liable for any indirect, incidental, or consequential damages arising from the use of our services. Our total liability in any dispute shall not exceed the total fees paid by the client for the specific service in question. We strongly recommend clients maintain their own backups and security measures independent of our engagement.",
  },
  {
    h: "Governing Law",
    p: "These Terms & Conditions are governed by the laws of India. Any disputes arising from or related to these terms or our services shall be subject to the jurisdiction of courts in India. For international clients, we aim to resolve disputes amicably before pursuing formal legal proceedings.",
  },
  {
    h: "Changes to Terms",
    p: "PudhuTech reserves the right to update these Terms & Conditions at any time. Changes will be reflected on this page with an updated date. Continued use of our services after changes constitutes your acceptance of the revised terms. We encourage clients to review this page periodically.",
  },
];

export const privacy_policy = [
  {
    h: "Who We Are",
    p: "PudhuTech is a digital agency based in India that provides web development and security testing services to startups, businesses, and companies worldwide. This Privacy Policy explains how we collect, use, and protect the personal information you share with us.",
  },
  {
    h: "Information We Collect",
    p: "We may collect personal information such as your name, email address, phone number, company name, and project details when you contact us through our website, fill out a form, or enter into a service agreement with us. For security testing engagements, we may also collect technical information about the systems you authorize us to test.",
  },
  {
    h: "How We Use Your Information",
    p: "We use the information you provide to respond to your inquiries, deliver our services, send project updates, and improve the quality of our offerings. We do not use your data for unsolicited marketing without your consent. We may occasionally send service-related communications relevant to your engagement with us.",
  },
  {
    h: "Data Sharing",
    p: "PudhuTech does not sell, rent, or trade your personal information to any third party. We may share data with trusted sub-contractors or tools (such as project management or communication platforms) strictly for the purpose of delivering your project, and only under confidentiality agreements. We may disclose information if required by applicable law or a valid legal order.",
  },
  {
    h: "Security of Your Data",
    p: "We take data security seriously. All sensitive communications and documents are handled with care, and access is restricted to authorized team members on a need-to-know basis. Security findings and audit reports are treated as strictly confidential and delivered only to authorized client representatives.",
  },
  {
    h: "Cookies & Website Analytics",
    p: "Our website may use cookies and analytics tools (such as Google Analytics) to understand how visitors interact with our site. This data is aggregated and anonymous. You may disable cookies in your browser settings, though some features of the site may not function as intended.",
  },
  {
    h: "Data Retention",
    p: "We retain your personal data only for as long as necessary to fulfill the purpose it was collected for, or as required by law. Project-related information is typically retained for up to 3 years after project completion. You may request deletion of your data at any time by contacting us.",
  },
  {
    h: "Your Rights",
    p: "Regardless of where you are located, you have the right to access, correct, or request deletion of your personal data held by PudhuTech. Clients in the EU/UK may exercise additional rights under GDPR. To make any such request, please email us and we will respond within a reasonable timeframe.",
  },
  {
    h: "Third-Party Links",
    p: "Our website may contain links to third-party websites or tools. PudhuTech is not responsible for the privacy practices of those sites. We encourage you to review their privacy policies before sharing any personal information with them.",
  },
  {
    h: "Changes to This Policy",
    p: "We may update this Privacy Policy from time to time. Any changes will be posted on this page with a revised date. Continued use of our website or services after changes constitutes your acceptance of the updated policy.",
  },
];

//detail service
export const whatWeBuild = [
  {
    icon: Globe,
    title: "Business Websites",
    desc: "Professional marketing and corporate websites built for performance, SEO, and long-term maintainability.",
    features: [
      "Performance-optimized static or SSR builds",
      "CMS integration (Sanity, Contentful)",
      "Mobile-first responsive design",
      "Conversion-focused layout structure",
      "Secure deployment configuration",
    ],
  },
  {
    icon: LayoutDashboard,
    title: "SaaS Platforms",
    desc: "Scalable multi-tenant applications with structured authentication, billing, and access control.",
    features: [
      "Tenant isolation & permission layers",
      "Stripe or Razorpay billing integration",
      "Authentication & role-based access control",
      "Admin dashboards & reporting panels",
      "Structured and secure API architecture",
    ],
    tag: "Popular",
  },
  {
    icon: ShoppingCart,
    title: "E-Commerce Systems",
    desc: "Secure end-to-end commerce platforms with structured checkout and order management.",
    features: [
      "Secure payment gateway integration",
      "Inventory & order management",
      "User authentication & account control",
      "Checkout validation & fraud handling",
      "Scalable architecture for growth",
    ],
  },
  {
    icon: BarChart2,
    title: "Custom Dashboards",
    desc: "Data visualization and reporting tools for internal teams and client-facing portals.",
    features: [
      "Real-time and historical data views",
      "Role-scoped data access per user",
      "Export & reporting tools",
      "Secure API-backed data architecture",
      "Audit logging for sensitive operations",
    ],
  },
  {
    icon: Settings2,
    title: "Internal Business Tools",
    desc: "Custom admin panels and workflow systems built to streamline internal operations.",
    features: [
      "Workflow automation & approval chains",
      "Access control & activity tracking",
      "Integration with existing systems",
      "Secure data boundaries",
      "Scalable backend architecture",
    ],
  },
];

export const devProcess = [
  {
    step: "01",
    title: "Requirement Discovery",
    desc: "We define scope, user flows, risk considerations, and success metrics before development begins.",
  },
  {
    step: "02",
    title: "Secure Architecture",
    desc: "System design covering authentication, access control, API contracts, database structure, and infrastructure layout.",
  },
  {
    step: "03",
    title: "Structured Implementation",
    desc: "Milestone-based development with version control, code reviews, and enforced security controls.",
  },
  {
    step: "04",
    title: "Testing & Validation",
    desc: "Functional QA, integration testing, and structured security review before release.",
  },
  {
    step: "05",
    title: "Production Deployment",
    desc: "Environment separation, secure configuration, secrets management, and deployment to production-ready infrastructure.",
  },
];

export const securityPractices = [
  {
    icon: LockIcon,
    title: "Authentication",
    desc: "Secure authentication using JWT or session-based systems with proper token storage and expiry controls.",
    points: [
      "Secure cookie configuration (HttpOnly, SameSite, Secure)",
      "Token refresh & revocation handling",
      "Optional MFA or SSO integration",
    ],
  },
  {
    icon: ShieldCheck,
    title: "Role-Based Access Control",
    desc: "Permissions are enforced at the API level to prevent unauthorized access or privilege escalation.",
    points: [
      "Granular permission sets per role",
      "Middleware-level enforcement",
      "Server-side access validation",
    ],
  },
  {
    icon: Filter,
    title: "Input Validation",
    desc: "Every incoming request is validated to prevent injection attacks and unexpected system behavior.",
    points: [
      "Schema-based request validation",
      "Parameterized database queries",
      "XSS prevention & output sanitization",
    ],
  },
  {
    icon: Radio,
    title: "Secure API Design",
    desc: "APIs are implemented with rate limiting, strict CORS policies, and minimal data exposure.",
    points: [
      "Per-route rate limiting",
      "Strict CORS configuration",
      "Security headers (HSTS, CSP, X-Frame-Options)",
    ],
  },
];
export const techStack = [
  { icon: Code2, label: "React / Next.js", note: "Frontend & SSR" },
  { icon: Server, label: "Node.js / Express", note: "Backend APIs" },
  { icon: Database, label: "MongoDB / PostgreSQL", note: "Structured data layer" },
  { icon: Layers, label: "JWT / OAuth 2.0", note: "Authentication & identity" },
  { icon: GitBranch, label: "Docker / Nginx", note: "Backend infrastructure" },
  {
    icon: Cloud,
    label: "Vercel / DigitalOcean",
    note: "Production deployment platforms",
  },
];

//
export const whatWeTest = [
  {
    icon: Monitor,
    title: "Client-Side Vulnerabilities",
    desc: "Testing browser-facing components for DOM-based XSS, insecure storage, token leakage, and client-side validation bypass.",
  },
  {
    icon: Server,
    title: "Server-Side Vulnerabilities",
    desc: "Injection flaws, insecure deserialization, misconfigurations, improper error handling, and backend data exposure.",
  },
  {
    icon: KeyRound,
    title: "Authentication & Session Management",
    desc: "Credential stuffing exposure, session fixation, token misuse, MFA bypass, and improper session invalidation.",
  },
  {
    icon: LockIcon,
    title: "Authorization & Access Control",
    desc: "IDOR, horizontal and vertical privilege escalation, broken role enforcement, and resource-level access flaws.",
  },
  {
    icon: Network,
    title: "API & Data Exposure",
    desc: "REST and GraphQL endpoints tested for excessive data exposure, mass assignment, rate-limiting gaps, and improper authentication.",
  },
  {
    icon: Activity,
    title: "Infrastructure & Network Exposure",
    desc: "Open ports, misconfigured services, TLS weaknesses, and exposed administrative interfaces.",
  },
  {
    icon: Bug,
    title: "Business Logic Abuse",
    desc: "Workflow manipulation, price tampering, coupon stacking, race conditions, and state-machine bypasses automated tools miss.",
  },
];

export const methodologySteps = [
  {
    step: "01",
    title: "Scoping & Threat Modeling",
    desc: "We define attack surface boundaries, map trust relationships, and agree on rules of engagement before testing begins.",
  },
  {
    step: "02",
    title: "Automated Baseline Scan",
    desc: "Automated scanning establishes a baseline and surfaces candidate issues for manual validation.",
  },
  {
    step: "03",
    title: "Manual-Led Exploitation",
    desc: "Human-driven testing validates real exploit paths, focusing on authentication, access control, and business logic abuse.",
  },
  {
    step: "04",
    title: "Risk-Based Prioritization",
    desc: "Each finding is ranked by exploitability and business impact—not just CVSS—so remediation focuses on real risk.",
  },
  {
    step: "05",
    title: "Responsible Disclosure & Coordination",
    desc: "Findings are shared securely. We coordinate remediation timelines and never publish details without consent.",
  },
];

export const deliverables = [
  {
    icon: BarChart3,
    title: "Severity-Ranked Report",
    desc: "Every finding documented with proof-of-concept evidence, reproduction steps, and clear exploitability classification and risk context.",
  },
  {
    icon: ClipboardList,
    title: "Developer-Ready Remediation",
    desc: "Actionable fix guidance tailored for engineers—not just vulnerability descriptions.",
  },
  {
    icon: RefreshCw,
    title: "Retest After Fixes",
    desc: "Verification of remediated findings within the original agreed scope.",
  },
  {
    icon: Microscope,
    title: "Executive Summary",
    desc: "A concise risk overview suitable for founders, stakeholders, or compliance discussions.",
  },
];

export const audiences = [
  {
    icon: Rocket,
    title: "Early-Stage Startups",
    desc: "Identify critical vulnerabilities before launch and avoid expensive post-release security incidents.",
  },
  {
    icon: Server,
    title: "SaaS Platforms",
    desc: "Multi-tenant systems require strict tenant isolation, API security, and access-control validation.",
  },
  {
    icon: TrendingUp,
    title: "Growing Digital Businesses",
    desc: "As integrations and traffic scale, periodic testing ensures your security posture keeps pace.",
  },
];

export const support_features = [
  {
    icon: Globe,
    title: "Domain & Hosting Coordination",
    desc: "We coordinate with your hosting and domain providers so you don’t have to manage technical dashboards or renewal processes.",
  },
  {
    icon: Pencil,
    title: "Content & Minor Feature Updates",
    desc: "Text changes, image updates, and small functional adjustments handled without disrupting your workflow.",
  },
  {
    icon: RefreshCw,
    title: "Dependency Updates",
    desc: "Libraries, plugins, and frameworks kept up to date to reduce compatibility risks and security exposure.",
  },
  {
    icon: Bell,
    title: "Renewal Management",
    desc: "Proactive alerts for domain, SSL, and hosting renewals so nothing lapses unexpectedly.",
  },
  {
    icon: MessageCircle,
    title: "Technical Guidance",
    desc: "Clear, practical advice when making technology decisions that impact your application.",
  },
  {
    icon: ShieldCheck,
    title: "Security Patch Updates",
    desc: "Essential security patches applied consistently to address known vulnerabilities as they arise.",
  },
];

export const audience = [
  {
    icon: User,
    title: "Non‑Technical Business Owners",
    desc: "Focus on running your business while we quietly manage the technical upkeep.",
  },
  {
    icon: Rocket,
    title: "Startups Without In‑House Developers",
    desc: "Early-stage teams needing reliable technical support without committing to a full-time hire.",
  },
  {
    icon: TrendingUp,
    title: "Growing Applications",
    desc: "Products that require periodic updates and adjustments as users and features scale.",
  },
  {
    icon: Users,
    title: "Teams Requiring Ongoing Guidance",
    desc: "Organizations that occasionally need informed technical input without retaining a permanent consultant.",
  },
];

export const plans = [
  {
    icon: Monitor,
    title: "Basic Support",
    desc: "Ideal for stable websites and low-change applications.",
    features: [
      "Renewal management",
      "Dependency updates",
      "Email-based technical guidance",
      "Minor content corrections",
    ],
    featured: false,
  },
  {
    icon: Monitor,
    tag: "Most suitable for active apps",
    title: "Extended Support",
    desc: "For dynamic applications requiring regular updates and closer oversight.",

    features: [
      "Everything in Basic",
      "Feature & content updates",
      "Domain & hosting coordination",
      "Priority response",
      "Periodic review discussions",
    ],
    featured: true,
  },
];
