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

export function useCategoryDrinks(category) {
  return useQuery({
    queryKey: ['category', category],
    queryFn: () => cocktailApi.filterByCategory(category),
    staleTime: 5 * 60 * 1000,
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
