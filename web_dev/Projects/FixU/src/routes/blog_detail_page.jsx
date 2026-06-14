import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { client } from "../sanity";
import { PortableText } from "@portabletext/react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Clock,
  Calendar,
  Twitter,
  Linkedin,
  ArrowUpRight,
  ChevronRight,
} from "lucide-react";
import { Reveal } from "../components/site/Reveal";
import { SEO } from "../components/SEO";

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const CATEGORY_COLORS = {
  Engineering: "bg-blue-50 text-blue-700",
  Product: "bg-violet-50 text-violet-700",
  Design: "bg-pink-50 text-pink-700",
  Culture: "bg-amber-50 text-amber-700",
};

// ─── Blog-scoped CSS variables (blue theme) ────────────────────────
// Drop this once anywhere in your global CSS or keep it here as a style tag.
// All blog-specific colours are defined under [data-theme="blog"] so they
// never bleed into the rest of the site.
const BLOG_THEME_STYLE = `
  [data-theme="blog"] {
    --blog-accent:        #3b82f6;   /* blue-500    */
    --blog-accent-light:  #bfdbfe;   /* blue-200    */
    --blog-accent-glow:   rgba(59,130,246,0.18);
    --blog-accent-muted:  #eff6ff;   /* blue-50     */
    --blog-gradient:      linear-gradient(135deg, #3b82f6, #8b5cf6);
    --blog-progress-bg:   rgba(59,130,246,0.15);
  }
`;

