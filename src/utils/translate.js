import zh from '../data/zhTranslations.json'

export function translateDrinkName(en) {
  return zh.drinks[en] || en
}

export function translateIngredient(en) {
  return zh.ingredients[en] || en
}

export function translateCategory(en) {
  return zh.categories[en] || en
}

export function translateGlass(en) {
  return zh.glasses[en] || en
}
