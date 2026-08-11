import { CalendarDays, ChevronRight, Image, MessageSquare, Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'
import { getContactMessages, getDashboardSummary } from '../../services/admin.ts'

export default function Dashboard() {
  const [summary, setSummary] = useState({ stories: 0, events: 0, gallery: 0, messages: 0, subscribers: 0 })
  const [recentMessages, setRecentMessages] = useState<Array<{ name: string; email: string; preview: string; date: string }>>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true)
        const [dashboardSummary, messages] = await Promise.all([getDashboardSummary(), getContactMessages()])
        setSummary(dashboardSummary)
        setRecentMessages(
          messages.slice(0, 3).map((message) => ({
            name: message.name,
            email: message.email,
            preview: message.message.length > 80 ? `${message.message.slice(0, 77)}...` : message.message,
            date: new Date(message.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          })),
        )
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : 'Unable to load dashboard data.')
      } finally {
        setLoading(false)
      }
    }

    void loadDashboard()
  }, [])

  const stats = [
    { label: 'Total stories', value: String(summary.stories), icon: Sparkles, color: '#c2410c' },
    { label: 'Upcoming events', value: String(summary.events), icon: CalendarDays, color: '#2563eb' },
    { label: 'Gallery items', value: String(summary.gallery), icon: Image, color: '#047857' },
    { label: 'New messages', value: String(summary.messages), icon: MessageSquare, color: '#7c3aed' },
  ]

  return (
    <div className="admin-dashboard-shell">
      <section className="admin-dashboard-welcome">
        <div>
          <p className="section-kicker">Administration</p>
          <h1>Dashboard overview</h1>
          <p>
            Review the latest program activity, track engagement across stories and events, and stay on top of incoming community messages.
          </p>
        </div>
        <a className="btn btn-primary admin-dashboard-button" href="/admin/events">
          Manage events
          <ChevronRight size={16} />
        </a>
      </section>

      {error ? <div className="admin-panel__error">{error}</div> : null}

      <section className="admin-dashboard-stats">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="admin-dashboard-card">
              <div className="admin-dashboard-card__icon" style={{ backgroundColor: `${stat.color}20`, color: stat.color }}>
                <Icon size={18} />
              </div>
              <div>
                <p className="admin-dashboard-card__value">{loading ? '...' : stat.value}</p>
                <p className="admin-dashboard-card__label">{stat.label}</p>
              </div>
            </div>
          )
        })}
      </section>

      <section className="admin-dashboard-panels">
        <div className="admin-dashboard-panel admin-dashboard-panel--wide">
          <div className="admin-dashboard-panel__header">
            <div>
              <h2>Recent activity</h2>
              <p>Keep track of the latest records in the system.</p>
            </div>
            <a href="/admin/events">View all events</a>
          </div>
          <div className="admin-dashboard-list">
            {loading ? (
              <div className="admin-panel__empty"><p>Loading dashboard data…</p></div>
            ) : recentMessages.length === 0 ? (
              <div className="admin-panel__empty"><p>No recent messages yet.</p></div>
            ) : (
              recentMessages.map((message) => (
                <div key={`${message.email}-${message.date}`} className="admin-dashboard-list-item admin-dashboard-list-item--compact">
                  <div>
                    <p className="admin-dashboard-list-item__title">{message.name}</p>
                    <p className="admin-dashboard-list-item__meta">{message.email}</p>
                  </div>
                  <span>{message.date}</span>
                  <p className="admin-dashboard-list-item__preview">{message.preview}</p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="admin-dashboard-panel">
          <div className="admin-dashboard-panel__header">
            <div>
              <h2>New messages</h2>
              <p>Recent inquiries from supporters and volunteers.</p>
            </div>
            <a href="/admin/contacts">View messages</a>
          </div>
          <div className="admin-dashboard-list">
            {loading ? (
              <div className="admin-panel__empty"><p>Loading messages…</p></div>
            ) : recentMessages.length === 0 ? (
              <div className="admin-panel__empty"><p>No messages available.</p></div>
            ) : (
              recentMessages.map((message) => (
                <div key={`${message.email}-${message.date}-preview`} className="admin-dashboard-list-item admin-dashboard-list-item--compact">
                  <div>
                    <p className="admin-dashboard-list-item__title">{message.name}</p>
                    <p className="admin-dashboard-list-item__meta">{message.email}</p>
                  </div>
                  <span>{message.date}</span>
                  <p className="admin-dashboard-list-item__preview">{message.preview}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
