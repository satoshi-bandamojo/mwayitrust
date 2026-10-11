import { termsOfUse } from '../../supabase/functions/_shared/legalPolicies.ts'

export default function TermsOfUse() {
  return (
    <div className="page-shell">
      <article className="legal-page">
        <h1>{termsOfUse.title}</h1>
        <p className="legal-updated">Last updated: {termsOfUse.updatedAt}</p>
        {termsOfUse.sections.map((section, sectionIndex) => (
          <section key={section.heading ?? `introduction-${sectionIndex}`}>
            {section.heading ? <h2>{section.heading}</h2> : null}
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph}>
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
          </section>
        ))}
      </article>
    </div>
  )
}
