import { useStore } from '../store/useStore'
import { useCocktailDetail } from '../hooks/useCocktails'
import DrinkCard from '../components/DrinkCard'
import EmptyState from '../components/EmptyState'
import { Link } from 'react-router-dom'

function FavoriteDrink({ id }) {
  const { data: drink, isLoading } = useCocktailDetail(id)

  if (isLoading) {
    return (
      <div className="card-vintage p-4 animate-pulse">
        <div className="w-full aspect-square bg-vintage-gold/20 rounded-sm" />
        <div className="h-4 bg-vintage-gold/20 rounded mt-2" />
      </div>
    )
  }

  if (!drink) return null
  return <DrinkCard drink={drink} />
}

export default function FavoritesPage() {
  const { favorites } = useStore()

  if (favorites.length === 0) {
    return (
      <div className="py-6">
        <h2 className="font-heading text-2xl text-vintage-gold border-b-2 border-vintage-gold/30 pb-1 mb-4">
          ❤️ 我的收藏
        </h2>
        <EmptyState
          icon="❤️"
          message="还没有收藏哦，去逛逛吧！"
        />
        <div className="text-center mt-4">
          <Link to="/" className="btn-accent inline-block text-sm">
            去首页看看
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="py-6">
      <h2 className="font-heading text-2xl text-vintage-gold border-b-2 border-vintage-gold/30 pb-1 mb-4">
        ❤️ 我的收藏 ({favorites.length})
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {favorites.map(id => (
          <FavoriteDrink key={id} id={id} />
        ))}
      </div>
    </div>
  )
}
