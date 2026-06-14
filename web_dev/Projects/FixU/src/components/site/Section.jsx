import { motion } from "framer-motion";
import {} from "react";

export function Section({ children, className = "", id }) {
  return (
    <section id={id} className={`relative py-20 md:py-28 ${className}`}>
      <div className="container mx-auto px-4">{children}</div>
    </section>
  );
}

export function SectionHeader({ eyebrow, title, description, center = true }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6 }}
      className={`max-w-2xl mb-14 ${center ? "mx-auto text-center" : ""}`}
    >
      {eyebrow && (
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs font-medium text-muted-foreground mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-glow" />
          {eyebrow}
        </span>
      )}
      <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
        <span className="text-gradient">{title}</span>
      </h2>
      {description && (
        <p className="mt-4 text-base md:text-lg text-muted-foreground">{description}</p>
      )}
    </motion.div>
  );
}

export function PageHeader({ eyebrow, title, description }) {
  return (
    <section className="relative pt-40 pb-16">
      <div className="absolute inset-0 bg-mesh opacity-60 pointer-events-none" />
      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          {eyebrow && (
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs font-medium text-muted-foreground mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-glow" />
              {eyebrow}
            </span>
          )}
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
            <span className="text-gradient">{title}</span>
          </h1>
          {description && <p className="mt-5 text-lg text-muted-foreground">{description}</p>}
        </motion.div>
      </div>
    </section>
  );
}
