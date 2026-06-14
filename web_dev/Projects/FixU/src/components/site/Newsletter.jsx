import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { Section } from "./Section";

const Newsletter = ({ inline = false }) => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const { error: subscribeError } = await supabase.from("emails").insert([{ email }]);

      if (subscribeError) throw subscribeError;

      setStatus("success");
      setEmail("");
    } catch (err) {
      console.error("Supabase error:", err);
      setErrorMsg("Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  if (inline) {
    return (
      <div className="flex flex-col gap-2.5 max-w-xs">
        <p className="text-xs text-muted-foreground">
          Stay updated with new articles and product insights.
        </p>
        {status === "success" ? (
          <p className="text-sm text-gradient font-medium">✓ You're subscribed!</p>
        ) : (
          <>
            <div className="flex gap-2 w-full">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="flex-1 min-w-0 px-4 py-2.5 rounded-xl glass text-sm tracking-wide placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
              <button
                onClick={handleSubmit}
                disabled={status === "loading"}
                className="shrink-0 px-4 py-2.5 rounded-xl bg-gradient-primary text-primary-foreground font-medium text-sm glow-primary hover:scale-[1.02] transition-transform disabled:opacity-50"
              >
                {status === "loading" ? "..." : "Subscribe"}
              </button>
            </div>
            {status === "error" && <p className="text-red-400 text-xs">{errorMsg}</p>}
          </>
        )}
      </div>
    );
  }

  return (
    <Section>
      <div className="glass-strong rounded-3xl p-10 md:p-16 text-center max-w-3xl mx-auto relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-primary opacity-10 pointer-events-none" />
        <div className="relative">
          <h2 className="text-3xl md:text-4xl font-bold tracking-[-0.02em] text-gradient">
            Stay in the Loop
          </h2>
          <p className="mt-3 text-muted-foreground text-sm leading-[1.75] tracking-wide max-w-sm mx-auto">
            New articles, security insights, and product updates from PudhuTech.
          </p>

          {status === "success" && (
            <div className="mt-7 flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center glow-primary">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary-foreground"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <p className="text-base font-semibold tracking-[-0.01em] text-gradient">
                You're subscribed!
              </p>
              <p className="text-sm text-muted-foreground tracking-wide">
                Welcome to the PudhuTech digest. See you in your inbox.
              </p>
            </div>
          )}

          {status !== "success" && (
            <form
              className="mt-7 flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
              onSubmit={handleSubmit}
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
                className="flex-1 px-4 py-3 rounded-xl glass text-sm tracking-wide placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="px-6 py-3 rounded-xl bg-gradient-primary text-primary-foreground font-medium tracking-wide glow-primary hover:scale-[1.02] transition-transform text-sm disabled:opacity-50"
              >
                {status === "loading" ? "Subscribing..." : "Subscribe"}
              </button>
            </form>
          )}

          {status === "error" && <p className="mt-3 text-red-400 text-sm">{errorMsg}</p>}
        </div>
      </div>
    </Section>
  );
};

export default Newsletter;
