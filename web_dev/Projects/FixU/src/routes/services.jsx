import { PageHeader, Section, SectionHeader } from "../components/site/Section";
import { Reveal } from "../components/site/Reveal";
import { SEO } from "../components/SEO";
import { services } from "../data/site";
import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";

import { process, industries } from "../data/site";

export function Services() {
  const serviceStructuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Web Development and Security Testing",
    provider: {
      "@type": "Organization",
      name: "PudhuTech",
      url: "https://pudhutech.com",
    },
    areaServed: ["United States", "Global"],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Web Development and Security Services",
      itemListElement: services.map((service, index) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: service.title,
          description: service.desc,
        },
        position: index + 1,
      })),
    },
  };

  return (
    <>
      <SEO
        title="Services"
        description="PudhuTech offers secure web application development, web application security testing, and post-launch support services. We design, build, and security-test web applications with scalability and real-world risk in mind."
        keywords="web development services, security testing, penetration testing, web application security, digital agency services, software development, secure development"
        structuredData={serviceStructuredData}
        canonical="https://pudhutech.com/services"
      />
      <PageHeader
        eyebrow="Services"
        title="Secure Web Applications & Security Testing"
        description="We design, build, and security-test web applications with scalability and real-world risk in mind—ensuring your product is secure from day one."
      />

      {/* Services Grid - !pt-2 reduces the top gap so cards aren't cut off on first view */}
      <Section className="!pt-2">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.05}>
              <div className="group relative h-full glass rounded-3xl p-7 hover:-translate-y-1 transition-transform flex flex-col">
                {s.tag && (
                  <span className="absolute top-5 right-5 text-[10px] font-semibold uppercase tracking-[0.12em] px-2.5 py-1 rounded-full bg-gradient-primary text-primary-foreground">
                    {s.tag}
                  </span>
                )}
                {/* Icon */}
                <div className="w-12 h-12 rounded-2xl bg-gradient-primary flex items-center justify-center mb-5 glow-primary group-hover:scale-110 transition-transform">
                  <s.icon className="w-6 h-6 text-white" />
                </div>

                {/* Title & desc */}
                <h3 className="text-lg font-semibold tracking-tight mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-[1.7] tracking-wide mb-5">
                  {s.desc}
                </p>

                {/* Features */}
                <ul className="space-y-2.5 mb-6 flex-1">
                  {s.features.map((b) => (
                    <li
                      key={b}
                      className="flex items-start gap-2.5 text-sm text-muted-foreground leading-relaxed"
                    >
                      <Check className="w-4 h-4 mt-0.5 text-accent shrink-0" />
                      <span className="tracking-wide">{b}</span>
                    </li>
                  ))}
                </ul>
                {/* Responsive CTA Container */}
                <div className="flex flex-col sm:flex-row sm:items-center mt-6 w-full gap-6 sm:gap-0 sm:max-w-[90%]">
                  {/* Primary Button CTA */}
                  <Link
                    to="/start-project"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-primary text-primary-foreground text-sm font-semibold glow-primary hover:scale-[1.03] active:scale-[0.99] transition-transform shadow-lg w-full sm:w-auto text-center shrink-0"
                  >
                    {s.cta}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  {/* Secondary Learn More Link (Fixed Hover Direction) */}
                  <Link
                    to={s.detailLink || "/services"}
                    className="group inline-flex items-center justify-center gap-1.5 text-sm font-medium text-accent transition-transform duration-200 w-full sm:w-auto text-center py-2 sm:py-0 sm:ml-auto hover:scale-[1.03] active:scale-[0.99]"
                  >
                    <span>Learn More</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Process */}
      <Section>
        <SectionHeader eyebrow="Process" title="A Clear Path from Idea to Production" />
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {process.map((p, i) => (
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
                <h3 className="font-semibold text-lg tracking-tight mb-2 relative">{p.title}</h3>
                <p className="text-sm text-muted-foreground leading-[1.7] tracking-wide relative">
                  {p.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Industries */}
      <Section>
        <SectionHeader eyebrow="Industries" title="Industries We Work With" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {industries.map((ind, i) => (
            <Reveal key={ind.name} delay={i * 0.05}>
              <div className="glass rounded-2xl px-6 py-5 flex items-center gap-4 hover:bg-white/[0.06] hover:-translate-y-0.5 transition-all duration-200">
                <div className="w-11 h-11 rounded-xl bg-gradient-primary/20 flex items-center justify-center flex-shrink-0">
                  <ind.icon className="w-5 h-5 text-accent" />
                </div>
                <span className="font-medium tracking-wide text-sm">{ind.name}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>
    </>
  );
}
