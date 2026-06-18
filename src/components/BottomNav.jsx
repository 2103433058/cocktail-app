import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/', label: '首页', icon: '🏠' },
  { to: '/search', label: '搜索', icon: '🔍' },
  { to: '/filter', label: '筛选', icon: '🧺' },
  { to: '/favorites', label: '收藏', icon: '❤️' },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-vintage-bg border-t-2 border-vintage-gold
                    md:hidden z-50">
      <div className="flex justify-around py-2">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center text-xs px-3 py-1 rounded-sm transition-colors ${
                isActive
                  ? 'text-vintage-accent bg-vintage-paper/20'
                  : 'text-vintage-gold hover:text-vintage-card'
              }`
            }
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
