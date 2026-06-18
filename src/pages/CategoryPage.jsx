import { useParams } from 'react-router-dom'
import { useCategoryDrinks } from '../hooks/useCocktails'
import DrinkCard from '../components/DrinkCard'
import LoadingSpinner from '../components/LoadingSpinner'
import EmptyState from '../components/EmptyState'
import ErrorMessage from '../components/ErrorMessage'

const categoryMeta = {
  Vodka: { label: '伏特加', icon: '🍸' },
  Whiskey: { label: '威士忌', icon: '🥃' },
  Rum: { label: '朗姆酒', icon: '🏝️' },
  Gin: { label: '金酒', icon: '🌿' },
  Tequila: { label: '龙舌兰', icon: '🌵' },
  Brandy: { label: '白兰地', icon: '🍇' },
}

export default function CategoryPage() {
  const { name } = useParams()
  const meta = categoryMeta[name] || { label: name, icon: '🍹' }
  const { data: drinks, isLoading, error, refetch } = useCategoryDrinks(name)

  return (
    <div className="py-6">
      <h2 className="font-heading text-2xl text-vintage-gold border-b-2 border-vintage-gold/30 pb-1 mb-4">
        {meta.icon} {meta.label} 基酒系列
      </h2>

      {isLoading && <LoadingSpinner />}
      {error && <ErrorMessage message="加载失败" onRetry={refetch} />}

      {drinks && (
        <>
          {drinks.length === 0 ? (
            <EmptyState icon={meta.icon} message={`暂无${meta.label}系列的鸡尾酒`} />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {drinks.map(drink => (
                <DrinkCard key={drink.idDrink} drink={drink} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
