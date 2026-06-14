import { PageHeader, Section, SectionHeader } from "../components/site/Section";
import { Reveal } from "../components/site/Reveal";
import {
  devPlans as plans,
  faqs,
  securityPlans as security_pricing,
  maintenancePlans,
} from "../data/site";
import { Check, ChevronRight, LucideAArrowDown, NotebookPenIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { SEO } from "../components/SEO";
import { meetlink } from "../data/site";

export function Pricing() {
  const [openFaq, setOpenFaq] = useState(0);

  const pricingStructuredData = {
    "@context": "https://schema.org",
    "@type": "PriceSpecification",
    priceCurrency: "USD",
    price: "varies",
    description: "Web development and security testing pricing plans",
  };

  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const el = document.getElementById(location.hash.replace("#", ""));
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);
  return (
    <>
      <SEO
        title="Pricing"
        description="Transparent pricing for web development and security testing services. Choose from Starter, Growth, and Scale plans for development, and Basic, Pro, Enterprise for security testing. No hidden fees."
        keywords="pricing, web development pricing, security testing pricing, cost, plans, packages, PudhuTech pricing, affordable web development, security audit cost"
        structuredData={pricingStructuredData}
        canonical="https://pudhutech.com/pricing"
      />
      <PageHeader
        eyebrow="Pricing"
        title="Project Packages"
        description="Clear scopes. Flexible pricing based on project requirements."
      />

      <Section className="!pt-0">
        <div className="max-w-6xl mx-auto space-y-20">
          {/* ── Pricing note ── */}
          <div className="rounded-2xl border border-primary/20 bg-primary/5 px-5 py-5 max-w-6xl">
            {/* Changed items-center to items-start for clean alignment */}
            <div className="flex items-start gap-3">
              {/* Removed mt-0.5 to let the icon align naturally with the text line-height */}
              <span className="text-primary text-base shrink-0">
                <NotebookPenIcon />
              </span>
              <p className="text-sm text-muted-foreground leading-relaxed">
                <span className="font-semibold text-foreground">Note: </span>
                These prices give you a general idea. The final cost depends on what you need and
                the scope of your project.
              </p>
            </div>
          </div>

          {/* ── Development Pricing ── */}
          <div id="development_pricing">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="inline-flex items-center gap-2 text-sm font-semibold text-primary bg-primary/10 border border-primary/25 px-4 py-2 rounded-full">
                <span className="w-2 h-2 rounded-full bg-primary shrink-0 inline-block" />
                Development Pricing
              </h2>
              <div className="flex-1 h-px bg-border/50" />
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {plans.map((p, i) => (
                <Reveal key={p.name} delay={i * 0.08}>
                  <div
                    className={`relative h-full rounded-3xl p-8 transition-all duration-300 ${
                      p.highlighted
                        ? "glass-strong bg-gradient-primary/10 border-2 border-primary/30 scale-105 shadow-2xl glow-primary"
                        : "glass hover:scale-102 hover:shadow-xl hover:border-primary/20"
                    }`}
                  >
                    {p.highlighted && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-semibold uppercase tracking-wider px-4 py-1.5 rounded-full bg-gradient-primary text-primary-foreground shadow-lg">
                        Most popular
                      </span>
                    )}
                    <div
                      className={`text-sm font-semibold mb-2 ${p.highlighted ? "text-primary" : "text-foreground"}`}
                    >
                      {p.name}
                    </div>
                    <div className="mb-4">
                      <span
                        className={`text-[11px] font-semibold uppercase tracking-wider block mb-2 ${p.highlighted ? "text-primary/70" : "text-muted-foreground"}`}
                      >
                        starting at
                      </span>
                      <span
                        className={`text-5xl font-bold ${p.highlighted ? "text-gradient-primary" : "text-foreground"}`}
                      >
                        {p.price}
                      </span>
                    </div>
                    <p
                      className={`text-sm mb-6 leading-relaxed ${p.highlighted ? "text-foreground/80" : "text-muted-foreground"}`}
                    >
                      {p.desc}
                    </p>
                    <Link
                      to="/start-project"
                      className={`block text-center w-full py-3.5 rounded-xl font-semibold mb-6 transition-all duration-200 ${
                        p.highlighted
                          ? "bg-gradient-primary text-primary-foreground hover:scale-105 shadow-lg"
                          : "bg-gradient-primary text-primary-foreground hover:scale-105"
                      }`}
                    >
                      {p.cta}
                    </Link>
                    <ul className="space-y-3">
                      {p.features.map((f) => (
                        <li key={f} className="flex items-start gap-3 text-sm leading-relaxed">
                          <Check
                            className={`w-5 h-5 mt-0.5 shrink-0 ${p.highlighted ? "text-primary" : "text-accent"}`}
                          />
                          <span
                            className={p.highlighted ? "text-foreground" : "text-muted-foreground"}
                          >
                            {f}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* ── Security Pricing ── */}
          <div id="security_pricing">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="inline-flex items-center gap-2 text-sm font-semibold text-primary bg-primary/10 border border-primary/25 px-4 py-2 rounded-full">
                <span className="w-2 h-2 rounded-full bg-primary shrink-0 inline-block" />
                Security Pricing
              </h2>
              <div className="flex-1 h-px bg-border/50" />
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {security_pricing.map((p, i) => (
                <Reveal key={p.name} delay={i * 0.08}>
                  <div
                    className={`relative h-full rounded-3xl p-8 transition-all duration-300 ${
                      p.highlighted
                        ? "glass-strong bg-gradient-primary/10 border-2 border-primary/30 scale-105 shadow-2xl glow-primary"
                        : "glass hover:scale-102 hover:shadow-xl hover:border-primary/20"
                    }`}
                  >
                    {p.highlighted && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-semibold uppercase tracking-wider px-4 py-1.5 rounded-full bg-gradient-primary text-primary-foreground shadow-lg">
                        Most popular
                      </span>
                    )}
                    <div
                      className={`text-sm font-semibold mb-2 ${p.highlighted ? "text-primary" : "text-foreground"}`}
                    >
                      {p.name}
                    </div>
                    <div className="mb-4">
                      <span
                        className={`text-[11px] font-semibold uppercase tracking-wider block mb-2 ${p.highlighted ? "text-primary/70" : "text-muted-foreground"}`}
                      >
                        starting at
                      </span>
                      <span
                        className={`text-5xl font-bold ${p.highlighted ? "text-gradient-primary" : "text-foreground"}`}
                      >
                        {p.price}
                      </span>
                    </div>
                    <p
                      className={`text-sm mb-6 leading-relaxed ${p.highlighted ? "text-foreground/80" : "text-muted-foreground"}`}
                    >
                      {p.desc}
                    </p>
                    <Link
                      to="/start-project"
                      className={`block text-center w-full py-3.5 rounded-xl font-semibold mb-6 transition-all duration-200 ${
                        p.highlighted
                          ? "bg-gradient-primary text-primary-foreground hover:scale-105 shadow-lg"
                          : "bg-gradient-primary text-primary-foreground hover:scale-105"
                      }`}
                    >
                      {p.cta}
                    </Link>
                    <ul className="space-y-3">
                      {p.features.map((f) => (
                        <li key={f} className="flex items-start gap-3 text-sm leading-relaxed">
                          <Check
                            className={`w-5 h-5 mt-0.5 shrink-0 ${p.highlighted ? "text-primary" : "text-accent"}`}
                          />
                          <span
                            className={p.highlighted ? "text-foreground" : "text-muted-foreground"}
                          >
                            {f}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
          {/* ── Maintenance ── */}
          <div id="maintenance_pricing">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="inline-flex items-center gap-2 text-sm font-semibold text-primary bg-primary/10 border border-primary/25 px-4 py-2 rounded-full">
                <span className="w-2 h-2 rounded-full bg-primary shrink-0 inline-block" />
                Maintenance Pricing
              </h2>
              <div className="flex-1 h-px bg-border/50" />
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {maintenancePlans.map((p, i) => (
                <Reveal key={p.name} delay={i * 0.08}>
                  <div
                    className={`relative h-full rounded-3xl p-8 transition-all duration-300 ${
                      p.highlighted
                        ? "glass-strong bg-gradient-primary/10 border-2 border-primary/30 scale-105 shadow-2xl glow-primary"
                        : "glass hover:scale-102 hover:shadow-xl hover:border-primary/20"
                    }`}
                  >
                    {p.highlighted && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-semibold uppercase tracking-wider px-4 py-1.5 rounded-full bg-gradient-primary text-primary-foreground shadow-lg">
                        Most popular
                      </span>
                    )}
                    <div
                      className={`text-sm font-semibold mb-2 ${p.highlighted ? "text-primary" : "text-foreground"}`}
                    >
                      {p.name}
                    </div>
                    <div className="mb-4">
                      <span
                        className={`text-[11px] font-semibold uppercase tracking-wider block mb-2 ${p.highlighted ? "text-primary/70" : "text-muted-foreground"}`}
                      >
                        starting at
                      </span>
                      <div className="flex items-end gap-2">
                        <span
                          className={`text-5xl font-bold ${p.highlighted ? "text-gradient-primary" : "text-foreground"}`}
                        >
                          {p.price}
                        </span>
                        <span
                          className={`text-sm font-medium mb-1.5 ${p.highlighted ? "text-primary/70" : "text-muted-foreground"}`}
                        >
                          / per month
                        </span>
                      </div>
                    </div>
                    <p
                      className={`text-sm mb-6 leading-relaxed ${p.highlighted ? "text-foreground/80" : "text-muted-foreground"}`}
                    >
                      {p.desc}
                    </p>
                    <Link
                      to="/start-project"
                      className={`block text-center w-full py-3.5 rounded-xl font-semibold mb-6 transition-all duration-200 ${
                        p.highlighted
                          ? "bg-gradient-primary text-primary-foreground hover:scale-105 shadow-lg"
                          : "bg-gradient-primary text-primary-foreground hover:scale-105"
                      }`}
                    >
                      {p.cta}
                    </Link>
                    <ul className="space-y-3">
                      {p.features.map((f) => (
                        <li key={f} className="flex items-start gap-3 text-sm leading-relaxed">
                          <Check
                            className={`w-5 h-5 mt-0.5 shrink-0 ${p.highlighted ? "text-primary" : "text-accent"}`}
                          />
                          <span
                            className={p.highlighted ? "text-foreground" : "text-muted-foreground"}
                          >
                            {f}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* ── Discovery Call CTA ── */}
          <Reveal>
            <div className="rounded-3xl border border-primary/20 bg-primary/5 px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="shrink-0 w-11 h-11 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.14 13.5a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.05 2.76h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21 16.92z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-foreground text-base">
                    Not sure where to start?
                  </p>
                  <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">
                    If you'd prefer to discuss your project before deciding, book a short discovery
                    call.
                  </p>
                </div>
              </div>
              <button
                onClick={() => window.open(meetlink ? meetlink : "#", "_blank")}
                className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm bg-gradient-primary text-primary-foreground hover:scale-105 transition-all duration-200 shadow-lg whitespace-nowrap"
              >
                Book a 15‑Minute Call
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </Reveal>
        </div>
      </Section>

      <Section>
        <SectionHeader eyebrow="Pricing FAQ" title="Common Questions" />
        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((f, i) => (
            <button
              key={f.q}
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
              className="w-full text-left glass rounded-2xl p-6 hover:bg-white/[0.05] transition-colors"
            >
              <div className="flex items-center justify-between gap-4">
                <span className="font-medium">{f.q}</span>
                <ChevronRight
                  className={`w-4 h-4 shrink-0 transition-transform ${openFaq === i ? "rotate-90" : ""}`}
                />
              </div>
              <motion.div
                initial={false}
                animate={{
                  height: openFaq === i ? "auto" : 0,
                  opacity: openFaq === i ? 1 : 0,
                }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <p className="pt-4 text-sm text-muted-foreground leading-relaxed">{f.a}</p>
              </motion.div>
            </button>
          ))}
        </div>
      </Section>
    </>
  );
}
