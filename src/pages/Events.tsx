import { ArrowRight, CalendarDays, MapPin, TimerReset } from 'lucide-react'
import { useEffect, useState } from 'react'
import { eventsService } from '../services/events.ts'
import type { EventItem } from '../types/index.ts'
import LoadingState from '../components/ui/LoadingState.tsx'

type EventStatus = 'upcoming' | 'ongoing' | 'past'

const formatDate = (date: string) => {
  if (!date) return ''
  return new Date(`${date}T00:00:00`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

const getStatus = (date: string): EventStatus => {
  const target = new Date(`${date}T00:00:00`)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  if (target < today) return 'past'
  if (target.getTime() === today.getTime()) return 'ongoing'
  return 'upcoming'
}

export default function Events() {
  const [events, setEvents] = useState<EventItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [visibleCount, setVisibleCount] = useState(6)

  useEffect(() => {
    let active = true

    async function loadEvents() {
      setLoading(true)
      try {
        const allEvents = await eventsService.getAll()
        if (active) {
          setEvents(allEvents)
        }
      } catch (err) {
        if (active) {
          setError((err as Error)?.message || 'Unable to load events from Supabase.')
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadEvents()
    return () => {
      active = false
    }
  }, [])

  const displayedEvents = events.slice(0, visibleCount)
  const hasMore = visibleCount < events.length

  return (
    <div className="events-shell">
      <section className="events-hero reveal-on-scroll">
        <div className="events-hero__content">
          <p className="section-kicker">Upcoming programs</p>
          <h1>Explore the events and learning experiences shaping our community.</h1>
          <p>
            From workshops to mentorship launches, discover the opportunities that help learners grow, connect, and thrive.
          </p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="#events-list">
              <CalendarDays size={18} />
              Browse events
            </a>
            <a className="btn btn-secondary" href="/contact">
              <ArrowRight size={18} />
              Reach out
            </a>
          </div>
        </div>
      </section>

      <div className="events-layout">
        <main id="events-list" className="events-main">
          <div className="events-toolbar">
            <p className="events-count">Showing {displayedEvents.length} of {events.length} events</p>
          </div>

          {loading ? (
            <LoadingState label="Loading events" />
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : displayedEvents.length ? (
            <div className="events-grid">
              {displayedEvents.map((event) => {
                const status = getStatus(event.event_date)
                return (
                  <article key={event.id} className="event-card">
                    <div className="event-card__image-wrap">
                      {event.image ? <img src={event.image} alt={event.title} /> : null}
                      <span className={`event-card__status event-card__status--${status}`}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </span>
                    </div>
                    <div className="event-card__content">
                      <div className="event-card__header">
                        {event.featured ? <span className="event-card__badge">Featured</span> : null}
                      </div>
                      <h3>{event.title}</h3>
                      <p>{event.description}</p>
                      <div className="event-card__details">
                        <div className="event-card__detail">
                          <CalendarDays size={16} />
                          <span>{formatDate(event.event_date)}</span>
                        </div>
                        {event.start_time ? (
                          <div className="event-card__detail">
                            <TimerReset size={16} />
                            <span>{event.start_time}</span>
                          </div>
                        ) : null}
                        <div className="event-card__detail">
                          <MapPin size={16} />
                          <span>{event.location}</span>
                        </div>
                      </div>
                      <a className="event-card__cta" href="/contact">
                        Learn more
                        <ArrowRight size={16} />
                      </a>
                    </div>
                  </article>
                )
              })}
            </div>
          ) : (
            <div className="events-empty-state">
              <div className="events-empty-state__icon">📅</div>
              <h3>No events found</h3>
              <p>Check back soon for fresh opportunities.</p>
            </div>
          )}

          {hasMore ? (
            <div className="events-pagination">
              <button type="button" className="events-load-more" onClick={() => setVisibleCount((count) => count + 6)}>
                Load more events
              </button>
            </div>
          ) : null}
        </main>
      </div>


    </div>
  )
}