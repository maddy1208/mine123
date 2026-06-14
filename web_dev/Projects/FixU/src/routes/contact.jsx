import { PageHeader, Section } from "../components/site/Section";
import { Reveal } from "../components/site/Reveal";
import { SEO } from "../components/SEO";
import {
  Mail,
  MapPin,
  Twitter,
  Github,
  Linkedin,
  ArrowRight,
  Clock,
  Rocket,
  Calendar,
  Sparkles,
  Users,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useState } from "react";
import { socialLinks } from "../data/site";
import { Link } from "react-router-dom";
import { meetlink } from "../data/site";
import { supabase } from "../lib/supabaseClient"; // ← your shared client

/* ─── Reusable field ─── */
function Field({ label, name, type = "text", placeholder }) {
  return (
    <div>
      <label
        htmlFor={name}
        className="text-[10px] text-gray-600 uppercase tracking-[0.16em] font-semibold mb-2 block"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl glass text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40 tracking-wide"
      />
    </div>
  );
}

/* ─── General quick-question form ─── */
function GeneralForm() {
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    const form = e.currentTarget;
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    try {
      // 1. Insert into contact_general table
      const { error: contactError } = await supabase
        .from("contact_general")
        .insert([{ name, email, message }]);

      if (contactError) throw contactError;

      setStatus("success");
    } catch (err) {
      console.error("Supabase error:", err);
      setErrorMsg(err.message || "Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="glass-strong rounded-3xl p-12 flex flex-col items-center justify-center gap-5 text-center min-h-[320px]">
        <div className="w-16 h-16 rounded-full bg-gradient-primary/20 border border-primary/30 flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8 text-accent" />
        </div>
        <div>
          <h3 className="text-xl font-bold tracking-tight mb-2">Message Sent</h3>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
            Thanks for reaching out! We'll get back to you within one business day.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="glass-strong rounded-3xl p-8 space-y-6 h-full">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold tracking-tight mb-0.5">Quick question?</h3>
        <p className="text-sm text-muted-foreground tracking-wide leading-relaxed">
          For general inquiries or feedback, send us a message below.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Full name" name="name" placeholder="Your name" />
        <Field label="Email" name="email" type="email" placeholder="you@example.com" />
      </div>

      <div>
        <label className="text-[10px] text-gray-600 uppercase tracking-[0.16em] font-semibold mb-2 block">
          Message
        </label>
        <textarea
          name="message"
          rows={5}
          className="w-full px-4 py-3 rounded-xl glass text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40 leading-[1.75] tracking-wide resize-none"
          placeholder="Tell us what's on your mind."
        />
      </div>

      {/* Error banner */}
      {status === "error" && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {errorMsg}
        </div>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-primary text-primary-foreground text-sm font-medium glow-primary hover:scale-[1.02] active:scale-[0.99] transition-transform disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        {status === "loading" ? "Sending…" : "Send message"}
        <ArrowRight className="w-4 h-4" />
      </button>
    </form>
  );
}

/* ─── Main export ─── */
export function Contact() {
  const contactStructuredData = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact PudhuTech",
    description:
      "Get in touch with PudhuTech for web development and security testing services. Based in Chennai, India.",
    url: "https://pudhutech.com/contact",
    mainEntity: {
      "@type": "Organization",
      name: "PudhuTech",
      url: "https://pudhutech.com",
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+91-6380076528",
        contactType: "customer service",
        email: "hello@pudhutech.com",
        areaServed: "IN",
        availableLanguage: ["English"],
      },
      address: {
        "@type": "PostalAddress",
        addressLocality: "Chennai",
        addressCountry: "IN",
      },
    },
  };

  return (
    <>
      <SEO
        title="Contact Us"
        description="Have a question or planning a project? Let's talk. Email: hello@pudhutech.com — based in Chennai, India. We respond within one business day."
        keywords="contact PudhuTech, get in touch, project inquiry, software development, web development, security testing"
        structuredData={contactStructuredData}
        canonical="https://pudhutech.com/contact"
      />

      {/* ── Page header with dual CTAs ── */}
      <PageHeader
        eyebrow="Contact"
        title="Have a Question or Planning a Project? Let’s Talk"
        description="Whether you're exploring ideas or ready to build, we'll guide you to the right next step."
      >
        <div className="flex flex-wrap gap-3 justify-center mt-6">
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
      </PageHeader>

      {/* ── Contact grid ── */}
      <Section className="!pt-4">
        <div className="flex flex-col gap-6 max-w-6xl mx-auto">
          {/* ── Row 1: Promo card ── */}
          <Reveal>
            <div className="glass-strong rounded-3xl p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6 border border-primary/20 bg-gradient-primary/5">
              <div className="w-14 h-14 rounded-2xl bg-gradient-primary/20 flex items-center justify-center shrink-0">
                <Rocket className="w-7 h-7 text-accent" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold tracking-tight mb-1">
                  Planning a detailed project?
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">
                  Tell us about your goals and timeline. Our structured intake form helps us respond
                  clearly and quickly.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 shrink-0">
                <Link
                  to="/start-project"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-primary text-primary-foreground text-sm font-semibold glow-primary hover:scale-[1.03] active:scale-[0.99] transition-transform whitespace-nowrap shadow-lg"
                >
                  Start a project
                </Link>
                <a
                  href={meetlink ? meetlink : "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl glass border border-white/10 text-sm font-semibold hover:bg-white/8 hover:scale-[1.03] active:scale-[0.99] transition-all whitespace-nowrap"
                >
                  <Calendar className="w-4 h-4 text-accent" />
                  Book a call
                </a>
              </div>
            </div>
          </Reveal>

          {/* ── Row 2: Sidebar + Form side by side ── */}
          <div className="grid lg:grid-cols-5 gap-6">
            {/* Left sidebar */}
            <Reveal className="lg:col-span-2">
              <div className="glass rounded-3xl p-7 flex flex-col gap-5">
                <div className="flex flex-col gap-4">
                  {[
                    {
                      icon: Mail,
                      label: "Email",
                      value: "hello@pudhutech.com",
                      href: "mailto:hello@pudhutech.com",
                    },
                    { icon: MapPin, label: "Location", value: "Chennai, India", href: null },
                    {
                      icon: Clock,
                      label: "Response time",
                      value: "Within one business day",
                      href: null,
                    },
                  ].map((c) => (
                    <div key={c.label} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-gradient-primary/20 flex items-center justify-center shrink-0">
                        <c.icon className="w-4 h-4 text-accent" />
                      </div>
                      <div>
                        <div className="text-[10px] text-muted-foreground uppercase tracking-[0.16em] font-medium mb-0.5">
                          {c.label}
                        </div>
                        {c.href ? (
                          <a
                            href={c.href}
                            className="text-sm font-medium tracking-tight hover:text-accent transition-colors"
                          >
                            {c.value}
                          </a>
                        ) : (
                          <div className="text-sm font-medium tracking-tight">{c.value}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-white/5" />

                <div className="rounded-2xl bg-gradient-primary/10 border border-primary/20 p-4 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-accent shrink-0" />
                    <span className="text-xs font-semibold tracking-wide text-accent uppercase">
                      Ready to Start Your Project?
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Use our structured project intake form —{" "}
                    <Link to="/start-project" className="text-accent hover:underline font-medium">
                      Start a project
                    </Link>{" "}
                    so we can understand your requirements and respond with clarity.
                  </p>
                </div>

                <div className="border-t border-white/5" />

                <div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-[0.16em] font-medium mb-3">
                    Follow us
                  </div>
                  <div className="flex gap-2">
                    {socialLinks?.map(({ icon: Icon, href, label }) => (
                      <a
                        key={label}
                        href={href}
                        aria-label={label}
                        className="w-10 h-10 rounded-xl glass flex items-center justify-center hover:bg-white/10 hover:scale-105 transition-all"
                      >
                        <Icon className="w-4 h-4" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Right: General form */}
            <Reveal delay={0.1} className="lg:col-span-3">
              <GeneralForm />
            </Reveal>
          </div>
        </div>
      </Section>
    </>
  );
}
