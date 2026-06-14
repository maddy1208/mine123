import { PageHeader, Section, SectionHeader } from "../components/site/Section";
import { Reveal } from "../components/site/Reveal";
import { SEO } from "../components/SEO";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Check,
  Globe,
  LayoutDashboard,
  ShoppingCart,
  BarChart2,
  Settings2,
  Lock,
  ShieldCheck,
  Filter,
  Radio,
  FlaskConical,
  Clock,
  Layers,
  Zap,
  Database,
  Server,
  Code2,
  GitBranch,
  Cloud,
  LockKeyhole,
  Rocket,
  Calendar,
} from "lucide-react";

import { whatWeBuild, devProcess, securityPractices, techStack, meetlink } from "../data/site";

// ─── Page ─────────────────────────────────────────────────────────────────────

export function SecureWebDev() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Secure Web Application Development",
    provider: {
      "@type": "Organization",
      name: "PudhuTech",
      url: "https://pudhutech.com",
    },
    areaServed: ["United States", "Global"],
    description:
      "We design and build scalable web applications with security integrated from day one — authentication, RBAC, input validation, and secure API practices built in throughout.",
  };

  return (
    <>
      <SEO
        title="Secure Web Application Development"
        description="PudhuTech designs and builds scalable web applications with security built in from day one. MERN, Next.js, secure APIs, authentication, RBAC, and production-ready deployment. 4-8 week delivery."
        keywords="secure web application development, MERN stack, Next.js, web app security, SaaS development, custom dashboard, Chennai web development, secure coding, authentication, RBAC"
        structuredData={structuredData}
        canonical="https://pudhutech.com/services/secure-web-development"
      />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <PageHeader
        eyebrow="Service"
        title="Secure Web Application Development"
        description="We design and develop scalable web applications with security built into every stage of development from the start—not added as an afterthought after launch. This ensures your application is reliable, secure, and ready to grow with your business."
      />

      {/* Hero CTA + stat strip — sits between PageHeader and first Section */}
      <div className="container mx-auto px-6 pb-16 -mt-2">
        {/* Stats strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Clock, stat: "4–8 weeks", label: "Typical Delivery" },
            { icon: ShieldCheck, stat: "Security-First", label: "From Architecture" },
            { icon: Zap, stat: "MERN + Next.js", label: "Core Stack" },
            {
              icon: LockKeyhole,
              stat: "Essential Security Testing",
              label: "Included in Every Project",
            },
          ].map((item, i) => (
            <Reveal key={item.stat} delay={i * 0.06}>
              <div className="glass rounded-2xl px-5 py-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-primary/15 flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <div className="font-semibold text-sm tracking-tight">{item.stat}</div>
                  <div className="text-xs text-muted-foreground tracking-wide">{item.label}</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        {/* ── Inline CTA: Contact / Book a call ── */}
        <div className="container mx-auto px-6 pt-12 pb-2">
          <Reveal>
            <div className="glass rounded-2xl px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-primary/15 flex items-center justify-center flex-shrink-0">
                  <Rocket className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-base tracking-tight mb-1">
                    Have a Question or Planning a Project?
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed tracking-wide">
                    Whether you're exploring ideas or ready to build, we'll guide you to the right
                    next step.
                  </p>
                </div>
              </div>
              {/* cta buttons*/}
              <div className="flex flex-wrap gap-3 flex-shrink-0">
                <Link
                  to="/start-project"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-primary text-primary-foreground text-sm font-semibold glow-primary hover:scale-[1.03] active:scale-[0.99] transition-transform shadow-lg"
                >
                  <Rocket className="w-4 h-4" />
                  Start a project
                </Link>

                <a
                  href={meetlink ? meetlink : "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl glass border border-white/10 text-sm font-semibold hover:bg-white/5 hover:scale-[1.03] active:scale-[0.99] transition-all"
                >
                  <Calendar className="w-4 h-4 text-accent" />
                  Book a call
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      {/* ── What We Build ─────────────────────────────────────────────────── */}
      <Section>
        <SectionHeader
          eyebrow="What we build"
          title="Applications We Build"
          description="From business websites to complex SaaS platforms, we build systems designed for long-term
          scalability and maintainability."
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {whatWeBuild.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.05}>
              <div className="group relative h-full glass rounded-3xl p-7 hover:-translate-y-1 transition-transform flex flex-col">
                {s.tag && (
                  <span className="absolute top-5 right-5 text-[10px] font-semibold uppercase tracking-[0.12em] px-2.5 py-1 rounded-full bg-gradient-primary text-primary-foreground">
                    {s.tag}
                  </span>
                )}
                <div className="w-12 h-12 rounded-2xl bg-gradient-primary flex items-center justify-center mb-5 glow-primary group-hover:scale-110 transition-transform">
                  <s.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold tracking-tight mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-[1.7] tracking-wide mb-5">
                  {s.desc}
                </p>
                <ul className="space-y-2.5 mb-6 flex-1">
                  {s.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-2.5 text-sm text-muted-foreground leading-relaxed"
                    >
                      <Check className="w-4 h-4 mt-0.5 text-accent shrink-0" />
                      <span className="tracking-wide">{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/start-project"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:gap-2.5 transition-all mt-auto"
                >
                  Discuss your project
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ── Development Process ───────────────────────────────────────────── */}
      <Section>
        <SectionHeader eyebrow="Process" title="A Clear Path from Idea to Production" />
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-5">
          {devProcess.map((p, i) => (
            <Reveal key={p.step} delay={i * 0.07}>
              <div className="h-full glass rounded-3xl p-7 relative overflow-hidden group hover:bg-white/[0.05] transition-colors">
                <div className="absolute -top-3 -right-2 text-8xl font-bold text-white/[0.04] select-none leading-none">
                  {p.step}
                </div>
                <div className="flex items-center gap-2 mb-3 relative">
                  <div className="w-2 h-2 rounded-full bg-gradient-primary glow-primary flex-shrink-0" />
                  <div className="text-[10px] text-accent font-semibold tracking-[0.18em] uppercase">
                    Step {p.step}
                  </div>
                </div>
                <h3 className="font-semibold text-base tracking-tight mb-2 relative">{p.title}</h3>
                <p className="text-sm text-muted-foreground leading-[1.7] tracking-wide relative">
                  {p.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ── Security Built-In ─────────────────────────────────────────────── */}
      <Section>
        <SectionHeader
          eyebrow="Security"
          title="Security Built In - From the Start"
          description="Security controls are defined during architecture and enforced throughout implementation."
        />

        {/* Four security cards */}
        <div className="grid md:grid-cols-2 gap-5 mb-6">
          {securityPractices.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.06}>
              <div className="group h-full glass rounded-3xl p-7 flex flex-col hover:-translate-y-1 transition-transform">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-primary flex items-center justify-center glow-primary group-hover:scale-110 transition-transform flex-shrink-0">
                    <item.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-base tracking-tight">{item.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-[1.7] tracking-wide mb-5">
                  {item.desc}
                </p>
                <ul className="space-y-2 mt-auto">
                  {item.points.map((pt) => (
                    <li
                      key={pt}
                      className="flex items-start gap-2.5 text-sm text-muted-foreground leading-relaxed"
                    >
                      <Check className="w-4 h-4 mt-0.5 text-accent shrink-0" />
                      <span className="tracking-wide">{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Manual security testing callout */}
        <Reveal delay={0.25}>
          <div className="glass-strong rounded-3xl p-7 flex flex-col sm:flex-row sm:items-center gap-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-mesh opacity-30 pointer-events-none" />

            <div className="relative flex-1">
              <h3 className="font-semibold text-lg tracking-tight mb-2">
                Advanced Security Validation
              </h3>
              <p className="text-sm text-muted-foreground leading-[1.7] tracking-wide max-w-2xl">
                Every application includes essential secure coding practices by default. For
                projects requiring deeper validation, we provide manual security testing—including
                authentication bypass attempts, privilege escalation checks, and API
                enumeration—within higher-tier engagements. All critical findings are documented
                with severity ratings and clear remediation guidance.{" "}
              </p>
            </div>
            <Link
              to="/pricing#security_pricing"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:gap-2.5 transition-all flex-shrink-0 relative"
            >
              See security plans
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </Reveal>
      </Section>

      {/* ── Tech Stack ────────────────────────────────────────────────────── */}
      <Section>
        <SectionHeader
          eyebrow="Technology"
          title="Tech Stack"
          description="We use modern, production-ready technologies suited for scalable web systems."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {techStack.map((item, i) => (
            <Reveal key={item.label} delay={i * 0.05}>
              <div className="glass rounded-2xl px-6 py-5 flex items-center gap-4 hover:bg-white/[0.06] hover:-translate-y-0.5 transition-all duration-200">
                <div className="w-11 h-11 rounded-xl bg-gradient-primary/20 flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <div className="font-semibold text-sm tracking-tight">{item.label}</div>
                  <div className="text-xs text-muted-foreground tracking-wide mt-0.5">
                    {item.note}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ── Timeline ──────────────────────────────────────────────────────── */}
      <Section>
        <SectionHeader
          eyebrow="Timeline"
          title="Typical Timeline"
          description="Most web application projects are completed within 4–8 weeks, depending on scope and complexity.

"
        />
        <Reveal>
          <div className="glass rounded-3xl p-8 grid md:grid-cols-3 gap-8 items-center">
            <div className="md:col-span-1">
              <p className="text-[10px] text-accent font-semibold tracking-[0.18em] uppercase mb-2">
                Estimated delivery
              </p>
              <p className="text-5xl font-bold tracking-tight text-gradient-primary leading-none mb-3">
                4–8<span className="text-2xl ml-1">Weeks</span>
              </p>
              <p className="text-xs text-muted-foreground tracking-wide">
                Scope locked in week one
              </p>
            </div>
            <div className="md:col-span-2 grid sm:grid-cols-2 gap-4">
              {[
                { label: "Week 1", note: "Discovery, specification, and timeline sign-off" },
                { label: "Weeks 2–4", note: "Architecture, design, and first milestone build" },
                {
                  label: "Weeks 5–7",
                  note: "Core implementation with structured security reviews",
                },
                { label: "Week 7–8", note: "QA, final validation, and production deployment" },
              ].map((phase) => (
                <div key={phase.label} className="glass rounded-2xl px-5 py-4">
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-gradient-primary glow-primary flex-shrink-0" />
                    <span className="text-xs font-semibold text-accent tracking-wide">
                      {phase.label}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-[1.6] tracking-wide">
                    {phase.note}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </Section>

      {/* ── Final CTA ─────────────────────────────────────────────────────── */}
      <Section>
        <Reveal>
          <div className="glass-strong rounded-3xl p-12 sm:p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-mesh opacity-40 pointer-events-none" />
            <div className="absolute inset-0 grid-pattern opacity-30 pointer-events-none" />
            <div className="relative">
              <div className="text-[10px] text-accent font-semibold tracking-[0.2em] uppercase mb-5">
                Ready to start?
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4 text-gradient">
                Let's Build Your Application
              </h2>
              <p className="text-sm text-muted-foreground leading-[1.8] tracking-wide max-w-md mx-auto mb-8">
                Tell us about your project. We’ll define the scope clearly and outline a structured
                execution plan.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  to="/start-project"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-primary text-white text-sm font-semibold glow-primary hover:opacity-90 hover:gap-3 transition-all"
                >
                  Start a Project
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
