import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Calendar, User, HeartHandshake } from 'lucide-react'
import { storiesService } from '../services/stories.ts'
import type { Story } from '../types/index.ts'
import LoadingState from '../components/ui/LoadingState.tsx'

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

export default function StoryDetails() {
  const { id } = useParams()
  const [story, setStory] = useState<Story | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    async function load() {
      if (!id) {
        setError('Story not found.')
        setLoading(false)
        return
      }

      setLoading(true)
      try {
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)
        let result = isUuid ? await storiesService.getById(id) : null

        if (!result) {
          result = await storiesService.getBySlug(id)
        }

        if (!result && !isUuid) {
          const normalize = (value: string) => value.trim().toLocaleLowerCase().replace(/\s+/g, ' ')
          const stories = await storiesService.getAll()
          result =
            stories.find((item) =>
              item.id === id ||
              normalize(item.slug) === normalize(id) ||
              normalize(item.title) === normalize(id),
            ) ?? null
        }

        if (active) {
          if (result) setStory(result)
          else setError('Story not found.')
        }
      } catch (err) {
        if (active) setError((err as Error)?.message || 'Unable to load story.')
      } finally {
        if (active) setLoading(false)
      }
    }

    load()
    return () => {
      active = false
    }
  }, [id])

  if (loading) {
    return (
      <div className="page-shell">
        <LoadingState label="Loading story" />
      </div>
    )
  }

  if (error || !story) {
    return (
      <div className="page-shell text-center py-12">
        <p className="error-message mb-4">{error || 'Story not found.'}</p>
        <Link to="/stories" className="btn btn-secondary min-h-[44px]">
          <ArrowLeft size={18} />
          Back to all stories
        </Link>
      </div>
    )
  }

  const cover = story.cover_image || story.featured_image || story.image_url || ''
  const contentParagraphs = story.content ? story.content.split(/\r?\n+/).map((paragraph) => paragraph.trim()).filter(Boolean) : []

  return (
    <div className="page-shell story-details">
      <article className="story-details__article">
        <Link to="/stories" className="story-details__back">
          <ArrowLeft size={18} />
          <span>Back to all stories</span>
        </Link>

        <header className="story-details__header">
          <h1>{story.title}</h1>

          <div className="story-details__meta">
            {story.author && (
              <span>
                <User size={16} aria-hidden="true" />
                {story.author}
              </span>
            )}
            {(story.created_at || story.published_at) && (
              <span>
                <Calendar size={16} aria-hidden="true" />
                {formatDate(story.created_at || story.published_at || '')}
              </span>
            )}
            {story.category && <span className="story-details__category">{story.category}</span>}
          </div>
        </header>

        {cover ? (
          <div className="story-details__cover">
            <img src={cover} alt={story.title} />
          </div>
        ) : null}

        <div className="story-details__content">
          {contentParagraphs.length ? (
            contentParagraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)
          ) : (
            <p>{story.excerpt}</p>
          )}
        </div>

        <div className="story-details__cta">
          <div className="story-details__cta-copy">
            <h2>Inspired by this story?</h2>
            <p>Help us sponsor more students and vocational apprentices in Chileka.</p>
          </div>
          <Link to="/donate" className="btn btn-primary story-details__cta-button">
            <HeartHandshake size={18} />
            <span>Support Mwayi Trust</span>
          </Link>
        </div>
      </article>
    </div>
  )
}
