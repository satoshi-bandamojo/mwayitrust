import { ArrowRight, Eye, GraduationCap, HeartHandshake, PlayCircle, Sparkles, Target } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { programs } from '../data/programs.ts'
import { storiesService } from '../services/stories.ts'
import { subscribersService } from '../services/subscribers.ts'
import type { Story } from '../types/index.ts'
import heroImage from '../assets/hero.webp'

const stats = [
  { value: '3,000+', label: 'students supported' },
  { value: '6', label: 'learning hubs' },
  { value: '96%', label: 'community retention' },
]

const missionSnapshot = [
  {
    title: 'Our Mission',
    icon: Target,
    description:
      'To enable young people and communities to access vocational training, educational support, employment opportunities, and positive, sustainable lifestyles.',
  },
  {
    title: 'Our Vision',
    icon: Eye,
    description:
      'A thriving, self-reliant community where education and skills open pathways to dignified livelihoods and lasting social change.',
  },
]

const featuredStoriesDefault: Story[] = []
const featuredPrograms = programs.slice(0, 3)

export default function Home() {
  const [featuredStories, setFeaturedStories] = useState<Story[]>(featuredStoriesDefault)
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
        const stories = await storiesService.getFeatured()
        if (active) {
          setFeaturedStories(stories.slice(0, 2))
        }
      } catch (error) {
        if (active) {
          setStoriesError((error as Error)?.message || 'Unable to load stories from Supabase.')
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
      await subscribersService.subscribe(subscriberEmail.trim().toLowerCase())
      setSubscriberStatus('success')
      setSubscriberMessage('Subscribed! You will receive updates soon.')
      setSubscriberEmail('')
    } catch (error) {
      setSubscriberStatus('error')
      setSubscriberMessage((error as Error)?.message || 'Unable to subscribe. Please try again.')
    }
  }

  return (
    <div className="homepage-shell">
      <section className="hero-section" style={{ backgroundImage: `url(${heroImage})` }}>
        <div className="hero-overlay" />
        <div className="hero-content">
          <div className="hero-badge">
            <Sparkles size={16} />
            Joining Hands. Opening Doors.
          </div>
          <h1>Building brighter futures through learning and care.</h1>
          <p>
            Mwayi Trust supports classrooms, mentors, and community-led programs that help children thrive.
          </p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="/donate">
              <HeartHandshake size={18} />
              Donate now
            </a>
            <a className="btn btn-secondary" href="/about">
              <PlayCircle size={18} />
              Learn more
            </a>
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

      <section className="section-divider mission-snapshot-section" aria-label="Who we are">
        <div className="section-heading mission-snapshot-heading">
          <div>
            <p className="section-kicker">Who we are</p>
            <h2>Mwayi Trust is a community-rooted NGO built to open doors through education and opportunity.</h2>
          </div>
        </div>
        <p className="mission-snapshot-lead">
          Founded in 2009 and rooted in Mbvundula Village, TA Kunthembwe in Chileka, Blantyre, we work with young people and families to build lasting livelihoods through learning, training, and support.
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

      <section className="section-divider content-section programs-home-section">
        <div className="section-heading">
          <div>
            <p className="section-kicker">Programs available</p>
            <h2>Support the opportunities families need most.</h2>
          </div>
          <a href="/programs">View all programs</a>
        </div>

        <div className="home-programs-grid">
          {featuredPrograms.map((program) => (
            <Link key={program.slug} to={`/programs/${program.slug}`} className="home-program-card">
              <img src={program.image} alt={program.title} />
              <div className="home-program-body">
                <h3>{program.title}</h3>
                <p>{program.summary}</p>
                <span>
                  Learn more
                  <ArrowRight size={16} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="section-divider content-section">
        <div className="section-heading">
          <div>
            <p className="section-kicker">Featured stories</p>
            <h2>See how support turns into lasting change.</h2>
          </div>
        </div>
        <div className="card-grid">
          {storiesLoading ? (
            <p>Loading featured stories…</p>
          ) : storiesError ? (
            <p className="error-message">{storiesError}</p>
          ) : (
            featuredStories.map((story) => (
              <article key={story.id} className="info-card">
                <div className="icon-pill">
                  <GraduationCap size={18} />
                </div>
                <h3>{story.title}</h3>
                <p>{story.excerpt}</p>
              </article>
            ))
          )}
        </div>
        <div className="section-cta">
          <a className="btn btn-primary" href="/stories">
            Read Stories
          </a>
        </div>
      </section>

      <section className="newsletter-section">
        <div>
          <p className="section-kicker">Stay connected</p>
          <h2>Receive updates from Mwayi Trust.</h2>
          <p>Get stories, events, and opportunities straight to your inbox.</p>
        </div>
        <form className="newsletter-form" onSubmit={handleSubscribe}>
          <input
            type="email"
            placeholder="Enter your email"
            aria-label="Email address"
            value={subscriberEmail}
            onChange={(event) => setSubscriberEmail(event.target.value)}
            required
          />
          <button type="submit" disabled={subscriberStatus === 'saving'}>
            Subscribe
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
