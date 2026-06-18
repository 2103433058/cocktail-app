import { Link } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { translateDrinkName } from '../utils/translate'

export default function DrinkCard({ drink }) {
  const { toggleFavorite, isFavorite } = useStore()
  const fav = isFavorite(drink.idDrink)

  return (
    <div className="card-vintage overflow-hidden group">
      <Link to={`/drink/${drink.idDrink}`}>
        <div className="relative aspect-square overflow-hidden">
          <img
            src={drink.strDrinkThumb}
            alt={drink.strDrink}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              e.target.style.display = 'none'
              e.target.nextSibling.style.display = 'flex'
            }}
          />
          <div className="hidden absolute inset-0 bg-gradient-to-br from-vintage-accent/20 to-vintage-gold/20
                          items-center justify-center text-6xl">
            🍸
          </div>
        </div>
      </Link>
      <div className="p-3 flex items-start justify-between">
        <Link to={`/drink/${drink.idDrink}`} className="flex-1">
          <h3 className="font-heading text-base text-vintage-ink leading-tight line-clamp-1">
            {translateDrinkName(drink.strDrink)}
          </h3>
          <p className="font-script text-sm text-vintage-gold mt-0.5">
            {drink.strDrink}
          </p>
        </Link>
        <button
          onClick={(e) => { e.preventDefault(); toggleFavorite(drink.idDrink) }}
          className={`ml-2 text-xl transition-colors shrink-0 ${
            fav ? 'text-vintage-accent' : 'text-vintage-gold/40 hover:text-vintage-accent'
          }`}
          aria-label={fav ? '取消收藏' : '收藏'}
        >
          {fav ? '❤️' : '🤍'}
        </button>
      </div>
    </div>
  )
}
