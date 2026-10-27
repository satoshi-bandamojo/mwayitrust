import { createClient } from '@supabase/supabase-js'
import graduationImg from '../assets/graduation.jpg'
import graduation1Img from '../assets/graduation1.webp'
import carpentryImg from '../assets/carpentry.webp'
import cookeryImg from '../assets/cookery2.webp'
import houseKeepingImg from '../assets/house-keeping.webp'
import homeworkImg from '../assets/program-homework.webp'
import homework1Img from '../assets/program-homework1.webp'
import vocationalImg from '../assets/program-vocational.webp'
import gardenImg from '../assets/program-community-garden2.webp'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const hasSupabaseConfig = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith('http') &&
    !supabaseUrl.includes('your-project')
)

// Initial mock data used when Supabase credentials are not provided
const INITIAL_STORIES = [
  {
    id: 'story-1',
    title: 'Empowering Young Women Through Tailoring & Vocational Skills',
    slug: 'empowering-young-women-tailoring',
    excerpt: 'How hands-on technical training at Mwayi Trust opened self-employment opportunities for youth in Chileka.',
    content:
      'Our vocational training program equipped 45 students with hands-on tailoring and garment-making skills. Through daily practice, trade mentorship, and entrepreneurship coaching, graduates now produce school uniforms and fashion garments for local markets.',
    category: 'Vocational Training',
    cover_image: graduationImg,
    featured_image: graduationImg,
    featured: true,
    published: true,
    published_at: '2026-10-15T10:00:00.000Z',
    created_at: '2026-10-15T10:00:00.000Z',
  },
  {
    id: 'story-2',
    title: 'Nurturing Potential: After-School Homework Support',
    slug: 'nurturing-potential-after-school-support',
    excerpt: 'Tutoring circles and academic mentorship are helping primary learners boost grades and build confidence.',
    content:
      'Through the Homework Centre program, young students receive personalized guidance, learning books, and school supplies. With a supportive environment, learner retention and classroom participation have risen significantly.',
    category: 'Education',
    cover_image: homeworkImg,
    featured_image: homeworkImg,
    featured: true,
    published: true,
    published_at: '2026-10-10T14:30:00.000Z',
    created_at: '2026-10-10T14:30:00.000Z',
  },
  {
    id: 'story-3',
    title: 'Growing Sustainability in the Community Garden',
    slug: 'growing-sustainability-community-garden',
    excerpt: 'Fresh produce, vocational scholarships, and agricultural learning for young mothers and youth.',
    content:
      'The community garden provides daily meals, nutrition, and income through sustainable farming techniques. Produce directly feeds participants of the professional cookery courses, with surplus sold to finance student scholarships.',
    category: 'Community',
    cover_image: gardenImg,
    featured_image: gardenImg,
    featured: false,
    published: true,
    published_at: '2026-10-05T09:00:00.000Z',
    created_at: '2026-10-05T09:00:00.000Z',
  },
  {
    id: 'story-4',
    title: 'Graduation Day: Celebrating 30 Carpentry & Cookery Graduates',
    slug: 'graduation-day-celebrating-graduates',
    excerpt: 'A proud milestone for graduates stepping into apprenticeships and independent enterprise.',
    content:
      'Students received national trade certificates in carpentry and professional catering, celebrating with their families, village headmen, and community partners in Mbvundula Village.',
    category: 'Achievement',
    cover_image: graduation1Img,
    featured_image: graduation1Img,
    featured: false,
    published: true,
    published_at: '2026-09-28T11:00:00.000Z',
    created_at: '2026-09-28T11:00:00.000Z',
  },
]

