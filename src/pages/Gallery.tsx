import { ArrowRight, Images, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { galleryService } from '../services/gallery.ts'
import type { GalleryImage } from '../types/index.ts'

const initialGalleryItems: GalleryImage[] = []

const formatDate = (value: string) => {
  if (!value) return ''
  return new Date(`${value}T00:00:00`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export default function Gallery() {
  const [galleryItems, setGalleryItems] = useState<GalleryImage[]>(initialGalleryItems)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [displayCount, setDisplayCount] = useState(6)
  const [selectedItem, setSelectedItem] = useState<GalleryImage | null>(null)

  useEffect(() => {
    let active = true

    async function loadGallery() {
      setLoading(true)
      try {
        const items = await galleryService.getAll()
        if (active) {
          setGalleryItems(items)
        }
      } catch (err) {
        if (active) {
          setError((err as Error)?.message || 'Unable to load gallery items from Supabase.')
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadGallery()
    return () => {
      active = false
    }
  }, [])

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(galleryItems.map((item) => item.category || 'Uncategorized'))).sort()],
    [galleryItems],
  )

  const filteredItems = useMemo(() => {
    if (!activeCategory || activeCategory === 'All') {
      return galleryItems
    }
    return galleryItems.filter((item) => item.category === activeCategory)
  }, [activeCategory, galleryItems])

  const thumbnailFor = (item: GalleryImage) => item.thumbnail_url || item.image_url || ''
  const imageFor = (item: GalleryImage) => item.image_url || item.thumbnail_url || ''
  const displayDate = (item: GalleryImage) => (item.created_at ? formatDate(item.created_at) : '')

  const displayedItems = filteredItems.slice(0, displayCount)
  const hasMore = displayCount < filteredItems.length

  useEffect(() => {
    if (selectedItem) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [selectedItem])

  const openLightbox = (item: GalleryImage) => setSelectedItem(item)
  const closeLightbox = () => setSelectedItem(null)
  const showPrevious = () => {
    if (!selectedItem) return
    const index = filteredItems.findIndex((item) => item.id === selectedItem.id)
    const previousIndex = index <= 0 ? filteredItems.length - 1 : index - 1
    setSelectedItem(filteredItems[previousIndex] ?? null)
  }

  const showNext = () => {
    if (!selectedItem) return
    const index = filteredItems.findIndex((item) => item.id === selectedItem.id)
    const nextIndex = index >= filteredItems.length - 1 ? 0 : index + 1
    setSelectedItem(filteredItems[nextIndex] ?? null)
  }

  return (
    <div className="gallery-shell">
      <section className="gallery-hero">
        <div className="gallery-hero__content">
          <p className="section-kicker">Our gallery</p>
          <h1>Moments of learning, care, and community.</h1>
          <p>
            Browse visual stories from our programs, events, and the people who make this work possible.
          </p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="#gallery-grid">
              <Images size={18} />
              View gallery
            </a>
            <a className="btn btn-secondary" href="/contact">
              <ArrowRight size={18} />
              Share your support
            </a>
          </div>
        </div>
      </section>

      <div className="gallery-filters" aria-label="Gallery filters">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            className={`filter-chip${activeCategory === category || (!activeCategory && category === 'All') ? ' filter-chip--active' : ''}`}
            onClick={() => {
              setActiveCategory(category === 'All' ? null : category)
              setDisplayCount(6)
            }}
          >
            {category}
          </button>
        ))}
      </div>

      <div id="gallery-grid" className="gallery-grid">
        {displayedItems.map((item) => (
          <article key={item.id} className="gallery-card" onClick={() => openLightbox(item)}>
            <div className="gallery-card__image-wrap">
              <img src={thumbnailFor(item)} alt={item.title} loading="lazy" />
              <div className="gallery-card__overlay">
                <span className="gallery-card__icon">🔎</span>
              </div>
            </div>
            <div className="gallery-card__content">
              <span className="gallery-card__category">{item.category}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <span className="gallery-card__date">{displayDate(item)}</span>
            </div>
          </article>
        ))}
      </div>

      {loading ? <p>Loading gallery…</p> : null}
      {error ? <p className="error-message">{error}</p> : null}

      {hasMore ? (
        <div className="gallery-pagination">
          <button type="button" className="gallery-load-more" onClick={() => setDisplayCount((count) => count + 6)}>
            Load more
          </button>
        </div>
      ) : null}

      {selectedItem ? (
        <div className="lightbox" role="dialog" aria-modal="true" onClick={closeLightbox}>
          <div className="lightbox__container" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="lightbox__close" onClick={closeLightbox} aria-label="Close gallery preview">
              <X size={20} />
            </button>

            <div className="lightbox__media">
              <img src={imageFor(selectedItem)} alt={selectedItem.title} />
              <button type="button" className="lightbox__nav lightbox__nav--prev" onClick={showPrevious} aria-label="Previous image">
                ←
              </button>
              <button type="button" className="lightbox__nav lightbox__nav--next" onClick={showNext} aria-label="Next image">
                →
              </button>
              <div className="lightbox__counter">
                {filteredItems.findIndex((item) => item.id === selectedItem.id) + 1} / {filteredItems.length}
              </div>
            </div>

            <div className="lightbox__info">
              <span className="gallery-card__category">{selectedItem.category}</span>
              <h2>{selectedItem.title}</h2>
              <p>{selectedItem.description}</p>
              <div className="lightbox__meta">
                <span>{displayDate(selectedItem)}</span>
                {selectedItem.author ? <span>{selectedItem.author}</span> : null}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}