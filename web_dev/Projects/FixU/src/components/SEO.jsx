import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

const defaultMeta = {
  title: "PudhuTech - Premium Digital Agency",
  description:
    "PudhuTech is a boutique digital engineering studio crafting high-performance web applications, SaaS platforms, and fortified digital infrastructure.",
  keywords: "web development, SaaS, digital agency, React, Next.js, full-stack development",
  ogImage: "/og-image.png",
  twitterCard: "summary_large_image",
};

export function SEO({
  title,
  description,
  keywords,
  ogImage,
  noIndex = false,
  canonical,
  structuredData,
}) {
  const location = useLocation();
  const fullTitle = title ? `${title} | PudhuTech` : defaultMeta.title;
  const metaDescription = description || defaultMeta.description;
  const metaKeywords = keywords || defaultMeta.keywords;
  const metaOgImage = ogImage || defaultMeta.ogImage;
  const url = typeof window !== "undefined" ? window.location.href : "";
  const canonicalUrl = canonical || url;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={metaKeywords} />

      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={metaOgImage} />

      {/* Twitter */}
      <meta name="twitter:card" content={defaultMeta.twitterCard} />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={metaOgImage} />

      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      )}
    </Helmet>
  );
}