const INITIAL_EVENTS = [
  {
    id: 'event-1',
    title: 'Community Vocational Intake & Open Day',
    slug: 'vocational-intake-open-day',
    description:
      'Orientation and registration for prospective learners in cookery, carpentry, tailoring, and housekeeping trades.',
    category: 'Orientation',
    event_date: '2026-11-15',
    start_time: '09:00 AM',
    end_time: '01:00 PM',
    location: 'Mwayi Trust Centre, Chileka, Blantyre',
    image: vocationalImg,
    image_url: vocationalImg,
    featured: true,
  },
  {
    id: 'event-2',
    title: 'Annual Youth Education & Mentorship Summit',
    slug: 'youth-mentorship-summit',
    description:
      'Interactive workshop bringing together secondary school students and guest mentors for career path guidance.',
    category: 'Mentorship',
    event_date: '2026-12-05',
    start_time: '10:00 AM',
    end_time: '03:00 PM',
    location: 'Mbvundula Village Community Hall',
    image: graduationImg,
    image_url: graduationImg,
    featured: true,
  },
  {
    id: 'event-3',
    title: 'Community Harvest & Garden Showcase',
    slug: 'community-harvest-showcase',
    description:
      'Celebrating seasonal yield from our community garden and raising scholarship support for vocational trainees.',
    category: 'Community',
    event_date: '2026-11-28',
    start_time: '08:30 AM',
    end_time: '12:30 PM',
    location: 'Community Garden Plot 4',
    image: gardenImg,
    image_url: gardenImg,
    featured: false,
  },
]

const INITIAL_GALLERY = [
  {
    id: 'gal-1',
    title: 'Graduation Ceremony',
    image_url: graduationImg,
    thumbnail_url: graduationImg,
    description: 'Trainees proudly displaying certificates upon completing their trade training.',
    category: 'Graduation',
    author: 'Mwayi Trust',
    created_at: '2026-10-12T10:00:00.000Z',
  },
  {
    id: 'gal-2',
    title: 'Carpentry Workshop Training',
    image_url: carpentryImg,
    thumbnail_url: carpentryImg,
    description: 'Learners mastering woodworking, joinery, and durable furniture construction.',
    category: 'Vocational',
    author: 'Mwayi Trust',
    created_at: '2026-10-08T11:00:00.000Z',
  },
  {
    id: 'gal-3',
    title: 'Professional Cookery Class',
    image_url: cookeryImg,
    thumbnail_url: cookeryImg,
    description: 'Culinary arts practical sessions preparing catering students for hospitality roles.',
    category: 'Vocational',
    author: 'Mwayi Trust',
    created_at: '2026-10-04T12:00:00.000Z',
  },
  {
    id: 'gal-4',
    title: 'Housekeeping and Hospitality Skills',
    image_url: houseKeepingImg,
    thumbnail_url: houseKeepingImg,
    description: 'Practical training in accommodation management and hygiene standards.',
    category: 'Vocational',
    author: 'Mwayi Trust',
    created_at: '2026-09-25T14:00:00.000Z',
  },
  {
    id: 'gal-5',
    title: 'Homework Centre Study Circle',
    image_url: homework1Img,
    thumbnail_url: homework1Img,
    description: 'Primary learners working on mathematics and reading comprehension.',
    category: 'Education',
    author: 'Mwayi Trust',
    created_at: '2026-09-20T15:30:00.000Z',
  },
  {
    id: 'gal-6',
    title: 'Community Garden Harvest',
    image_url: gardenImg,
    thumbnail_url: gardenImg,
    description: 'Fresh vegetables grown by students to support daily meals and vocational learning.',
    category: 'Community',
    author: 'Mwayi Trust',
    created_at: '2026-09-15T08:00:00.000Z',
  },
]

const INITIAL_PROFILES = [
  {
    id: 'admin-user-1',
    email: 'admin@mwayitrust.org',
    full_name: 'Mwayi Trust Administrator',
    role: 'admin',
  },
]

const INITIAL_DONATIONS = [
  {
    id: 'don-1',
    name: 'Grace Phiri',
    donor_name: 'Grace Phiri',
    email: 'grace@example.com',
    amount: 60000,
    status: 'Completed',
    date: '2026-10-24T14:20:00.000Z',
    created_at: '2026-10-24T14:20:00.000Z',
    payment_reference: 'MT-1729779600000-8812',
  },
  {
    id: 'don-2',
    name: 'Anonymous Donor',
    donor_name: 'Anonymous Donor',
    email: 'donor@example.com',
    amount: 180000,
    status: 'Completed',
    date: '2026-10-22T09:15:00.000Z',
    created_at: '2026-10-22T09:15:00.000Z',
    payment_reference: 'MT-1729588500000-4321',
  },
]

