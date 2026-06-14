import { useEffect, useState, useMemo } from "react";
import { client } from "../sanity";
import { Link } from "react-router-dom";
import { Search, ArrowRight, Clock, Calendar } from "lucide-react";
import { PageHeader, Section } from "../components/site/Section";
import { Reveal } from "../components/site/Reveal";
import { SEO } from "../components/SEO";
import Newsletter from "../components/site/Newsletter";
const categories = ["All", "Security", "Development", "Business", "Product"];
function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function ReadTime({ body }) {
  if (!body) return null;
  // rough estimate: 200 words/min
  const words = JSON.stringify(body).split(" ").length;
  const mins = Math.max(1, Math.round(words / 200));
  return (
    <span className="flex items-center gap-1">
      <Clock className="w-3 h-3" />
      {mins} min read
    </span>
  );
}

export function Blogs() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");

  useEffect(() => {
    client
      .fetch(
        `*[_type == "post"] | order(publishedAt desc){
          title,
          slug,
          publishedAt,
          excerpt,
          category,
          "estimatedReadingTime": round(length(pt::text(body)) / 5 / 200),
          "imageUrl": mainImage.asset->url,
          "authorName": author->name,
          "authorImage": author->image.asset->url
        }`,
      )
      .then((data) => {
        setPosts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const filtered = useMemo(
    () =>
      posts.filter(
        (p) =>
          (cat === "All" || p.category === cat) &&
          (p.title?.toLowerCase().includes(q.toLowerCase()) ||
            p.excerpt?.toLowerCase().includes(q.toLowerCase())),
      ),
    [posts, q, cat],
  );

  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <>
      <SEO
        title="Blog"
        description="Insights from the PudhuTech team on security, development, business, and product. Deep dives into web development, scalable architecture, and application security."
        keywords="blog, engineering, product, design, culture, web development, security, digital infrastructure, PudhuTech blog, React tutorials, security guides"
        canonical="https://pudhutech.com/blog"
      />
      <PageHeader
        eyebrow="Blog"
        title="Insights"
        description="Deep dives into web development, scalable architecture, and application security."
      />
      <Section className="!pt-0">
        {/* Search + Filter Bar */}
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-3 mb-10">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search posts..."
              className="w-full pl-11 pr-4 py-3 rounded-xl glass placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                  cat === c
                    ? "bg-gradient-primary text-primary-foreground glow-primary"
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
          <div className="max-w-5xl mx-auto space-y-5">
            <div className="glass-strong rounded-3xl p-8 md:p-12 grid md:grid-cols-2 gap-8 animate-pulse">
              <div className="aspect-video w-full rounded-2xl bg-muted/40" />
              <div className="space-y-4">
                <div className="h-3 w-24 bg-muted/40 rounded-full" />
                <div className="h-8 w-3/4 bg-muted/40 rounded-xl" />
                <div className="h-4 w-full bg-muted/40 rounded-full" />
                <div className="h-4 w-5/6 bg-muted/40 rounded-full" />
              </div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="glass rounded-3xl p-6 animate-pulse space-y-3">
                  <div className="aspect-video w-full rounded-2xl bg-muted/40" />
                  <div className="h-3 w-20 bg-muted/40 rounded-full" />
                  <div className="h-5 w-3/4 bg-muted/40 rounded-lg" />
                  <div className="h-3 w-full bg-muted/40 rounded-full" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Featured Post */}
        {!loading && featured && (
          <Reveal>
            <Link to={`/blog/${featured.slug.current}`}>
              <article className="glass-strong rounded-3xl p-8 md:p-12 mb-8 grid md:grid-cols-2 gap-8 items-center hover:bg-white/[0.05] transition-colors cursor-pointer group">
                {featured.imageUrl ? (
                  <img
                    src={featured.imageUrl}
                    alt={featured.title}
                    className="aspect-video w-full object-cover rounded-2xl"
                  />
                ) : (
                  <div className="aspect-video w-full rounded-2xl bg-mesh grid-pattern flex items-center justify-center">
                    <span className="text-5xl font-bold text-gradient opacity-30">
                      {featured.title?.[0]}
                    </span>
                  </div>
                )}
                <div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span className="text-accent font-semibold uppercase tracking-wider">
                      Featured · {featured.category || "Article"}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(featured.publishedAt)}
                    </span>
                    {featured.estimatedReadingTime > 0 && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {featured.estimatedReadingTime} min read
                        </span>
                      </>
                    )}
                  </div>
                  <h2 className="mt-4 text-3xl md:text-4xl font-bold text-gradient">
                    {featured.title}
                  </h2>
                  {featured.excerpt && (
                    <p className="mt-3 text-muted-foreground line-clamp-3">{featured.excerpt}</p>
                  )}
                  {featured.authorName && (
                    <div className="mt-4 flex items-center gap-2">
                      {featured.authorImage && (
                        <img
                          src={featured.authorImage}
                          alt={featured.authorName}
                          className="w-7 h-7 rounded-full object-cover"
                        />
                      )}
                      <span className="text-sm text-muted-foreground">{featured.authorName}</span>
                    </div>
                  )}
                  <span className="mt-5 inline-flex items-center gap-2 text-accent font-medium group-hover:gap-3 transition-all">
                    Read post <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </article>
            </Link>
          </Reveal>
        )}

        {/* Post Grid */}
        {!loading && rest.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {rest.map((post, i) => (
              <Reveal key={post.slug.current} delay={i * 0.05}>
                <Link to={`/blog/${post.slug.current}`} className="block h-full">
                  <article className="group h-full glass rounded-3xl p-6 hover:-translate-y-1 transition-transform cursor-pointer flex flex-col">
                    {post.imageUrl ? (
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="aspect-video w-full object-cover rounded-2xl mb-5"
                      />
                    ) : (
                      <div className="aspect-video w-full rounded-2xl bg-mesh grid-pattern mb-5 flex items-center justify-center">
                        <span className="text-4xl font-bold text-gradient opacity-30">
                          {post.title?.[0]}
                        </span>
                      </div>
                    )}
                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-2">
                      <span className="text-accent font-semibold uppercase tracking-wider">
                        {post.category || "Article"}
                      </span>
                      <span>•</span>
                      <span>{formatDate(post.publishedAt)}</span>
                      {post.estimatedReadingTime > 0 && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {post.estimatedReadingTime} min
                          </span>
                        </>
                      )}
                    </div>
                    <h3 className="font-semibold text-lg mt-3 mb-2 group-hover:text-gradient-primary transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="text-sm text-muted-foreground line-clamp-2 flex-1">
                        {post.excerpt}
                      </p>
                    )}
                    {post.authorName && (
                      <div className="mt-4 flex items-center gap-2 pt-4 border-t border-border">
                        {post.authorImage && (
                          <img
                            src={post.authorImage}
                            alt={post.authorName}
                            className="w-6 h-6 rounded-full object-cover"
                          />
                        )}
                        <span className="text-xs text-muted-foreground">{post.authorName}</span>
                      </div>
                    )}
                  </article>
                </Link>
              </Reveal>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">No posts match your search.</div>
        )}
      </Section>
      {/* Newsletter CTA */}
      <Newsletter />
    </>
  );
}
