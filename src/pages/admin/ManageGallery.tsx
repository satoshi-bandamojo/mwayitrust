import { Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { addGalleryImage, deleteGalleryImage, getGallery } from '../../services/admin.ts'
import type { GalleryImage } from '../../types/index.ts'

export default function ManageGallery() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [message, setMessage] = useState('')

  const refresh = async () => {
    setLoading(true)
    setImages(await getGallery())
    setLoading(false)
  }

  useEffect(() => {
    void refresh()
  }, [])

  const handleAdd = async () => {
    if (!title.trim() || !imageUrl.trim()) {
      setMessage('Title and image URL are required.')
      return
    }
    try {
      const created = await addGalleryImage({ title, image_url: imageUrl })
      setImages((current) => [created, ...current])
      setTitle('')
      setImageUrl('')
      setMessage('')
    } catch {
      setMessage('Unable to add image.')
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this image?')) return
    try {
      await deleteGalleryImage(id)
      setImages((current) => current.filter((img) => img.id !== id))
    } catch {
      setMessage('Unable to delete image.')
    }
  }

  return (
    <div className="admin-page-shell">
      <section className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Gallery</h1>
          <p className="admin-page-subtitle">Add and remove gallery images.</p>
        </div>
      </section>

      {message ? <div className="admin-alert admin-alert--error">{message}</div> : null}

      <section className="admin-panel" style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input placeholder="Image URL" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
        <button type="button" className="btn btn-primary" onClick={() => void handleAdd()}>
          Add
        </button>
      </section>

      <section className="admin-panel">
        {loading ? (
          <p>Loading…</p>
        ) : images.length === 0 ? (
          <p>No images yet.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
            {images.map((img) => (
              <div key={img.id} style={{ position: 'relative' }}>
                <img src={img.thumbnail_url || img.image_url} alt={img.title} style={{ width: '100%', borderRadius: 8 }} />
                <p style={{ fontSize: 13, marginTop: 4 }}>{img.title}</p>
                <button
                  type="button"
                  className="admin-action-button admin-action-button--danger"
                  onClick={() => void handleDelete(img.id)}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}