const INITIAL_CONTACT_MESSAGES = [
  {
    id: 'msg-1',
    name: 'Daniel Banda',
    email: 'daniel.banda@example.com',
    message: 'I would like to volunteer as a weekend math tutor at the Homework Centre in Chileka.',
    created_at: '2026-10-25T16:00:00.000Z',
  },
]

const INITIAL_SUBSCRIBERS = [
  {
    id: 'sub-1',
    email: 'supporter@mwayitrust.org',
    subscribed: true,
    subscribed_at: '2026-10-18T10:00:00.000Z',
    source: 'website',
  },
]

// In-memory or localStorage-backed reactive tables
function getStorage<T>(key: string, defaultData: T[]): T[] {
  try {
    const raw = localStorage.getItem(`mwayi_${key}`)
    if (raw) return JSON.parse(raw)
  } catch {
    // ignore
  }
  return [...defaultData]
}

function setStorage<T>(key: string, data: T[]): void {
  try {
    localStorage.setItem(`mwayi_${key}`, JSON.stringify(data))
  } catch {
    // ignore
  }
}

// In-memory tables with initial seed
const tables: Record<string, any[]> = {
  stories: getStorage('stories', INITIAL_STORIES),
  events: getStorage('events', INITIAL_EVENTS),
  gallery: getStorage('gallery', INITIAL_GALLERY),
  profiles: getStorage('profiles', INITIAL_PROFILES),
  admins: getStorage('admins', INITIAL_PROFILES),
  donations: getStorage('donations', INITIAL_DONATIONS),
  contact_messages: getStorage('contact_messages', INITIAL_CONTACT_MESSAGES),
  messages: getStorage('messages', INITIAL_CONTACT_MESSAGES),
  contacts: getStorage('contacts', INITIAL_CONTACT_MESSAGES),
  subscribers: getStorage('subscribers', INITIAL_SUBSCRIBERS),
}

let currentMockUser: { id: string; email: string; user_metadata?: Record<string, unknown> } | null =
  getStorage('auth_user', [INITIAL_PROFILES[0]])[0] || null

