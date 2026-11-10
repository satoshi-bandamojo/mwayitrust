import { useEffect, useState } from 'react'

interface ProgramImageSlidesProps {
  images: [string, string]
  title: string
}

export default function ProgramImageSlides({ images, title }: ProgramImageSlidesProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % images.length)
    }, 5000)

    return () => window.clearInterval(intervalId)
  }, [images])

  return (
    <div className="program-image-slides" role="group" aria-label={`${title} photos`}>
      <div
        className="program-image-track"
        style={{ transform: `translateX(-${activeIndex * 50}%)` }}
      >
        {images.map((image, index) => (
          <img
            key={image}
            className="program-image-slide"
            src={image}
            alt={`${title} ${index + 1} of ${images.length}`}
            loading="lazy"
            decoding="async"
            aria-hidden={activeIndex !== index}
          />
        ))}
      </div>
      <div className="program-image-indicators" aria-hidden="true">
        {images.map((image, index) => (
          <span
            key={image}
            className={`program-image-indicator ${activeIndex === index ? 'program-image-indicator--active' : ''}`}
          />
        ))}
      </div>
    </div>
  )
}
