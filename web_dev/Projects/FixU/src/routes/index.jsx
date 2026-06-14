import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Star, Check, ChevronRight, MessageCircleMore } from "lucide-react";
import { Section, SectionHeader } from "../components/site/Section";
import { Reveal } from "../components/site/Reveal";
import { SEO } from "../components/SEO";
import {
  features,
  services,
  stats,
  testimonials,
  devPlans as plans,
  faqs,
  partners,
  floatCards,
  tags,
  heroStats,
  whatsappURL,
} from "../data/site";
import { useEffect, useRef, useState } from "react";

function useTypewriter(words, speed = 90, pause = 1800) {
  const [text, setText] = useState("");
  const wordIdx = useRef(0);
  const charIdx = useRef(0);
  const deleting = useRef(false);
  useEffect(() => {
    let timer;
    const tick = () => {
      const word = words[wordIdx.current];
      if (!deleting.current) {
        charIdx.current++;
        setText(word.slice(0, charIdx.current));
        if (charIdx.current === word.length) {
          deleting.current = true;
          timer = setTimeout(tick, pause);
          return;
        }
      } else {
        charIdx.current--;
        setText(word.slice(0, charIdx.current));
        if (charIdx.current === 0) {
          deleting.current = false;
          wordIdx.current = (wordIdx.current + 1) % words.length;
        }
      }
      timer = setTimeout(tick, deleting.current ? 50 : speed);
    };
    timer = setTimeout(tick, 400);
    return () => clearTimeout(timer);
  }, []);
  return text;
}

function HeroCanvas() {
  return (
    <div className="relative w-full h-[560px]">
      {/* Central orb */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-[320px] h-[320px]">
          <div className="absolute inset-0 rounded-full bg-gradient-primary blur-3xl opacity-50 animate-pulse-glow" />
          <div className="absolute inset-8 rounded-full bg-gradient-primary glow-primary flex items-center justify-center">
            <img
              src="/logo-icon.png"
              alt="PudhuTech Logo"
              className="w-2/3 h-2/3 object-contain brightness-0 invert mix-blend-overlay"
            />
          </div>
          <div className="absolute -inset-6 rounded-full border border-primary/30 animate-spin-slow" />
          <div
            className="absolute -inset-16 rounded-full border border-purple/20 animate-spin-slow"
            style={{ animationDirection: "reverse", animationDuration: "30s" }}
          />
        </div>
      </div>

      {floatCards.map((c, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 + c.delay * 0.2, duration: 0.6 }}
          className={`absolute ${c.pos}`}
          style={{
            animation: `float${i % 2 ? "B" : "A"} ${5 + i}s ease-in-out infinite`,
          }}
        >
          <div className={`glass-strong rounded-2xl p-4 min-w-[140px] bg-gradient-to-br ${c.tint}`}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                <c.Icon className="w-4 h-4 text-white" />
              </div>
              <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
                {c.label}
              </span>
            </div>
            <div className="text-2xl font-bold text-gradient-primary">{c.val}</div>
          </div>
        </motion.div>
      ))}

      {tags.map((t, i) => (
        <motion.div
          key={t.label}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 + i * 0.15 }}
          className={`absolute ${t.pos} glass rounded-full px-4 py-1.5 text-xs font-medium`}
          style={{
            animation: `float${i % 2 ? "A" : "B"} ${6 + i}s ease-in-out infinite`,
          }}
        >
          {t.label}
        </motion.div>
      ))}

      <style>{`
        @keyframes floatA { 0%,100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-18px) rotate(2deg); } }
        @keyframes floatB { 0%,100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(14px) rotate(-3deg); } }
      `}</style>
    </div>
  );
}

