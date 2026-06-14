import { Link } from "react-router-dom";
import { Sparkles, Mail, ArrowUpRight, MapPin, Phone } from "lucide-react";
import Newsletter from "./Newsletter";

// ── Social icons (inline SVGs so no extra dep needed) ──────────────────────
const socials = [
  {
    label: "Instagram",
    href: "https://instagram.com/pudhutech",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-4 h-4"
      >
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: "GitHub",
    href: "https://github.com/pudhutech",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/company/pudhutech",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: "Twitter / X",
    href: "https://twitter.com/pudhutech",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
];

// ── Navigation columns ──────────────────────────────────────────────────────
const cols = [
  {
    title: "Services",
    links: [
      { label: "Web Application Development", to: "/services/secure-web-development" },
      { label: "Security Testing", to: "/services/security-testing" },
      { label: "Post‑Launch Support", to: "/services/post-launch-support" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", to: "/about" },
      { label: "Work", to: "/work" },
      { label: "Blog", to: "/blog" },
      { label: "Contact", to: "/contact" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Pricing", to: "/pricing" },
      { label: "FAQ", to: "/faq" },
      { label: "Privacy Policy", to: "/privacy" },
      { label: "Terms of Service", to: "/terms" },
    ],
  },
];

// ── Component ───────────────────────────────────────────────────────────────
export function Footer() {
  return (
    <footer className="relative mt-32 border-t border-white/5">
      {/* top gradient line */}
      <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      {/* subtle ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-72 opacity-20"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 0%, hsl(var(--primary)) 0%, transparent 100%)",
        }}
      />

      <div className="container mx-auto px-4 pt-16 pb-10 relative z-10">
        {/* ── CTA banner ──────────────────────────────────────────── */}
        <div className="glass rounded-2xl px-8 py-8 mb-16 flex flex-col md:flex-row items-center justify-between gap-6 border border-white/8 relative overflow-hidden">
          <div
            aria-hidden
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 50% 80% at 0% 50%, hsl(var(--primary)) 0%, transparent 80%)",
            }}
          />
          <div className="relative">
            <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-1">
              Let's Talk
            </p>
            <h3 className="text-xl md:text-2xl font-bold">Have a project in mind?</h3>
          </div>
          <Link
            to="/contact"
            className="relative shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-primary text-primary-foreground text-sm font-semibold glow-primary transition-transform hover:scale-105"
          >
            Start a conversation
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* ── Main grid ───────────────────────────────────────────── */}
        <div className="grid lg:grid-cols-6 gap-10">
          {/* Brand column */}
          <div className="lg:col-span-3 space-y-5 pr-0 lg:pr-10">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="relative flex-shrink-0">
                <div className="absolute inset-0  blur-md opacity-40 group-hover:opacity-70 transition rounded-sm" />
                <img
                  src="/logo-icon.png"
                  alt=""
                  aria-hidden="true"
                  className="relative w-8 h-8 object-contain"
                />
              </div>

              <img
                src="/logo-name.png"
                alt="PudhuTech"
                className="h-8 w-auto max-w-[120px] object-contain"
              />
            </Link>

            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              A focused development studio building scalable web applications and delivering
              practical security testing for modern businesses.
            </p>

            {/* Contact info */}
            <div className="space-y-2 pt-1">
              <a
                href="mailto:hello@pudhutech.com"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
              >
                <Mail className="w-3.5 h-3.5 shrink-0 text-primary" />
                hello@pudhutech.com
              </a>
              <a
                href="tel:+919876543210"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Phone className="w-3.5 h-3.5 shrink-0 text-primary" />
                +91 63800 76528
              </a>
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-3.5 h-3.5 shrink-0 text-primary" />
                Chennai, Tamil Nadu, India
              </span>
            </div>

            {/* Newsletter */}
            <div className="pt-2">
              <Newsletter inline />
            </div>
          </div>

          {/* Nav columns */}
          {cols.map((col) => (
            <div key={col.title} className="lg:col-span-1">
              <h4 className="text-xs uppercase tracking-widest font-semibold text-foreground/60 mb-4">
                {col.title}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.to}>
                    <Link
                      to={l.to}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors hover:translate-x-0.5 inline-block"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Bottom bar ──────────────────────────────────────────── */}
        <div className="mt-14 pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} PudhuTech. All rights reserved.
          </p>

          {/* Social icons */}
          <div className="flex items-center gap-2">
            {socials.map(({ label, href, icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="w-9 h-9 rounded-xl glass flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors"
              >
                {icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
