import { useNavigate } from "react-router-dom";
import { SEO } from "../components/SEO";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <>
      <SEO
        title="404 - Page Not Found"
        description="The page you're looking for doesn't exist or may have been moved. Return to PudhuTech homepage."
        noIndex={true}
      />
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="flex flex-col items-center gap-5 glass-strong rounded-2xl px-16 py-14 max-w-md w-full text-center">
          {/* Badge */}
          <span className="glass text-5xl font-semibold text-primary tracking-widest uppercase px-4 py-1.5 rounded-full">
            404
          </span>

          {/* Heading */}
          <h1 className="font-display text-4xl font-bold text-foreground leading-tight">
            Page not found
          </h1>

          {/* Body */}
          <p className="font-sans text-sm text-muted-foreground leading-relaxed max-w-xs">
            The page you're looking for doesn't exist or may have been moved.
          </p>

          {/* CTA */}
          <button
            onClick={() => navigate("/")}
            className="mt-2 bg-gradient-primary text-primary-foreground font-sans font-medium text-sm px-8 py-3 rounded-xl glow-primary hover:opacity-90 transition-opacity"
          >
            Go back home
          </button>
        </div>
      </div>
    </>
  );
}
