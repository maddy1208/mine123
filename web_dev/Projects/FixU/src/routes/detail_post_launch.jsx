import { Link } from "react-router-dom";
import {
  Check,
  Clock,
  Globe,
  Pencil,
  RefreshCw,
  Bell,
  MessageCircle,
  ShieldCheck,
  User,
  Rocket,
  TrendingUp,
  Users,
  Monitor,
  ArrowRight,
  Calendar,
} from "lucide-react";
import { PageHeader, Section, SectionHeader } from "../components/site/Section";
import { Reveal } from "../components/site/Reveal";
import { SEO } from "../components/SEO";

import { support_features as features, audience, plans, meetlink } from "../data/site";

export function PostLaunchSupport() {
  return (
    <>
      <SEO
        title="Post-Launch Support & Maintenance"
        description="Ongoing assistance to keep your web application stable, secure, and well‑managed after deployment. Domain coordination, security patches, dependency updates, and technical guidance."
        keywords="post-launch support, web application maintenance, security patches, dependency updates, technical guidance, website maintenance Chennai, app support India"
        canonical="https://pudhutech.com/services/post-launch-support"
      />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div className="relative pb-20">
        <PageHeader
          eyebrow="Post-Launch Support"
          title="Post-Launch Support & Maintenance"
          description="We provide continuous post-launch support to ensure your web application remains stable, secure, and fully operational over time. This includes regular monitoring for performance issues, timely security updates and patches, proactive bug fixes, routine maintenance, and ongoing management to keep your application running smoothly, protected against vulnerabilities, and aligned with your evolving business needs."
        />

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

      {/* ── What's Included ──────────────────────────────────────────────── */}
      <Section className="!pt-16">
        <SectionHeader
          eyebrow="What's Included"
          title="Everything your application needs to stay healthy"
          description="Our support plans ensure your application remains stable, updated, and aligned with your
          evolving business needs."
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.05}>
              <div className="h-full glass rounded-3xl p-7 flex flex-col gap-4 hover:bg-white/[0.05] transition-colors">
                <div className="w-11 h-11 rounded-2xl bg-gradient-primary/15 flex items-center justify-center flex-shrink-0">
                  <f.icon className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold tracking-tight mb-1.5">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-[1.7] tracking-wide">
                    {f.desc}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ── Who This Is For ───────────────────────────────────────────────── */}
      <Section>
        <SectionHeader
          eyebrow="Who This Is For"
          title="Who benefits from post-launch support"
          description=" You don’t need a full in‑house engineering team to maintain a stable application. These
          plans are built for teams that require dependable technical continuity without long‑term
          overhead."
        />

        <div className="grid sm:grid-cols-2 gap-4 items-stretch">
          {audience.map((a, i) => (
            <Reveal key={a.title} delay={i * 0.06} className="h-full">
              <div className="h-full glass rounded-2xl px-6 py-5 flex items-start gap-4 hover:bg-white/[0.06] hover:-translate-y-0.5 transition-all duration-200">
                <div className="w-10 h-10 rounded-xl bg-gradient-primary/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <a.icon className="w-4.5 h-4.5 text-accent" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold tracking-tight mb-1">{a.title}</h3>
                  <p className="text-sm text-muted-foreground leading-[1.7] tracking-wide">
                    {a.desc}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ── Support Plans ─────────────────────────────────────────────────── */}
      <Section>
        <SectionHeader
          eyebrow="Support Plans"
          title="Plans structured around your application’s stage."
          description="Choose the level of support that matches your current needs. Plans can evolve as your
          application grows."
        />

        <div className="flex flex-wrap justify-center gap-5">
          {plans?.map((s, i) => (
            /* 
      We target the Reveal wrapper to take up 1/3 width on desktop (minus space for gaps) 
      and center it using Flexbox.
    */
            <Reveal key={s.title} delay={i * 0.05} className="w-full md:w-[calc(33.333%-1.25rem)]">
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
                  Discuss your project <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ── Final CTA ─────────────────────────────────────────────────────── */}
      <Section>
        <div className="glass-strong rounded-3xl px-8 py-12 text-center max-w-2xl mx-auto">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-accent mb-3">
            Get Started
          </p>
          <h2 className="text-2xl font-semibold tracking-tight mb-3">Need Ongoing Support?</h2>
          <p className="text-sm text-muted-foreground leading-[1.7] tracking-wide mb-7 max-w-md mx-auto">
            Let’s discuss a plan aligned with your application and business stage. No complicated
            onboarding — just a straightforward conversation.
          </p>
          <Link
            to="/start-project"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-primary text-white text-sm font-semibold tracking-wide hover:opacity-90 transition-opacity"
          >
            Request Support Plan
          </Link>
        </div>
      </Section>
    </>
  );
}
