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

// Instruction phrase translations (English phrase → Chinese)
const PHRASE_MAP = [
  // Shaking & mixing
  [/shake\s*(all\s*)?(ingredients|well|vigorously|together)?\s*(with\s*)?(ice\s*cubes?)?/gi, '将所有材料加冰倒入摇酒壶，用力摇匀'],
  [/stir(red)?\s*(well|gently|together)?\s*(with\s*ice)?/gi, '用吧勺轻轻搅拌融合'],
  [/muddle\s*(the\s*)?([a-z\s]+?)(\s*in|with|together)/gi, '在杯底将$2捣碎，释放香气'],
  [/blend\s*(all\s*)?(ingredients|together)?\s*(with\s*ice)?/gi, '将所有材料与冰块一起放入搅拌机打匀'],

  // Pouring & building
  [/pour\s*(the\s*)?([a-z\s]+?)\s*(into|over)/gi, '将$2倒入杯中'],
  [/fill\s*the\s*glass\s*with\s*ice/gi, '在杯中加满冰块'],
  [/fill\s*(a\s*)?([a-z\s]*glass)\s*with\s*(ice\s*cubes?)/gi, '在$2中加入冰块'],
  [/top\s*(it\s*)?(up\s*)?(off\s*)?\s*with\s*([a-z\s]+)/gi, '顶部缓缓注入$4'],
  [/add\s*(the\s*)?([a-z\s]+?)(\s*and|,|\s*to\s*)/gi, '加入$2'],
  [/combine\s*(the\s*)?([a-z\s]+?)(\s*in|with|and)/gi, '将$2与其他材料混合'],

  // Straining & serving
  [/strain\s*(into|the\s*mixture)?\s*(into\s*)?([a-z\s]*glass)/gi, '通过滤网倒入$3中'],
  [/double[\s-]?strain/gi, '用双重滤网过滤'],
  [/fine[\s-]?strain/gi, '用细网过滤'],
  [/serve\s*(immediately|right\s*away|chilled)?/gi, '立即享用'],
  [/serve\s*in\s*a\s*([a-z\s]*glass)/gi, '用$1盛装呈上'],

  // Garnishes
  [/garnish\s*with\s*(a\s*|an\s*)?([a-z\s,]+)(\.|$)/gi, '用$2作为装饰点缀'],
  [/twist\s*of\s*([a-z]+)(\s*peel)?/gi, '扭一片$1皮'],
  [/squeeze\s*(a\s*|the\s*)?([a-z]+)(\s*wedge|\s*slice)?/gi, '挤入新鲜$2汁'],
  [/rim\s*of\s*the\s*glass\s*with\s*([a-z\s]+)/gi, '用$1擦拭杯口边缘'],
  [/coat\s*the\s*rim\s*with\s*([a-z]+)/gi, '杯口沾上一圈$1'],

  // Preparation
  [/chill\s*(a\s*|the\s*)?([a-z\s]*glass)/gi, '将$2放入冰箱冰镇'],
  [/moisten\s*(the\s*)?([a-z\s]+)/gi, '将$2微微湿润'],
  [/rub\s*the\s*([a-z]+)/gi, '用$1轻轻擦拭'],
  [/almost\s*fill(ed)?\s*with\s*ice/gi, '杯中装八分满冰块'],
  [/half[\s-]?fill(ed)?\s*with\s*ice/gi, '杯中装半满冰块'],

  // Common actions
  [/dissolve\s*([a-z\s]+?)\s*in\s*/gi, '将$1溶入'],
  [/prepare\s*all\s*(the\s*)?ingredients/gi, '将所有材料准备就绪'],
  [/roll\s*the\s*([a-z]+)/gi, '将$1轻轻滚动'],
  [/swirl\s*(the\s*)?glass/gi, '旋转杯子使其均匀附着'],
  [/float\s*([a-z\s]+)\s*on\s*top/gi, '在顶部小心漂浮一层$1'],
]

// Translate a full English instruction text to Chinese
export function translateInstructions(englishText) {
  if (!englishText) return '暂无制作步骤'

  let text = englishText
    .replace(/\\r\\n/g, '\n')
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '\n')
    .replace(/\s+/g, ' ')
    .trim()

  // Apply phrase translations
  for (const [pattern, replacement] of PHRASE_MAP) {
    text = text.replace(pattern, replacement)
  }

  return text
}

