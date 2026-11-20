import { Plus, Trash2, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import AdminImageUpload from '../../components/admin/AdminImageUpload.tsx'
import { addEvent, deleteEvent, getEvents } from '../../services/admin.ts'
import { deleteContentImage, uploadContentImage } from '../../services/contentImages.ts'
import type { EventItem } from '../../types/index.ts'

const slugify = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

export default function ManageEvents() {
  const [events, setEvents] = useState<EventItem[]>([])
  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState('')
  const [eventDate, setEventDate] = useState('')
  const [location, setLocation] = useState('')
  const [description, setDescription] = useState('')
  const [eventImageFile, setEventImageFile] = useState<File | null>(null)
  const [message, setMessage] = useState('')
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)

  const refresh = async () => {
    setLoading(true)
    setEvents(await getEvents())
    setLoading(false)
  }

  useEffect(() => {
    void refresh()
  }, [])

  const openForm = () => {
    setTitle('')
    setEventDate('')
    setLocation('')
    setDescription('')
    setEventImageFile(null)
    setMessage('')
    setShowForm(true)
  }

  const closeForm = () => {
    if (saving) return
    setShowForm(false)
    setTitle('')
    setEventDate('')
    setLocation('')
    setDescription('')
    setEventImageFile(null)
    setMessage('')
  }

  const handleAdd = async () => {
    if (!title.trim() || !eventDate || !location.trim() || !eventImageFile) {
      setMessage('Title, date, location, and an event image are required.')
      return
    }

    setSaving(true)
    let uploadedImageUrl = ''
    try {
      uploadedImageUrl = await uploadContentImage('events', eventImageFile)
      const created = await addEvent({
        title: title.trim(),
        slug: slugify(title),
        event_date: eventDate,
        location: location.trim(),
        description: description.trim(),
        image_url: uploadedImageUrl,
      })
      setEvents((current) => [...current, created].sort((a, b) => a.event_date.localeCompare(b.event_date)))
      setTitle('')
      setEventDate('')
      setLocation('')
      setDescription('')
      setEventImageFile(null)
      setMessage('')
      setShowForm(false)
    } catch (err) {
      if (uploadedImageUrl) {
        try {
          await deleteContentImage('events', uploadedImageUrl)
        } catch (cleanupError) {
          setMessage(
            `Unable to add event, and its uploaded image could not be removed: ${
              cleanupError instanceof Error ? cleanupError.message : 'Storage cleanup failed.'
            }`,
          )
          setSaving(false)
          return
        }
      }
      setMessage(err instanceof Error ? err.message : 'Unable to add event. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this event?')) return
    const event = events.find((item) => item.id === id)
    try {
      await deleteEvent(id)
      setEvents((current) => current.filter((ev) => ev.id !== id))
      const eventImage = event?.image_url || event?.image || event?.cover_image
      if (eventImage) {
        try {
          await deleteContentImage('events', eventImage)
          setMessage('')
        } catch (cleanupError) {
          setMessage(
            `Event deleted, but its image could not be removed: ${
              cleanupError instanceof Error ? cleanupError.message : 'Storage cleanup failed.'
            }`,
          )
        }
      }
    } catch {
      setMessage('Unable to delete event.')
    }
  }

  return (
    <div className="admin-page-shell admin-content-page">
      <section className="admin-page-header">
        <div>
          <p className="admin-content-page__eyebrow">Content management</p>
          <h1 className="admin-page-title">Events</h1>
          <p className="admin-page-subtitle">Create and manage upcoming events.</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={openForm}>
          <Plus size={16} />
          Create event
        </button>
      </section>

      {message && !showForm ? <div className="admin-alert admin-alert--error" role="alert">{message}</div> : null}

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
                  <th>Image</th>
                  <th>Title</th>
                  <th>Date</th>
                  <th>Location</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {events.map((ev) => (
                  <tr key={ev.id}>
                    <td>
                      {ev.image_url || ev.image || ev.cover_image ? (
                        <img
                          className="admin-events__thumbnail"
                          src={ev.image_url || ev.image || ev.cover_image}
                          alt=""
                          loading="lazy"
                        />
                      ) : '—'}
                    </td>
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

      {showForm ? (
        <div
          className="admin-content-modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="event-form-title"
        >
          <div className="admin-content-modal">
            <div className="admin-modal__header">
              <h2 id="event-form-title">Create event</h2>
              <button
                type="button"
                className="admin-modal__close"
                onClick={closeForm}
                aria-label="Close"
                disabled={saving}
              >
                <X size={18} />
              </button>
            </div>
            <div className="admin-modal__body">
              {message ? <div className="admin-alert admin-alert--error" role="alert">{message}</div> : null}
              <section className="admin-events__form">
                <label className="admin-events__field">
                  <span>Title *</span>
                  <input placeholder="Event title" value={title} onChange={(e) => setTitle(e.target.value)} />
                </label>
                <label className="admin-events__field">
                  <span>Date *</span>
                  <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} />
                </label>
                <label className="admin-events__field">
                  <span>Location *</span>
                  <input placeholder="Event location" value={location} onChange={(e) => setLocation(e.target.value)} />
                </label>
                <label className="admin-events__field admin-events__field--full">
                  <span>Description</span>
                  <textarea
                    placeholder="Event description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                  />
                </label>
                <AdminImageUpload
                  label="Event image"
                  file={eventImageFile}
                  onChange={setEventImageFile}
                  required
                  disabled={saving}
                />
              </section>
            </div>
            <div className="admin-modal__footer">
              <button type="button" className="btn btn-secondary" onClick={closeForm} disabled={saving}>
                Cancel
              </button>
              <button type="button" className="btn btn-primary" disabled={saving} onClick={() => void handleAdd()}>
                {saving ? 'Uploading…' : 'Create event'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}