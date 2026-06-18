import { useQuery } from '@tanstack/react-query'
import { cocktailApi } from '../api/cocktailApi'

export function useSearchCocktails(name) {
  return useQuery({
    queryKey: ['search', name],
    queryFn: () => cocktailApi.searchByName(name),
    staleTime: 5 * 60 * 1000,
    enabled: !!name && name.length >= 2,
  })
}

export function useCocktailDetail(id) {
  return useQuery({
    queryKey: ['drink', id],
    queryFn: () => cocktailApi.lookupById(id),
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
  })
}

export function useFilterByIngredients(ingredients) {
  return useQuery({
    queryKey: ['filter', ...[...ingredients].sort()],
    queryFn: () => cocktailApi.filterByIngredients(ingredients),
    staleTime: 5 * 60 * 1000,
    enabled: ingredients.length > 0,
  })
}

export function useCategoryDrinks(ingredient) {
  return useQuery({
    queryKey: ['search', ingredient],
    queryFn: () => cocktailApi.searchByName(ingredient),
    staleTime: 5 * 60 * 1000,
    enabled: !!ingredient,
  })
}

export function useRandomDrinks(count = 4) {
  return useQuery({
    queryKey: ['random', count],
    queryFn: () => cocktailApi.getMultipleRandom(count),
    staleTime: 0, // Always get fresh random drinks
  })
}

function getIngredientNames(drink) {
  const names = []
  for (let i = 1; i <= 15; i++) {
    const name = drink[`strIngredient${i}`]
    if (name && name.trim()) names.push(name.trim())
  }
  return names
}

export function useEnrichedFilterResults(drinks, selectedIngredients) {
  return useQuery({
    queryKey: ['enrich', drinks?.map(d => d.idDrink) || [], ...selectedIngredients.sort()],
    queryFn: async () => {
      if (!drinks?.length) return []
      const fullDrinks = await Promise.all(
        drinks.map(d => cocktailApi.lookupById(d.idDrink))
      )
      return fullDrinks.filter(Boolean).map(drink => {
        const drinkIngredients = getIngredientNames(drink)
        const matched = drinkIngredients.filter(ing =>
          selectedIngredients.some(sel => sel.toLowerCase() === ing.toLowerCase())
        )
        const total = drinkIngredients.length
        const matchedCount = matched.length
        const missingIngredients = drinkIngredients.filter(ing =>
          !selectedIngredients.some(sel => sel.toLowerCase() === ing.toLowerCase())
        )
        return {
          ...drink,
          matchedCount,
          totalCount: total,
          matchPercent: total > 0 ? Math.round((matchedCount / total) * 100) : 0,
          matchedIngredients: matched,
          missingIngredients,
        }
      })
    },
    enabled: !!drinks?.length && selectedIngredients.length > 0,
    staleTime: 5 * 60 * 1000,
  })
}
