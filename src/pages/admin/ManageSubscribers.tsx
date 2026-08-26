import { Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { deleteSubscriber, getSubscribers } from '../../services/admin.ts'
import type { Subscriber } from '../../types/index.ts'

export default function ManageSubscribers() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  const refresh = async () => {
    setLoading(true)
    setSubscribers(await getSubscribers())
    setLoading(false)
  }

  useEffect(() => {
    void refresh()
  }, [])

  const handleDelete = async (id: string) => {
    if (!window.confirm('Remove this subscriber?')) return
    try {
      await deleteSubscriber(id)
      setSubscribers((current) => current.filter((s) => s.id !== id))
    } catch {
      setMessage('Unable to remove subscriber.')
    }
  }

  return (
    <div className="admin-page-shell">
      <section className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Subscribers</h1>
          <p className="admin-page-subtitle">View and remove newsletter subscribers.</p>
        </div>
      </section>

      {message ? <div className="admin-alert admin-alert--error">{message}</div> : null}

      <section className="admin-panel">
        {loading ? (
          <p>Loading…</p>
        ) : subscribers.length === 0 ? (
          <p>No subscribers yet.</p>
        ) : (
          <div className="donations-table-wrapper">
            <table className="donations-table">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Subscribed</th>
                  <th>Source</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {subscribers.map((s) => (
                  <tr key={s.id}>
                    <td>{s.email}</td>
                    <td>{s.subscribed_at ? new Date(s.subscribed_at).toLocaleDateString('en-GB') : '—'}</td>
                    <td>{s.source || '—'}</td>
                    <td className="admin-table-actions">
                      <button
                        type="button"
                        className="admin-action-button admin-action-button--danger"
                        onClick={() => void handleDelete(s.id)}
                      >
                        <Trash2 size={16} />
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}