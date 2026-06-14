import { PageHeader, Section } from "../components/site/Section";
import { Reveal } from "../components/site/Reveal";
import { faqs } from "../data/site";
import { ChevronRight, Search, MessageSquare } from "lucide-react";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { SEO } from "../components/SEO";

export function FAQPage() {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(0);
  const filtered = useMemo(
    () =>
      faqs.filter(
        (f) =>
          f.q.toLowerCase().includes(q.toLowerCase()) ||
          f.a.toLowerCase().includes(q.toLowerCase()),
      ),
    [q],
  );

  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };

  return (
    <>
      <SEO
        title="FAQ"
        description="Frequently asked questions about PudhuTech's web development and security testing services. Find answers about pricing, process, timelines, security, and more. If your question isn't listed, reach out."
        keywords="FAQ, frequently asked questions, web development FAQ, security testing FAQ, help, support, PudhuTech FAQ"
        structuredData={faqStructuredData}
        canonical="https://pudhutech.com/faq"
      />
      <PageHeader
        eyebrow="FAQ"
        title="Frequently Asked Questions"
        description="If your question isn’t listed below, feel free to reach out.
"
      />
      <Section className="!pt-0">
        <div className="max-w-3xl mx-auto">
          <div className="relative mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search the FAQ..."
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl glass placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
          <div className="space-y-3">
            {filtered.map((f, i) => (
              <Reveal key={f.q} delay={i * 0.03}>
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full text-left glass rounded-2xl p-6 hover:bg-white/[0.05] transition-colors"
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-medium">{f.q}</span>
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
                    <p className="pt-4 text-sm text-muted-foreground leading-relaxed">{f.a}</p>
                  </motion.div>
                </button>
              </Reveal>
            ))}
            {filtered.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                No results. Try different keywords.
              </div>
            )}
          </div>

          <div className="mt-12 glass-strong rounded-3xl p-10 text-center">
            <div className="w-14 h-14 rounded-2xl bg-gradient-primary mx-auto flex items-center justify-center mb-4 glow-primary">
              <MessageSquare className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gradient">Still have a question?</h3>
            <p className="mt-2 text-muted-foreground">
              We typically respond within one business day.
            </p>
            <Link
              to="/contact"
              className="inline-block mt-5 px-6 py-3 rounded-xl bg-gradient-primary text-primary-foreground font-medium glow-primary"
            >
              Contact us
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}
