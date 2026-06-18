import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useStore = create(
  persist(
    (set, get) => ({
      // Favorites
      favorites: [],

      toggleFavorite: (idDrink) => {
        const { favorites } = get()
        if (favorites.includes(idDrink)) {
          set({ favorites: favorites.filter(id => id !== idDrink) })
        } else {
          set({ favorites: [...favorites, idDrink] })
        }
      },

      isFavorite: (idDrink) => get().favorites.includes(idDrink),

      // Selected ingredients for filtering
      selectedIngredients: [],

      toggleIngredient: (name) => {
        const { selectedIngredients } = get()
        if (selectedIngredients.includes(name)) {
          set({ selectedIngredients: selectedIngredients.filter(i => i !== name) })
        } else {
          set({ selectedIngredients: [...selectedIngredients, name] })
        }
      },

      clearIngredients: () => set({ selectedIngredients: [] }),

      // Shopping list
      shoppingList: [],

      addToShoppingList: (name, category, drinkName) => {
        const { shoppingList } = get()
        const existing = shoppingList.find(item => item.name === name)
        if (existing) {
          if (!existing.relatedDrinks.includes(drinkName)) {
            set({
              shoppingList: shoppingList.map(item =>
                item.name === name
                  ? { ...item, relatedDrinks: [...item.relatedDrinks, drinkName] }
                  : item
              ),
            })
          }
        } else {
          set({
            shoppingList: [...shoppingList, { name, category, relatedDrinks: [drinkName] }],
          })
        }
      },

      removeFromShoppingList: (name) => {
        set({ shoppingList: get().shoppingList.filter(item => item.name !== name) })
      },

      clearShoppingList: () => set({ shoppingList: [] }),

      // View mode for filter
      viewMode: 'strict', // 'strict' | 'loose'
      setViewMode: (mode) => set({ viewMode: mode }),
    }),
    {
      name: 'cocktail-store',
      partialize: (state) => ({
        favorites: state.favorites,
        shoppingList: state.shoppingList,
      }),
    }
  )
)
