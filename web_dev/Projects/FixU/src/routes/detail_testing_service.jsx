import { PageHeader, Section, SectionHeader } from "../components/site/Section";
import { Reveal } from "../components/site/Reveal";
import { SEO } from "../components/SEO";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ShieldCheck,
  Lock,
  KeyRound,
  Network,
  Bug,
  Layers,
  ClipboardList,
  Microscope,
  RefreshCw,
  BarChart3,
  Rocket,
  Server,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Activity,
  Monitor,
  Calendar,
} from "lucide-react";

import { whatWeTest, methodologySteps, deliverables, audiences, meetlink } from "../data/site";
/* ─── Static data ──────────────────────────────────────────────────────────── */

/* ─── Page Component ───────────────────────────────────────────────────────── */

export function SecurityTesting() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Web Application Security Testing",
    provider: {
      "@type": "Organization",
      name: "PudhuTech",
      url: "https://pudhutech.com",
    },
    description:
      "Manual web application security testing covering authentication, authorization, API vulnerabilities, business logic flaws, and OWASP Top 10 risks.",
  };

  return (
    <>
      <SEO
        title="Web Application Security Testing"
        description="Identify and remediate vulnerabilities before they impact your users or business. PudhuTech offers manual web application security testing with clear, actionable reporting. OWASP-aligned methodology."
        keywords="web application security testing, penetration testing, OWASP, API security, IDOR, authentication flaws, security audit, Chennai, security testing India, vulnerability assessment"
        structuredData={structuredData}
        canonical="https://pudhutech.com/services/security-testing"
      />

      {/* ── Hero ── */}
      <PageHeader
        eyebrow="Security Testing"
        title="Web Application Security Testing"
        description="We help you find and fix security vulnerabilities before they affect your users or your business. By thinking like attackers, our team identifies weaknesses early—allowing you to resolve issues before they turn into real security incidents."
      >
        <Reveal delay={0.2}>
          <Link
            to="/start-project"
            className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-full bg-gradient-primary text-white font-semibold text-sm tracking-wide hover:opacity-90 hover:gap-3 transition-all shadow-md"
          >
            Start a Security Review
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Reveal>
      </PageHeader>

      {/* ── Trust bar ── */}
      <Section className="!pt-0 !pb-8">
        <Reveal>
          <div className="glass rounded-2xl px-6 py-6 flex flex-wrap items-center justify-around gap-6 text-xs font-medium text-muted-foreground tracking-wide">
            {[
              "Manual-Led Testing",
              "OWASP-Aligned Methodology",
              "Severity-Ranked Findings",
              "Retest Included",
              "Responsible Disclosure",
            ].map((label) => (
              <span key={label} className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-accent shrink-0" />
                {label}
              </span>
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
        </Reveal>
      </Section>

      {/* ── What We Test ── */}
      <Section>
        <SectionHeader
          eyebrow="Coverage"
          title="What We Test"
          description="We evaluate critical areas where modern web applications are most commonly exploited."
        />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {whatWeTest.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.06}>
              <div className="group h-full glass rounded-3xl p-7 hover:-translate-y-1 transition-transform flex flex-col gap-4">
                <div className="w-11 h-11 rounded-2xl bg-gradient-primary flex items-center justify-center glow-primary group-hover:scale-110 transition-transform shrink-0">
                  <item.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-base tracking-tight mb-1.5">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-[1.75] tracking-wide">
                    {item.desc}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ── Methodology ── */}
      <Section>
        <SectionHeader
          eyebrow="Methodology"
          title="How We Approach Each Engagement"
          description="Every assessment follows a structured manual testing approach, aligned with real-world attack patterns."
        />

        {/* Connector line visible on lg+ */}
        <div className="relative">
          {/* Horizontal rule behind steps on large screens */}
          <div className="hidden lg:block absolute top-9 left-[calc(12.5%+1.5rem)] right-[calc(12.5%+1.5rem)] h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 relative">
            {methodologySteps.map((step, i) => (
              <Reveal key={step.step} delay={i * 0.08}>
                <div className="h-full glass rounded-3xl p-7 relative overflow-hidden group hover:bg-white/[0.05] transition-colors">
                  {/* Ghost step number */}
                  <div className="absolute -top-3 -right-2 text-8xl font-bold text-white/[0.04] select-none leading-none">
                    {step.step}
                  </div>

                  {/* Step pill */}
                  <div className="flex items-center gap-2 mb-4 relative">
                    <div className="w-2 h-2 rounded-full bg-gradient-primary glow-primary shrink-0" />
                    <span className="text-[10px] text-accent font-semibold tracking-[0.18em] uppercase">
                      Step {step.step}
                    </span>
                  </div>

                  <h3 className="font-semibold text-base tracking-tight mb-2 relative">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-[1.75] tracking-wide relative">
                    {step.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Methodology note */}
      </Section>

      {/* ── Deliverables ── */}
      <Section>
        <SectionHeader eyebrow="Deliverables" title="What You Receive" />
        <div className="grid md:grid-cols-2 gap-5">
          {deliverables.map((d, i) => (
            <Reveal key={d.title} delay={i * 0.07}>
              <div className="group h-full glass rounded-3xl p-7 flex items-start gap-5 hover:-translate-y-0.5 transition-all duration-200">
                <div className="w-11 h-11 rounded-xl bg-gradient-primary/15 flex items-center justify-center shrink-0 group-hover:bg-gradient-primary group-hover:shadow-glow transition-all duration-300">
                  <d.icon className="w-5 h-5 text-accent group-hover:text-white transition-colors duration-300" />
                </div>
                <div>
                  <h3 className="font-semibold text-base tracking-tight mb-1.5">{d.title}</h3>
                  <p className="text-sm text-muted-foreground leading-[1.75] tracking-wide">
                    {d.desc}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ── Who This Is For ── */}
      <Section>
        <SectionHeader eyebrow="Who This Is For" title="Security testing is ideal for" />
        <div className="grid md:grid-cols-3 gap-5">
          {audiences.map((a, i) => (
            <Reveal key={a.title} delay={i * 0.08}>
              <div className="h-full glass rounded-3xl p-8 text-center flex flex-col items-center gap-4 hover:bg-white/[0.07] hover:-translate-y-1 transition-all duration-200">
                <div className="w-14 h-14 rounded-2xl bg-gradient-primary flex items-center justify-center glow-primary">
                  <a.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-base tracking-tight">{a.title}</h3>
                <p className="text-sm text-muted-foreground leading-[1.75] tracking-wide">
                  {a.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ── Final CTA ── */}
      <Section>
        <Reveal>
          <div className="glass-strong rounded-3xl px-8 py-14 text-center relative overflow-hidden">
            {/* Background glow orb */}
            <div className="absolute inset-0 bg-mesh opacity-40 pointer-events-none" />
            <div className="relative">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 text-accent text-[11px] font-semibold tracking-[0.14em] uppercase mb-5">
                <ShieldCheck className="w-3.5 h-3.5" />
                Security Review
              </div>

              <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-4">
                Secure Your Application
              </h2>

              <p className="text-muted-foreground text-sm max-w-md mx-auto leading-relaxed tracking-wide mb-8">
                Tell us about your application, and we’ll outline a testing scope aligned with your
                timeline, risk profile, and business context.
              </p>

              <Link
                to="/start-project"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-primary text-white font-semibold text-sm tracking-wide hover:opacity-90 hover:gap-3 transition-all shadow-md"
              >
                Start a Security Review
                <ArrowRight className="w-4 h-4" />
              </Link>

              <p className="mt-5 text-xs text-muted-foreground tracking-wide">
                We typically respond within one business day with next steps and a structured
                scoping outline.{" "}
              </p>
            </div>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
