import { Link } from 'react-router-dom'
import { ArrowRight, HeartHandshake } from 'lucide-react'
import { programs } from '../data/programs.ts'

export default function Programs() {
  return (
    <div className="programs-shell">
      <section className="programs-hero welcome-hero">
        <div className="welcome-hero__content">
          <p className="section-kicker">What we do in Malawi</p>
          <h1>Our community programs</h1>
          <p>
            Through education, trade mentorship, and agricultural training, Mwayi Trust empowers youth and families in Chileka to create dignified, sustainable livelihoods.
          </p>
        </div>
      </section>

      <section className="programs-grid" aria-label="Available programs">
        {programs.map((program) => (
          <Link key={program.slug} to={`/programs/${program.slug}`} className="program-card">
            <div className="program-image-wrap">
              <img src={program.image} alt={program.title} loading="lazy" decoding="async" />
            </div>
            <div className="program-body">
              <span className="text-xs font-bold uppercase tracking-wider text-[#034694]">Program Track</span>
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

      <div className="programs-footer flex-col sm:flex-row gap-3 items-center">
        <Link to="/donate" className="btn btn-primary min-h-[48px] w-full sm:w-auto justify-center">
          <HeartHandshake size={18} />
          <span>Support These Programs (MWK)</span>
        </Link>
        <Link to="/contact" className="btn btn-secondary min-h-[48px] w-full sm:w-auto justify-center">
          <span>Inquire About Enrollment</span>
        </Link>
      </div>
    </div>
  )
}
