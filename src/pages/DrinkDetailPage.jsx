import { useParams, Link } from 'react-router-dom'
import { useCocktailDetail } from '../hooks/useCocktails'
import { useStore } from '../store/useStore'
import { translateDrinkName, translateIngredient, translateGlass, parseInstructions } from '../utils/translate'
import { useState } from 'react'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'

function getIngredients(drink) {
  const ingredients = []
  for (let i = 1; i <= 15; i++) {
    const name = drink[`strIngredient${i}`]
    const measure = drink[`strMeasure${i}`]
    if (name && name.trim()) {
      ingredients.push({
        name: name.trim(),
        measure: (measure || '').trim(),
      })
    }
  }
  return ingredients
}

const STEP_ICONS = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟']

export default function DrinkDetailPage() {
  const { id } = useParams()
  const { data: drink, isLoading, error, refetch } = useCocktailDetail(id)
  const { toggleFavorite, isFavorite, addToShoppingList } = useStore()
  const [imageError, setImageError] = useState(false)

  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorMessage message="加载配方失败" onRetry={refetch} />
  if (!drink) return <ErrorMessage message="未找到这款鸡尾酒" />

  const fav = isFavorite(drink.idDrink)
  const ingredients = getIngredients(drink)
  const cnName = translateDrinkName(drink.strDrink)
  const steps = parseInstructions(drink.strInstructions)

  const handleShare = async () => {
    const shareData = {
      title: `${cnName} - 复古调酒手册`,
      text: `来试试${cnName}（${drink.strDrink}）吧！${drink.strGlass ? `用${translateGlass(drink.strGlass)}盛装。` : ''}`,
      url: window.location.href,
    }
    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        await navigator.clipboard.writeText(
          `${shareData.title}\n${shareData.text}\n${shareData.url}`
        )
        alert('链接已复制到剪贴板！')
      }
    } catch (e) {
      if (e.name === 'AbortError') return
      console.warn('分享失败:', e)
    }
  }

  return (
    <div className="py-6">
      <Link to="/" className="text-vintage-gold hover:text-vintage-accent text-sm mb-4 inline-block font-body">
        ← 返回
      </Link>

      {/* Hero Image */}
      <div className="card-vintage overflow-hidden mb-6">
        <div className="relative aspect-video md:aspect-[21/9] overflow-hidden">
          {!imageError ? (
            <img
              src={drink.strDrinkThumb}
              alt={drink.strDrink}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-vintage-accent/20 to-vintage-gold/20
                            flex items-center justify-center text-8xl"
                 role="img" aria-label={cnName}>
              🍸
            </div>
          )}
        </div>
        <div className="p-6">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="font-heading text-3xl text-vintage-ink">{cnName}</h1>
              <p className="font-script text-xl text-vintage-gold mt-1">{drink.strDrink}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {drink.strCategory && (
                  <span className="bg-vintage-gold/20 text-vintage-ink text-xs px-3 py-1 rounded-full
                                   font-body border border-vintage-gold/40">
                    📂 {drink.strCategory}
                  </span>
                )}
                {drink.strIBA && (
                  <span className="bg-vintage-gold/20 text-vintage-ink text-xs px-3 py-1 rounded-full
                                   font-body border border-vintage-gold/40">
                    🏆 IBA官方
                  </span>
                )}
                {drink.strAlcoholic && (
                  <span className="bg-vintage-accent/10 text-vintage-accent text-xs px-3 py-1
                                   rounded-full font-body border border-vintage-accent/30">
                    {drink.strAlcoholic === 'Alcoholic' ? '🍸 含酒精' : '🧃 无酒精'}
                  </span>
                )}
                {drink.strGlass && (
                  <span className="bg-vintage-paper text-vintage-ink text-xs px-3 py-1 rounded-full
                                   font-body border border-vintage-gold/40">
                    🥂 {translateGlass(drink.strGlass)}
                  </span>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => toggleFavorite(drink.idDrink)}
                className={`px-4 py-2 rounded-sm border-2 font-body text-sm transition-all ${
                  fav
                    ? 'bg-vintage-accent text-vintage-card border-vintage-accent'
                    : 'border-vintage-gold text-vintage-gold hover:bg-vintage-gold/10'
                }`}
              >
                {fav ? '❤️ 已收藏' : '🤍 收藏'}
              </button>
              <button
                onClick={handleShare}
                className="px-4 py-2 rounded-sm border-2 border-vintage-gold text-vintage-gold
                           hover:bg-vintage-gold/10 font-body text-sm transition-all"
              >
                📤 分享
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Ingredients */}
        <div className="card-vintage p-6">
          <h2 className="font-heading text-xl text-vintage-ink border-b border-vintage-gold/30 pb-2 mb-4">
            📋 配料清单 ({ingredients.length}种)
          </h2>
          <ul className="space-y-2">
            {ingredients.map((ing) => (
              <li key={ing.name} className="flex justify-between items-center py-1.5
                                      border-b border-vintage-gold/10 last:border-0">
                <span className="font-body text-vintage-ink">
                  {translateIngredient(ing.name)}
                  <span className="text-xs text-vintage-gold/60 ml-1">{ing.name}</span>
                </span>
                {ing.measure && (
                  <span className="font-script text-vintage-gold text-sm">{ing.measure}</span>
                )}
                <button
                  onClick={() => addToShoppingList(ing.name, '', drink.strDrink)}
                  className="text-xs text-vintage-gold/50 hover:text-vintage-accent ml-2"
                  title="加入采购清单"
                >
                  ➕
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Instructions — now step-by-step */}
        <div className="card-vintage p-6">
          <h2 className="font-heading text-xl text-vintage-ink border-b border-vintage-gold/30 pb-2 mb-4">
            📝 制作步骤
          </h2>
          {steps.length > 0 ? (
            <ol className="space-y-5">
              {steps.map((step, i) => (
                <li key={i} className="flex gap-3">
                  <span className="shrink-0 text-xl mt-0.5">{STEP_ICONS[i] || '🔸'}</span>
                  <div className="flex-1">
                    {step.hint && (
                      <p className="text-xs text-vintage-accent font-body mb-1">{step.hint}</p>
                    )}
                    <p className="font-body text-vintage-ink leading-relaxed">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          ) : (
            <p className="font-body text-vintage-ink leading-relaxed whitespace-pre-line">
              {drink.strInstructions || '暂无制作步骤'}
            </p>
          )}

          {/* Original English instructions as reference */}
          {steps.length > 0 && (
            <details className="mt-6 pt-4 border-t border-vintage-gold/20">
              <summary className="text-xs text-vintage-gold/60 cursor-pointer font-body hover:text-vintage-gold">
                查看英文原文
              </summary>
              <p className="mt-2 text-sm text-vintage-gold/70 font-body leading-relaxed whitespace-pre-line">
                {drink.strInstructions}
              </p>
            </details>
          )}

          {drink.strInstructionsZH && (
            <div className="mt-4 pt-4 border-t border-vintage-gold/20">
              <p className="text-sm text-vintage-gold/70 mb-1">📖 中文参考：</p>
              <p className="font-body text-vintage-ink leading-relaxed">
                {drink.strInstructionsZH}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Extra info bar */}
      {(drink.strTags || drink.strIBA) && (
        <div className="card-vintage p-4 mb-6">
          <div className="flex flex-wrap gap-4 text-sm font-body">
            {drink.strTags && (
              <div>
                <span className="text-vintage-gold/60">🏷️ 标签：</span>
                <span className="text-vintage-ink">{drink.strTags.split(',').join('、')}</span>
              </div>
            )}
            {drink.strIBA && (
              <div>
                <span className="text-vintage-gold/60">🏆 IBA分类：</span>
                <span className="text-vintage-ink">{drink.strIBA}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
