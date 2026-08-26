import { Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { addEvent, deleteEvent, getEvents } from '../../services/admin.ts'
import type { EventItem } from '../../types/index.ts'

const slugify = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

export default function ManageEvents() {
  const [events, setEvents] = useState<EventItem[]>([])
  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState('')
  const [eventDate, setEventDate] = useState('')
  const [location, setLocation] = useState('')
  const [description, setDescription] = useState('')
  const [message, setMessage] = useState('')

  const refresh = async () => {
    setLoading(true)
    setEvents(await getEvents())
    setLoading(false)
  }

  useEffect(() => {
    void refresh()
  }, [])

  const handleAdd = async () => {
    if (!title.trim() || !eventDate || !location.trim()) {
      setMessage('Title, date, and location are required.')
      return
    }
    try {
      const created = await addEvent({
        title,
        slug: slugify(title),
        event_date: eventDate,
        location,
        description,
      })
      setEvents((current) => [...current, created].sort((a, b) => a.event_date.localeCompare(b.event_date)))
      setTitle('')
      setEventDate('')
      setLocation('')
      setDescription('')
      setMessage('')
    } catch {
      setMessage('Unable to add event.')
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this event?')) return
    try {
      await deleteEvent(id)
      setEvents((current) => current.filter((ev) => ev.id !== id))
    } catch {
      setMessage('Unable to delete event.')
    }
  }

  return (
    <div className="admin-page-shell">
      <section className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Events</h1>
          <p className="admin-page-subtitle">Add and remove upcoming events.</p>
        </div>
      </section>

      {message ? <div className="admin-alert admin-alert--error">{message}</div> : null}

      <section className="admin-panel" style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} />
        <input placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
        <input placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <button type="button" className="btn btn-primary" onClick={() => void handleAdd()}>
          Add
        </button>
      </section>

      <section className="admin-panel">
        {loading ? (
          <p>Loading…</p>
        ) : events.length === 0 ? (
          <p>No events yet.</p>
        ) : (
          <div className="donations-table-wrapper">
            <table className="donations-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Date</th>
                  <th>Location</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {events.map((ev) => (
                  <tr key={ev.id}>
                    <td>{ev.title}</td>
                    <td>{new Date(ev.event_date).toLocaleDateString('en-GB')}</td>
                    <td>{ev.location}</td>
                    <td className="admin-table-actions">
                      <button
                        type="button"
                        className="admin-action-button admin-action-button--danger"
                        onClick={() => void handleDelete(ev.id)}
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}