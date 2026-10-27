import { privacyNotice } from '../../supabase/functions/_shared/legalPolicies.ts'

export default function PrivacyPolicy() {
  return (
    <div className="page-shell">
      <div style={{ maxWidth: '900px', margin: '0 auto', lineHeight: 1.7 }}>
        <h1 style={{ marginBottom: '0.75rem' }}>{privacyNotice.title}</h1>
        <p style={{ marginBottom: '1.5rem', color: '#475569' }}>
          Effective date: {privacyNotice.effectiveDate} | Last updated: {privacyNotice.updatedAt}
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
                {paragraph.split('sandy.mwayi@gmail.com').map((part, index, parts) => (
                  <span key={`${part}-${index}`}>
                    {part}
                    {index < parts.length - 1 ? (
                      <a href="mailto:sandy.mwayi@gmail.com">sandy.mwayi@gmail.com</a>
                    ) : null}
                  </span>
                ))}
              </p>
            ))}
            {'listItems' in section ? (
              <ul style={{ paddingLeft: '1.5rem', listStyleType: 'disc' }}>
                {section.listItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : null}
            {'subsections' in section
              ? section.subsections.map((subsection) => (
                  <section key={subsection.heading}>
                    <h3 style={{ fontSize: '1.05rem', marginTop: '1.25rem' }}>{subsection.heading}</h3>
                    {subsection.paragraphs.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                    {'listItems' in subsection ? (
                      <ul style={{ paddingLeft: '1.5rem', listStyleType: 'disc' }}>
                        {subsection.listItems.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    ) : null}
                  </section>
                ))
              : null}
          </section>
        ))}
      </div>
    </div>
  )
}