function Hero() {
  const typed = useTypewriter([
    "Secure Applications.",
    "Scalable Platforms.",
    "Trust through code.",
  ]);

  return (
    <section className="relative pt-36 md:pt-40 pb-20 overflow-hidden">
      <div className="absolute inset-0 bg-mesh opacity-80 pointer-events-none" />
      <div className="container mx-auto px-4 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs font-medium mb-6 text-primary border border-primary/20">
              <Sparkles className="w-3.5 h-3.5" />
              Premium Digital Agency
            </span>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-[-0.02em] leading-[1.05]">
              <span className="text-foreground">We Build </span>
              <br />
              <span className="text-gradient animate-gradient bg-[length:200%_auto]">{typed}</span>
              <span className="text-primary animate-blink">|</span>
            </h1>
            <p className="mt-7 text-lg text-muted-foreground max-w-xl leading-[1.75] tracking-wide">
              PudhuTech builds and secures web applications for startups and growing
              businesses—designed for performance, scalability, and real-world security from day
              one.
            </p>
            <div className="mt-9 flex flex-col sm:flex-row items-start gap-4">
              <Link
                to="/start-project"
                className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-primary text-primary-foreground font-medium glow-primary hover:scale-[1.03] transition-transform"
              >
                Start a Project
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/work"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-foreground/20 font-medium hover:bg-foreground/5 transition-colors"
              >
                Explore Projects
              </Link>
            </div>

            <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-6">
              {heroStats.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.08 }}
                >
                  <div className="text-2xl md:text-3xl font-bold text-gradient-primary">{s.n}</div>
                  <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="hidden lg:block"
          >
            <HeroCanvas />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Partners() {
  return (
    // <Section className="!py-16">
    //   <p className="text-center text-xs uppercase tracking-[0.2em] text-muted-foreground mb-10">
    //     Trusted by teams shipping serious products
    //   </p>
    //   <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-x-10 gap-y-6 items-center opacity-70">
    //     {partners.map((p) => (
    //       <div
    //         key={p}
    //         className="text-center text-lg font-semibold tracking-tight text-muted-foreground hover:text-foreground transition-colors"
    //       >
    //         {p}
    //       </div>
    //     ))}
    //   </div>
    // </Section>
    <></>
  );
}

function Features() {
  return (
    <Section>
      <SectionHeader
        eyebrow="Why PudhuTech"
        title="Design. Build. Secure."
        description="A focused team of developers and security researchers - small enough to care, experienced enough to deliver."
      />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {features.map((f, i) => (
          <Reveal key={f.title} delay={i * 0.05}>
            <div className="group relative h-full glass rounded-3xl p-7 hover:bg-white/[0.05] transition-colors overflow-hidden">
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-gradient-primary/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <f.icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-lg font-semibold mb-2 tracking-tight">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-[1.7] tracking-wide">
                  {f.desc}
                </p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function ServicesPreview() {
  return (
    <Section>
      <SectionHeader
        eyebrow="Services"
        title="Focused. Secure. Scalable."
        description="We specialize in secure web application development and in-depth security testing—staying focused so we deliver with precision."
      />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {services.slice(0, 6).map((s, i) => (
          <Reveal key={s.title} delay={i * 0.05}>
            <div className="group relative h-full glass rounded-3xl p-7 hover:-translate-y-1 transition-transform">
              {s.tag && (
                <span className="absolute top-5 right-5 text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded-full bg-gradient-primary text-primary-foreground">
                  {s.tag}
                </span>
              )}
              <div className="w-12 h-12 rounded-2xl bg-gradient-primary flex items-center justify-center mb-5 glow-primary">
                <s.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2 tracking-tight">{s.title}</h3>
              <p className="text-sm text-muted-foreground leading-[1.7] tracking-wide mb-5">
                {s.desc}
              </p>
              <Link
                to="/services"
                className="inline-flex items-center gap-1 text-sm text-accent hover:gap-2 transition-all"
              >
                Explore <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function Stats() {
  return (
    <Section>
      <div className="glass-strong rounded-3xl p-10 md:p-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-primary opacity-10" />
        <div className="relative grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08}>
              <div>
                <div className="text-4xl md:text-6xl font-bold text-gradient-primary">
                  {s.value}
                </div>
                <div className="mt-2 text-sm text-muted-foreground">{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}

function TestimonialCard({ t }) {
  return (
    <div
      className="flex-shrink-0 w-[340px] glass rounded-3xl p-7 mx-3 hover:bg-white/[0.06] transition-colors flex flex-col"
      style={{ minHeight: "220px" }}
    >
      <div className="flex gap-0.5 mb-4">
        {Array.from({ length: 5 }).map((_, j) => (
          <Star key={j} className="w-3.5 h-3.5 fill-accent text-accent" />
        ))}
      </div>
      <p className="text-base leading-relaxed tracking-wide text-foreground/90 flex-1">
        "{t.quote}"
      </p>
      <div className="flex items-center gap-3 mt-5">
        <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center font-semibold text-sm flex-shrink-0">
          {t.avatar}
        </div>
        <div>
          <div className="text-sm font-semibold tracking-wide">{t.name}</div>
          <div className="text-xs text-muted-foreground tracking-wider">{t.role}</div>
        </div>
      </div>
    </div>
  );
}

function Testimonials() {
  return (
    <Section>
      <SectionHeader eyebrow="Client love" title="What our clients say" />
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 z-10 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 z-10 bg-gradient-to-l from-background to-transparent" />
        <div
          className="flex"
          style={{ animation: "marquee-scroll 40s linear infinite", width: "max-content" }}
        >
          {[...testimonials, ...testimonials].map((t, i) => (
            <TestimonialCard key={i} t={t} />
          ))}
        </div>
      </div>
      <style>{`
        @keyframes marquee-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </Section>
  );
}
function PricingPreview() {
  return (
    <Section>
      <SectionHeader
        eyebrow="Project packages"
        title="Clear scopes. Flexible pricing."
        description="Pick a package that fits your stage. Custom scopes always welcome."
      />
      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {plans.map((p, i) => (
          <Reveal key={p.name} delay={i * 0.08}>
            <div
              className={`relative h-full rounded-3xl p-8 transition-all duration-300 flex flex-col ${
                p.highlighted
                  ? "glass-strong bg-gradient-primary/10 border-2 border-primary/30 scale-105 shadow-2xl glow-primary"
                  : "glass hover:scale-[1.02] hover:shadow-xl hover:border-primary/20"
              }`}
            >
              {p.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-semibold uppercase tracking-[0.12em] px-4 py-1.5 rounded-full bg-gradient-primary text-primary-foreground shadow-lg whitespace-nowrap">
                  Most popular
                </span>
              )}

              {/* Plan name - large, like screenshot */}
              <div className="flex items-center gap-3 mb-3 flex-wrap">
                <h3 className="text-2xl font-bold tracking-tight text-foreground">{p.name}</h3>
                {p.tag && (
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-foreground text-background">
                    {p.tag}
                  </span>
                )}
              </div>

              {/* Description */}
              <p
                className={`text-sm leading-relaxed tracking-wide mb-6 ${p.highlighted ? "text-foreground/80" : "text-muted-foreground"}`}
              >
                {p.desc}
              </p>

              {/* Features list */}
              <ul className="space-y-3 mb-6">
                {p.features.slice(0, 5).map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm leading-relaxed">
                    <Check
                      className={`w-4 h-4 mt-0.5 shrink-0 ${p.highlighted ? "text-primary" : "text-accent"}`}
                    />
                    <span
                      className={`tracking-wide ${p.highlighted ? "text-foreground" : "text-muted-foreground"}`}
                    >
                      {f}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                to="/pricing"
                className={`block text-center w-full py-4 rounded-2xl font-semibold tracking-wide transition-all duration-200 text-sm ${
                  p.highlighted
                    ? "bg-foreground text-background hover:opacity-90 shadow-lg"
                    : "bg-foreground text-background hover:opacity-90"
                }`}
              >
                {p.cta}
              </Link>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
function FAQ() {
  const [open, setOpen] = useState(0);
  return (
    <Section>
      <SectionHeader eyebrow="FAQ" title="Questions Answered" />
      <div className="max-w-3xl mx-auto space-y-3">
        {faqs.slice(0, 7).map((f, i) => (
          <Reveal key={f.q} delay={i * 0.04}>
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full text-left glass rounded-2xl p-6 hover:bg-white/[0.05] transition-colors"
            >
              <div className="flex items-center justify-between gap-4">
                <span className="font-medium tracking-wide">{f.q}</span>
                <ChevronRight
                  className={`w-4 h-4 shrink-0 transition-transform ${open === i ? "rotate-90" : ""}`}
                />
              </div>
              <motion.div
                initial={false}
                animate={{
                  height: open === i ? "auto" : 0,
                  opacity: open === i ? 1 : 0,
                }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <p className="pt-4 text-sm text-muted-foreground leading-[1.7] tracking-wide">
                  {f.a}
                </p>
              </motion.div>
            </button>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function CTA() {
  return (
    <Section>
      <div className="relative glass-strong rounded-3xl p-10 md:p-20 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-primary opacity-20" />
        <div className="absolute inset-0 bg-mesh opacity-50" />
        <div className="relative">
          <h2 className="text-4xl md:text-6xl font-bold tracking-[-0.02em]">
            <span className="text-gradient">Ready to Start</span>
            <br />
            <span className="text-gradient-primary">Your Project?</span>
          </h2>
          <p className="mt-5 text-lg text-muted-foreground max-w-xl mx-auto leading-[1.75] tracking-wide">
            Share your project details with us. We'll respond within one business day with a
            proposal and next steps.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/start-project"
              className="px-7 py-3.5 rounded-2xl bg-gradient-primary text-primary-foreground font-medium glow-primary hover:scale-[1.03] transition-transform"
            >
              Start a project
            </Link>
            <Link
              to="/services"
              className="px-7 py-3.5 rounded-2xl glass-strong font-medium hover:bg-white/10 transition-colors"
            >
              View services
            </Link>
          </div>
        </div>
      </div>
    </Section>
  );
}

function FloatingActions() {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        {/* Sub-buttons - shown when expanded */}
        <div
          className="flex flex-col items-end gap-2.5 transition-all duration-300 origin-bottom"
          style={{
            opacity: expanded ? 1 : 0,
            transform: expanded ? "translateY(0) scale(1)" : "translateY(12px) scale(0.92)",
            pointerEvents: expanded ? "auto" : "none",
          }}
        >
          {/* Chat with us */}
          <a
            className="group flex items-center gap-3 glass-strong rounded-2xl px-5 py-3 hover:bg-white/10 transition-all duration-200 shadow-xl border border-white/10 hover:scale-[1.03]"
            onClick={() => setExpanded(false)}
            href={whatsappURL}
            target="_blank"
            rel="noopener noreferrer"
          >
            {" "}
            {/* <MessageCircleMore className="w-6 h-6 text-accent" /> */}
            <div className="w-6 h-6 rounded-2xl bg-gradient-primary flex items-center justify-center  glow-primary">
              <MessageCircleMore className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm font-medium tracking-wide text-foreground/90 whitespace-nowrap">
              Quick Question?
            </span>
          </a>
        </div>

        {/* Main toggle button */}
        <button
          onClick={() => setExpanded((v) => !v)}
          className="w-14 h-14 rounded-2xl bg-gradient-primary flex items-center justify-center glow-primary shadow-2xl hover:scale-110 transition-transform duration-200 border border-white/10"
          aria-label="Toggle contact options"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6 text-white transition-transform duration-300"
            style={{ transform: expanded ? "rotate(45deg)" : "rotate(0deg)" }}
          >
            {expanded ? (
              <path
                fillRule="evenodd"
                d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z"
                clipRule="evenodd"
              />
            ) : (
              <path
                fillRule="evenodd"
                d="M4.848 2.771A49.144 49.144 0 0 1 12 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 0 1-3.476.383.39.39 0 0 0-.297.17l-2.755 4.133a.75.75 0 0 1-1.248 0l-2.755-4.133a.39.39 0 0 0-.297-.17 48.9 48.9 0 0 1-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97Z"
                clipRule="evenodd"
              />
            )}
          </svg>
        </button>
      </div>
    </>
  );
}

export function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "PudhuTech",
    description:
      "PudhuTech is a boutique digital engineering studio crafting high-performance web applications, SaaS platforms, and fortified digital infrastructure.",
    url: "https://pudhutech.com",
    logo: "https://pudhutech.com/logo.png",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+91-6380076528",
      contactType: "customer service",
      email: "hello@pudhutech.com",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Chennai",
      addressCountry: "IN",
    },
    sameAs: [
      "https://twitter.com/pudhutech",
      "https://github.com/pudhutech",
      "https://linkedin.com/company/pudhutech",
    ],
  };

  return (
    <>
      <SEO
        title="Home"
        description="PudhuTech builds and secures web applications for startups and growing businesses—designed for performance, scalability, and real-world security from day one. 20+ projects delivered, 30+ verified security findings."
        keywords="web development, SaaS, digital agency, React, Next.js, full-stack development, premium digital services, security testing, penetration testing, secure web applications"
        structuredData={structuredData}
        canonical="https://pudhutech.com"
      />
      <Hero />
      <Partners />
      <Features />
      <ServicesPreview />
      <Stats />
      <Testimonials />
      <FAQ />
      <CTA />
      <FloatingActions />
    </>
  );
}
