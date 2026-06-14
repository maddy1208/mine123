import { PageHeader, Section, SectionHeader } from "../components/site/Section";
import { Reveal } from "../components/site/Reveal";
import { SEO } from "../components/SEO";
import { team, values, timeline, stats } from "../data/site";

export function About() {
  const organizationStructuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "PudhuTech",
    url: "https://pudhutech.com",
    logo: "https://pudhutech.com/logo.png",
    description:
      "A boutique digital engineering studio specializing in web development and security testing services. Founded in 2022.",
    foundingDate: "2022",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Chennai",
      addressCountry: "IN",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+91-6380076528",
      contactType: "customer service",
      email: "hello@pudhutech.com",
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
        title="About Us"
        description="Learn about PudhuTech - a boutique digital engineering studio founded in 2022 specializing in secure web development and security testing services. 20+ projects delivered, 3+ years in development and security."
        keywords="about PudhuTech, digital agency story, engineering team, company mission, tech startup, web development company, security testing company"
        structuredData={organizationStructuredData}
        canonical="https://pudhutech.com/about"
      />
      <PageHeader
        eyebrow="Our story"
        title="Building Secure Web Applications Since 2022"
        description="Founded in 2022, PudhuTech began with a focused mission—to build secure, scalable web applications and help businesses identify security risks before they become costly problems. Since then, we’ve evolved into a security-first development studio serving growing businesses and startups."
      />

      <Section>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <Reveal>
            <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Mission
            </span>
            <h2 className="mt-3 text-4xl font-bold text-gradient leading-tight tracking-tight">
              To deliver secure, scalable web solutions that actually work.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-sm text-muted-foreground leading-[1.7] tracking-wide">
              We specialize in web development and security testing. Whether you need a simple
              landing page, a complex e-commerce platform, or a comprehensive security audit, we
              bring technical expertise and practical experience to every project.
            </p>
          </Reveal>
        </div>
      </Section>

      <Section>
        <div className="glass-strong rounded-3xl p-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="text-3xl md:text-5xl font-bold text-gradient-primary">{s.value}</div>
              <div className="mt-2 text-xs text-muted-foreground tracking-[0.15em] uppercase">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeader eyebrow="Our values" title="Principles That Guide Our Work" />
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {values.map((v, i) => (
            <Reveal key={v.title} delay={i * 0.06}>
              <div className="h-full glass rounded-3xl p-7 hover:bg-white/[0.05] transition-colors">
                <div className="w-12 h-12 rounded-2xl bg-gradient-primary/20 flex items-center justify-center mb-5">
                  <v.icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-semibold tracking-tight mb-2">{v.title}</h3>
                <p className="text-sm text-muted-foreground leading-[1.7] tracking-wide">
                  {v.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeader eyebrow="Journey" title="Focused Growth Since 2022" />
        <div className="max-w-3xl mx-auto">
          <div className="relative pl-8 space-y-8 border-l border-white/10">
            {timeline.map((t, i) => (
              <Reveal key={t.year} delay={i * 0.05}>
                <div className="relative">
                  <div className="absolute -left-[37px] top-1.5 w-4 h-4 rounded-full bg-gradient-primary glow-primary" />
                  <div className="text-xs uppercase tracking-[0.2em] text-accent">{t.year}</div>
                  <h3 className="mt-1 text-xl font-semibold tracking-tight">{t.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-[1.7] tracking-wide">
                    {t.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      <Section>
        <SectionHeader
          eyebrow="Team"
          title="The Team"
          description="A focused, cross-functional team driven by engineering discipline and security-first thinking."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {team.map((m, i) => (
            <Reveal key={m.name} delay={i * 0.05}>
              <div className="glass rounded-3xl p-7 flex items-center gap-4 hover:bg-white/[0.05] hover:-translate-y-0.5 transition-all duration-200">
                <div className="w-14 h-14 rounded-2xl bg-gradient-primary flex items-center justify-center font-semibold flex-shrink-0">
                  {m.avatar}
                </div>
                <div>
                  <div className="font-semibold tracking-tight">{m.name}</div>
                  <div className="text-sm text-muted-foreground tracking-wide mt-0.5">{m.role}</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>
    </>
  );
}
