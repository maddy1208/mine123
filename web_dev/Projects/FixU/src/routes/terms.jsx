import { PageHeader, Section } from "../components/site/Section";
import { SEO } from "../components/SEO";
import { terms_conditions } from "../data/site";

export function Terms() {
  return (
    <>
      <SEO
        title="Terms & Conditions"
        description="PudhuTech's terms and conditions. Learn about your rights and responsibilities when using our web development and security testing services. Last updated May 1, 2026."
        keywords="terms and conditions, terms of service, legal, user agreement, service terms, PudhuTech terms"
        noIndex={true}
        canonical="https://pudhutech.com/terms"
      />
      <PageHeader
        eyebrow="Legal"
        title="Terms & Conditions"
        description="Last updated May 1, 2026"
      />
      <Section className="!pt-0">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl p-8 md:p-14 space-y-10 border border-gray-100 shadow-xl shadow-gray-200/60">
            {terms_conditions.map((s, index) => (
              <div key={s.h} className="flex items-start gap-6">
                {/* purple dot*/}
                <div className="shrink-0 w-2.5 h-2.5 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 mt-1.5 shadow-sm shadow-indigo-200" />

                <div className="flex-1 min-w-0">
                  <h2 className="text-base font-semibold mb-1.5 text-gray-900">{s.h}</h2>
                  <p className="text-gray-600 leading-relaxed text-sm">{s.p}</p>
                </div>
              </div>
            ))}

            <div className="pt-8 border-t border-gray-100 text-sm text-gray-500">
              Questions about these terms? Contact{" "}
              <a
                className="text-indigo-600 hover:text-indigo-800 transition-colors duration-200  font-medium"
                href="mailto:legal@pudhutech.com"
              >
                legal@pudhutech.com
              </a>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
