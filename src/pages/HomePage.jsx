import { useNavigate, Link } from 'react-router-dom'
import { useRandomDrinks } from '../hooks/useCocktails'
import DrinkCard from '../components/DrinkCard'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'

const categories = [
  { name: 'Vodka', label: '伏特加', icon: '🍸', desc: '清爽纯净' },
  { name: 'Whiskey', label: '威士忌', icon: '🥃', desc: '醇厚深邃' },
  { name: 'Rum', label: '朗姆酒', icon: '🏝️', desc: '热带风情' },
  { name: 'Gin', label: '金酒', icon: '🌿', desc: '草本芳香' },
  { name: 'Tequila', label: '龙舌兰', icon: '🌵', desc: '热情奔放' },
  { name: 'Brandy', label: '白兰地', icon: '🍇', desc: '优雅经典' },
]

export default function HomePage() {
  const navigate = useNavigate()
  const { data: randomDrinks, isLoading, error, refetch } = useRandomDrinks(4)

  const handleSearch = (e) => {
    e.preventDefault()
    const q = e.target.search.value.trim()
    if (q) navigate(`/search?q=${encodeURIComponent(q)}`)
  }

  return (
    <div className="py-6">
      {/* Hero Section */}
      <section className="text-center py-8 md:py-16">
        <h1 className="font-heading text-4xl md:text-5xl text-vintage-gold mb-3">
          复古调酒手册
        </h1>
        <p className="font-script text-2xl text-vintage-gold/70 mb-8">
          The Vintage Cocktail Guide
        </p>
        <form onSubmit={handleSearch} className="max-w-md mx-auto">
          <div className="flex border-2 border-vintage-gold rounded-sm overflow-hidden
                          bg-vintage-paper">
            <input
              name="search"
              type="text"
              placeholder="输入酒名，探索配方..."
              className="flex-1 bg-transparent px-4 py-3 text-vintage-ink
                         placeholder-vintage-gold/60 focus:outline-none font-body"
            />
            <button type="submit" className="bg-vintage-accent text-vintage-card px-6 py-3
                                             font-semibold hover:brightness-110 transition-all">
              搜索
            </button>
          </div>
        </form>
      </section>

      {/* Random Recommendations */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading text-2xl text-vintage-gold border-b-2 border-vintage-gold/30 pb-1">
            🎲 随机推荐
          </h2>
          <button
            onClick={() => refetch()}
            className="text-sm text-vintage-gold hover:text-vintage-accent transition-colors font-body"
          >
            再摇一次 🔄
          </button>
        </div>
        {isLoading && <LoadingSpinner />}
        {error && <ErrorMessage message="无法获取推荐" onRetry={refetch} />}
        {randomDrinks && randomDrinks.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {randomDrinks.map(drink => (
              <DrinkCard key={drink.idDrink} drink={drink} />
            ))}
          </div>
        )}
      </section>

      {/* Category Grid */}
      <section className="mb-10">
        <h2 className="font-heading text-2xl text-vintage-gold border-b-2 border-vintage-gold/30 pb-1 mb-4">
          📂 按基酒分类
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {categories.map(cat => (
            <Link
              key={cat.name}
              to={`/category/${cat.name}`}
              className="card-vintage p-5 text-center hover:scale-[1.02] transition-transform
                         cursor-pointer group"
            >
              <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">
                {cat.icon}
              </div>
              <h3 className="font-heading text-lg text-vintage-ink">{cat.label}</h3>
              <p className="font-script text-vintage-gold text-sm">{cat.desc}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
