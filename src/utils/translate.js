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

// Parse raw English instructions into numbered steps, and add Chinese hints
const STEP_KEYWORDS = [
  { en: /\b(rub|moisten|coat)\b.*?\b(rim|glass)\b/i, zh: '杯口处理：用柠檬片擦拭杯口边缘' },
  { en: /\bshak(e|ing|en)\b.*?\b(ice|with)\b/i, zh: '🧊 加冰摇匀' },
  { en: /\bstir(red|ring)?\b.*?\b(ice|glass|well)\b/i, zh: '🥄 加冰搅拌' },
  { en: /\b(pour|add|combine)\b.*?\b(glass|shaker|blender)\b/i, zh: '🍹 倒入杯中' },
  { en: /\bstrain\b/i, zh: '🫗 过滤倒入' },
  { en: /\bgarnish\b.*?\b(with|slice|wedge|twist|cherry|lemon|lime|orange|mint|olive)\b/i, zh: '🍋 装饰点缀' },
  { en: /\bmuddl(e|ing)\b/i, zh: '🔨 捣碎材料' },
  { en: /\bblend(er|ing)?\b/i, zh: '🔄 搅拌机混合' },
  { en: /\btop\b.*?\b(with|off)\b/i, zh: '⬆️ 顶部注满' },
  { en: /\bsqueez(e|ing)\b/i, zh: '🤏 挤入果汁' },
  { en: /\bchill(ed)?\b.*?\b(glass|serv)\b/i, zh: '❄️ 冰镇杯子' },
  { en: /\bfill\b.*?\b(ice|glass)\b/i, zh: '🧊 杯中加冰' },
  { en: /\bserv(e|ing)\b/i, zh: '✨ 完成，享用' },
]

export function parseInstructions(raw) {
  if (!raw) return []

  // Clean up the raw text
  let text = raw
    .replace(/\\r\\n/g, '\n')
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '\n')
    .replace(/\. /g, '.\n')
    .trim()

  // Split into sentences/steps
  const sentences = text
    .split(/\n+/)
    .map(s => s.trim())
    .filter(s => s.length > 5)

  // If we have too few steps, try splitting by periods
  if (sentences.length <= 1) {
    const periodSplit = text
      .split(/\.\s+/)
      .map(s => s.trim() + '.')
      .filter(s => s.length > 5)
    if (periodSplit.length > 1) return periodSplit.map(s => ({ text: s, hint: '' }))
  }

  return sentences.map(sentence => {
    // Find matching Chinese hint
    let hint = ''
    for (const kw of STEP_KEYWORDS) {
      if (kw.en.test(sentence)) {
        hint = kw.zh
        break
      }
    }
    // Ensure sentence ends with proper punctuation
    const text = sentence.endsWith('.') ? sentence : sentence + '.'
    return { text, hint }
  })
}

// Format instructions into a readable Chinese-enhanced version
export function enhanceInstructions(raw) {
  const steps = parseInstructions(raw)
  if (!steps.length) return '暂无制作步骤'

  return steps
    .map((step, i) => {
      const num = i + 1
      const prefix = step.hint ? step.hint + '\n' : ''
      return `第${num}步：\n${prefix}${step.text}`
    })
    .join('\n\n')
}
