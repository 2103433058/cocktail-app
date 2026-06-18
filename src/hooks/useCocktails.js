import { useQuery } from '@tanstack/react-query'
import { cocktailApi } from '../api/cocktailApi'

export function useSearchCocktails(name) {
  return useQuery({
    queryKey: ['search', name],
    queryFn: () => cocktailApi.searchByName(name),
    enabled: !!name && name.length >= 2,
  })
}

export function useCocktailDetail(id) {
  return useQuery({
    queryKey: ['drink', id],
    queryFn: () => cocktailApi.lookupById(id),
    enabled: !!id,
  })
}

export function useFilterByIngredients(ingredients) {
  return useQuery({
    queryKey: ['filter', ...ingredients.sort()],
    queryFn: () => cocktailApi.filterByIngredients(ingredients),
    enabled: ingredients.length > 0,
  })
}

export function useCategoryDrinks(category) {
  return useQuery({
    queryKey: ['category', category],
    queryFn: () => cocktailApi.filterByCategory(category),
    enabled: !!category,
  })
}

export function useRandomDrinks(count = 4) {
  return useQuery({
    queryKey: ['random', count],
    queryFn: () => cocktailApi.getMultipleRandom(count),
    staleTime: 0, // Always get fresh random drinks
  })
}
