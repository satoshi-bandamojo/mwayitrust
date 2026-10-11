import { privacyNotice } from '../../supabase/functions/_shared/legalPolicies.ts'

export default function PrivacyPolicy() {
  return (
    <div className="page-shell">
      <div style={{ maxWidth: '900px', margin: '0 auto', lineHeight: 1.7 }}>
        <h1 style={{ marginBottom: '0.75rem' }}>{privacyNotice.title}</h1>
        <p style={{ marginBottom: '1.5rem', color: '#475569' }}>
          Last updated: {privacyNotice.updatedAt}
        </p>
        {privacyNotice.sections.map((section, sectionIndex) => (
          <section key={section.heading ?? `introduction-${sectionIndex}`}>
            {section.heading ? (
              <h2 style={{ fontSize: '1.15rem', marginTop: '1.5rem' }}>{section.heading}</h2>
            ) : null}
            {section.paragraphs.map((paragraph, paragraphIndex) => (
              <p
                key={paragraph}
                style={sectionIndex === 0 && paragraphIndex === 0 ? { marginBottom: '1.5rem' } : undefined}
              >
                {paragraph}
              </p>
            ))}
          </section>
        ))}
      </div>
    </div>
  )
}
