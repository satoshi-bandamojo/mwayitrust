import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { storiesService } from '../services/stories.ts'
import type { Story } from '../types/index.ts'

const formatDate = (value: string) => {
  if (!value) return ''
  return new Date(`${value}T00:00:00`).toLocaleDateString('en-US', {
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
      if (!id) return
      setLoading(true)
      try {
        // Try to resolve by id first, then fallback to slug
        let result: Story | null = null
        try {
          result = await storiesService.getById(id)
        } catch (e) {
          // ignore and try slug
        }

        if (!result) {
          try {
            result = await storiesService.getBySlug(id)
          } catch (e) {
            // no-op
          }
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

  if (loading) return <div className="page-shell">Loading story…</div>
  if (error) return <div className="page-shell"><p className="error-message">{error}</p></div>
  if (!story) return <div className="page-shell"><p>Story not found.</p></div>

  const cover = story.cover_image || story.featured_image || story.image_url || ''
  const contentParagraphs = story.content ? story.content.split(/\r?\n\r?\n/).filter(Boolean) : []

  return (
    <div className="page-shell story-details">
      <article>
        <h1>{story.title}</h1>
        <p className="story-meta">
          {story.author && <span>By {story.author}</span>}
          {story.published_at || story.created_at ? (
            <span> — {formatDate(story.published_at || story.created_at || '')}</span>
          ) : null}
        </p>
        {cover ? <img src={cover} alt={story.title} className="story-cover" /> : null}

        <div className="story-content">
          {contentParagraphs.length
            ? contentParagraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))
            : <p>{story.excerpt}</p>}
        </div>
      </article>
    </div>
  )
}
