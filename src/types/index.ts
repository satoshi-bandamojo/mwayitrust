export type Story = {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  author?: string
  category?: string
  cover_image?: string
  featured_image?: string
  image_url?: string
  published?: boolean
  published_at?: string
  featured?: boolean
  created_at?: string
}

export type EventItem = {
  id: string
  title: string
  slug: string
  description: string
  category?: string
  event_date: string
  start_time?: string
  end_time?: string
  location: string
  image?: string
  image_url?: string
  cover_image?: string
  featured?: boolean
  full_description?: string
}

export type GalleryImage = {
  id: string
  title: string
  image_url: string
  thumbnail_url?: string
  description?: string
  category?: string
  author?: string
  created_at?: string
}

export type Donation = {
  id: string
  full_name: string
  email: string
  amount: number
  currency: string
  status: string
  created_at?: string
}

export type Subscriber = {
  id: string
  email: string
  subscribed: boolean
  subscribed_at?: string
  source?: string
}

export type ContactMessage = {
  id: string
  name: string
  email: string
  subject: string
  message: string
  status?: string
  created_at?: string
}