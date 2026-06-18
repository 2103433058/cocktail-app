import { Link, useNavigate } from 'react-router-dom'

export default function Header() {
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    const q = e.target.search.value.trim()
    if (q) navigate(`/search?q=${encodeURIComponent(q)}`)
  }

  return (
    <header className="bg-vintage-bg border-b-2 border-vintage-gold sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="font-heading text-2xl text-vintage-gold tracking-wide">
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
                       w-40 md:w-56 font-body"
          />
          <button type="submit" className="text-vintage-gold ml-2 hover:text-vintage-accent">
            🔍
          </button>
        </form>
      </div>
    </header>
  )
}
