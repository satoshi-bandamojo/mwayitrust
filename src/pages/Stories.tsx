import { ArrowRight } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { storiesService } from '../services/stories.ts'
import type { Story } from '../types/index.ts'
import LoadingState from '../components/ui/LoadingState.tsx'

const initialStories: Story[] = []

const formatDate = (value: string) => {
  if (!value) return ''
  const date = /^\d{4}-\d{2}-\d{2}$/.test(value) ? new Date(`${value}T00:00:00`) : new Date(value)
  if (Number.isNaN(date.getTime())) return ''

  return date.toLocaleDateString('en-US', {
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

  const publishedStories = useMemo(
    () => stories.filter((story) => story.published !== false),
    [stories],
  )

  const coverImage = (story: Story) => story.cover_image || story.featured_image || story.image_url || ''
  const storyCategory = (story: Story) => story.category || 'Story'
  const storyDate = (story: Story) => formatDate(story.created_at || story.published_at || '')

  return (
    <div className="stories-shell">
      <section className="stories-intro" aria-labelledby="stories-title">
        <p className="section-kicker">Stories of impact</p>
        <h1 id="stories-title">Small steps. Lasting change.</h1>
        <p>
          Updates and stories from the young people and communities growing with Mwayi Trust.
        </p>
      </section>

      <section id="story-grid" className="story-list-section" aria-label="Stories">
        {loading ? (
          <div className="story-loading"><LoadingState label="Loading stories" /></div>
        ) : error ? (
          <p className="error-message" role="alert">{error}</p>
        ) : publishedStories.length ? (
          <div className="story-grid">
            {publishedStories.map((story) => (
              <article key={story.id} className="story-card">
                <Link to={`/stories/${story.slug}`} className="story-card__link">
                  {coverImage(story) ? (
                    <div className="story-card__image-wrap">
                      <img src={coverImage(story)} alt={story.title} loading="lazy" decoding="async" />
                    </div>
                  ) : null}
                  <div className="story-card__body">
                    <div className="story-card__meta-line">
                      <span className="story-card__tag">{storyCategory(story)}</span>
                      <span className="story-card__meta">{storyDate(story)}</span>
                    </div>
                    <h3>{story.title}</h3>
                    <p>{story.excerpt}</p>
                    <span className="story-card__read-more">Read story <ArrowRight size={15} /></span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <div className="stories-empty-state">
            <h2>Stories are coming soon</h2>
            <p>We’re preparing updates from our programs and the communities we work alongside. Please check back soon.</p>
            <Link to="/programs" className="stories-empty-link">
              Explore our programs <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </section>

    </div>
  )
}