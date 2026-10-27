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
      if (!id) return
      setLoading(true)
      try {
        let result: Story | null = null
        try {
          result = await storiesService.getById(id)
        } catch {
          // ignore and try slug
        }

        if (!result) {
          try {
            result = await storiesService.getBySlug(id)
          } catch {
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
  const contentParagraphs = story.content ? story.content.split(/\r?\n\r?\n/).filter(Boolean) : []

  return (
    <div className="page-shell story-details">
      <article className="max-w-3xl mx-auto">
        <Link to="/stories" className="link-back min-h-[44px] mb-4 inline-flex items-center gap-2 text-[#034694] font-semibold">
          <ArrowLeft size={18} />
          <span>Back to all stories</span>
        </Link>

        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight mb-3">
          {story.title}
        </h1>

        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 mb-4 pb-3 border-b border-slate-100">
          {story.author && (
            <span className="inline-flex items-center gap-1.5">
              <User size={15} />
              <span>{story.author}</span>
            </span>
          )}
          {(story.created_at || story.published_at) && (
            <span className="inline-flex items-center gap-1.5">
              <Calendar size={15} />
              <span>{formatDate(story.created_at || story.published_at || '')}</span>
            </span>
          )}
          {story.category && (
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-[#034694]">
              {story.category}
            </span>
          )}
        </div>

        {cover ? (
          <div className="my-4 rounded-2xl overflow-hidden shadow-md">
            <img src={cover} alt={story.title} className="w-full max-h-[480px] object-cover" />
          </div>
        ) : null}

        <div className="story-content text-slate-700 leading-relaxed space-y-4 my-6 text-base sm:text-lg">
          {contentParagraphs.length ? (
            contentParagraphs.map((p, i) => <p key={i}>{p}</p>)
          ) : (
            <p>{story.excerpt}</p>
          )}
        </div>

        <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50 p-5 rounded-2xl">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Inspired by this story?</h3>
            <p className="text-sm text-slate-600">Help us sponsor more students and vocational apprentices in Chileka.</p>
          </div>
          <Link to="/donate" className="btn btn-primary min-h-[48px] w-full sm:w-auto justify-center">
            <HeartHandshake size={18} />
            <span>Support Mwayi Trust</span>
          </Link>
        </div>
      </article>
    </div>
  )
}
