import { PageHeader, Section } from "../components/site/Section";
import { Reveal } from "../components/site/Reveal";
import { SEO } from "../components/SEO";
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  ShieldCheck,
  Clock,
  ChevronDown,
  Check,
  AlertCircle,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { meetlink } from "../data/site";
import { supabase } from "../lib/supabaseClient"; // ← your shared client

/* ─── Reusable text / email input ─── */
function Field({ label, name, type = "text", placeholder, required }) {
  return (
    <div>
      <label
        htmlFor={name}
        className="text-[10px] text-gray-600 uppercase tracking-[0.16em] font-semibold mb-2 block"
      >
        {label}
        {required && <span className="text-accent ml-1">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl glass text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40 tracking-wide"
      />
    </div>
  );
}

/* ─── Custom styled select ─── */
function SelectField({ label, name, options, required, value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <label className="text-[10px] text-gray-600 uppercase tracking-[0.16em] font-semibold mb-2 block">
        {label}
        {required && <span className="text-accent ml-1">*</span>}
      </label>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`w-full px-4 py-3 rounded-xl glass text-sm text-left flex items-center justify-between gap-2 tracking-wide transition-all focus:outline-none focus:ring-2 focus:ring-primary/40 ${
          open ? "ring-2 ring-primary/40" : ""
        }`}
      >
        <span className={selected ? "text-foreground" : "text-muted-foreground/60"}>
          {selected ? selected.label : "Select an option"}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute z-50 top-full mt-2 w-full glass-strong rounded-2xl border border-white/10 py-1.5 shadow-xl overflow-hidden">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-left hover:bg-white/8 transition-colors"
            >
              <span>{opt.label}</span>
              {value === opt.value && <Check className="w-3.5 h-3.5 text-accent shrink-0" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Project intake form ─── */
function ProjectIntakeForm() {
  const [agreed, setAgreed] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState("");
  const [projectType, setProjectType] = useState("");
  const [budget, setBudget] = useState("");
  const [timeline, setTimeline] = useState("");

  const projectTypes = [
    { value: "business-website", label: "Business Website" },
    { value: "web-application", label: "Web Application" },
    { value: "saas-platform", label: "SaaS Platform" },
    { value: "ecommerce", label: "E-commerce System" },
    { value: "security-testing", label: "Security Testing" },
    { value: "not-sure", label: "Not Sure Yet" },
  ];

  const budgets = [
    { value: "under-20k", label: "Under ₹20k" },
    { value: "20k-50k", label: "₹20k – ₹50k" },
    { value: "50k-1l", label: "₹50k – ₹1L" },
    { value: "1l-plus", label: "₹1L+" },
    { value: "discuss", label: "Prefer to discuss" },
  ];

  const timelines = [
    { value: "asap", label: "ASAP" },
    { value: "1-month", label: "1 Month" },
    { value: "2-3-months", label: "2–3 Months" },
    { value: "flexible", label: "Flexible" },
  ];

  async function handleSubmit(e) {
    e.preventDefault();
    if (!agreed) return;

    setStatus("loading");
    setErrorMsg("");

    const form = e.currentTarget;
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const company = form.company.value.trim();
    const description = form.description.value.trim();

    try {
      // 1. Insert into contact_project table
      const { error: projectError } = await supabase.from("contact_project").insert([
        {
          name,
          email,
          company: company || null,
          project_type: projectType || null,
          budget: budget || null,
          timeline: timeline || null,
          description,
        },
      ]);

      if (projectError) throw projectError;

      setStatus("success");
    } catch (err) {
      console.error("Supabase error:", err);
      setErrorMsg(err.message || "Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="glass-strong rounded-3xl p-12 flex flex-col items-center justify-center gap-5 text-center min-h-[400px]">
        <div className="w-16 h-16 rounded-full bg-gradient-primary/20 border border-primary/30 flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8 text-accent" />
        </div>
        <div>
          <h3 className="text-xl font-bold tracking-tight mb-2">Inquiry Received</h3>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
            We've received your project details and will get back to you within one business day
            with a structured response.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl glass border border-white/10 text-xs text-muted-foreground">
          <Clock className="w-3.5 h-3.5 text-accent shrink-0" />
          Typical response: within 1 business day
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="glass-strong rounded-3xl p-8 space-y-6">
      {/* Form header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <ShieldCheck className="w-4 h-4 text-accent" />
          <span className="text-[10px] text-accent uppercase tracking-[0.18em] font-semibold">
            Project Intake
          </span>
        </div>
        <h3 className="text-lg font-semibold tracking-tight">Tell us about your project</h3>
      </div>

      {/* Row 1: Name + Email */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Full Name" name="name" placeholder="Your full name" required />
        <Field
          label="Work Email"
          name="email"
          type="email"
          placeholder="you@company.com"
          required
        />
      </div>

      {/* Row 2: Company + Project Type */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Company (optional)" name="company" placeholder="Your company or org" />
        <SelectField
          label="Project Type"
          name="project_type"
          options={projectTypes}
          required
          value={projectType}
          onChange={setProjectType}
        />
      </div>

      {/* Row 3: Budget + Timeline */}
      <div className="grid sm:grid-cols-2 gap-4">
        <SelectField
          label="Estimated Budget"
          name="budget"
          options={budgets}
          required
          value={budget}
          onChange={setBudget}
        />
        <SelectField
          label="Timeline"
          name="timeline"
          options={timelines}
          required
          value={timeline}
          onChange={setTimeline}
        />
      </div>

      {/* Row 4: Description */}
      <div>
        <label className="text-[10px] text-gray-600 uppercase tracking-[0.16em] font-semibold mb-2 block">
          Project Description <span className="text-accent">*</span>
        </label>
        <textarea
          name="description"
          required
          rows={5}
          className="w-full px-4 py-3 rounded-xl glass text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40 leading-[1.75] tracking-wide resize-none"
          placeholder="Describe your goals, current challenges, and expected outcomes."
        />
      </div>

      <div className="border-t border-white/5" />

      {/* Checkbox */}
      <button
        type="button"
        onClick={() => setAgreed((v) => !v)}
        className="flex items-start gap-3 text-left w-full group"
      >
        <span
          className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-all ${
            agreed
              ? "bg-gradient-primary border-primary/60"
              : "border-white/20 glass group-hover:border-primary/40"
          }`}
        >
          {agreed && <Check className="w-3 h-3 text-primary-foreground" strokeWidth={3} />}
        </span>
        <span className="text-sm text-muted-foreground font-medium leading-relaxed">
          I understand this is a{" "}
          <span className="text-foreground font-medium">project inquiry</span>, not general support.
        </span>
      </button>

      {/* Error banner */}
      {status === "error" && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {errorMsg}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={!agreed || status === "loading"}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-primary text-primary-foreground text-sm font-semibold glow-primary hover:scale-[1.02] active:scale-[0.99] transition-transform disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        {status === "loading" ? "Submitting…" : "Submit Project Inquiry"}
        <ArrowRight className="w-4 h-4" />
      </button>
    </form>
  );
}

/* ─── Discovery card ─── */
function DiscoveryCard() {
  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 border-t border-white/10" />
        <span className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-medium shrink-0">
          or
        </span>
        <div className="flex-1 border-t border-white/10" />
      </div>

      <div className="glass rounded-3xl p-7 flex flex-col sm:flex-row items-start sm:items-center gap-5">
        <div className="w-11 h-11 rounded-2xl bg-gradient-primary/15 border border-primary/20 flex items-center justify-center shrink-0">
          <Calendar className="w-5 h-5 text-accent" />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold tracking-tight mb-1">Not sure yet?</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Still exploring? Book a short discovery call. No commitment — just a focused
            conversation about what's possible.
          </p>
        </div>

        <a
          href={meetlink ? meetlink : "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl glass border border-white/10 text-sm font-semibold hover:bg-white/8 hover:scale-[1.03] active:scale-[0.99] transition-all whitespace-nowrap"
        >
          Book a 15‑Minute Call
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}

/* ─── Main export ─── */
export function StartProject() {
  return (
    <>
      <SEO
        title="Start a Project"
        description="Tell us about your goals, timeline, and requirements. We'll respond within one business day with a structured plan tailored to your needs. Web development and security testing services."
        keywords="start project, web development inquiry, PudhuTech project intake, project requirements, web development quote, security testing quote"
        canonical="https://pudhutech.com/start-project"
      />

      <PageHeader
        eyebrow="Start a Project"
        title="Tell Us About Your Goals, Timeline, and Requirements"
        description="The more clarity you provide, the faster we can respond with a structured plan."
      >
        <div className="flex justify-center mt-5">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/10 text-xs text-muted-foreground">
            <Clock className="w-3.5 h-3.5 text-accent shrink-0" />
            We typically respond within one business day.
          </div>
        </div>
      </PageHeader>

      <Section className="-mt-24">
        <div className="flex flex-col gap-8 max-w-3xl mx-auto">
          <Reveal>
            <ProjectIntakeForm />
          </Reveal>

          <Reveal delay={0.1}>
            <DiscoveryCard />
          </Reveal>
        </div>
      </Section>
    </>
  );
}
