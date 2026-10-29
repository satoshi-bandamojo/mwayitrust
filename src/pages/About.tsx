import { ArrowRight, HeartHandshake } from 'lucide-react'
import { Link } from 'react-router-dom'
import teamMember1 from '../assets/team-member1.webp'
import teamMember2 from '../assets/team-member2.webp'

const milestones = [
  {
    year: '2009',
    text: 'Established in TA Kunthembwe, Chileka to support learners and youth development.',
  },
  {
    year: '2010',
    text: 'Launched the Homework Centre program for vulnerable primary school learners.',
  },
  {
    year: '2015',
    text: 'Started the Girls Secondary School Sponsorship and mentorship initiative.',
  },
  {
    year: '2018',
    text: 'Opened vocational trade courses in carpentry, cookery, and tailoring alongside our community garden.',
  },
  {
    year: '2023+',
    text: 'Expanded direct impact to 3,000+ youth through weekly learning hubs, certifications, and trade toolkits.',
  },
]

const values = [
  {
    title: 'Community First',
    description:
      'Every program begins with listening to the village leadership, families, and young people in Mbvundula.',
    icon: '🤝',
  },
  {
    title: 'Education as Liberation',
    description:
      'We believe learning and certified vocational trades break generational poverty and open real doors.',
    icon: '📚',
  },
  {
    title: 'Integrity & Stewardship',
    description:
      'Every Kwacha and foreign donation is managed with transparency and accountability to our donors and community.',
    icon: '🛡️',
  },
  {
    title: 'Self-Reliance',
    description:
      'We build practical skills, work discipline, and enterprise confidence so graduates build independent livelihoods.',
    icon: '🌱',
  },
  {
    title: 'Dignity & Care',
    description:
      'Every student, child, and family member is treated with deep respect, compassion, and encouragement.',
    icon: '💛',
  },
  {
    title: 'Sustainable Impact',
    description:
      'Our initiatives are designed for long-term community continuity that Malawian youth carry forward.',
    icon: '🌍',
  },
]

export default function About() {
  return (
    <div className="about-shell">
      <section className="about-intro" aria-labelledby="about-title">
        <p className="section-kicker">About Mwayi Trust</p>
        <h1 id="about-title">Opening doors through education and community support.</h1>
        <p>
          Founded in 2009, Mwayi Trust began in Chileka to support students who lacked school fees, books, and uniforms. Today, we provide homework tutoring, secondary school sponsorships, vocational training, and agricultural education in Mbvundula Village.
        </p>
        <p>
          We work alongside families, schools, and village leaders so young people can build skills, confidence, and a brighter future.
        </p>
        <div className="hero-actions about-story-actions">
          <Link className="btn btn-primary min-h-[48px] justify-center" to="/donate">
            <HeartHandshake size={18} />
            <span>Support Our Mission</span>
          </Link>
          <Link className="btn btn-secondary min-h-[48px] justify-center" to="/stories">
            <span>Read Impact Stories</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <section className="about-history" aria-labelledby="about-history-title">
        <div className="about-section-heading">
          <p className="section-kicker">Our journey</p>
          <h2 id="about-history-title">Growing with our community</h2>
        </div>
        <div className="milestone-list" aria-label="Key milestones">
          {milestones.map((milestone) => (
            <div key={milestone.year} className="milestone-item">
              <span className="milestone-year">{milestone.year}</span>
              <p>{milestone.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="about-values">
        <div className="about-section-heading">
          <p className="section-kicker">What drives us</p>
          <h2>Our core values</h2>
        </div>

        <div className="about-values-grid">
          {values.map((value) => (
            <article key={value.title} className="value-card">
              <div className="value-icon">{value.icon}</div>
              <h3>{value.title}</h3>
              <p>{value.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="about-team">
        <div className="about-section-heading">
          <p className="section-kicker">Leadership</p>
          <h2>Meet the people leading this work.</h2>
        </div>

        <div className="team-grid">
          <article className="team-card">
            <img src={teamMember2} alt="Sandra Trevethan" loading="lazy" decoding="async" />
            <div>
              <h3>Sandra Trevethan</h3>
              <p className="text-slate-500 font-semibold text-sm">Executive Director</p>
            </div>
          </article>
          <article className="team-card">
            <img src={teamMember1} alt="Linda Banda" loading="lazy" decoding="async" />
            <div>
              <h3>Linda Banda</h3>
              <p className="text-slate-500 font-semibold text-sm">General Manager</p>
            </div>
          </article>
        </div>
      </section>
    </div>
  )
}
