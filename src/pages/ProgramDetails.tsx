import { useMemo } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, HeartHandshake, PhoneCall } from 'lucide-react'
import { programs } from '../data/programs.ts'
import carpentryImage from '../assets/carpentry.webp'
import cookeryImage from '../assets/cookery2.webp'
import houseKeepingImage from '../assets/house-keeping.webp'
import tailoringImage from '../assets/converted_image (16).webp'

const vocationalCourses = [
  {
    title: 'Professional Cookery',
    description: 'Build practical cookery skills through hands-on kitchen training.',
    image: cookeryImage,
    tag: 'Culinary arts',
  },
  {
    title: 'Tailoring',
    description: 'Develop practical sewing and garment-making skills.',
    image: tailoringImage,
    tag: 'Fashion & design',
  },
  {
    title: 'Housekeeping',
    description: 'A practical course for girls with learning difficulties and women who did not complete or attend secondary school, taught in a model hotel room with an ensuite.',
    image: houseKeepingImage,
    tag: 'Hospitality services',
  },
  {
    title: 'Carpentry',
    description: 'Gain hands-on carpentry and joinery skills for practical work and self-employment.',
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
        <div className="page-block text-center py-12">
          <p className="section-kicker">Program not found</p>
          <h1>Sorry, we could not find that program.</h1>
          <p className="mb-6">Please return to our programs directory to explore available opportunities.</p>
          <button className="btn btn-secondary min-h-[44px]" type="button" onClick={() => navigate('/programs')}>
            <ArrowLeft size={18} />
            Back to programs
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="program-detail-shell">
      <section className="program-detail-hero">
        <button className="link-back min-h-[44px] mb-2" type="button" onClick={() => navigate('/programs')}>
          <ArrowLeft size={18} />
          <span>Back to all programs</span>
        </button>
        <p className="section-kicker">Our programs</p>
        <h1>{program.title}</h1>
        <p className="program-detail-summary">{program.summary}</p>
      </section>

      <section className="program-detail-feature">
        <div className="program-detail-image-wrap">
          <img src={program.detailImage} alt={program.title} loading="lazy" decoding="async" />
        </div>
        <div className="program-detail-overview">
          <p className="section-kicker">Overview</p>
          <h2>What this program offers</h2>
          <p>{program.overview}</p>
        </div>
      </section>

      {program.slug === 'vocational-training' ? (
        <section className="program-detail-section vocational-courses">
          <div className="program-detail-heading">
            <p className="section-kicker">Training pathways</p>
            <h2>Skills for work and business</h2>
          </div>
          <div className="course-grid">
            {vocationalCourses.map((course) => (
              <article key={course.title} className="course-card">
                <div className="course-card-image-wrap">
                  <img src={course.image} alt={course.title} loading="lazy" decoding="async" />
                </div>
                <div className="course-card-body">
                  <span className="course-tag">{course.tag}</span>
                  <h3>{course.title}</h3>
                  <p>{course.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <section className="program-detail-info-grid">
        <div className="program-detail-section">
          <p className="section-kicker">What’s included</p>
          <h2>Program highlights</h2>
          <ul className="program-detail-list">
            {program.highlights.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>

        <div className="program-detail-section">
          <p className="section-kicker">The difference</p>
          <h2>Expected outcomes</h2>
          <ul className="program-detail-list">
            {program.outcomes.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
      </section>

      <section className="program-detail-section program-enrollment">
        <div className="program-detail-heading">
          <p className="section-kicker">Getting started</p>
          <h2>{program.slug === 'vocational-training' || program.slug === 'speak-english-chileka' ? 'How to enroll' : 'How to get involved'}</h2>
        </div>
        <ol className="program-enrollment-steps">
          {program.enrollSteps.map((step, index) => (
            <li key={step}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <p>{step}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="program-detail-actions" aria-label="Program actions">
        <Link className="btn btn-primary min-h-[48px] justify-center" to="/contact">
          <PhoneCall size={18} />
          <span>
            {program.slug === 'speak-english-chileka'
              ? 'Ask About 2027 Restart'
              : program.slug === 'vocational-training'
                ? 'Enquire About Enrollment'
                : 'Contact Us to Get Involved'}
          </span>
          <ArrowRight size={16} />
        </Link>
        <Link className="btn btn-secondary min-h-[48px] justify-center" to="/donate">
          <HeartHandshake size={18} />
          <span>{program.slug === 'vocational-training' ? 'Support a Vocational Trainee' : 'Support This Program'}</span>
        </Link>
      </section>
    </div>
  )
}
