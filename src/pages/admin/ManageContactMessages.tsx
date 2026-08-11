import { RefreshCcw, Mail, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { deleteContactMessage, getContactMessages, type ContactMessageRecord } from '../../services/admin.ts'

function formatMessageDate(value: string) {
  return new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

export default function ManageContactMessages() {
  const [messages, setMessages] = useState<ContactMessageRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    void loadMessages()
  }, [])

  const loadMessages = async () => {
    setLoading(true)
    setError('')

    try {
      const result = await getContactMessages()
      setMessages(result)
    } catch {
      setError('Unable to refresh inbox at this time.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number | string) => {
    const confirmed = window.confirm('Delete this message? This cannot be undone.')
    if (!confirmed) return

    try {
      await deleteContactMessage(id)
      setMessages((current) => current.filter((message) => message.id !== id))
    } catch {
      setError('Unable to delete this message.')
    }
  }

  return (
    <div className="admin-page-shell">
      <section className="admin-page-header">
        <div>
          <p className="admin-page-eyebrow">Community inbox</p>
          <h1 className="admin-page-title">Messages</h1>
          <p className="admin-page-subtitle">Review messages sent from the contact form.</p>
        </div>
        <button className="btn btn-secondary admin-page-refresh" type="button" onClick={loadMessages} disabled={loading}>
          <RefreshCcw size={16} />
          {loading ? 'Refreshing...' : 'Refresh inbox'}
        </button>
      </section>

      <section className="admin-panel">
        <div className="admin-panel__header">
          <div>
            <h2 className="admin-panel__title">Inbox</h2>
            <p className="admin-panel__subtitle">{messages.length} message{messages.length === 1 ? '' : 's'} total</p>
          </div>
        </div>

        {error ? <div className="admin-panel__error">{error}</div> : null}

        {loading ? (
          <div className="admin-panel__empty">
            <Mail size={24} />
            <p>Refreshing messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="admin-panel__empty">
            <Mail size={24} />
            <p>No messages yet.</p>
          </div>
        ) : (
          <div className="message-list">
            {messages.map((message) => (
              <article key={String(message.id)} className="message-card">
                <div className="message-card__header">
                  <div>
                    <h3 className="message-card__name">{message.name}</h3>
                    <p className="message-card__email">{message.email}</p>
                  </div>
                  <div className="message-card__actions">
                    <span className="message-card__date">{formatMessageDate(message.created_at)}</span>
                    <button type="button" className="message-card__delete" onClick={() => void handleDelete(message.id)}>
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                </div>
                <p className="message-card__body">{message.message}</p>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
