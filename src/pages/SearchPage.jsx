import { useSearchParams } from 'react-router-dom'
import { useSearchCocktails } from '../hooks/useCocktails'
import DrinkCard from '../components/DrinkCard'
import LoadingSpinner from '../components/LoadingSpinner'
import EmptyState from '../components/EmptyState'
import ErrorMessage from '../components/ErrorMessage'

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const { data: drinks, isLoading, error, refetch } = useSearchCocktails(query)

  const handleSubmit = (e) => {
    e.preventDefault()
    const q = e.target.q.value.trim()
    if (q) setSearchParams({ q })
  }

  return (
    <div className="py-6">
      <h2 className="font-heading text-2xl text-vintage-gold border-b-2 border-vintage-gold/30 pb-1 mb-4">
        🔍 搜索鸡尾酒
      </h2>

      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex gap-2">
          <input
            name="q"
            type="text"
            defaultValue={query}
            placeholder="输入鸡尾酒名称..."
            className="flex-1 bg-vintage-paper text-vintage-ink
                       placeholder-vintage-gold/60 px-4 py-3 rounded-sm
                       border-2 border-vintage-gold focus:outline-none
                       focus:ring-1 focus:ring-vintage-accent font-body"
          />
          <button type="submit" className="btn-accent">搜索</button>
        </div>
      </form>

      {isLoading && <LoadingSpinner />}
      {error && <ErrorMessage message="搜索失败，请稍后重试" onRetry={refetch} />}

      {drinks && (
        <>
          {drinks.length === 0 ? (
            <EmptyState
              icon="🍸"
              message={`没有找到关于"${query}"的鸡尾酒，试试其他关键词？`}
            />
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
