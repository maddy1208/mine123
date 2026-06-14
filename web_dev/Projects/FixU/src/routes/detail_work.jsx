import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { client } from "../sanity";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight, ExternalLink } from "lucide-react";
import { Reveal } from "../components/site/Reveal";
import { SEO } from "../components/SEO";

// ─── Reading Progress ─────────────────────────────────────────────────────────
function ReadingProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const total = el.scrollHeight - el.clientHeight;
      setProgress(total > 0 ? (el.scrollTop / total) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-[3px] bg-white/10">
      <div
        className="h-full transition-all duration-75 ease-linear bg-gradient-primary"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function Skeleton() {
  return (
    <div className="animate-pulse max-w-4xl mx-auto px-6 lg:px-8 py-20 space-y-6">
      <div className="h-3 w-20 bg-white/10 rounded-full" />
      <div className="h-10 w-2/3 bg-white/10 rounded-xl" />
      <div className="h-4 w-full bg-white/10 rounded-lg" />
      <div className="h-4 w-3/4 bg-white/10 rounded-lg" />
      <div className="flex gap-2 pt-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-7 w-20 bg-white/10 rounded-lg" />
        ))}
      </div>
    </div>
  );
}

// ─── Metric Card ──────────────────────────────────────────────────────────────
function MetricCard({ value, label }) {
  return (
    <div className="glass rounded-2xl p-5 flex flex-col items-center justify-center text-center">
      <span className="text-3xl md:text-4xl font-bold text-gradient mb-1">{value}</span>
      <span className="text-xs text-muted-foreground font-medium leading-snug tracking-wide">
        {label}
      </span>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export function DetailWork() {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client
      .fetch(
        `*[_type == "project" && slug.current == $slug][0]{
          title,
          category,
          industry,
          timeline,
          description,
          htmlContent,
          metaDescription,
          liveUrl,
          tools,
          "metrics": metrics[]{value, label},
          "relatedProjects": *[_type == "project" && slug.current != $slug && category == ^.category] | order(_createdAt desc)[0..1]{
            title,
            slug,
            category,
            industry,
            description,
            "imageUrl": mainImage.asset->url
          }
        }`,
        { slug },
      )
      .then((data) => {
        setProject(data);
        setLoading(false);
        window.scrollTo(0, 0);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [slug]);

  if (loading) return <Skeleton />;

  if (!project)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground text-lg">Project not found.</p>
        <Link to="/work" className="text-sm font-medium text-accent">
          ← Back to Work
        </Link>
      </div>
    );

  const projectStructuredData = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.metaDescription || project.description || "",
    url: `https://pudhutech.com/work/${project.slug?.current || ""}`,
    category: project.category,
    keywords: project.tools?.join(", ") || "",
  };

  return (
    <div className="min-h-screen">
      <ReadingProgress />

      <SEO
        title={project.title}
        description={project.metaDescription || project.description || ""}
        keywords={project.tools?.join(", ") || "case study, project, web development, PudhuTech"}
        canonical={`https://pudhutech.com/work/${project.slug?.current || ""}`}
        structuredData={projectStructuredData}
      />

      {/* ── PLAIN TEXT HEADER ─────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-6 lg:px-8 pt-16 pb-10">
        <Reveal>
          {/* Back link */}
          <Link
            to="/work"
            className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-accent transition-colors mb-8 tracking-wide uppercase"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Work
          </Link>

          {/* Centered header block */}
          <div className="flex flex-col items-center text-center">
            {/* Eyebrow pill */}

            <span className="inline-flex items-center gap-2 mt-5 px-3 py-1.5 rounded-full glass text-xs font-medium text-muted-foreground mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-glow" />
              Case Study
            </span>
            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-[-0.03em] text-black text-center leading-tight mb-5">
              {project.title}
            </h1>

            {/* Description */}
            {project.description && (
              <p className="text-muted-foreground text-lg text-center leading-[1.75] tracking-wide max-w-2xl mx-auto mb-5">
                {project.description}
              </p>
            )}

            {/* Meta row */}
            <div className="flex flex-wrap justify-center items-center gap-2.5 mb-8">
              {project.category && (
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-accent">
                  {project.category}
                </span>
              )}
              {project.category && project.industry && (
                <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
              )}
              {project.industry && (
                <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  {project.industry}
                </span>
              )}
              {project.timeline && (
                <>
                  <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
                  <span className="text-xs text-muted-foreground/70 tracking-wide">
                    ⏱ {project.timeline}
                  </span>
                </>
              )}
            </div>

            {/* Tools row */}
            {project.tools?.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 mb-8">
                {project.tools.map((tool) => (
                  <span
                    key={tool}
                    className="px-3 py-1 rounded-lg text-xs font-mono font-semibold glass border border-white/10 text-muted-foreground"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            )}

            {/* Live URL */}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-primary text-primary-foreground glow-primary transition-opacity hover:opacity-90"
              >
                View Live Project <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
          {/* end centered block */}
        </Reveal>
      </div>

      {/* ── DIVIDER ───────────────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <div className="h-px bg-white/[0.08] w-full" />
      </div>

      {/* ── METRICS ───────────────────────────────────────────────── */}
      {project.metrics?.length > 0 && (
        <div className="max-w-4xl mx-auto px-6 lg:px-8 py-10">
          <Reveal>
            <div
              className={`grid gap-4 ${
                project.metrics.length === 2
                  ? "grid-cols-2"
                  : project.metrics.length === 3
                    ? "grid-cols-3"
                    : "grid-cols-2 md:grid-cols-4"
              }`}
            >
              {project.metrics.map((m, i) => (
                <MetricCard key={i} value={m.value} label={m.label} />
              ))}
            </div>
          </Reveal>
        </div>
      )}

      {/* ── MAIN CONTENT ──────────────────────────────────────────── */}
      {project.htmlContent && (
        <div className="max-w-4xl mx-auto px-6 lg:px-8 pb-20">
          <Reveal>
            <div className="glass rounded-3xl p-8 md:p-12">
              <div
                className="prose prose-invert prose-slate max-w-none"
                dangerouslySetInnerHTML={{ __html: project.htmlContent }}
              />
            </div>
          </Reveal>
        </div>
      )}

      {/* ── RELATED PROJECTS ──────────────────────────────────────── */}
      {project.relatedProjects?.length > 0 && (
        <div className="border-t border-white/[0.08]">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 py-16">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent mb-6">
              More {project.category} Work
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {project.relatedProjects.map((rel) => (
                <Link
                  key={rel.slug.current}
                  to={`/work/${rel.slug.current}`}
                  className="group block"
                >
                  <article className="glass rounded-2xl p-6 h-full flex flex-col hover:-translate-y-1 transition-transform duration-200">
                    <div className="flex items-center gap-2 mb-3">
                      {rel.category && (
                        <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-accent">
                          {rel.category}
                        </span>
                      )}
                      {rel.industry && (
                        <>
                          <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
                          <span className="text-[10px] text-muted-foreground uppercase tracking-wide">
                            {rel.industry}
                          </span>
                        </>
                      )}
                    </div>
                    <h4 className="font-semibold text-base tracking-tight leading-snug flex-1 group-hover:text-gradient-primary transition-colors mb-3">
                      {rel.title}
                    </h4>
                    {rel.description && (
                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-4">
                        {rel.description}
                      </p>
                    )}
                    <div className="inline-flex items-center gap-1 text-xs font-medium text-accent opacity-0 group-hover:opacity-100 group-hover:gap-1.5 transition-all duration-200">
                      View Case Study <ArrowUpRight className="w-3.5 h-3.5" />
                    </div>
                  </article>
                </Link>
              ))}
            </div>

            <div className="mt-10 pt-8 border-t border-white/[0.08] text-center">
              <Link
                to="/work"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium glass hover:bg-white/[0.08] transition-all duration-200 text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="w-4 h-4" /> Back to all work
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
