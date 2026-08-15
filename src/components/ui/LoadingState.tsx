type LoadingStateProps = {
  label?: string
}

export default function LoadingState({ label = 'Loading' }: LoadingStateProps) {
  return (
    <div className="loading-state" aria-live="polite" aria-label={label}>
      <div className="loading-state__pulse loading-state__pulse--large" />
      <div className="loading-state__pulse loading-state__pulse--medium" />
      <div className="loading-state__pulse loading-state__pulse--small" />
      <span>{label}</span>
    </div>
  )
}
