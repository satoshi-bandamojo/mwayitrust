import { useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { programs } from '../data/programs.ts'
import carpentryImage from '../assets/carpentry.webp'
import cookeryImage from '../assets/cookery2.webp'
import houseKeepingImage from '../assets/house-keeping.jpg'
import tailoringImage from '../assets/program-vocational2.webp'

const vocationalCourses = [
  {
    title: 'Cookery',
    description: 'Hands-on practical training in food preparation, kitchen hygiene, and hospitality service.',
    image: cookeryImage,
    tag: 'Culinary arts',
  },
  {
    title: 'Tailoring',
    description: 'Skills in garment making, pattern reading, fitting, and finishing for everyday tailoring work.',
    image: tailoringImage,
    tag: 'Fashion & design',
  },
  {
    title: 'House Keeping',
    description: 'Training in cleanliness, room care, hospitality standards, and responsible housekeeping routines.',
    image: houseKeepingImage,
    tag: 'Hospitality services',
  },
  {
    title: 'Carpentry',
    description: 'Practical woodworking skills including measurement, cutting, assembly, and basic furniture making.',
    image: carpentryImage,
    tag: 'Skilled trades',
  },
]

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

  if (program.slug === 'vocational-training') {
    return (
      <div className="program-detail-shell vocational-shell">
        <section className="program-detail-hero vocational-hero">
          <button className="link-back" type="button" onClick={() => navigate('/programs')}>
            <ArrowLeft size={18} />
            Back to programs
          </button>
          <h1>{program.title}</h1>
          <p className="program-detail-summary">{program.summary}</p>
        </section>

        <section className="vocational-spotlight">
          <div className="vocational-spotlight-copy">
            <p className="section-kicker">Training pathways</p>
            <h2>Four practical courses designed to build real skills and brighter futures.</h2>
            <p>
              The Mwayi Trust Vocational Training Centre equips young people with hands-on experience in the trades and
              service skills most needed in everyday work and enterprise.
            </p>
          </div>
        </section>

        <section className="program-detail-section vocational-courses">
          <div className="course-grid">
            {vocationalCourses.map((course) => (
              <article key={course.title} className="course-card">
                <img src={course.image} alt={course.title} />
                <div className="course-card-body">
                  <span className="course-tag">{course.tag}</span>
                  <h3>{course.title}</h3>
                  <p>{course.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <div className="program-detail-actions vocational-actions">
          <a className="btn btn-primary" href="/contact">
            Contact us to enroll
          </a>
          <a className="btn btn-secondary" href="/donate">
            Support the program
          </a>
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
