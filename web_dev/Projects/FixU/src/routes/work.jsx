import { PageHeader, Section } from "../components/site/Section";
import { Reveal } from "../components/site/Reveal";
import { Search, ArrowRight } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { SEO } from "../components/SEO";
import Newsletter from "../components/site/Newsletter";
import { client } from "../sanity";

const WORK_QUERY = `*[_type == "project"] | order(_createdAt desc) {
  title,
  "slug": slug.current,
  category,
  "excerpt": description,
  "date": timeline,
  "imgSrc": mainImage.asset->url,
  "badge": industry,
  timeline,
  tools
}`;

const categories = ["All", "Web Projects", "Security Research", "Academic"];

export function Work() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");

  useEffect(() => {
    client
      .fetch(WORK_QUERY)
      .then((data) => {
        setProjects(data ?? []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const filtered = useMemo(
    () =>
      projects.filter(
        (p) =>
          (cat === "All" || p.category === cat) &&
          (p.title?.toLowerCase().includes(q.toLowerCase()) ||
            p.excerpt?.toLowerCase().includes(q.toLowerCase())),
      ),
    [q, cat, projects],
  );

  const featured = filtered[0];
  const rest = filtered.slice(1);

  const portfolioStructuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "PudhuTech Portfolio",
    description:
      "Explore our portfolio of web development and security testing projects. See how we've helped businesses build secure, scalable digital solutions.",
    url: "https://pudhutech.com/work",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: projects.map((project, index) => ({
        "@type": "CreativeWork",
        position: index + 1,
        name: project.title,
        description: project.excerpt,
        dateCreated: project.date,
        image: project.imgSrc,
        keywords: project.tools,
      })),
    },
  };

  return (
    <>
      <SEO
        title="Work"
        description="Explore our portfolio of web development and security testing projects. See how we've helped businesses build secure, scalable digital solutions. 20+ projects delivered across web projects, security research, and academic work."
        keywords="portfolio, work, projects, web development projects, security testing projects, case studies, PudhuTech projects, React projects, security audits"
        structuredData={portfolioStructuredData}
        canonical="https://pudhutech.com/work"
      />
      <PageHeader
        eyebrow="Work"
        title="Recent Projects"
        description="Client engagements and product builds focused on secure, scalable systems."
      />

      <Section className="!pt-0">
        {/* Search + Filter bar */}
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-3 mb-10">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search projects..."
              className="w-full pl-11 pr-4 py-3 rounded-xl glass text-sm tracking-wide placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium tracking-wide whitespace-nowrap transition-all duration-200 ${
                  cat === c
                    ? "bg-gradient-primary text-primary-foreground glow-primary scale-[1.03]"
                    : "glass hover:bg-white/[0.08]"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div className="animate-pulse space-y-5">
            <div className="glass-strong rounded-3xl h-64 w-full" />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="glass rounded-3xl h-48" />
              ))}
            </div>
          </div>
        )}

        {!loading && (
          <>
            {/* Featured card */}
            {featured && (
              <Reveal>
                <Link to={`/work/${featured.slug}`} className="block">
                  <article className="glass-strong rounded-3xl p-8 md:p-10 mb-8 grid md:grid-cols-2 gap-8 items-center hover:bg-white/[0.04] transition-colors cursor-pointer group">
                    {/* Image + badge overlay */}
                    <div className="relative overflow-hidden rounded-2xl">
                      <img
                        src={featured.imgSrc}
                        alt={featured.title}
                        className="aspect-video w-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                      />
                      <span className="absolute top-2.5 left-2.5 text-[10px] font-semibold uppercase tracking-[0.12em] px-2.5 py-1 rounded-full bg-accent/80 backdrop-blur-sm text-white border border-accent/30">
                        {featured.badge ?? "Client Work"}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2.5 mb-4">
                        <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-accent">
                          Featured
                        </span>
                        <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
                        <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                          {featured.category}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
                        <span className="text-xs text-muted-foreground">{featured.date}</span>
                      </div>
                      <h2 className="text-3xl md:text-4xl font-bold tracking-[-0.02em] text-gradient leading-tight">
                        {featured.title}
                      </h2>
                      <p className="mt-3 text-muted-foreground text-sm leading-[1.75] tracking-wide">
                        {featured.excerpt}
                      </p>
                      <div className="mt-6 flex items-center justify-between">
                        <span className="inline-flex items-center gap-2 text-sm font-medium text-accent group-hover:gap-3 transition-all duration-200">
                          View work <ArrowRight className="w-4 h-4" />
                        </span>
                        {/* Timeline */}
                      </div>
                    </div>
                  </article>
                </Link>
              </Reveal>
            )}

            {/* Project grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {rest.map((p, i) => (
                <Reveal key={p.slug} delay={i * 0.05}>
                  <Link to={`/work/${p.slug}`} className="block h-full">
                    <article className="group h-full glass rounded-3xl p-6 hover:-translate-y-1 transition-transform duration-200 cursor-pointer flex flex-col">
                      {/* Image + badge overlay */}
                      <div className="relative overflow-hidden rounded-2xl mb-5">
                        <img
                          src={p.imgSrc}
                          alt={p.title}
                          className="aspect-video w-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                        />
                        <span className="absolute top-2.5 left-2.5 text-[10px] font-semibold uppercase tracking-[0.12em] px-2.5 py-1 rounded-full bg-accent backdrop-blur-sm text-white border border-accent/30">
                          {p.badge ?? "Client Work"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2.5 mb-3">
                        <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-accent">
                          {p.category}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
                        <span className="text-xs text-muted-foreground">{p.date}</span>
                      </div>
                      <h3 className="font-semibold text-lg tracking-tight mb-2 group-hover:text-gradient-primary transition-colors">
                        {p.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-[1.7] tracking-wide flex-1">
                        {p.excerpt}
                      </p>
                      {/* Footer: view link + timeline */}
                      <div className="mt-4 flex items-center justify-between">
                        <div className="inline-flex items-center gap-1.5 text-xs font-medium text-accent opacity-0 group-hover:opacity-100 group-hover:gap-2 transition-all duration-200">
                          View project <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </article>
                  </Link>
                </Reveal>
              ))}
            </div>

            {/* Empty state */}
            {filtered.length === 0 && (
              <div className="text-center py-20 text-muted-foreground tracking-wide text-sm">
                No projects match your search.
              </div>
            )}
          </>
        )}
      </Section>

      {/* Newsletter */}
      <Newsletter />
    </>
  );
}
