import { BookOpen, HeartHandshake, Home, PhoneCall, Sparkles } from 'lucide-react'
import { NavLink } from 'react-router-dom'

interface TabItem {
  label: string
  href: string
  icon: typeof Home
  highlight?: boolean
}

const tabs: TabItem[] = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'Programs', href: '/programs', icon: BookOpen },
  { label: 'Donate', href: '/donate', icon: HeartHandshake, highlight: true },
  { label: 'Stories', href: '/stories', icon: Sparkles },
  { label: 'Contact', href: '/contact', icon: PhoneCall },
]

export default function BottomTabBar() {
  return (
    <nav
      className="mobile-bottom-tab-bar"
      aria-label="Mobile navigation"
    >
      <div className="mobile-bottom-tab-container">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <NavLink
              key={tab.href}
              to={tab.href}
              end={tab.href === '/'}
              className={({ isActive }) =>
                `bottom-tab-item ${tab.highlight ? 'bottom-tab-item--highlight' : ''} ${
                  isActive ? 'bottom-tab-item--active' : ''
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className={`tab-icon-wrap ${tab.highlight ? 'tab-icon-wrap--highlight' : ''}`}>
                    <Icon size={tab.highlight ? 22 : 20} strokeWidth={isActive || tab.highlight ? 2.4 : 1.8} />
                  </div>
                  <span className="tab-label">{tab.label}</span>
                  {isActive && !tab.highlight && <span className="tab-active-indicator" />}
                </>
              )}
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}
