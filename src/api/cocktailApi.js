const BASE = 'https://www.thecocktaildb.com/api/json/v1/1'

async function fetchJSON(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error('API请求失败')
  return res.json()
}

export const cocktailApi = {
  async searchByName(name) {
    const data = await fetchJSON(`${BASE}/search.php?s=${encodeURIComponent(name)}`)
    return data.drinks || []
  },

  async lookupById(id) {
    const data = await fetchJSON(`${BASE}/lookup.php?i=${encodeURIComponent(id)}`)
    return data.drinks ? data.drinks[0] : null
  },

  async filterByIngredients(ingredients) {
    if (!ingredients.length) return []
    const results = await Promise.all(
      ingredients.map(ing =>
        fetchJSON(`${BASE}/filter.php?i=${encodeURIComponent(ing)}`)
          .then(d => d.drinks || [])
      )
    )
    // Intersection: drinks that appear in ALL ingredient results
    const [first, ...rest] = results
    if (!first) return []
    const firstIds = new Set(first.map(d => d.idDrink))
    for (const arr of rest) {
      const ids = new Set(arr.map(d => d.idDrink))
      for (const id of firstIds) {
        if (!ids.has(id)) firstIds.delete(id)
      }
    }
    return first.filter(d => firstIds.has(d.idDrink))
  },

  async filterByCategory(category) {
    const data = await fetchJSON(`${BASE}/filter.php?c=${encodeURIComponent(category)}`)
    return data.drinks || []
  },

  async getRandom() {
    const data = await fetchJSON(`${BASE}/random.php`)
    return data.drinks ? data.drinks[0] : null
  },

  async getMultipleRandom(count = 4) {
    const promises = Array.from({ length: count }, () =>
      fetchJSON(`${BASE}/random.php`).then(d => d.drinks?.[0])
    )
    const results = await Promise.all(promises)
    // Deduplicate by id
    const seen = new Set()
    return results.filter(d => {
      if (!d || seen.has(d.idDrink)) return false
      seen.add(d.idDrink)
      return true
    })
  },
}
