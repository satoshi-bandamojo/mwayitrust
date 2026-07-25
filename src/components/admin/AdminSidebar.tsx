export default function AdminSidebar() {
  return (
    <aside className="admin-sidebar">
      <h2>Admin</h2>
      <ul>
        <li><a href="/admin">Dashboard</a></li>
        <li><a href="/admin/stories">Stories</a></li>
        <li><a href="/admin/events">Events</a></li>
        <li><a href="/admin/gallery">Gallery</a></li>
      </ul>
    </aside>
  )
}
