import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet, Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import "../index.css";

import { Navbar } from "../components/site/Navbar";
import { Footer } from "../components/site/Footer";

const queryClient = new QueryClient();

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>

        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>

        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export function RootComponent() {
  const location = useLocation();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="relative min-h-screen overflow-x-hidden">
        <div className="pointer-events-none fixed inset-0 grid-pattern opacity-[0.5]" />

        <div className="pointer-events-none fixed -top-40 -left-40 h-[600px] w-[600px] animate-orb rounded-full bg-purple/20 blur-[120px]" />

        <div className="pointer-events-none fixed top-1/3 -right-40 h-[500px] w-[500px] animate-orb rounded-full bg-primary/15 blur-[120px]" />

        <div className="pointer-events-none fixed bottom-0 left-1/3 h-[400px] w-[400px] animate-orb rounded-full bg-accent/15 blur-[120px]" />

        <Navbar />

        <main className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>

        <Footer />
      </div>
    </QueryClientProvider>
  );
}

export default RootComponent;
