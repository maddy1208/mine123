import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

const links = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/work", label: "Work" },
  { to: "/pricing", label: "Pricing" },
  { to: "/about", label: "About" },
  { to: "/blog", label: "Blog" },
  { to: "/contact", label: "Contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const location = useLocation();

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let scrollUpAccumulator = 0;

    const onScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDirection = currentScrollY > lastScrollY ? "down" : "up";
      const scrollDelta = Math.abs(currentScrollY - lastScrollY);

      setScrolled(currentScrollY > 16);

      if (currentScrollY > 100) {
        if (scrollDirection === "down") {
          setHidden(true);
          scrollUpAccumulator = 0;
        } else {
          scrollUpAccumulator += scrollDelta;
          if (scrollUpAccumulator > 50) {
            setHidden(false);
            scrollUpAccumulator = 0;
          }
        }
      } else {
        setHidden(false);
        scrollUpAccumulator = 0;
      }

      lastScrollY = currentScrollY;
    };

    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [location.pathname]);

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        hidden ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100"
      } ${scrolled ? "py-3" : "py-5"}`}
    >
      <div className="container mx-auto px-4">
        <nav
          className={`flex items-center justify-between rounded-2xl px-5 py-3 transition-all duration-500 ${
            scrolled ? "glass-strong shadow-elevated" : "glass"
          }`}
        >
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative flex-shrink-0">
              <div className="absolute inset-0 blur-md opacity-40 group-hover:opacity-70 transition rounded-sm" />
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

          <div className="hidden lg:flex items-center gap-1">
            {links.map((l) => {
              const isActive =
                l.to === "/" ? location.pathname === "/" : location.pathname.startsWith(l.to);

              return (
                <Link
                  key={l.to}
                  to={l.to}
                  className={`px-4 py-2 text-sm font-medium transition-all duration-300 ease-in-out rounded-lg ${
                    isActive
                      ? "text-blue-600 dark:text-blue-400 font-semibold"
                      : "text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400"
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <Link
              to="/start-project"
              className="relative inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-primary text-primary-foreground text-sm font-medium hover:scale-[1.03] transition-transform glow-primary"
            >
              Start a Project
            </Link>
          </div>

          <button
            className="lg:hidden p-2 rounded-lg glass"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </nav>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="lg:hidden mt-2 glass-strong rounded-2xl p-4 flex flex-col gap-1"
            >
              {links.map((l) => {
                const isActive =
                  l.to === "/" ? location.pathname === "/" : location.pathname.startsWith(l.to);

                return (
                  <Link
                    key={l.to}
                    to={l.to}
                    className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ease-in-out ${
                      isActive
                        ? "text-blue-600 dark:text-blue-400 font-semibold"
                        : "text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400"
                    }`}
                  >
                    {l.label}
                  </Link>
                );
              })}
              <Link
                to="/contact"
                className="mt-2 text-center px-4 py-3 rounded-xl bg-gradient-primary text-primary-foreground text-sm font-medium"
              >
                Get Started
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