// Step keyword detection for icons
const STEP_KEYWORDS = [
  { en: /\b(rub|moisten|coat)\b.*?\b(rim|glass)\b/i, zh: '杯口处理' },
  { en: /\bshak(e|ing|en)\b/i, zh: '🧊 摇匀' },
  { en: /\bstir(red|ring)?\b/i, zh: '🥄 搅拌' },
  { en: /\b(pour|fill|add|combine)\b/i, zh: '🍹 倒入' },
  { en: /\bstrain\b/i, zh: '🫗 过滤' },
  { en: /\bgarnish\b/i, zh: '🍋 装饰' },
  { en: /\bmuddl(e|ing)\b/i, zh: '🔨 捣碎' },
  { en: /\bblend(er|ing)?\b/i, zh: '🔄 搅打' },
  { en: /\bsqueez(e|ing)\b/i, zh: '🤏 挤汁' },
  { en: /\bchill(ed)?\b/i, zh: '❄️ 冰镇' },
  { en: /\b(top|float)\b.*?\b(with|on)\b/i, zh: '⬆️ 注满' },
  { en: /\b(serve|enjoy|ready)\b/i, zh: '✨ 享用' },
]

export function parseInstructions(raw) {
  if (!raw) return []

  const text = raw
    .replace(/\\r\\n/g, '\n')
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '\n')
    .trim()

  const sentences = text
    .split(/\n+/)
    .map(s => s.trim())
    .filter(s => s.length > 5)

  if (sentences.length <= 1) {
    const periodSplit = text
      .split(/\.\s+/)
      .map(s => s.trim())
      .filter(s => s.length > 5)
      .map(s => s.endsWith('.') ? s : s + '.')
    if (periodSplit.length > 1) return periodSplit.map(s => ({ text: s, hint: '' }))
  }

  return sentences.map(sentence => {
    let hint = ''
    for (const kw of STEP_KEYWORDS) {
      if (kw.en.test(sentence)) { hint = kw.zh; break }
    }
    const clean = sentence.endsWith('.') ? sentence : sentence + '.'
    return { text: clean, hint }
  })
}

// Find ingredients mentioned in a step
export function findIngredientsInStep(stepText, ingredients) {
  if (!stepText || !ingredients) return []
  return ingredients.filter(ing => {
    const name = ing.name.toLowerCase()
    // Check if the ingredient name or key parts of it appear in the step
    return stepText.toLowerCase().includes(name) ||
      name.split(' ').some(part => part.length > 2 && stepText.toLowerCase().includes(part))
  })
}

// ─── Cocktail Story Generator ───

const STORY_TEMPLATES = {
  classic: [
    '这款经典的{cname}诞生于上世纪初的酒吧黄金年代。传说一位调酒师在{location}，受{inspiration}启发，创造出了这杯传世之作。',
    '{cname}的历史可以追溯到禁酒令时期。当时，为了掩盖劣质酒的辛辣口感，调酒师们开始加入{ingredient}，意外地调配出了这杯美味。',
    '在上世纪{decade}年代的{location}，{cname}是社交名流们的最爱。它简约而不简单的配方，完美诠释了"少即是多"的调酒哲学。',
  ],
  tropical: [
    '想象你正躺在加勒比海的白沙滩上，手中握着这杯{cname}。热带水果的甜美与{ingredient}的醇厚在口中交织，仿佛海风拂面。',
    '{cname}是热带度假的完美伴侣。它融合了多种热带水果的鲜甜，搭配{ingredient}的独特风味，每一口都是对夏日的最好致敬。',
  ],
  refreshing: [
    '炎炎夏日，没有什么比一杯冰凉的{cname}更能消暑解渴了。清爽的{ingredient}在舌尖跳跃，带来瞬间的清凉与畅快。',
    '这是一杯会呼吸的鸡尾酒——{cname}的每一口都充满了新鲜的活力。{ingredient}与冰块的碰撞，奏响了夏日最美妙的乐章。',
    '在闷热的午后，调一杯{cname}吧。当冰凉的液体滑过喉咙，整个人都仿佛被唤醒——这就是简单纯粹的美好。',
  ],
  strong: [
    '这不是一杯柔弱的酒——{cname}生来就带着浓烈的个性。{ingredient}的强劲基底，让它在众多鸡尾酒中脱颖而出。',
    '喜欢烈酒的人，一定不能错过{cname}。它不遮掩酒精的力量，而是用{ingredient}将这种力量打磨得更加优雅深邃。',
  ],
  elegant: [
    '{cname}如同一位身着晚礼服的绅士，优雅而克制。用{glass}盛装，轻轻摇晃，{ingredient}的芬芳在空气中徐徐展开。',
    '在高级鸡尾酒吧里，{cname}是永恒的经典之选。它精致的口感和优雅的呈现，让每一次品尝都成为一次仪式。',
    '有人说，{cname}是鸡尾酒中的"小黑裙"——永远不会过时。它用最简单的配方，诉说着最动人的故事。',
  ],
  party: [
    '派对前，先来一杯{cname}热热身！欢快的气泡和{ingredient}的甜美，瞬间点燃整个夜晚的气氛。',
    '{cname}天生属于派对。它色彩缤纷、口感活泼，是聚会上最受欢迎的明星鸡尾酒。',
  ],
}

