export default function AdminSidebar() {
  return (
    <nav className="admin-sidebar" aria-label="Admin navigation">
      <h2>Admin</h2>
      <ul>
        <li><a href="/admin">Dashboard</a></li>
        <li><a href="/admin/stories">Stories</a></li>
        <li><a href="/admin/events">Events</a></li>
        <li><a href="/admin/gallery">Gallery</a></li>
        <li><a href="/admin/donations">Donations</a></li>
        <li><a href="/admin/subscribers">Subscribers</a></li>
        <li><a href="/admin/contacts">Messages</a></li>
      </ul>
    </nav>
  )
}
