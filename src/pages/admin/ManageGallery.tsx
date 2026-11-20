import { Plus, Trash2, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import AdminImageUpload from '../../components/admin/AdminImageUpload.tsx'
import { addGalleryImage, deleteGalleryImage, getGallery } from '../../services/admin.ts'
import { deleteContentImage, uploadContentImage } from '../../services/contentImages.ts'
import type { GalleryImage } from '../../types/index.ts'

export default function ManageGallery() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [message, setMessage] = useState('')
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)

  const refresh = async () => {
    setLoading(true)
    setImages(await getGallery())
    setLoading(false)
  }

  useEffect(() => {
    void refresh()
  }, [])

  const openForm = () => {
    setTitle('')
    setImageFile(null)
    setMessage('')
    setShowForm(true)
  }

  const closeForm = () => {
    if (saving) return
    setShowForm(false)
    setTitle('')
    setImageFile(null)
    setMessage('')
  }

  const handleAdd = async () => {
    if (!title.trim() || !imageFile) {
      setMessage('Title and an image are required.')
      return
    }

    setSaving(true)
    let uploadedImageUrl = ''
    try {
      uploadedImageUrl = await uploadContentImage('gallery', imageFile)
      const created = await addGalleryImage({ title: title.trim(), image_url: uploadedImageUrl })
      setImages((current) => [created, ...current])
      setTitle('')
      setImageFile(null)
      setMessage('')
      setShowForm(false)
    } catch (err) {
      if (uploadedImageUrl) {
        try {
          await deleteContentImage('gallery', uploadedImageUrl)
        } catch (cleanupError) {
          setMessage(
            `Unable to add gallery image, and its upload could not be removed: ${
              cleanupError instanceof Error ? cleanupError.message : 'Storage cleanup failed.'
            }`,
          )
          return
        }
      }
      setMessage(err instanceof Error ? err.message : 'Unable to add gallery image. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this image?')) return
    const image = images.find((item) => item.id === id)
    try {
      await deleteGalleryImage(id)
      setImages((current) => current.filter((img) => img.id !== id))
      if (image?.image_url) {
        try {
          await deleteContentImage('gallery', image.image_url)
          setMessage('')
        } catch (cleanupError) {
          setMessage(
            `Gallery entry deleted, but its image could not be removed: ${
              cleanupError instanceof Error ? cleanupError.message : 'Storage cleanup failed.'
            }`,
          )
        }
      }
    } catch {
      setMessage('Unable to delete image.')
    }
  }

  return (
    <div className="admin-page-shell admin-content-page">
      <section className="admin-page-header">
        <div>
          <p className="admin-content-page__eyebrow">Content management</p>
          <h1 className="admin-page-title">Gallery</h1>
          <p className="admin-page-subtitle">Upload and manage moments from our community.</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={openForm}>
          <Plus size={16} />
          Add to gallery
        </button>
      </section>

      {message && !showForm ? <div className="admin-alert admin-alert--error" role="alert">{message}</div> : null}

      <section className="admin-panel">
        {loading ? (
          <p>Loading…</p>
        ) : images.length === 0 ? (
          <p>No images yet.</p>
        ) : (
          <div className="admin-gallery__grid">
            {images.map((img) => (
              <div key={img.id} className="admin-gallery__card">
                <img src={img.thumbnail_url || img.image_url} alt={img.title} />
                <p>{img.title}</p>
                <button
                  type="button"
                  className="admin-action-button admin-action-button--danger"
                  onClick={() => void handleDelete(img.id)}
                  aria-label={`Delete ${img.title}`}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {showForm ? (
        <div
          className="admin-content-modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="gallery-form-title"
        >
          <div className="admin-content-modal">
            <div className="admin-modal__header">
              <h2 id="gallery-form-title">Add to gallery</h2>
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
              <section className="admin-gallery__form">
                <label className="admin-gallery__field">
                  <span>Image title *</span>
                  <input placeholder="Image title" value={title} onChange={(e) => setTitle(e.target.value)} />
                </label>
                <AdminImageUpload
                  label="Gallery image"
                  file={imageFile}
                  onChange={setImageFile}
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
                {saving ? 'Uploading…' : 'Add to gallery'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}