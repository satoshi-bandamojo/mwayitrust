import { ArrowRight, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { galleryService } from '../services/gallery.ts'
import type { GalleryImage } from '../types/index.ts'

const initialGalleryItems: GalleryImage[] = []

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
          setError((err as Error)?.message || 'Unable to load gallery items.')
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
    () => ['All', ...Array.from(new Set(galleryItems.map((item) => item.category || 'Community'))).sort()],
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
      <section className="gallery-hero welcome-hero">
        <div className="gallery-hero__content welcome-hero__content">
          <p className="section-kicker">Visual moments</p>
          <h1>Life at Mwayi Trust</h1>
          <p>
            Moments of vocational achievement, classroom curiosity, and community agriculture in Chileka, Blantyre.
          </p>
          <div className="hero-actions">
            <a className="btn btn-secondary" href="/contact">
              <ArrowRight size={18} />
              Visit Our Centre
            </a>
          </div>
        </div>
      </section>

      {/* Touch-Friendly Horizontal Category Scroll */}
      <div className="gallery-filters-container">
        <div className="gallery-filters" aria-label="Gallery category filters">
          {categories.map((category) => {
            const isActive = activeCategory === category || (!activeCategory && category === 'All')
            return (
              <button
                key={category}
                type="button"
                className={`filter-chip ${isActive ? 'filter-chip--active' : ''}`}
                onClick={() => {
                  setActiveCategory(category === 'All' ? null : category)
                  setDisplayCount(6)
                }}
              >
                {category}
              </button>
            )
          })}
        </div>
      </div>

      <div id="gallery-grid" className="gallery-grid">
        {displayedItems.map((item) => (
          <article
            key={item.id}
            className="gallery-card"
            onClick={() => openLightbox(item)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') openLightbox(item)
            }}
          >
            <div className="gallery-card__image-wrap">
              <img
                src={thumbnailFor(item)}
                alt={item.title}
                loading="lazy"
                decoding="async"
              />
              <div className="gallery-card__overlay">
                <span className="gallery-card__icon">Tap to view</span>
              </div>
            </div>
            <div className="gallery-card__content">
              <span className="gallery-card__category">{item.category || 'Community'}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              {displayDate(item) && <span className="gallery-card__date">{displayDate(item)}</span>}
            </div>
          </article>
        ))}
      </div>

      {loading ? <p className="text-center py-8 text-slate-500">Loading gallery photos…</p> : null}
      {error ? <p className="error-message text-center">{error}</p> : null}

      {hasMore ? (
        <div className="gallery-pagination">
          <button
            type="button"
            className="gallery-load-more min-h-[48px] px-6 text-sm font-bold"
            onClick={() => setDisplayCount((count) => count + 6)}
          >
            Load More Photos ({filteredItems.length - displayCount} remaining)
          </button>
        </div>
      ) : null}

      {/* Mobile-Friendly Lightbox Modal */}
      {selectedItem ? (
        <div className="lightbox" role="dialog" aria-modal="true" onClick={closeLightbox}>
          <div className="lightbox__container" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              className="lightbox__close"
              onClick={closeLightbox}
              aria-label="Close photo preview"
            >
              <X size={22} />
            </button>

            <div className="lightbox__media">
              <img src={imageFor(selectedItem)} alt={selectedItem.title} />
              <button
                type="button"
                className="lightbox__nav lightbox__nav--prev"
                onClick={showPrevious}
                aria-label="Previous photo"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                type="button"
                className="lightbox__nav lightbox__nav--next"
                onClick={showNext}
                aria-label="Next photo"
              >
                <ChevronRight size={24} />
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
                {selectedItem.author ? <span>Taken by {selectedItem.author}</span> : null}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}