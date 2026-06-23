import { Link, NavLink, useNavigate } from 'react-router-dom'

const navItems = [
  { to: '/', label: '首页' },
  { to: '/search', label: '搜索' },
  { to: '/filter', label: '筛选' },
  { to: '/favorites', label: '收藏' },
]

export default function Header() {
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    const q = e.target.search.value.trim()
    if (q) navigate(`/search?q=${encodeURIComponent(q)}`)
  }

  return (
    <header className="bg-vintage-bg border-b-2 border-vintage-gold sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 py-3">
        {/* Top row: logo + search */}
        <div className="flex items-center justify-between">
          <Link to="/" className="font-heading text-2xl text-vintage-gold tracking-wide shrink-0">
            🍸 调酒手册
          </Link>
          <form onSubmit={handleSearch} className="flex items-center">
            <input
              name="search"
              type="text"
              placeholder="搜索鸡尾酒..."
              className="bg-vintage-paper text-vintage-ink placeholder-vintage-gold/60
                         px-3 py-1.5 rounded-sm text-sm border border-vintage-gold
                         focus:outline-none focus:ring-1 focus:ring-vintage-accent
                         w-32 sm:w-40 md:w-56 font-body"
            />
            <button type="submit" className="text-vintage-gold ml-2 hover:text-vintage-accent">
              🔍
            </button>
          </form>
        </div>

        {/* Desktop nav row — hidden on mobile, shown on md+ */}
        <nav className="hidden md:flex justify-center gap-1 mt-2 pt-2 border-t border-vintage-gold/20">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `px-4 py-1.5 rounded-sm text-sm font-body transition-colors ${
                  isActive
                    ? 'text-vintage-accent bg-vintage-paper/20'
                    : 'text-vintage-gold/70 hover:text-vintage-gold hover:bg-vintage-gold/5'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}
