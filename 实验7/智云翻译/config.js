export default {
  youdao: {
    appKey: '322ed9d76c115d58',
    appSecret: 'RDi1tcCgT1ElYcCHKJawGw6OPNB2a390',
    apiUrl: 'https://openapi.youdao.com/api',
    langList: [
      { code: 'auto', name: '自动检测' },
      { code: 'zh-CHS', name: '中文' },
      { code: 'en', name: '英语' },
      { code: 'ja', name: '日语' },
      { code: 'ko', name: '韩语' }
    ]
  },
  storage: {
    historyKey: 'translation_history',
    favoriteKey: 'favorite_translations',
    themeKey: 'app_theme',
    maxHistoryCount: 100
  }
}
