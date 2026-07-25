import { useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { programs } from '../data/programs.ts'

type ProgramParams = {
  slug: string
}

export default function ProgramDetails() {
  const { slug } = useParams<ProgramParams>()
  const navigate = useNavigate()

  const program = useMemo(() => programs.find((item) => item.slug === slug), [slug])

  if (!program) {
    return (
      <div className="page-shell">
        <div className="page-block">
          <p className="section-kicker">Program not found</p>
          <h1>Sorry, we could not find that program.</h1>
          <p>Return to the programs page to choose a valid program and learn how to enroll.</p>
          <button className="btn btn-secondary" type="button" onClick={() => navigate('/programs')}>
            Back to programs
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="program-detail-shell">
      <section className="program-detail-hero">
        <button className="link-back" type="button" onClick={() => navigate('/programs')}>
          <ArrowLeft size={18} />
          Back to programs
        </button>
        <h1>{program.title}</h1>
        <p className="program-detail-summary">{program.summary}</p>
      </section>

      <section className="program-detail-content">
        <div className="program-detail-image-wrap">
          <img src={program.detailImage} alt={program.title} />
        </div>
        <div className="program-detail-copy">
          <div className="program-detail-section">
            <p className="section-kicker">Overview</p>
            <h2>What this program offers</h2>
            <p>{program.overview}</p>
          </div>

          <div className="program-detail-section">
            <p className="section-kicker">Program highlights</p>
            <ul className="program-detail-list">
              {program.highlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="program-detail-section">
            <p className="section-kicker">Expected outcomes</p>
            <ul className="program-detail-list">
              {program.outcomes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="program-detail-section">
            <p className="section-kicker">Enrollment process</p>
            <ol className="program-detail-list program-detail-list--numbered">
              {program.enrollSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>

          <div className="program-detail-actions">
            <a className="btn btn-primary" href="/contact">
              Contact us to enroll
            </a>
            <a className="btn btn-secondary" href="/donate">
              Support the program
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
