import { CalendarDays, ChevronRight, Image, MessageSquare, Sparkles } from 'lucide-react'

const stats = [
  { label: 'Total stories', value: '24', icon: Sparkles, color: '#c2410c' },
  { label: 'Upcoming events', value: '5', icon: CalendarDays, color: '#2563eb' },
  { label: 'Gallery items', value: '48', icon: Image, color: '#047857' },
  { label: 'New messages', value: '12', icon: MessageSquare, color: '#7c3aed' },
]

const recentEvents = [
  { title: 'Mentorship Program Launch', date: '2026-06-20', status: 'Upcoming' },
  { title: 'Digital Skills Bootcamp', date: '2026-06-15', status: 'Upcoming' },
  { title: 'Community Reading Day', date: '2026-07-03', status: 'Planning' },
  { title: 'Career Panel Discussion', date: '2026-06-25', status: 'Confirmed' },
]

const recentMessages = [
  { name: 'Grace Mwale', email: 'grace@example.com', preview: 'I would like to volunteer with the after-school programme...', date: '2h ago' },
  { name: 'John Banda', email: 'john.banda@example.com', preview: 'Can you share more details about the scholarship fund?', date: '5h ago' },
  { name: 'Mercy Phiri', email: 'mercy.phiri@example.com', preview: 'We are interested in donating school supplies...', date: '1d ago' },
]

export default function Dashboard() {
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

      <section className="admin-dashboard-stats">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="admin-dashboard-card">
              <div className="admin-dashboard-card__icon" style={{ backgroundColor: `${stat.color}20`, color: stat.color }}>
                <Icon size={18} />
              </div>
              <div>
                <p className="admin-dashboard-card__value">{stat.value}</p>
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
              <h2>Recent event activity</h2>
              <p>Keep track of the next planned programs and the current planning status.</p>
            </div>
            <a href="/admin/events">View all events</a>
          </div>
          <div className="admin-dashboard-list">
            {recentEvents.map((event) => (
              <div key={event.title} className="admin-dashboard-list-item">
                <div>
                  <p className="admin-dashboard-list-item__title">{event.title}</p>
                  <p className="admin-dashboard-list-item__meta">{event.date}</p>
                </div>
                <span className="admin-dashboard-badge">{event.status}</span>
              </div>
            ))}
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
            {recentMessages.map((message) => (
              <div key={message.email} className="admin-dashboard-list-item admin-dashboard-list-item--compact">
                <div>
                  <p className="admin-dashboard-list-item__title">{message.name}</p>
                  <p className="admin-dashboard-list-item__meta">{message.email}</p>
                </div>
                <span>{message.date}</span>
                <p className="admin-dashboard-list-item__preview">{message.preview}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
