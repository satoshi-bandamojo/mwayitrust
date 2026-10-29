import { Link } from 'react-router-dom'
import { ArrowRight, HeartHandshake } from 'lucide-react'
import { programs } from '../data/programs.ts'

export default function Programs() {
  return (
    <div className="programs-shell">
      <section className="programs-intro" aria-labelledby="programs-title">
        <p className="section-kicker">What we do in Malawi</p>
        <h1 id="programs-title">Programs that open doors.</h1>
        <p>
          We support young people and families through education, practical skills, and opportunities rooted in the community.
        </p>
      </section>

      <section className="programs-grid" aria-label="Available programs">
        {programs.map((program) => (
          <Link key={program.slug} to={`/programs/${program.slug}`} className="program-card">
            <div className="program-image-wrap">
              <img src={program.image} alt={program.title} loading="lazy" decoding="async" />
            </div>
            <div className="program-body">
              <span className="program-card-kicker">Our programs</span>
              <h3>{program.title}</h3>
              <p>{program.summary}</p>
              <div className="program-card-action">
                <span>View Program Details</span>
                <ArrowRight size={16} />
              </div>
            </div>
          </Link>
        ))}
      </section>

      <section className="programs-footer" aria-label="Support and enrollment">
        <p>Want to help or learn more?</p>
        <div className="programs-footer-actions">
          <Link to="/donate" className="btn btn-primary min-h-[48px] justify-center">
            <HeartHandshake size={18} />
            <span>Support These Programs</span>
          </Link>
          <Link to="/contact" className="btn btn-secondary min-h-[48px] justify-center">
            <span>Inquire About Enrollment</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  )
}
