import { ArrowRight, HeartHandshake } from 'lucide-react'
import aboutImage from '../assets/about.jpg'
import teamMember1 from '../assets/team-member1.jpg'
import teamMember2 from '../assets/team-member2.jpg'
import teamMember3 from '../assets/team-member3.jpg'

const milestones = [
  {
    year: '2009',
    text: 'Established in TA Kunthembwe to support learners and youth development.',
  },
  {
    year: '2010',
    text: 'Launched the Homework Centre program for vulnerable learners.',
  },
  {
    year: '2015',
    text: 'Started the Girls Secondary School Sponsorship program.',
  },
  {
    year: '2018',
    text: 'Introduced vocational training and community garden initiatives.',
  },
  {
    year: '2023',
    text: 'Expanded support to 1,000+ learners through weekly programs and scholarships.',
  },
]

const values = [
  {
    title: 'Community First',
    description:
      'Every decision starts with the community. We listen, learn, and act alongside the people we serve.',
    icon: '🤝',
  },
  {
    title: 'Education as Liberation',
    description:
      'We believe education is the most powerful tool for breaking cycles of poverty and opening doors to opportunity.',
    icon: '📚',
  },
  {
    title: 'Integrity',
    description:
      'We operate with transparency, accountability, and honesty in how we use resources and report impact.',
    icon: '🛡️',
  },
  {
    title: 'Empowerment',
    description:
      'We build skills, confidence, and agency so individuals and communities can lead their own futures.',
    icon: '🌱',
  },
  {
    title: 'Compassion',
    description:
      'We approach every student, family, and community with dignity, care, and respect.',
    icon: '💛',
  },
  {
    title: 'Sustainability',
    description:
      'Our programs are designed to create lasting change that communities can carry forward independently.',
    icon: '🌍',
  },
]

export default function About() {
  return (
    <div className="about-shell">
      <section className="about-hero">
        <div className="about-hero-content">
          <p className="section-kicker">About Mwayi Trust</p>
          <h1>From a vision to a movement of change.</h1>
          <p>
            Mwayi Trust was born from a simple belief: every student in Malawi deserves access to education, mentorship,
            and opportunity regardless of background.
          </p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="/donate">
              <HeartHandshake size={18} />
              Support the mission
            </a>
            <a className="btn btn-secondary" href="/stories">
              Read our stories
              <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </section>

      <section className="about-story">
        <div className="about-story-media">
          <img src={aboutImage} alt="Mwayi Trust community in action" />
          <div className="story-badge">
            <strong>2009</strong>
            <span>Est.</span>
          </div>
        </div>

        <div className="about-story-content">
          <p className="section-kicker">Our story</p>
          <h2>What began as a small community initiative is now a trusted force for change.</h2>
          <p>
            Founded in 2009, Mwayi Trust started as a small community response to support students who lacked the resources
            to continue their education. Today, the organization walks alongside students, families, and communities through
            mentorship, digital learning, school support, and community workshops.
          </p>
          <p>
            We continue to document impact, celebrate achievements, and open doors that were once closed for young people in
            Malawi.
          </p>

          <div className="milestone-list">
            {milestones.map((milestone) => (
              <div key={milestone.year} className="milestone-item">
                <span className="milestone-year">{milestone.year}</span>
                <p>{milestone.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="about-values">
        <div className="section-heading">
          <div>
            <p className="section-kicker">What drives us</p>
            <h2>Our core values</h2>
          </div>
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
        <div className="section-heading">
          <p className="section-kicker">Meet the team</p>
          <h2>People who guide Mwayi Trust every day.</h2>
        </div>

        <div className="team-grid">
          <article className="team-card">
            <img src={teamMember1} alt="Patricia Banda" />
            <div>
              <h3>---------------------</h3>
              <p>---------------------</p>
            </div>
          </article>
          <article className="team-card">
            <img src={teamMember2} alt="Esther Moyo" />
            <div>
              <h3>Linda Banda</h3>
              <p>---------------------</p>
            </div>
          </article>
          <article className="team-card">
            <img src={teamMember3} alt="Joseph Phiri" />
            <div>
              <h3>Sandra</h3>
              <p>---------------------</p>
            </div>
          </article>
        </div>
      </section>
    </div>
  )
}
