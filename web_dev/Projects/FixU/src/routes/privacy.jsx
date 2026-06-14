import { PageHeader, Section } from "../components/site/Section";
import { SEO } from "../components/SEO";
import { privacy_policy } from "../data/site";

export function Privacy() {
  return (
    <>
      <SEO
        title="Privacy Policy"
        description="PudhuTech's privacy policy. Learn how we collect, use, and protect your personal information. Last updated May 1, 2026."
        keywords="privacy policy, data protection, security, GDPR compliance, PudhuTech privacy"
        noIndex={true}
        canonical="https://pudhutech.com/privacy"
      />
      <PageHeader eyebrow="Legal" title="Privacy Policy" description="Last updated May 1, 2026" />
      <Section className="!pt-0">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-3xl p-8 md:p-12 border border-gray-100 shadow-xl shadow-gray-200/60">
            <div className="space-y-8">
              {privacy_policy.map((s) => (
                <div key={s.h} className="flex items-start gap-4">
                  {/* Accent dot matching site's purple */}
                  <div className="shrink-0 w-2.5 h-2.5 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 mt-1.5 shadow-sm shadow-indigo-200" />
                  <div>
                    <h2 className="text-base font-semibold mb-1.5 text-gray-900">{s.h}</h2>
                    <p className="text-gray-600 leading-relaxed text-sm">{s.p}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 pt-8 border-t border-gray-100 text-sm text-gray-500">
              Questions? Email{" "}
              <a
                className="text-indigo-600 hover:text-indigo-800 transition-colors duration-200   font-medium"
                href="mailto:privacy@pudhutech.com"
              >
                privacy@pudhutech.com
              </a>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
