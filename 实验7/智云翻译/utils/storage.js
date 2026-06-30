import config from '../config.js'

const storageConfig = config.storage

export function getHistory() {
  try {
    const data = uni.getStorageSync(storageConfig.historyKey)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export function saveToHistory(item) {
  const history = getHistory()
  const newItem = {
    ...item,
    id: Date.now().toString(),
    timestamp: Date.now()
  }
  
  const existIndex = history.findIndex(
    h => h.sourceText === item.sourceText && h.targetLang === item.targetLang
  )
  
  if (existIndex !== -1) {
    history.splice(existIndex, 1)
  }
  
  history.unshift(newItem)
  
  if (history.length > storageConfig.maxHistoryCount) {
    history.pop()
  }
  
  uni.setStorageSync(storageConfig.historyKey, JSON.stringify(history))
}

export function deleteFromHistory(id) {
  const history = getHistory()
  const newHistory = history.filter(h => h.id !== id)
  uni.setStorageSync(storageConfig.historyKey, JSON.stringify(newHistory))
}

export function clearHistory() {
  uni.removeStorageSync(storageConfig.historyKey)
}

export function getFavorites() {
  try {
    const data = uni.getStorageSync(storageConfig.favoriteKey)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export function addToFavorites(item) {
  const favorites = getFavorites()
  const existIndex = favorites.findIndex(f => f.id === item.id)
  
  if (existIndex === -1) {
    favorites.unshift({ ...item, isFavorite: true })
    uni.setStorageSync(storageConfig.favoriteKey, JSON.stringify(favorites))
    return true
  }
  return false
}

export function removeFromFavorites(id) {
  const favorites = getFavorites()
  const newFavorites = favorites.filter(f => f.id !== id)
  uni.setStorageSync(storageConfig.favoriteKey, JSON.stringify(newFavorites))
  
  const history = getHistory()
  history.forEach(h => {
    if (h.id === id) {
      h.isFavorite = false
    }
  })
  uni.setStorageSync(storageConfig.historyKey, JSON.stringify(history))
}

export function isFavorite(id) {
  const favorites = getFavorites()
  return favorites.some(f => f.id === id)
}

export function getTheme() {
  try {
    return uni.getStorageSync(storageConfig.themeKey) || 'light'
  } catch {
    return 'light'
  }
}

export function setTheme(theme) {
  uni.setStorageSync(storageConfig.themeKey, theme)
}

export function clearAllCache() {
  clearHistory()
  uni.removeStorageSync(storageConfig.favoriteKey)
}
