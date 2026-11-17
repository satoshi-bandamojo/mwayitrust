type LoadingStateProps = {
  label?: string
  variant?: 'page' | 'cards' | 'detail'
}

function SkeletonCard() {
  return (
    <div className="loading-state__card" aria-hidden="true">
      <div className="loading-state__block loading-state__card-image" />
      <div className="loading-state__card-content">
        <div className="loading-state__block loading-state__line loading-state__line--short" />
        <div className="loading-state__block loading-state__line loading-state__line--title" />
        <div className="loading-state__block loading-state__line" />
        <div className="loading-state__block loading-state__line loading-state__line--medium" />
      </div>
    </div>
  )
}

function SkeletonCards() {
  return (
    <div className="loading-state__grid" aria-hidden="true">
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </div>
  )
}

export default function LoadingState({ label = 'Loading', variant = 'page' }: LoadingStateProps) {
  return (
    <div className={`loading-state loading-state--${variant}`} role="status" aria-live="polite">
      <span className="loading-state__sr-only">{label}</span>
      {variant === 'cards' ? (
        <SkeletonCards />
      ) : variant === 'detail' ? (
        <div className="loading-state__detail" aria-hidden="true">
          <div className="loading-state__block loading-state__detail-image" />
          <div className="loading-state__detail-content">
            <div className="loading-state__block loading-state__line loading-state__line--short" />
            <div className="loading-state__block loading-state__line loading-state__line--heading" />
            <div className="loading-state__block loading-state__line" />
            <div className="loading-state__block loading-state__line" />
            <div className="loading-state__block loading-state__line loading-state__line--medium" />
            <div className="loading-state__block loading-state__line" />
            <div className="loading-state__block loading-state__line loading-state__line--short" />
          </div>
        </div>
      ) : (
        <div className="loading-state__page" aria-hidden="true">
          <div className="loading-state__intro">
            <div className="loading-state__block loading-state__line loading-state__line--short" />
            <div className="loading-state__block loading-state__line loading-state__line--heading" />
            <div className="loading-state__block loading-state__line loading-state__line--intro" />
          </div>
          <SkeletonCards />
        </div>
      )}
    </div>
  )
}
