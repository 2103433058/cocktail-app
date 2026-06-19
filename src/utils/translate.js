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

// ─── Intelligent Chinese instruction generator ───
// Instead of regex-translating English (poor quality),
// we detect the cocktail method and generate natural Chinese from the data.

function detectMethod(instructions) {
  if (!instructions) return 'build'
  const t = instructions.toLowerCase()
  if (t.includes('shake') || t.includes('shaker')) return 'shake'
  if (t.includes('stir')) return 'stir'
  if (t.includes('blender') || t.includes('blend')) return 'blend'
  if (t.includes('muddle')) return 'muddle'
  if (t.includes('build') || t.includes('pour directly')) return 'build'
  return 'build'
}

function detectGlassPrep(instructions) {
  if (!instructions) return null
  const t = instructions.toLowerCase()
  if (t.includes('chill') && t.includes('glass')) return 'chill'
  if (t.includes('rub') && t.includes('rim')) return 'salt-rim'
  if (t.includes('coat') && t.includes('rim')) return 'sugar-rim'
  if (t.includes('moisten') && t.includes('rim')) return 'moisten-rim'
  return null
}

function findGarnish(instructions, ingredients) {
  if (!instructions) return null
  const t = instructions.toLowerCase()
  const garnishWords = ['lemon', 'lime', 'orange', 'cherry', 'mint', 'olive', 'pineapple', 'strawberry', 'basil', 'rosemary', 'cucumber', 'apple']
  for (const gw of garnishWords) {
    if (t.includes(gw) && (t.includes('garnish') || t.includes('twist') || t.includes('slice') || t.includes('wedge') || t.includes('sprig') || t.includes('wheel') || t.includes('peel'))) {
      const match = ingredients.find(i => i.name.toLowerCase().includes(gw))
      return match ? match.name : gw
    }
  }
  return null
}

function pickMainSpirit(ingredients) {
  const spirits = ['Vodka', 'Gin', 'Rum', 'Tequila', 'Whiskey', 'Bourbon', 'Scotch', 'Brandy', 'Cognac', 'White Rum', 'Dark Rum', 'Light Rum', 'Spiced Rum']
  for (const s of spirits) {
    const found = ingredients.find(i => i.name.toLowerCase() === s.toLowerCase())
    if (found) return found.name
  }
  return ingredients[0]?.name || '基酒'
}

function pickMixers(ingredients) {
  const mixers = ['Lime Juice', 'Lemon Juice', 'Orange Juice', 'Pineapple Juice', 'Cranberry Juice', 'Grapefruit Juice', 'Simple Syrup', 'Sugar Syrup', 'Grenadine', 'Soda Water', 'Tonic Water', 'Coca-Cola', 'Ginger Beer', 'Ginger Ale', 'Cream', 'Egg White', 'Honey', 'Triple Sec', 'Cointreau', 'Blue Curacao', 'Sweet Vermouth', 'Dry Vermouth', 'Campari', 'Angostura Bitters', 'Orange Bitters']
  return ingredients.filter(i => mixers.some(m => m.toLowerCase() === i.name.toLowerCase()))
}

export function translateInstructions(englishText, ingredients = []) {
  if (!englishText) return []

  const method = detectMethod(englishText)
  const glassPrep = detectGlassPrep(englishText)
  const garnish = findGarnish(englishText, ingredients)
  const mainSpirit = pickMainSpirit(ingredients)
  const mixers = pickMixers(ingredients)
  const mixerNames = mixers.map(i => translateIngredient(i.name))

  const steps = []

  // Step 1: Glass preparation
  if (glassPrep === 'chill') {
    steps.push('将杯子放入冰箱冷藏片刻，或加冰预冷后倒掉冰水。冰镇过的杯子能让鸡尾酒保持最佳口感。')
  } else if (glassPrep === 'salt-rim') {
    steps.push('用柠檬角沿杯口边缘擦拭一圈，然后将杯口倒扣在盐盘中旋转，让杯口均匀沾上一层细盐。')
  } else if (glassPrep === 'sugar-rim') {
    steps.push('用柠檬角沿杯口边缘擦拭一圈，然后将杯口倒扣在糖盘中旋转，让杯口均匀沾上一层糖粒。')
  } else if (glassPrep === 'moisten-rim') {
    steps.push('用柠檬片轻轻擦拭杯口边缘，使其微微湿润即可。')
  } else {
    steps.push('准备一只干净的酒杯，放入适量冰块预冷备用。')
  }

  // Step 2: Mixing method
  if (method === 'shake') {
    const ingList = [translateIngredient(mainSpirit), ...mixerNames].filter(Boolean).join('、')
    steps.push(`在摇酒壶中加入适量冰块，依次倒入${ingList}。盖紧壶盖，双手握住摇酒壶，用力上下摇动约15-20秒，直到壶身表面结起一层白霜。`)
    steps.push('打开摇酒壶，用滤网（Hawthorne Strainer）将混合液过滤倒入准备好的杯中。')
  } else if (method === 'stir') {
    const ingList = [translateIngredient(mainSpirit), ...mixerNames].filter(Boolean).join('、')
    steps.push(`在调酒杯（Mixing Glass）中加入大量冰块，依次倒入${ingList}。用吧勺贴杯壁缓缓搅拌约30秒，使材料充分融合并降温稀释。`)
    steps.push('用滤网（Julep Strainer）将酒液过滤倒入准备好的杯中。')
  } else if (method === 'blend') {
    const ingList = [translateIngredient(mainSpirit), ...mixerNames].filter(Boolean).join('、')
    steps.push(`在搅拌机中加入适量碎冰，然后倒入${ingList}。启动搅拌机，高速搅打约10-15秒，直到混合物呈现顺滑的泥状质地。`)
    steps.push('将打好的混合物倒入杯中，无需过滤。')
  } else if (method === 'muddle') {
    const ingList = [translateIngredient(mainSpirit), ...mixerNames].filter(Boolean).join('、')
    steps.push('在杯底放入需要捣碎的新鲜材料（如薄荷叶、柠檬角、方糖等），用捣棒轻轻按压旋转几次，释放香气和汁液。注意不要过度捣碎，以免产生苦味。')
    steps.push(`加入冰块，然后倒入${ingList}，用吧勺轻轻搅拌使所有材料融合。`)
  } else {
    // build method
    const ingList = [translateIngredient(mainSpirit), ...mixerNames].filter(Boolean).join('、')
    steps.push(`在杯中加满冰块，依次倒入${ingList}。用吧勺轻轻搅拌几下，让各种材料在杯中自然融合。`)
  }

  // Step 3: Carbonation / topping
  const t = englishText.toLowerCase()
  if (t.includes('top') && (t.includes('soda') || t.includes('tonic') || t.includes('carbonated') || t.includes('ginger') || t.includes('champagne') || t.includes('prosecco') || t.includes('cola'))) {
    steps.push('最后，沿杯壁缓缓注入气泡饮料，轻轻用吧勺提拉一下使气泡均匀分布。不要过度搅拌，以免气泡散失。')
  }

  // Step 4: Garnish
  if (garnish) {
    const gName = translateIngredient(garnish)
    steps.push(`最后进行装饰：取${gName}，精心摆放在杯口或酒液表面。一杯精致的鸡尾酒就此完成，请立即享用。`)
  } else {
    steps.push('一杯精心调制的鸡尾酒就此完成。趁着冰凉，慢慢品味吧。')
  }

  return steps.map((text, i) => `${i + 1}、${text}`)
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
