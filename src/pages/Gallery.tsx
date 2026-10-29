import { ChevronLeft, ChevronRight, X } from 'lucide-react'
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
    return galleryItems.filter((item) => (item.category || 'Community') === activeCategory)
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
      <section className="gallery-intro" aria-labelledby="gallery-title">
        <p className="section-kicker">A glimpse of life here</p>
        <h1 id="gallery-title">Moments from our community.</h1>
        <p>
          A few moments of learning, making, and growing together in Chileka.
        </p>
      </section>

      {!loading && !error && galleryItems.length > 0 ? (
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
      ) : null}

      <section id="gallery-grid" aria-label="Gallery photos">
        {loading ? (
          <p className="gallery-message" role="status">Loading photos…</p>
        ) : error ? (
          <p className="error-message" role="alert">{error}</p>
        ) : displayedItems.length ? (
          <div className="gallery-grid">
            {displayedItems.map((item) => (
              <article
                key={item.id}
                className="gallery-card"
                onClick={() => openLightbox(item)}
                role="button"
                aria-label={`View photo: ${item.title}`}
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    openLightbox(item)
                  }
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
                    <span className="gallery-card__icon">View photo</span>
                  </div>
                </div>
                <div className="gallery-card__content">
                  <span className="gallery-card__category">{item.category || 'Community'}</span>
                  <h3>{item.title}</h3>
                  {item.description ? <p>{item.description}</p> : null}
                  {displayDate(item) && <span className="gallery-card__date">{displayDate(item)}</span>}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="gallery-empty-state">
            <h2>More moments coming soon</h2>
            <p>We’re gathering photos from our programs and community. Check back soon.</p>
          </div>
        )}
      </section>

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