import { useState, useMemo } from 'react'
import { useStore } from '../store/useStore'
import { useFilterByIngredients, useEnrichedFilterResults } from '../hooks/useCocktails'
import { translateIngredient, translateDrinkName } from '../utils/translate'
import LoadingSpinner from '../components/LoadingSpinner'
import EmptyState from '../components/EmptyState'
import ErrorMessage from '../components/ErrorMessage'
import { Link } from 'react-router-dom'

// All available ingredients grouped by category
const INGREDIENT_GROUPS = [
  {
    category: '基酒',
    items: ['Vodka', 'Gin', 'White Rum', 'Dark Rum', 'Light Rum', 'Tequila', 'Bourbon', 'Scotch', 'Whiskey', 'Brandy', 'Cognac', 'Spiced Rum'],
  },
  {
    category: '利口酒',
    items: ['Triple Sec', 'Cointreau', 'Blue Curacao', 'Amaretto', 'Kahlua', 'Baileys', 'Grand Marnier', 'Campari', 'Sweet Vermouth', 'Dry Vermouth', 'Peach Schnapps', 'Melon Liqueur', 'Crème de Cacao', 'Crème de Menthe', 'Maraschino Liqueur', 'Apricot Brandy', 'Cherry Brandy'],
  },
  {
    category: '果汁',
    items: ['Lime Juice', 'Lemon Juice', 'Orange Juice', 'Pineapple Juice', 'Cranberry Juice', 'Grapefruit Juice', 'Tomato Juice', 'Apple Juice', 'Passion Fruit Juice', 'Mango Juice'],
  },
  {
    category: '汽水/饮料',
    items: ['Soda Water', 'Tonic Water', 'Coca-Cola', 'Ginger Beer', 'Ginger Ale', 'Apple Cider', 'Champagne', 'Prosecco'],
  },
  {
    category: '糖浆/调味',
    items: ['Sugar Syrup', 'Simple Syrup', 'Grenadine', 'Honey', 'Sugar', 'Salt', 'Angostura Bitters', 'Orange Bitters', 'Vanilla Extract', 'Tabasco Sauce', 'Worcestershire Sauce'],
  },
  {
    category: '乳制品/其他',
    items: ['Cream', 'Milk', 'Egg White', 'Egg Yolk', 'Coconut Milk', 'Coconut Cream', 'Coffee', 'Espresso', 'Ice'],
  },
  {
    category: '装饰',
    items: ['Mint', 'Basil', 'Rosemary', 'Lemon', 'Lime', 'Orange', 'Cherry', 'Olive'],
  },
]

function IngredientTag({ name, type, onClick }) {
  const label = type === 'matched' ? '✅' : '❌'
  const baseClass = 'text-xs px-2 py-0.5 rounded-sm font-body border transition-all inline-block m-0.5'
  const typeClass = type === 'matched'
    ? 'bg-green-100 text-green-800 border-green-300'
    : 'bg-red-100 text-red-800 border-red-300 hover:bg-red-200 hover:border-red-400 cursor-pointer'

  return (
    <span
      className={`${baseClass} ${typeClass}`}
      onClick={type === 'missing' ? onClick : undefined}
      title={type === 'missing' ? `将 ${translateIngredient(name)} 加入采购清单` : undefined}
    >
      {label} {translateIngredient(name)}
    </span>
  )
}

