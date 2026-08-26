import { Pencil, Plus, Star, Trash2, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { storiesService } from '../../services/stories.ts'
import type { Story } from '../../types/index.ts'

type FormState = {
  title: string
  slug: string
  excerpt: string
  content: string
  author: string
  category: string
  cover_image: string
  featured: boolean
  published: boolean
}

const emptyForm: FormState = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  author: '',
  category: '',
  cover_image: '',
  featured: false,
  published: true,
}

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

const formatDate = (value?: string) => {
  if (!value) return '—'
  return new Date(value).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function ManageStories() {
  const [stories, setStories] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)
  const [statusMessage, setStatusMessage] = useState('')
  const [statusType, setStatusType] = useState<'success' | 'error'>('success')

  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [slugTouched, setSlugTouched] = useState(false)
  const [saving, setSaving] = useState(false)

  const refreshStories = async () => {
    setLoading(true)
    try {
      const result = await storiesService.getAll()
      setStories(result)
    } catch {
      setStatusType('error')
      setStatusMessage('Unable to load stories from the database.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void refreshStories()
  }, [])

  const sortedStories = useMemo(
    () =>
      [...stories].sort((a, b) => {
        const da = new Date(a.created_at || 0).getTime()
        const db = new Date(b.created_at || 0).getTime()
        return db - da
      }),
    [stories],
  )

  const openCreateForm = () => {
    setEditingId(null)
    setForm(emptyForm)
    setSlugTouched(false)
    setShowForm(true)
  }

  const openEditForm = (story: Story) => {
    setEditingId(story.id)
    setForm({
      title: story.title ?? '',
      slug: story.slug ?? '',
      excerpt: story.excerpt ?? '',
      content: story.content ?? '',
      author: story.author ?? '',
      category: story.category ?? '',
      cover_image: story.cover_image || story.featured_image || story.image_url || '',
      featured: Boolean(story.featured),
      published: story.published !== false,
    })
    setSlugTouched(true)
    setShowForm(true)
  }

  const closeForm = () => {
    setShowForm(false)
    setEditingId(null)
    setForm(emptyForm)
  }

  const handleTitleChange = (value: string) => {
    setForm((current) => ({
      ...current,
      title: value,
      slug: slugTouched ? current.slug : slugify(value),
    }))
  }

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.slug.trim()) {
      setStatusType('error')
      setStatusMessage('Title and slug are required.')
      return
    }

    setSaving(true)
    try {
      const payload: Partial<Story> = {
        title: form.title.trim(),
        slug: form.slug.trim(),
        excerpt: form.excerpt.trim(),
        content: form.content,
        author: form.author.trim() || undefined,
        category: form.category.trim() || undefined,
        cover_image: form.cover_image.trim() || undefined,
        featured: form.featured,
        published: form.published,
        published_at: form.published ? new Date().toISOString() : undefined,
      }

      if (editingId) {
        const updated = await storiesService.update(editingId, payload)
        setStories((current) => current.map((item) => (item.id === editingId ? updated : item)))
        setStatusType('success')
        setStatusMessage('Story updated.')
      } else {
        const created = await storiesService.create(payload)
        setStories((current) => [created, ...current])
        setStatusType('success')
        setStatusMessage('Story created.')
      }

      closeForm()
    } catch (err) {
      setStatusType('error')
      setStatusMessage(err instanceof Error ? err.message : 'Unable to save the story.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm('Delete this story? This cannot be undone.')
    if (!confirmed) return

    try {
      await storiesService.remove(id)
      setStories((current) => current.filter((item) => item.id !== id))
      setStatusType('success')
      setStatusMessage('Story deleted.')
    } catch {
      setStatusType('error')
      setStatusMessage('Unable to delete the story.')
    }
  }

  const togglePublished = async (story: Story) => {
    try {
      const updated = await storiesService.update(story.id, {
        published: !story.published,
        published_at: !story.published ? new Date().toISOString() : story.published_at,
      })
      setStories((current) => current.map((item) => (item.id === story.id ? updated : item)))
    } catch {
      setStatusType('error')
      setStatusMessage('Unable to update publish status.')
    }
  }

  return (
    <div className="admin-page-shell">
      <section className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Stories</h1>
          <p className="admin-page-subtitle">Create, edit, publish, and remove impact stories.</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={openCreateForm}>
          <Plus size={16} />
          New story
        </button>
      </section>

      {statusMessage ? (
        <div className={`admin-alert admin-alert--${statusType}`}>{statusMessage}</div>
      ) : null}

      <section className="admin-panel">
        {loading ? (
          <div className="admin-panel__empty">
            <p>Loading stories…</p>
          </div>
        ) : sortedStories.length === 0 ? (
          <div className="admin-panel__empty">
            <p>No stories have been created yet.</p>
          </div>
        ) : (
          <div className="donations-table-wrapper">
            <table className="donations-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Author</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {sortedStories.map((story) => (
                  <tr key={story.id}>
                    <td>
                      {story.title}
                      {story.featured ? (
                        <Star size={14} style={{ marginLeft: 6, verticalAlign: 'middle' }} fill="currentColor" />
                      ) : null}
                    </td>
                    <td>{story.category || '—'}</td>
                    <td>{story.author || '—'}</td>
                    <td>{formatDate(story.published_at || story.created_at)}</td>
                    <td>
                      <span
                        className={`admin-status-badge admin-status-badge--${story.published !== false ? 'verified' : 'pending'}`}
                      >
                        {story.published !== false ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="admin-table-actions">
                      <button type="button" className="admin-action-button" onClick={() => void togglePublished(story)}>
                        {story.published !== false ? 'Unpublish' : 'Publish'}
                      </button>
                      <button type="button" className="admin-action-button" onClick={() => openEditForm(story)}>
                        <Pencil size={16} />
                        Edit
                      </button>
                      <button
                        type="button"
                        className="admin-action-button admin-action-button--danger"
                        onClick={() => void handleDelete(story.id)}
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
        <div className="admin-modal-overlay" role="dialog" aria-modal="true">
          <div className="admin-modal">
            <div className="admin-modal__header">
              <h2>{editingId ? 'Edit story' : 'New story'}</h2>
              <button type="button" className="admin-modal__close" onClick={closeForm} aria-label="Close">
                <X size={18} />
              </button>
            </div>

            <div className="admin-modal__body">
              <label className="admin-form-field">
                <span>Title</span>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Story title"
                />
              </label>

              <label className="admin-form-field">
                <span>Slug</span>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => {
                    setSlugTouched(true)
                    setForm((current) => ({ ...current, slug: slugify(e.target.value) }))
                  }}
                  placeholder="story-slug"
                />
              </label>

              <div className="admin-form-row">
                <label className="admin-form-field">
                  <span>Author</span>
                  <input
                    type="text"
                    value={form.author}
                    onChange={(e) => setForm((current) => ({ ...current, author: e.target.value }))}
                  />
                </label>
                <label className="admin-form-field">
                  <span>Category</span>
                  <input
                    type="text"
                    value={form.category}
                    onChange={(e) => setForm((current) => ({ ...current, category: e.target.value }))}
                  />
                </label>
              </div>

              <label className="admin-form-field">
                <span>Cover image URL</span>
                <input
                  type="text"
                  value={form.cover_image}
                  onChange={(e) => setForm((current) => ({ ...current, cover_image: e.target.value }))}
                  placeholder="https://..."
                />
              </label>

              <label className="admin-form-field">
                <span>Excerpt</span>
                <textarea
                  rows={2}
                  value={form.excerpt}
                  onChange={(e) => setForm((current) => ({ ...current, excerpt: e.target.value }))}
                />
              </label>

              <label className="admin-form-field">
                <span>Content</span>
                <textarea
                  rows={8}
                  value={form.content}
                  onChange={(e) => setForm((current) => ({ ...current, content: e.target.value }))}
                />
              </label>

              <div className="admin-form-row">
                <label className="admin-form-checkbox">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) => setForm((current) => ({ ...current, featured: e.target.checked }))}
                  />
                  <span>Featured</span>
                </label>
                <label className="admin-form-checkbox">
                  <input
                    type="checkbox"
                    checked={form.published}
                    onChange={(e) => setForm((current) => ({ ...current, published: e.target.checked }))}
                  />
                  <span>Published</span>
                </label>
              </div>
            </div>

            <div className="admin-modal__footer">
              <button type="button" className="btn btn-secondary" onClick={closeForm}>
                Cancel
              </button>
              <button type="button" className="btn btn-primary" disabled={saving} onClick={() => void handleSubmit()}>
                {saving ? 'Saving…' : editingId ? 'Save changes' : 'Create story'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}