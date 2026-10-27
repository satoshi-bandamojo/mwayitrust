import { ArrowRight, BookOpen, Eye, GraduationCap, HeartHandshake, PackageOpen, PlayCircle, Target, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { programs } from '../data/programs.ts'
import type { Story } from '../types/index.ts'
import heroImage from '../assets/hero.webp'
import LoadingState from '../components/ui/LoadingState.tsx'

const stats = [
  { value: '3,000+', label: 'students supported' },
  { value: '6', label: 'learning hubs' },
  { value: '96%', label: 'program retention' },
]

const missionSnapshot = [
  {
    title: 'Our Mission',
    icon: Target,
    description:
      'To enable young people and communities in Malawi to access vocational training, educational support, employment opportunities, and self-reliant livelihoods.',
  },
  {
    title: 'Our Vision',
    icon: Eye,
    description:
      'A thriving, self-reliant community where practical skills and quality education open permanent pathways to dignity and economic freedom.',
  },
]

const featuredPrograms = programs.slice(0, 3)
const coverImage = (story: Story) => story.cover_image || story.featured_image || story.image_url || ''

export default function Home() {
  const [featuredStories, setFeaturedStories] = useState<Story[]>([])
  const [storiesLoading, setStoriesLoading] = useState(true)
  const [storiesError, setStoriesError] = useState('')
  const [subscriberEmail, setSubscriberEmail] = useState('')
  const [subscriberMessage, setSubscriberMessage] = useState('')
  const [subscriberStatus, setSubscriberStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle')

  useEffect(() => {
    let active = true

    async function loadFeaturedStories() {
      setStoriesLoading(true)
      try {
        const { storiesService } = await import('../services/stories.ts')
        const stories = await storiesService.getFeatured()
        if (active) {
          setFeaturedStories(stories.slice(0, 2))
        }
      } catch (error) {
        if (active) {
          setStoriesError((error as Error)?.message || 'Unable to load stories.')
        }
      } finally {
        if (active) {
          setStoriesLoading(false)
        }
      }
    }

    loadFeaturedStories()
    return () => {
      active = false
    }
  }, [])

  async function handleSubscribe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubscriberMessage('')

    if (!subscriberEmail.trim()) {
      setSubscriberStatus('error')
      setSubscriberMessage('Please enter a valid email address.')
      return
    }

    setSubscriberStatus('saving')

    try {
      const { subscribersService } = await import('../services/subscribers.ts')
      await subscribersService.subscribe(subscriberEmail.trim().toLowerCase())
      setSubscriberStatus('success')
      setSubscriberMessage('Zikomo! Subscribed to Mwayi Trust updates.')
      setSubscriberEmail('')
    } catch (error) {
      setSubscriberStatus('error')
      setSubscriberMessage((error as Error)?.message || 'Unable to subscribe. Please try again.')
    }
  }

  return (
    <div className="homepage-shell">
      {/* Mobile-First Hero Section */}
      <section className="hero-section">
        <img className="hero-image" src={heroImage} alt="Mwayi Trust Students and Community" fetchPriority="high" />
        <div className="hero-overlay" />
        <div className="hero-content">
          <div className="hero-badge">
            <span>🇲🇼</span>
            <span>Chileka, Blantyre, Malawi</span>
          </div>

          <h1 className="hero-slogan">
            <span>Joining</span>
            <span>Hands.</span>
            <span>Opening</span>
            <span>Doors.</span>
          </h1>
          <p className="hero-lead-text">
            Mwayi Trust equips young Malawians with education, vocational trade certificates, and community mentorship.
          </p>

          <div className="hero-actions">
            <Link className="btn btn-primary min-h-[48px]" to="/donate">
              <HeartHandshake size={20} />
              <span>Donate (MWK)</span>
            </Link>
            <Link className="btn btn-secondary min-h-[48px]" to="/programs">
              <PlayCircle size={20} />
              <span>Explore Programs</span>
            </Link>
          </div>

          <div className="hero-stats" aria-label="Impact statistics">
            {stats.map((stat) => (
              <div key={stat.label} className="stat-card">
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision Snapshot */}
      <section className="section-divider mission-snapshot-section" aria-label="Who we are">
        <div className="section-heading mission-snapshot-heading">
          <div>
            <p className="section-kicker">Rooted in Malawi</p>
            <h2>Community-led empowerment built to open doors through skills and education.</h2>
          </div>
        </div>
        <p className="mission-snapshot-lead">
          Founded in 2009 in Mbvundula Village, TA Kunthembwe in Chileka, Blantyre, Mwayi Trust creates sustainable livelihoods for youth and families through vocational training, after-school learning, and agricultural scholarships.
        </p>
        <div className="mission-snapshot-grid">
          {missionSnapshot.map((item) => {
            const Icon = item.icon
            return (
              <article key={item.title} className="mission-snapshot-card">
                <div className="mission-snapshot-icon">
                  <Icon size={22} />
                </div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            )
          })}
        </div>
      </section>

      {/* Core Programs Preview */}
      <section className="section-divider content-section programs-home-section">
        <div className="section-heading">
          <div>
            <p className="section-kicker">Key initiatives</p>
            <h2>Hands-on programs creating lasting opportunity.</h2>
          </div>
          <Link to="/programs" className="font-semibold text-[#034694] hover:underline flex items-center gap-1">
            <span>View all 4 programs</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="home-programs-grid">
          {featuredPrograms.map((program) => (
            <Link key={program.slug} to={`/programs/${program.slug}`} className="home-program-card">
              <div className="home-program-image-wrap">
                <img src={program.image} alt={program.title} loading="lazy" decoding="async" />
              </div>
              <div className="home-program-body">
                <h3>{program.title}</h3>
                <p>{program.summary}</p>
                <span className="home-program-link">
                  <span>Learn more</span>
                  <ArrowRight size={16} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* How to Help */}
      <section className="section-divider content-section help-section" aria-labelledby="how-to-help-title">
        <div className="section-heading">
          <div>
            <p className="section-kicker">How to participate</p>
            <h2 id="how-to-help-title">Multiple ways to stand with a young learner.</h2>
          </div>
          <p className="help-intro">
            Whether you donate via Airtel Money/Mpamba, provide learning materials, or volunteer your expertise, your support keeps classroom doors open.
          </p>
        </div>

        <div className="help-options-grid">
          <article className="help-option-card">
            <div className="help-option-icon">
              <HeartHandshake size={22} />
            </div>
            <p className="help-option-number">01</p>
            <h3>Make a donation</h3>
            <p>
              Directly sponsor school fees, trade uniforms, exam fees, and daily student meals.
            </p>
            <Link to="/donate" className="help-option-link">
              Give today (MWK) <ArrowRight size={16} />
            </Link>
          </article>

          <article className="help-option-card">
            <div className="help-option-icon">
              <PackageOpen size={22} />
            </div>
            <p className="help-option-number">02</p>
            <h3>Donate learning supplies</h3>
            <p>
              Exercise books, pens, secondary textbooks, geometry sets, and sewing or carpentry tools.
            </p>
            <Link to="/contact" className="help-option-link">
              Coordinate drop-off <ArrowRight size={16} />
            </Link>
          </article>

          <article className="help-option-card">
            <div className="help-option-icon">
              <Users size={22} />
            </div>
            <p className="help-option-number">03</p>
            <h3>Volunteer & mentor</h3>
            <p>
              Join our homework tutoring circles, lead trade masterclasses, or mentor secondary school girls.
            </p>
            <Link to="/contact" className="help-option-link">
              Join as a mentor <ArrowRight size={16} />
            </Link>
          </article>
        </div>

        <div className="help-note">
          <BookOpen size={20} />
          <p>Every contribution, big or small, impacts a real family in Chileka.</p>
        </div>
      </section>

      {/* Featured Stories */}
      <section className="section-divider content-section">
        <div className="section-heading">
          <div>
            <p className="section-kicker">Real impact</p>
            <h2>Stories from our students and community.</h2>
          </div>
        </div>
        <div className="card-grid">
          {storiesLoading ? (
            <LoadingState label="Loading featured stories" />
          ) : storiesError ? (
            <p className="error-message">{storiesError}</p>
          ) : (
            featuredStories.map((story) => (
              <article key={story.id} className="info-card story-card">
                {coverImage(story) ? (
                  <div className="story-card__image-wrap">
                    <img src={coverImage(story)} alt={story.title} loading="lazy" decoding="async" />
                  </div>
                ) : null}
                <div className="story-card__body">
                  <div className="icon-pill">
                    <GraduationCap size={18} />
                  </div>
                  <h3>{story.title}</h3>
                  <p>{story.excerpt}</p>
                  <Link to={`/stories/${story.slug}`} className="mt-3 text-sm font-bold text-[#034694] inline-flex items-center gap-1">
                    <span>Read story</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </article>
            ))
          )}
        </div>
        <div className="section-cta">
          <Link className="btn btn-primary min-h-[48px]" to="/stories">
            Read All Stories
          </Link>
        </div>
      </section>

      {/* Mobile-Friendly Newsletter */}
      <section className="newsletter-section">
        <div className="newsletter-copy">
          <p className="section-kicker">Stay updated</p>
          <h2>Connect with Mwayi Trust</h2>
          <p>Receive periodic updates on student graduations, community garden yields, and events.</p>
        </div>
        <form className="newsletter-form" onSubmit={handleSubscribe} noValidate>
          <input
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="Enter your email address"
            aria-label="Email address"
            value={subscriberEmail}
            onChange={(event) => setSubscriberEmail(event.target.value)}
            required
          />
          <button type="submit" className="min-h-[48px]" disabled={subscriberStatus === 'saving'}>
            {subscriberStatus === 'saving' ? 'Subscribing…' : 'Subscribe'}
          </button>
        </form>
        {subscriberMessage ? (
          <p className={subscriberStatus === 'error' ? 'error-message' : 'success-message'} aria-live="polite">
            {subscriberMessage}
          </p>
        ) : null}
      </section>
    </div>
  )
}
