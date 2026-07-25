import { CheckCircle2, Trash2 } from 'lucide-react'
import { useState } from 'react'

interface DonationRecord {
  id: number
  name: string
  email: string
  amount: number
  date: string
  status: 'Pending' | 'Verified'
}

const initialDonations: DonationRecord[] = [
  { id: 1, name: 'Grace Mwale', email: 'grace.mwale@example.com', amount: 120.0, date: '2026-07-22', status: 'Pending' },
  { id: 2, name: 'John Banda', email: 'john.banda@example.com', amount: 250.0, date: '2026-07-18', status: 'Verified' },
  { id: 3, name: 'Mercy Phiri', email: 'mercy.phiri@example.com', amount: 80.0, date: '2026-07-15', status: 'Pending' },
]

export default function ManageDonations() {
  const [donations, setDonations] = useState<DonationRecord[]>(initialDonations)
  const [statusMessage, setStatusMessage] = useState('')
  const [statusType, setStatusType] = useState<'success' | 'error'>('success')

  const markVerified = (id: number) => {
    setDonations((current) =>
      current.map((item) => (item.id === id ? { ...item, status: 'Verified' } : item)),
    )
    setStatusType('success')
    setStatusMessage('Donation marked as verified.')
  }

  const deleteDonation = (id: number) => {
    const confirmed = window.confirm('Delete this donation record?')
    if (!confirmed) return

    setDonations((current) => current.filter((item) => item.id !== id))
    setStatusType('success')
    setStatusMessage('Donation record deleted.')
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
        {donations.length === 0 ? (
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
                  <tr key={donation.id}>
                    <td>{donation.name}</td>
                    <td>{donation.email}</td>
                    <td>${donation.amount.toFixed(2)}</td>
                    <td>{donation.date}</td>
                    <td>
                      <span className={`admin-status-badge admin-status-badge--${donation.status.toLowerCase()}`}>
                        {donation.status}
                      </span>
                    </td>
                    <td className="admin-table-actions">
                      {donation.status === 'Pending' ? (
                        <button type="button" className="admin-action-button" onClick={() => markVerified(donation.id)}>
                          <CheckCircle2 size={16} />
                          Verify
                        </button>
                      ) : null}
                      <button type="button" className="admin-action-button admin-action-button--danger" onClick={() => deleteDonation(donation.id)}>
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