// Category → story style mapping
const CATEGORY_STYLE = {
  'Ordinary Drink': 'classic',
  'Cocktail': 'classic',
  'Cocoa': 'strong',
  'Shot': 'party',
  'Coffee / Tea': 'strong',
  'Punch / Party Drink': 'party',
  'Beer': 'refreshing',
  'Soft Drink': 'refreshing',
  'Homemade Liqueur': 'elegant',
}

const LOCATIONS = ['纽约的华尔道夫酒店', '伦敦的萨沃伊酒店', '巴黎的丽兹酒店', '哈瓦那的老城区酒吧', '新奥尔良的法国区', '旧金山的码头酒吧', '芝加哥的地下酒馆', '墨西哥的海滨酒馆']
const INSPIRATIONS = ['一位水手的航海故事', '当地新鲜的水果', '偶然的配方失误', '客人的特别请求', '对祖母配方的改良', '一场调酒比赛的灵感']

export function generateCocktailStory(drink, ingredients) {
  const cnName = translateDrinkName(drink.strDrink)
  const glass = drink.strGlass ? translateGlass(drink.strGlass) : '精美的杯子'
  const category = drink.strCategory || 'Cocktail'
  const style = CATEGORY_STYLE[category] || 'classic'
  const templates = STORY_TEMPLATES[style] || STORY_TEMPLATES.classic

  // Pick a random template for variety
  const hash = drink.idDrink ? parseInt(drink.idDrink) % templates.length : 0
  const template = templates[hash]

  // Pick a random ingredient for the story
  const ingIdx = Math.abs(hash * 7) % ingredients.length
  const featuredIng = ingredients[ingIdx]
    ? translateIngredient(ingredients[ingIdx].name)
    : '基酒'

  const location = LOCATIONS[hash % LOCATIONS.length]
  const inspiration = INSPIRATIONS[(hash * 3) % INSPIRATIONS.length]
  const decade = ['20', '30', '40', '50', '60', '70', '80'][hash % 7]

  return template
    .replace(/{cname}/g, cnName)
    .replace(/{glass}/g, glass)
    .replace(/{ingredient}/g, featuredIng)
    .replace(/{location}/g, location)
    .replace(/{inspiration}/g, inspiration)
    .replace(/{decade}/g, decade)
}

// Add a second story variant for more variety
export function generateStorySubtitle(drink) {
  const cnName = translateDrinkName(drink.strDrink)
  const glass = drink.strGlass ? translateGlass(drink.strGlass) : '杯'

  const subtitles = [
    `每一杯${cnName}都是一段故事，用${glass}盛装的不仅仅是酒，更是一份心情。`,
    `经典的配方，永恒的味道——${cnName}用最真诚的方式诠释了调酒的艺术。`,
    `${glass}中摇曳的，是调酒师的心意与岁月的沉淀。`,
    `不需要太多言语，一杯${cnName}就足以表达所有。`,
    `在这个快节奏的时代，${cnName}提醒我们慢下来，细细品味。`,
  ]

  const idx = drink.idDrink ? parseInt(drink.idDrink) % subtitles.length : 0
  return subtitles[idx]
}
