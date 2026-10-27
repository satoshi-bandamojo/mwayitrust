import { useMemo } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, HeartHandshake, PhoneCall } from 'lucide-react'
import { programs } from '../data/programs.ts'
import carpentryImage from '../assets/carpentry.webp'
import cookeryImage from '../assets/cookery2.webp'
import houseKeepingImage from '../assets/house-keeping.webp'
import tailoringImage from '../assets/converted_image (16).webp'

const vocationalCourses = [
  {
    title: 'Cookery & Catering',
    description: 'Hands-on practical training in food preparation, nutrition, kitchen hygiene, and hospitality service.',
    image: cookeryImage,
    tag: 'Culinary arts',
  },
  {
    title: 'Tailoring & Design',
    description: 'Skills in garment construction, sewing machine operation, pattern reading, fitting, and school uniform production.',
    image: tailoringImage,
    tag: 'Fashion & design',
  },
  {
    title: 'House Keeping & Hospitality',
    description: 'Training in professional cleanliness, room care, laundry, hospitality standards, and hygiene management.',
    image: houseKeepingImage,
    tag: 'Hospitality services',
  },
  {
    title: 'Carpentry & Joinery',
    description: 'Practical woodworking skills including measurement, cutting, joinery, and durable local furniture construction.',
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

  if (program.slug === 'vocational-training') {
    return (
      <div className="program-detail-shell vocational-shell">
        <section className="program-detail-hero vocational-hero">
          <button className="link-back min-h-[44px] mb-2" type="button" onClick={() => navigate('/programs')}>
            <ArrowLeft size={18} />
            <span>Back to all programs</span>
          </button>
          <h1>{program.title}</h1>
          <p className="program-detail-summary">{program.summary}</p>
        </section>

        <section className="vocational-spotlight">
          <div className="vocational-spotlight-copy">
            <p className="section-kicker">Trades & Careers</p>
            <h2>Four certified training pathways to employment and entrepreneurship.</h2>
            <p>
              The Mwayi Trust Vocational Training Centre in Mbvundula Village equips young people with certified practical trades, workplace readiness, and micro-enterprise mentoring.
            </p>
          </div>
        </section>

        <section className="program-detail-section vocational-courses">
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

        <div className="program-detail-actions vocational-actions flex-col sm:flex-row gap-3">
          <Link className="btn btn-primary min-h-[48px] w-full sm:w-auto justify-center" to="/contact">
            <PhoneCall size={18} />
            <span>Contact Us to Enroll</span>
          </Link>
          <Link className="btn btn-secondary min-h-[48px] w-full sm:w-auto justify-center" to="/donate">
            <HeartHandshake size={18} />
            <span>Support a Vocational Trainee</span>
          </Link>
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
        <h1>{program.title}</h1>
        <p className="program-detail-summary">{program.summary}</p>
      </section>

      <section className="program-detail-content">
        <div className="program-detail-image-wrap">
          <img src={program.detailImage} alt={program.title} loading="lazy" decoding="async" />
        </div>
        <div className="program-detail-copy">
          <div className="program-detail-section">
            <p className="section-kicker">Program Overview</p>
            <h2>What this program offers</h2>
            <p className="text-slate-600 leading-relaxed">{program.overview}</p>
          </div>

          <div className="program-detail-section">
            <p className="section-kicker">Key Highlights</p>
            <ul className="program-detail-list">
              {program.highlights.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="program-detail-section">
            <p className="section-kicker">Expected Outcomes</p>
            <ul className="program-detail-list">
              {program.outcomes.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <CheckCircle2 size={18} className="text-[#034694] shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="program-detail-section">
            <p className="section-kicker">How to Enroll</p>
            <ol className="program-detail-list program-detail-list--numbered">
              {program.enrollSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>

          <div className="program-detail-actions flex-col sm:flex-row gap-3">
            <Link className="btn btn-primary min-h-[48px] w-full sm:w-auto justify-center" to="/contact">
              <PhoneCall size={18} />
              <span>Contact Us to Enroll</span>
            </Link>
            <Link className="btn btn-secondary min-h-[48px] w-full sm:w-auto justify-center" to="/donate">
              <HeartHandshake size={18} />
              <span>Support This Program</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
