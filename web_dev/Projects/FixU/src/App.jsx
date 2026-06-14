import { Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { RootComponent } from "./routes/__root";
import { Home } from "./routes/index";
import { About } from "./routes/about";
import { Pricing } from "./routes/pricing";
import { Privacy } from "./routes/privacy";
import { Services } from "./routes/services";
import { Terms } from "./routes/terms";
import { FAQPage } from "./routes/faq";
import { lazy, Suspense } from "react";
import { SecureWebDev } from "./routes/detail_webapp_service";
import { SecurityTesting } from "./routes/detail_testing_service";
import { PostLaunchSupport } from "./routes/detail_post_launch";
import NotFound from "./routes/notFound";
import Loading from "./components/ui/Loading";

function App() {
  const Contact = lazy(() =>
    import("./routes/contact").then((module) => ({ default: module.Contact })),
  );
  const Work = lazy(() => import("./routes/work").then((module) => ({ default: module.Work })));
  const DetailWork = lazy(() =>
    import("./routes/detail_work").then((module) => ({ default: module.DetailWork })),
  );

  const Blogs = lazy(() => import("./routes/blogs").then((module) => ({ default: module.Blogs })));
  const BlogDetail = lazy(() =>
    import("./routes/blog_detail_page").then((module) => ({ default: module.BlogDetail })),
  );
  const StartProject = lazy(() =>
    import("./routes/start-project").then((module) => ({ default: module.StartProject })),
  );
  return (
    <HelmetProvider>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route element={<RootComponent />}>
            <Route path="/" element={<Home />} />
            <Route path="/services/secure-web-development" element={<SecureWebDev />} />
            <Route path="/services/security-testing" element={<SecurityTesting />} />
            <Route path="/services/post-launch-support" element={<PostLaunchSupport />} />
            <Route path="/about" element={<About />} />
            <Route path="/work" element={<Work />} />
            <Route path="/work/:slug" element={<DetailWork />} />
            <Route path="/start-project" element={<StartProject />} />
            <Route path="/blog" element={<Blogs />} />
            <Route path="/blog/:slug" element={<BlogDetail />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/services" element={<Services />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>{" "}
      </Suspense>
    </HelmetProvider>
  );
}

export default App;