function createMockQueryBuilder(tableName: string) {
  if (!tables[tableName]) {
    tables[tableName] = []
  }

  let filtered = [...tables[tableName]]
  let isCountQuery = false

  const builder: any = {
    select(_columns?: string, options?: { count?: string }) {
      if (options?.count === 'exact') {
        isCountQuery = true
      }
      return builder
    },

    eq(column: string, value: any) {
      filtered = filtered.filter((item) => {
        const itemVal = item[column]
        if (typeof value === 'boolean') {
          return Boolean(itemVal) === value
        }
        return String(itemVal) === String(value)
      })
      return builder
    },

    order(column: string, options?: { ascending?: boolean }) {
      const asc = options?.ascending !== false
      filtered.sort((a, b) => {
        const valA = a[column] ?? ''
        const valB = b[column] ?? ''
        if (valA < valB) return asc ? -1 : 1
        if (valA > valB) return asc ? 1 : -1
        return 0
      })
      return builder
    },

    limit(n: number) {
      filtered = filtered.slice(0, n)
      return builder
    },

    async single() {
      const item = filtered[0] ?? null
      return { data: item ? { ...item } : null, error: item ? null : { message: 'Row not found', code: 'PGRST116' } }
    },

    async maybeSingle() {
      const item = filtered[0] ?? null
      return { data: item ? { ...item } : null, error: null }
    },

    then(resolve: (res: { data: any; error: any }) => void) {
      const resultData = isCountQuery ? filtered.map((item) => ({ id: item.id })) : [...filtered]
      return Promise.resolve({ data: resultData, error: null }).then(resolve)
    },

    insert(rows: any | any[]) {
      const itemsToInsert = Array.isArray(rows) ? rows : [rows]
      const inserted: any[] = []

      for (const raw of itemsToInsert) {
        const item = {
          ...raw,
          id: raw.id || `id-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          created_at: raw.created_at || new Date().toISOString(),
        }
        tables[tableName].unshift(item)
        inserted.push(item)
      }
      setStorage(tableName, tables[tableName])
      filtered = inserted

      return {
        ...builder,
        select: () => ({
          ...builder,
          single: async () => ({ data: inserted[0] ? { ...inserted[0] } : null, error: null }),
          maybeSingle: async () => ({ data: inserted[0] ? { ...inserted[0] } : null, error: null }),
        }),
        then: (resolve: (res: { data: any; error: any }) => void) =>
          Promise.resolve({ data: inserted, error: null }).then(resolve),
      }
    },

    update(updates: Record<string, any>) {
      return {
        eq(col: string, val: any) {
          const updatedRows: any[] = []
          tables[tableName] = tables[tableName].map((item) => {
            if (String(item[col]) === String(val)) {
              const updated = { ...item, ...updates }
              updatedRows.push(updated)
              return updated
            }
            return item
          })
          setStorage(tableName, tables[tableName])
          filtered = updatedRows

          return {
            ...builder,
            select: () => ({
              ...builder,
              single: async () => ({ data: updatedRows[0] ? { ...updatedRows[0] } : null, error: null }),
              maybeSingle: async () => ({ data: updatedRows[0] ? { ...updatedRows[0] } : null, error: null }),
            }),
            then: (resolve: (res: { data: any; error: any }) => void) =>
              Promise.resolve({ data: updatedRows, error: null }).then(resolve),
          }
        },
      }
    },

    delete() {
      return {
        eq(col: string, val: any) {
          tables[tableName] = tables[tableName].filter((item) => String(item[col]) !== String(val))
          setStorage(tableName, tables[tableName])
          return Promise.resolve({ data: null, error: null })
        },
      }
    },
  }

  return builder
}

const mockSupabaseClient = {
  auth: {
    async getUser() {
      return { data: { user: currentMockUser }, error: null }
    },
    async getSession() {
      return {
        data: {
          session: currentMockUser ? { user: currentMockUser, access_token: 'mock-session-token' } : null,
        },
        error: null,
      }
    },
    async signInWithPassword({ email }: { email: string; password?: string }) {
      const profile = tables.profiles.find((p) => p.email.toLowerCase() === email.toLowerCase()) || {
        id: 'admin-user-1',
        email,
        full_name: 'Mwayi Trust Admin',
        role: 'admin',
      }
      currentMockUser = { id: profile.id, email: profile.email }
      setStorage('auth_user', [currentMockUser])
      return { data: { user: currentMockUser, session: { user: currentMockUser } }, error: null }
    },
    async signOut() {
      currentMockUser = null
      setStorage('auth_user', [])
      return { error: null }
    },
    onAuthStateChange(callback: (event: string, session: any) => void) {
      setTimeout(() => {
        callback(currentMockUser ? 'SIGNED_IN' : 'SIGNED_OUT', { user: currentMockUser })
      }, 0)
      return { data: { subscription: { unsubscribe: () => undefined } } }
    },
  },
  from(tableName: string) {
    return createMockQueryBuilder(tableName)
  },
  functions: {
    async invoke<T = any>(functionName: string, options?: { body?: any }): Promise<{ data: T | null; error: any }> {
      if (functionName === 'record-consent') {
        return { data: { success: true } as unknown as T, error: null }
      }
      if (functionName === 'create-donation') {
        const txRef = options?.body?.payment_reference || `MT-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`
        // Save donation record to mock donations
        if (options?.body) {
          tables.donations.unshift({
            id: `don-${Date.now()}`,
            name: options.body.donor_name || 'Anonymous donor',
            donor_name: options.body.donor_name || 'Anonymous donor',
            email: options.body.email,
            phone: options.body.phone,
            amount: options.body.amount,
            currency: options.body.currency || 'MWK',
            status: 'Completed',
            date: new Date().toISOString(),
            created_at: new Date().toISOString(),
            payment_reference: txRef,
          })
          setStorage('donations', tables.donations)
        }

        return {
          data: {
            success: true,
            checkout_url: `/donation-callback?status=success&tx_ref=${encodeURIComponent(txRef)}`,
            tx_ref: txRef,
          } as unknown as T,
          error: null,
        }
      }
      return { data: null, error: null }
    },
  },
}

export const supabase = hasSupabaseConfig
  ? createClient(supabaseUrl, supabaseAnonKey)
  : (mockSupabaseClient as unknown as ReturnType<typeof createClient>)