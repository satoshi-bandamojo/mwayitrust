import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { programs } from '../data/programs.ts'

export default function Programs() {
  return (
    <div className="programs-shell">
      <section className="programs-hero">
        <div>
          <p className="section-kicker">What we do</p>
          <h1>Our programs</h1>
          <p>
            Through these programs, Mwayi Trust helps learners stay in school, build skills, and create lasting opportunity.
          </p>
        </div>
      </section>

      <section className="programs-grid">
        {programs.map((program) => (
          <Link key={program.slug} to={`/programs/${program.slug}`} className="program-card">
            <div className="program-image-wrap">
              <img src={program.image} alt={program.title} />
            </div>
            <div className="program-body">
              <h3>{program.title}</h3>
              <p>{program.summary}</p>
            </div>
          </Link>
        ))}
      </section>

      <div className="programs-footer">
        <a href="/donate" className="btn btn-primary">
          Support these programs
          <ArrowRight size={18} />
        </a>
      </div>
    </div>
  )
}