export default function FilterPage() {
  const {
    selectedIngredients, toggleIngredient, clearIngredients,
    viewMode, setViewMode, shoppingList, clearShoppingList,
    removeFromShoppingList, addToShoppingList,
  } = useStore()

  const [activeTab, setActiveTab] = useState(INGREDIENT_GROUPS[0].category)
  const [showShopping, setShowShopping] = useState(false)
  const [sortBy, setSortBy] = useState('match') // 'match' | 'name'
  const [erroredImages, setErroredImages] = useState(new Set())

  // Step 1: Get basic filtered drink list from intersection of ingredient results
  const { data: drinks, isLoading, error, refetch } = useFilterByIngredients(selectedIngredients)

  // Step 2: Enrich with full ingredient data and compute real match scores
  const { data: enrichedDrinks, isLoading: isEnriching } = useEnrichedFilterResults(drinks, selectedIngredients)

  // Step 3: Filter by view mode
  const filteredDrinks = useMemo(() => {
    if (!enrichedDrinks) return []
    if (viewMode === 'strict') {
      // Only drinks where the user has ALL required ingredients (100% match)
      return enrichedDrinks.filter(d => d.matchedCount === d.totalCount)
    }
    // Loose mode: drinks missing at most 2 ingredients
    return enrichedDrinks.filter(d => d.totalCount - d.matchedCount <= 2)
  }, [enrichedDrinks, viewMode])

  // Step 4: Sort
  const sortedDrinks = useMemo(() => {
    const sorted = [...filteredDrinks]
    if (sortBy === 'name') {
      sorted.sort((a, b) => a.strDrink.localeCompare(b.strDrink))
    } else {
      sorted.sort((a, b) => b.matchPercent - a.matchPercent)
    }
    return sorted
  }, [filteredDrinks, sortBy])

  const handleImageError = (idDrink) => {
    setErroredImages(prev => {
      const next = new Set(prev)
      next.add(idDrink)
      return next
    })
  }

  const handleAddMissingIngredient = (ingredientName, drinkName) => {
    addToShoppingList(ingredientName, '', drinkName)
  }

  const isLoadingAny = isLoading || isEnriching

  return (
    <div className="py-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-heading text-2xl text-vintage-gold border-b-2 border-vintage-gold/30 pb-1">
          🧺 材料筛选
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowShopping(!showShopping)}
            className={`text-sm px-3 py-1 rounded-sm border font-body transition-all ${
              showShopping
                ? 'bg-vintage-accent text-vintage-card border-vintage-accent'
                : 'border-vintage-gold text-vintage-gold hover:bg-vintage-gold/10'
            }`}
          >
            📋 采购清单 {shoppingList.length > 0 && `(${shoppingList.length})`}
          </button>
        </div>
      </div>

      {/* Main layout: two columns on desktop */}
      <div className="lg:grid lg:grid-cols-5 lg:gap-6">
        {/* Ingredient Panel */}
        <div className="lg:col-span-2 mb-6 lg:mb-0">
          <div className="card-vintage p-4">
            {/* Category Tabs */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {INGREDIENT_GROUPS.map(group => (
                <button
                  key={group.category}
                  onClick={() => setActiveTab(group.category)}
                  className={`text-xs px-3 py-1 rounded-sm font-body transition-all border ${
                    activeTab === group.category
                      ? 'bg-vintage-accent text-vintage-card border-vintage-accent'
                      : 'border-vintage-gold/40 text-vintage-gold hover:bg-vintage-gold/10'
                  }`}
                >
                  {group.category}
                </button>
              ))}
            </div>

            {/* Ingredient Chips */}
            {INGREDIENT_GROUPS.filter(g => g.category === activeTab).map(group => (
              <div key={group.category} className="flex flex-wrap gap-2">
                {group.items.map(name => {
                  const selected = selectedIngredients.includes(name)
                  return (
                    <button
                      key={name}
                      onClick={() => toggleIngredient(name)}
                      className={`text-sm px-3 py-1.5 rounded-sm font-body border transition-all ${
                        selected
                          ? 'bg-vintage-accent text-vintage-card border-vintage-accent shadow-md'
                          : 'bg-vintage-paper text-vintage-ink border-vintage-gold/30 hover:border-vintage-gold'
                      }`}
                    >
                      {selected ? '✅ ' : ''}{translateIngredient(name)}
                    </button>
                  )
                })}
              </div>
            ))}

            {/* Selected Bar */}
            {selectedIngredients.length > 0 && (
              <div className="mt-4 pt-4 border-t border-vintage-gold/30">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-vintage-gold font-body">
                    已选 <strong className="text-vintage-accent">{selectedIngredients.length}</strong> 种材料
                  </span>
                  <button
                    onClick={clearIngredients}
                    className="text-xs text-vintage-gold/60 hover:text-vintage-accent font-body transition-colors"
                  >
                    一键清空
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Result Panel */}
        <div className="lg:col-span-3">
          {/* Result Header */}
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('strict')}
                className={`text-xs px-3 py-1 rounded-sm font-body border transition-all ${
                  viewMode === 'strict'
                    ? 'bg-vintage-accent text-vintage-card border-vintage-accent'
                    : 'border-vintage-gold/40 text-vintage-gold hover:bg-vintage-gold/10'
                }`}
              >
                ✅ 完全能调
              </button>
              <button
                onClick={() => setViewMode('loose')}
                className={`text-xs px-3 py-1 rounded-sm font-body border transition-all ${
                  viewMode === 'loose'
                    ? 'bg-vintage-accent text-vintage-card border-vintage-accent'
                    : 'border-vintage-gold/40 text-vintage-gold hover:bg-vintage-gold/10'
                }`}
              >
                🔶 差1-2种也能调
              </button>
            </div>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="text-xs bg-vintage-paper text-vintage-ink border border-vintage-gold/40
                         rounded-sm px-2 py-1 font-body focus:outline-none"
            >
              <option value="match">匹配度优先</option>
              <option value="name">名称 A-Z</option>
            </select>
          </div>

          {selectedIngredients.length === 0 && (
            <EmptyState icon="🧺" message="👈 从左侧选择你已有的材料，看看能调什么酒" />
          )}

          {isLoadingAny && <LoadingSpinner />}
          {error && <ErrorMessage message="筛选失败，请重试" onRetry={refetch} />}

          {!isLoadingAny && !error && sortedDrinks.length === 0 && selectedIngredients.length > 0 && drinks && drinks.length > 0 && (
            <EmptyState icon="🔍" message={`在"${viewMode === 'strict' ? '完全能调' : '差1-2种'}"模式下没有匹配的鸡尾酒，试试切换模式`} />
          )}

          {sortedDrinks.length > 0 && selectedIngredients.length > 0 && (
            <div className="space-y-3">
              {sortedDrinks.map(drink => (
                <div key={drink.idDrink} className="card-vintage p-4 flex gap-4 items-start group">
                  <Link to={`/drink/${drink.idDrink}`} className="shrink-0">
                    <div className="w-16 h-16 rounded-sm overflow-hidden border border-vintage-gold/40 bg-vintage-paper">
                      {erroredImages.has(drink.idDrink) ? (
                        <div className="w-full h-full flex items-center justify-center text-vintage-gold/40 text-2xl">
                          🍸
                        </div>
                      ) : (
                        <img
                          src={drink.strDrinkThumb}
                          alt={drink.strDrink}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          onError={() => handleImageError(drink.idDrink)}
                        />
                      )}
                    </div>
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link to={`/drink/${drink.idDrink}`} className="hover:text-vintage-accent transition-colors">
                      <h3 className="font-heading text-base text-vintage-ink line-clamp-1">
                        {translateDrinkName(drink.strDrink)}
                      </h3>
                      <p className="font-script text-sm text-vintage-gold">{drink.strDrink}</p>
                    </Link>
                    {/* Match bar */}
                    <div className="mt-2">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-vintage-paper rounded-full overflow-hidden border border-vintage-gold/20">
                          <div
                            className="h-full bg-vintage-accent rounded-full transition-all"
                            style={{ width: `${Math.min(100, drink.matchPercent)}%` }}
                          />
                        </div>
                        <span className="text-xs text-vintage-gold font-body whitespace-nowrap">
                          已满足 {drink.matchedCount}/{drink.totalCount}
                        </span>
                      </div>
                    </div>

                    {/* Ingredient tags */}
                    <div className="mt-2 flex flex-wrap gap-0.5">
                      {drink.matchedIngredients.map(name => (
                        <IngredientTag key={name} name={name} type="matched" />
                      ))}
                      {drink.missingIngredients.map(name => (
                        <IngredientTag
                          key={name}
                          name={name}
                          type="missing"
                          onClick={() => handleAddMissingIngredient(name, drink.strDrink)}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Shopping List Drawer */}
      {showShopping && (
        <div className="fixed inset-0 z-50 flex justify-end" onClick={() => setShowShopping(false)}>
          <div className="absolute inset-0 bg-black/50" />
          <div
            className="relative w-full max-w-md bg-vintage-bg border-l-2 border-vintage-gold
                        h-full overflow-y-auto p-6"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading text-xl text-vintage-gold">📋 采购清单</h2>
              <button
                onClick={() => setShowShopping(false)}
                className="text-vintage-gold hover:text-vintage-accent text-xl"
              >
                ✕
              </button>
            </div>

            {shoppingList.length === 0 ? (
              <EmptyState icon="📋" message="清单是空的，去筛选页添加吧" />
            ) : (
              <>
                <div className="space-y-3 mb-6">
                  {shoppingList.map((item) => (
                    <div key={item.name} className="card-vintage p-3 flex items-start justify-between">
                      <div>
                        <p className="font-body text-vintage-ink text-sm font-semibold">
                          {translateIngredient(item.name)}
                        </p>
                        <p className="text-xs text-vintage-gold mt-0.5">
                          涉及：{item.relatedDrinks.map(d => translateDrinkName(d)).join('、')}
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromShoppingList(item.name)}
                        className="text-vintage-gold/50 hover:text-vintage-accent ml-2 shrink-0"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      const text = shoppingList.map(item =>
                        `- ${translateIngredient(item.name)}（${item.relatedDrinks.map(d => translateDrinkName(d)).join('、')}）`
                      ).join('\n')
                      navigator.clipboard.writeText(text)
                      alert('清单已复制！')
                    }}
                    className="btn-accent text-sm flex-1"
                  >
                    📋 复制清单
                  </button>
                  <button
                    onClick={clearShoppingList}
                    className="text-sm border border-vintage-gold text-vintage-gold
                               px-4 py-2 rounded-sm font-body hover:bg-vintage-gold/10 transition-all"
                  >
                    清空
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