// ─── Portable Text ─────────────────────────────────────────────────────────────
const ptComponents = {
  block: {
    normal: ({ children }) => (
      <p className="mb-8 leading-[1.9] text-slate-700 text-[1.1rem] font-['Georgia',serif]">
        {children}
      </p>
    ),
    h2: ({ children }) => (
      <h2
        className="mt-16 mb-6 font-['Lora',Georgia,serif] text-3xl md:text-[2.1rem] font-bold text-slate-900 leading-tight pb-4"
        style={{ borderBottom: "2px solid var(--blog-accent-light)" }}
      >
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-12 mb-4 flex items-center gap-3 font-['Lora',Georgia,serif] text-2xl font-bold text-slate-900 leading-snug">
        <span
          className="inline-block w-1 h-6 rounded-full flex-shrink-0"
          style={{ background: "var(--blog-accent)" }}
        />
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="mt-8 mb-3 text-lg font-bold text-slate-900 uppercase tracking-wide">
        {children}
      </h4>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-12 relative pl-8">
        <span
          className="absolute left-0 top-0 bottom-0 w-1 rounded-full"
          style={{ background: "var(--blog-accent)" }}
        />
        <p className="font-['Lora',Georgia,serif] text-2xl md:text-3xl italic leading-relaxed text-slate-700">
          {children}
        </p>
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="mb-8 space-y-3">{children}</ul>,
    number: ({ children }) => (
      <ol className="mb-8 space-y-3 list-decimal list-inside">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => (
      <li className="flex gap-4 text-[1.1rem] font-['Georgia',serif] leading-[1.8] text-slate-700">
        <span
          className="mt-[0.65rem] w-1.5 h-1.5 rounded-full flex-shrink-0"
          style={{ background: "var(--blog-accent)" }}
        />
        <span>{children}</span>
      </li>
    ),
    number: ({ children }) => (
      <li className="text-[1.1rem] font-['Georgia',serif] leading-[1.8] text-slate-700 pl-1">
        {children}
      </li>
    ),
  },
  marks: {
    strong: ({ children }) => <strong className="font-bold text-slate-900">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    underline: ({ children }) => (
      <span className="underline underline-offset-[3px] decoration-slate-400">{children}</span>
    ),
    code: ({ children }) => (
      <code
        className="px-2 py-0.5 rounded-md font-mono text-[0.82em] border"
        style={{
          background: "var(--blog-accent-muted)",
          color: "var(--blog-accent)",
          borderColor: "var(--blog-accent-light)",
        }}
      >
        {children}
      </code>
    ),
    highlight: ({ children }) => (
      <mark className="bg-amber-100 text-slate-900 px-1 rounded">{children}</mark>
    ),
    link: ({ value, children }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium border-b transition-colors pb-[1px]"
        style={{ color: "var(--blog-accent)", borderColor: "var(--blog-accent-light)" }}
        onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--blog-accent)")}
        onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--blog-accent-light)")}
      >
        {children}
      </a>
    ),
  },
  types: {
    image: ({ value }) =>
      value?.asset?.url ? (
        <figure className="my-14 -mx-4 md:-mx-12 lg:-mx-24">
          <img
            src={value.asset.url}
            alt={value.alt || ""}
            className="w-full object-cover rounded-2xl"
          />
          {value.caption && (
            <figcaption className="mt-4 text-center text-sm text-slate-400 italic px-4">
              {value.caption}
            </figcaption>
          )}
        </figure>
      ) : null,

    code: ({ value }) => (
      <div className="my-10 rounded-2xl overflow-hidden border border-slate-900/10 shadow-lg shadow-slate-100">
        <div className="bg-slate-950 px-5 py-3 flex items-center gap-3 border-b border-white/5">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500/70" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
            <span className="w-3 h-3 rounded-full bg-green-500/70" />
          </div>
          {value.filename && (
            <span className="text-slate-500 text-xs font-mono ml-2">{value.filename}</span>
          )}
          {value.language && (
            <span className="ml-auto text-slate-600 text-xs font-mono uppercase">
              {value.language}
            </span>
          )}
        </div>
        <pre className="bg-slate-950 p-6 overflow-x-auto text-[0.875rem] font-mono leading-relaxed text-slate-200">
          <code>{value.code}</code>
        </pre>
      </div>
    ),

    callout: ({ value }) => (
      <div
        className="my-10 flex gap-4 p-7 rounded-2xl border"
        style={{
          background: "var(--blog-accent-muted)",
          borderColor: "var(--blog-accent-light)",
        }}
      >
        <span className="text-2xl flex-shrink-0 leading-none mt-0.5">{value.emoji || "💡"}</span>
        <p className="leading-relaxed text-base" style={{ color: "#1e3a5f" }}>
          {value.text}
        </p>
      </div>
    ),

    divider: () => (
      <div className="my-16 flex items-center justify-center gap-5">
        <span
          className="block w-2 h-2 rounded-full"
          style={{ background: "var(--blog-accent-light)" }}
        />
        <span className="block w-2 h-2 rounded-full" style={{ background: "var(--blog-accent)" }} />
        <span
          className="block w-2 h-2 rounded-full"
          style={{ background: "var(--blog-accent-light)" }}
        />
      </div>
    ),

    table: ({ value }) => (
      <div className="my-10 overflow-x-auto rounded-2xl border border-slate-200 shadow-sm">
        <table className="w-full text-sm text-left border-collapse">
          {value.caption && (
            <caption className="text-xs text-slate-400 italic text-center py-2 border-b border-slate-100">
              {value.caption}
            </caption>
          )}
          {value.headerRow?.length > 0 && (
            <thead style={{ background: "var(--blog-accent-muted)" }}>
              <tr>
                {value.headerRow.map((header, i) => (
                  <th
                    key={i}
                    className="px-5 py-3 font-semibold border-b border-slate-200 whitespace-nowrap"
                    style={{
                      color: "var(--blog-accent)",
                      borderBottomColor: "var(--blog-accent-light)",
                    }}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody>
            {value.rows?.map((row, ri) => (
              <tr
                key={ri}
                className={ri % 2 === 0 ? "bg-white" : "bg-slate-50/60"}
                style={{}}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "var(--blog-accent-muted)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = ri % 2 === 0 ? "white" : "")
                }
              >
                {row.cells?.map((cell, ci) => (
                  <td
                    key={ci}
                    className="px-5 py-3 text-slate-700 border-b border-slate-100 align-top"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ),
  },
};

// ─── Reading Progress (blue) ─────────────────────────────────────────────────
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
    <div
      className="fixed top-0 left-0 right-0 z-50 h-[3px]"
      style={{ background: "var(--blog-progress-bg)" }}
    >
      <div
        className="h-full transition-all duration-75 ease-linear"
        style={{
          width: `${progress}%`,
          background: "var(--blog-gradient)",
        }}
      />
    </div>
  );
}

// ─── Skeleton ──────────────────────────────────────────────────────────────────
function Skeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-[55vh] bg-slate-200 w-full" />
      <div className="max-w-4xl mx-auto px-6 lg:px-8 -mt-32 relative z-10">
        <div className="bg-white rounded-3xl p-10 shadow-sm space-y-5">
          <div className="h-3 w-24 bg-slate-100 rounded-full" />
          <div className="h-9 w-3/4 bg-slate-100 rounded-xl" />
          <div className="h-9 w-1/2 bg-slate-100 rounded-xl" />
          <div className="flex items-center gap-3 pt-4">
            <div className="h-12 w-12 rounded-full bg-slate-100" />
            <div className="space-y-2">
              <div className="h-3 w-32 bg-slate-100 rounded-full" />
              <div className="h-3 w-20 bg-slate-100 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── FAQ Accordion Item (blue theme) ────────────────────────────────────────
function FaqItem({ question, answer }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="rounded-2xl border transition-all duration-300 overflow-hidden bg-white/60 backdrop-blur-sm"
      style={{
        borderColor: open ? "var(--blog-accent-light)" : "rgba(59,130,246,0.12)",
        boxShadow: open ? "0 4px 24px -4px var(--blog-accent-glow)" : "none",
      }}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-4 px-7 py-5 text-left transition-all duration-300"
        style={{
          background: open ? "rgba(239,246,255,0.6)" : "transparent",
        }}
        aria-expanded={open}
      >
        <span className="font-semibold text-slate-800 text-[1.05rem] leading-snug">{question}</span>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-white shadow-md"
          style={{ background: "var(--blog-gradient)" }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M6 1v10M1 6h10"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </motion.span>
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <div
          className="px-7 pb-6 pt-3 border-t"
          style={{ borderColor: "var(--blog-accent-light)", background: "rgba(239,246,255,0.4)" }}
        >
          <p className="text-slate-600 leading-relaxed text-[0.975rem]">{answer}</p>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Share Button ──────────────────────────────────────────────────────────────
function ShareButton({ icon: Icon, href, label }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-200"
      style={{ borderColor: "var(--blog-accent-light)", color: "var(--blog-accent)" }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "var(--blog-accent)";
        e.currentTarget.style.color = "white";
        e.currentTarget.style.borderColor = "var(--blog-accent)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "transparent";
        e.currentTarget.style.color = "var(--blog-accent)";
        e.currentTarget.style.borderColor = "var(--blog-accent-light)";
      }}
    >
      <Icon className="w-4 h-4" />
    </a>
  );
}

// ─── Main ──────────────────────────────────────────────────────────────────────
export function BlogDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client
      .fetch(
        `*[_type == "post" && slug.current == $slug][0]{
    title, publishedAt, excerpt, category, tags, htmlContent,
    metaDescription,
    faqs,
    "estimatedReadingTime": round(length(pt::text(content)) / 5 / 200),
    "imageUrl": mainImage.asset->url,
    "imageAlt": mainImage.alt,
    "imageCaption": mainImage.caption,
    "authorName": author->name,
    "authorRole": author->role,
    "authorBio": author->bio,
    "authorImage": author->image.asset->url,
    "authorTwitter": author->twitterHandle,
    "authorLinkedin": author->linkedinUrl,
    "content": content[]{
      ...,
      _type == "image" => {
        ...,
        "asset": asset->{url, metadata}
      }
    },
    "relatedPosts": *[_type == "post" && slug.current != $slug && category == ^.category] | order(publishedAt desc)[0..2]{
      title, slug, publishedAt, category,
      "imageUrl": mainImage.asset->url,
      "authorName": author->name,
      "authorImage": author->image.asset->url,
      "estimatedReadingTime": round(length(pt::text(content)) / 5 / 200)
    }
  }`,
        { slug },
      )
      .then((data) => {
        setPost(data);
        setLoading(false);
        window.scrollTo(0, 0);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [slug]);

  if (loading) return <Skeleton />;

  if (!post) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
        <p className="font-['Georgia',serif] text-5xl font-bold text-slate-900 mb-4">
          Post not found
        </p>
        <p className="text-slate-500 text-lg mb-8">It may have been moved or removed.</p>
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-white text-sm font-medium transition-colors"
          style={{ background: "var(--blog-gradient)" }}
        >
          <ArrowLeft className="w-4 h-4" /> Back to Blog
        </Link>
      </div>
    );
  }

  const catColor = CATEGORY_COLORS[post.category] || "bg-slate-100 text-slate-600";

  const articleStructuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.metaDescription || post.excerpt || "",
    image: post.imageUrl || "https://pudhutech.com/og-image.png",
    author: {
      "@type": "Person",
      name: post.authorName || "PudhuTech Team",
      url: post.authorLinkedin || "https://pudhutech.com",
    },
    publisher: {
      "@type": "Organization",
      name: "PudhuTech",
      logo: { "@type": "ImageObject", url: "https://pudhutech.com/logo.png" },
    },
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://pudhutech.com/blog/${post.slug?.current || ""}`,
    },
  };

  const faqStructuredData =
    post.faqs?.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: post.faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: { "@type": "Answer", text: faq.answer },
          })),
        }
      : null;

  return (
    // data-theme="blog" scopes all blue CSS variables to this subtree only
    <div data-theme="blog">
      {/* Inject blog theme variables */}
      <style>{BLOG_THEME_STYLE}</style>

      {/* ── SEO META ──────────────────────────────────────────── */}
      <SEO
        title={post.title}
        description={post.metaDescription || post.excerpt || ""}
        keywords={post.tags?.join(", ") || "blog, web development, security, PudhuTech"}
        ogImage={post.imageUrl}
        canonical={`https://pudhutech.com/blog/${post.slug?.current || ""}`}
        structuredData={
          faqStructuredData
            ? { ...articleStructuredData, ...faqStructuredData }
            : articleStructuredData
        }
      />

      <ReadingProgress />

      {/* ── HERO BANNER ───────────────────────────────────────── */}
      <div className="relative">
        {post.imageUrl ? (
          <div className="relative h-[42vh] min-h-[280px] max-h-[440px] overflow-hidden">
            <img
              src={post.imageUrl}
              alt={post.imageAlt || post.title}
              className="w-full h-full object-cover"
            />
            {/* Subtle overlay that blends into blue theme */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-blue-950/20" />
          </div>
        ) : (
          /* Gradient fallback that matches blue palette */
          <div
            className="h-[32vh] min-h-[220px]"
            style={{
              background: "linear-gradient(135deg, #eff6ff 0%, #bfdbfe 50%, #93c5fd 100%)",
            }}
          />
        )}
      </div>

      {/* ── PAGE BODY: cool white bg to complement blue theme ── */}
      <div
        className="pb-20"
        style={{
          background: "linear-gradient(180deg, #f8fbff 0%, #f8fafc 100%)",
        }}
      >
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          {/* ── HEADER CARD ─────────────────────────────────────── */}
          <Reveal>
            <div
              className="-mt-28 shadow-sm relative z-10 rounded-3xl p-6 md:p-10 border border-blue-50"
              style={{
                background: "rgba(255,255,255,0.92)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
              }}
            >
              {/* Back link */}
              <Link
                to="/blog"
                className="inline-flex items-center gap-1.5 text-sm font-medium mb-5 transition-colors"
                style={{ color: "var(--blog-accent)" }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.75")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                <ArrowLeft className="w-4 h-4" />
                All articles
              </Link>

              {/* Category + meta row */}
              <div className="flex flex-wrap items-center gap-3 mb-4">
                {post.category && (
                  <span
                    className="text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg"
                    style={{
                      background: "var(--blog-accent-muted)",
                      color: "var(--blog-accent)",
                      border: "1px solid var(--blog-accent-light)",
                    }}
                  >
                    {post.category}
                  </span>
                )}
                <span className="flex items-center gap-1.5 text-sm text-slate-400">
                  <Calendar className="w-3.5 h-3.5" />
                  {formatDate(post.publishedAt)}
                </span>
                {post.estimatedReadingTime > 0 && (
                  <span className="flex items-center gap-1.5 text-sm text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    {post.estimatedReadingTime} min read
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="font-blog-title text-3xl md:text-4xl lg:text-[2.4rem] font-bold text-slate-900 leading-[1.3] mb-5">
                {post.title}
              </h1>

              {/* Excerpt */}
              {post.excerpt && (
                <p
                  className="font-['Georgia',serif] text-base md:text-lg text-slate-500 leading-relaxed mb-6 pl-4 italic"
                  style={{ borderLeft: "3px solid var(--blog-accent)" }}
                >
                  {post.excerpt}
                </p>
              )}

              {/* Author bar */}
              {post.authorName && (
                <div
                  className="flex items-center gap-4 pt-5 mt-2"
                  style={{ borderTop: "1px solid rgba(234,88,12,0.12)" }}
                >
                  {post.authorImage ? (
                    <img
                      src={post.authorImage}
                      alt={post.authorName}
                      className="w-12 h-12 rounded-full object-cover"
                      style={{
                        boxShadow: "0 0 0 3px white, 0 0 0 5px var(--blog-accent-light)",
                      }}
                    />
                  ) : (
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl text-white font-['Georgia',serif]"
                      style={{ background: "var(--blog-gradient)" }}
                    >
                      {post.authorName[0]}
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="font-semibold text-slate-800 text-sm">{post.authorName}</p>
                    {post.authorRole && <p className="text-xs text-slate-400">{post.authorRole}</p>}
                  </div>
                  {/* Share buttons */}
                  <div className="flex items-center gap-2">
                    {post.authorTwitter && (
                      <ShareButton
                        icon={Twitter}
                        href={`https://twitter.com/${post.authorTwitter}`}
                        label="Share on Twitter"
                      />
                    )}
                    {post.authorLinkedin && (
                      <ShareButton
                        icon={Linkedin}
                        href={post.authorLinkedin}
                        label="Share on LinkedIn"
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          </Reveal>

          {/* ── ARTICLE BODY ────────────────────────────────────── */}
          <Reveal delay={0.1}>
            <div className="bg-white rounded-3xl shadow-sm px-4 sm:px-8 md:px-12 py-3 md:py-3 mt-4 md:mt-6 border border-blue-50">
              {" "}
              {post.htmlContent ? (
                <div
                  className="blog-html-content"
                  dangerouslySetInnerHTML={{ __html: post.htmlContent }}
                />
              ) : (
                <PortableText value={post.content} components={ptComponents} />
              )}
              {/* Tags */}
              {post.tags?.length > 0 && (
                <div
                  className="mt-12 pt-8 flex flex-wrap gap-2"
                  style={{ borderTop: "1px solid rgba(59,130,246,0.12)" }}
                >
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3.5 py-1.5 rounded-full text-xs font-medium cursor-default transition-all duration-200"
                      style={{
                        border: "1px solid var(--blog-accent-light)",
                        color: "var(--blog-accent)",
                        background: "var(--blog-accent-muted)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "var(--blog-accent)";
                        e.currentTarget.style.color = "white";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "var(--blog-accent-muted)";
                        e.currentTarget.style.color = "var(--blog-accent)";
                      }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </Reveal>

          {/* ── FAQ SECTION ─────────────────────────────────────── */}
          {post.faqs?.length > 0 && (
            <Reveal>
              <div className="mt-6">
                <div
                  className="rounded-3xl p-8 md:p-12"
                  style={{
                    background: "rgba(255,255,255,0.8)",
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    border: "1px solid rgba(59,130,246,0.15)",
                    boxShadow: "0 8px 32px -8px var(--blog-accent-glow)",
                  }}
                >
                  {/* FAQ header with blue left accent */}
                  <div className="flex items-start gap-4 mb-8">
                    <div
                      className="w-1 rounded-full mt-1 flex-shrink-0"
                      style={{
                        height: "3rem",
                        background: "var(--blog-gradient)",
                      }}
                    />
                    <div>
                      <h2 className="font-['Lora',Georgia,serif] text-2xl md:text-3xl font-bold text-slate-900 mb-1">
                        Frequently Asked Questions
                      </h2>
                      <p className="text-slate-400 text-sm">Common questions about this topic</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {post.faqs.map((faq, i) => (
                      <FaqItem key={i} question={faq.question} answer={faq.answer} />
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          )}
        </div>
      </div>

      {/* ── RELATED POSTS ─────────────────────────────────────── */}
      {post.relatedPosts?.length > 0 && (
        <div
          style={{
            background: "linear-gradient(180deg, #eff6ff 0%, #f8fafc 100%)",
            borderTop: "1px solid rgba(59,130,246,0.12)",
          }}
        >
          <div className="max-w-4xl mx-auto px-6 lg:px-8 py-16">
            {/* Section label */}
            <div className="flex items-center gap-3 mb-8">
              <div
                className="h-px flex-1"
                style={{
                  background: "linear-gradient(to right, var(--blog-accent-light), transparent)",
                }}
              />
              <p
                className="text-xs font-bold uppercase tracking-[0.18em]"
                style={{ color: "var(--blog-accent)" }}
              >
                More in {post.category}
              </p>
              <div
                className="h-px flex-1"
                style={{
                  background: "linear-gradient(to left, var(--blog-accent-light), transparent)",
                }}
              />
            </div>

            <div className="grid md:grid-cols-3 gap-5">
              {post.relatedPosts.map((related) => (
                <Link
                  key={related.slug.current}
                  to={`/blog/${related.slug.current}`}
                  className="group block"
                >
                  <article
                    className="rounded-2xl overflow-hidden h-full flex flex-col transition-all duration-300"
                    style={{
                      background: "rgba(255,255,255,0.8)",
                      border: "1px solid rgba(59,130,246,0.12)",
                      boxShadow: "0 2px 12px -4px rgba(0,0,0,0.06)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "var(--blog-accent-light)";
                      e.currentTarget.style.boxShadow = "0 8px 28px -8px var(--blog-accent-glow)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "rgba(59,130,246,0.12)";
                      e.currentTarget.style.boxShadow = "0 2px 12px -4px rgba(0,0,0,0.06)";
                    }}
                  >
                    <div className="aspect-[16/10] overflow-hidden bg-blue-50">
                      {related.imageUrl ? (
                        <img
                          src={related.imageUrl}
                          alt={related.title}
                          className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                        />
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center"
                          style={{ background: "var(--blog-accent-muted)" }}
                        >
                          <span
                            className="text-3xl font-bold font-['Georgia',serif]"
                            style={{ color: "var(--blog-accent-light)" }}
                          >
                            {related.title?.[0]}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                      <div className="flex items-center gap-2 mb-3">
                        {related.authorImage ? (
                          <img
                            src={related.authorImage}
                            alt={related.authorName}
                            className="w-5 h-5 rounded-full object-cover"
                          />
                        ) : (
                          <div
                            className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
                            style={{ background: "var(--blog-accent)" }}
                          >
                            {related.authorName?.[0]}
                          </div>
                        )}
                        <span className="text-xs text-slate-400">{related.authorName}</span>
                        {related.estimatedReadingTime > 0 && (
                          <span className="text-xs text-slate-400 ml-auto flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {related.estimatedReadingTime}m
                          </span>
                        )}
                      </div>
                      <h4 className="font-['Lora',Georgia,serif] font-bold text-slate-800 text-base leading-snug line-clamp-2 flex-1 group-hover:text-blue-700 transition-colors">
                        {related.title}
                      </h4>
                      <div
                        className="mt-4 flex items-center gap-1 text-xs font-semibold transition-all duration-200"
                        style={{ color: "var(--blog-accent)" }}
                      >
                        Read article{" "}
                        <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>

            {/* Back button */}
            <div
              className="mt-12 pt-10 text-center"
              style={{ borderTop: "1px solid rgba(59,130,246,0.12)" }}
            >
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all duration-200"
                style={{
                  border: "1px solid var(--blog-accent-light)",
                  color: "var(--blog-accent)",
                  background: "transparent",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--blog-accent)";
                  e.currentTarget.style.color = "white";
                  e.currentTarget.style.borderColor = "var(--blog-accent)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "var(--blog-accent)";
                  e.currentTarget.style.borderColor = "var(--blog-accent-light)";
                }}
              >
                <ArrowLeft className="w-4 h-4" /> Back to all articles
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
