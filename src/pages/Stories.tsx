import { ArrowRight, BookOpen, Sparkles } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { storiesService } from '../services/stories.ts'
import type { Story } from '../types/index.ts'
import LoadingState from '../components/ui/LoadingState.tsx'

const initialStories: Story[] = []

const formatDate = (value: string) => {
  if (!value) return ''
  return new Date(`${value}T00:00:00`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export default function Stories() {
  const [stories, setStories] = useState<Story[]>(initialStories)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    async function loadStories() {
      setLoading(true)
      try {
        const allStories = await storiesService.getAll()
        if (active) {
          setStories(allStories)
        }
      } catch (err) {
        if (active) {
          setError((err as Error)?.message || 'Unable to load stories from Supabase.')
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadStories()
    return () => {
      active = false
    }
  }, [])

  const featuredStories = useMemo(
    () => stories.filter((story) => story.featured && story.published !== false).slice(0, 2),
    [stories],
  )
  const regularStories = useMemo(
    () => stories.filter((story) => !story.featured && story.published !== false),
    [stories],
  )

  const coverImage = (story: Story) => story.cover_image || story.featured_image || story.image_url || ''
  const storyCategory = (story: Story) => story.category || 'Story'
  const storyDate = (story: Story) => formatDate(story.published_at || story.created_at || '')

  return (
    <div className="stories-shell">
      <section className="stories-hero reveal-on-scroll">
        <div className="stories-hero__content">
          <p className="section-kicker">Stories of impact</p>
          <h1>Read the stories behind the change.</h1>
          <p>
            From quiet victories to community-wide transformation, these stories show how support becomes opportunity.
          </p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="#story-grid">
              <BookOpen size={18} />
              Explore stories
            </a>
            <a className="btn btn-secondary" href="/donate">
              <ArrowRight size={18} />
              Support the mission
            </a>
          </div>
        </div>
      </section>

      <section className="story-featured-grid" aria-label="Featured stories">
        {loading ? (
          <LoadingState label="Loading featured stories" />
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : featuredStories.length ? (
          featuredStories.map((story) => (
            <article key={story.id} className="story-feature-card">
              <a href={`/stories/${story.slug}`} className="story-feature-card__link">
                <img src={coverImage(story)} alt={story.title} />
                <div className="story-feature-card__content">
                  <span className="story-feature-card__tag">Featured</span>
                  <h3>{story.title}</h3>
                  <p>{story.excerpt}</p>
                </div>
              </a>
            </article>
          ))
        ) : (
          <p></p>
        )}
      </section>

      <section id="story-grid" className="story-grid" aria-label="Stories">
        {loading ? (
          <LoadingState label="Loading stories" />
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : regularStories.length ? (
          regularStories.map((story) => (
            <article key={story.id} className="story-card">
              <a href={`/stories/${story.slug}`} className="story-card__link">
                <div className="story-card__image-wrap">
                  <img src={coverImage(story)} alt={story.title} />
                </div>
                <div className="story-card__body">
                  <span className="story-card__tag">{storyCategory(story)}</span>
                  <h3>{story.title}</h3>
                  <p>{story.excerpt}</p>
                  <p className="story-card__meta">{storyDate(story)}</p>
                </div>
              </a>
            </article>
          ))
        ) : (
          <p>No stories available yet.</p>
        )}
      </section>

      <section className="story-cta-card">
        <div>
          <p className="section-kicker">Keep the momentum going</p>
          <h2>Every story is a reminder that change is possible.</h2>
          <p>When you support Mwayi Trust, you help turn these stories into more opportunities for young people.</p>
        </div>
        <a className="btn btn-primary" href="/donate">
          <Sparkles size={18} />
          Donate today
        </a>
      </section>
    </div>
  )
}