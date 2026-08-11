import { CheckCircle2, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { deleteDonation, getDonations, updateDonationStatus, type DonationRecord } from '../../services/admin.ts'

export default function ManageDonations() {
  const [donations, setDonations] = useState<DonationRecord[]>([])
  const [statusMessage, setStatusMessage] = useState('')
  const [statusType, setStatusType] = useState<'success' | 'error'>('success')
  const [loading, setLoading] = useState(true)

  const refreshDonations = async () => {
    setLoading(true)
    try {
      const result = await getDonations()
      setDonations(result)
    } catch {
      setStatusType('error')
      setStatusMessage('Unable to load donations from the database.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void refreshDonations()
  }, [])

  const markVerified = async (id: number | string) => {
    try {
      await updateDonationStatus(id, 'Verified')
      setDonations((current) => current.map((item) => (item.id === id ? { ...item, status: 'Verified' } : item)))
      setStatusType('success')
      setStatusMessage('Donation marked as verified.')
    } catch {
      setStatusType('error')
      setStatusMessage('Unable to update donation status.')
    }
  }

  const handleDelete = async (id: number | string) => {
    const confirmed = window.confirm('Delete this donation record?')
    if (!confirmed) return

    try {
      await deleteDonation(id)
      setDonations((current) => current.filter((item) => item.id !== id))
      setStatusType('success')
      setStatusMessage('Donation record deleted.')
    } catch {
      setStatusType('error')
      setStatusMessage('Unable to delete donation record.')
    }
  }

  return (
    <div className="admin-page-shell">
      <section className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Donations</h1>
          <p className="admin-page-subtitle">View, verify, and remove donation records.</p>
        </div>
      </section>

      {statusMessage ? (
        <div className={`admin-alert admin-alert--${statusType}`}>{statusMessage}</div>
      ) : null}

      <section className="admin-panel">
        {loading ? (
          <div className="admin-panel__empty">
            <p>Loading donations…</p>
          </div>
        ) : donations.length === 0 ? (
          <div className="admin-panel__empty">
            <p>No donations have been recorded yet.</p>
          </div>
        ) : (
          <div className="donations-table-wrapper">
            <table className="donations-table">
              <thead>
                <tr>
                  <th>Donor</th>
                  <th>Email</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {donations.map((donation) => (
                  <tr key={String(donation.id)}>
                    <td>{donation.name}</td>
                    <td>{donation.email}</td>
                    <td>MK {donation.amount.toLocaleString()}</td>
                    <td>{new Date(donation.date).toLocaleDateString('en-GB')}</td>
                    <td>
                      <span className={`admin-status-badge admin-status-badge--${donation.status.toLowerCase()}`}>
                        {donation.status}
                      </span>
                    </td>
                    <td className="admin-table-actions">
                      {donation.status === 'Pending' ? (
                        <button type="button" className="admin-action-button" onClick={() => void markVerified(donation.id)}>
                          <CheckCircle2 size={16} />
                          Verify
                        </button>
                      ) : null}
                      <button type="button" className="admin-action-button admin-action-button--danger" onClick={() => void handleDelete(donation.id)}>
                        <Trash2 size={16} />
                        Delete
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
