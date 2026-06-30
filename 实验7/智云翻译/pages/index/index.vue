<template>
  <view class="page-container">
    <view class="header">
      <text class="title">智云翻译</text>
      <view class="header-actions">
        <view class="action-btn" @click="goToHistory">
          <text>📜</text>
        </view>
        <view class="action-btn" @click="goToSetting">
          <text>⚙️</text>
        </view>
      </view>
    </view>

    <view class="main-content">
      <view class="input-section">
        <view class="language-row">
          <picker :value="fromLangIndex" :range="languageNames" @change="onFromLangChange">
            <view class="lang-picker">
              <text class="lang-text">{{ languageNames[fromLangIndex] }}</text>
              <text class="arrow">▼</text>
            </view>
          </picker>
          <view class="swap-btn" @click="swapLanguages">
            <text>↔️</text>
          </view>
          <picker :value="toLangIndex" :range="languageNames" @change="onToLangChange">
            <view class="lang-picker">
              <text class="lang-text">{{ languageNames[toLangIndex] }}</text>
              <text class="arrow">▼</text>
            </view>
          </picker>
        </view>

        <textarea
          class="input-textarea"
          placeholder="请输入要翻译的文本..."
          :maxlength="5000"
          @input="onInputChange"
          :value="inputText"
          :adjust-position="true"
          :show-confirm-bar="false"
        />
        <view class="input-footer">
          <text class="char-count">{{ inputText.length }}/5000</text>
        </view>
      </view>

      <button 
        class="translate-btn" 
        @tap="handleTranslate" 
        :disabled="!inputText.trim() || isLoading"
        :loading="isLoading"
      >
        <text>{{ isLoading ? '翻译中...' : '翻译' }}</text>
      </button>

      <view class="result-section" v-if="translatedText">
        <view class="result-header">
          <text class="result-label">翻译结果</text>
          <view class="result-actions">
            <view class="result-action-btn" @click="copyResult">
              <text>📋</text>
            </view>
            <view class="result-action-btn" @click="speakResult">
              <text>🔊</text>
            </view>
            <view 
              class="result-action-btn favorite-btn" 
              :class="{ active: isCurrentFavorite }"
              @click="toggleFavorite"
            >
              <text>{{ isCurrentFavorite ? '⭐' : '☆' }}</text>
            </view>
          </view>
        </view>
        <view class="result-text">{{ translatedText }}</view>
        <view class="phonetic" v-if="phonetic">音标: {{ phonetic }}</view>
      </view>

      <view class="error-section" v-if="errorMessage">
        <view class="error-content">
          <text class="error-icon">❌</text>
          <text class="error-text">{{ errorMessage }}</text>
          <view class="error-actions" v-if="errorCode">
            <text class="error-code">错误码: {{ errorCode }}</text>
            <text class="error-tip" v-if="errorCode === '201'">请检查API密钥是否正确配置</text>
            <text class="error-tip" v-if="errorCode === '110'">请确认已开通文本翻译服务</text>
            <text class="error-tip" v-if="errorCode === 'NETWORK_ERROR'">请检查网络连接或使用HBuilderX内置浏览器运行</text>
          </view>
        </view>
      </view>
    </view>

    <view class="safe-area-bottom"></view>
  </view>
</template>

<script>
import { translate } from '../../utils/request.js'
import { saveToHistory, addToFavorites, removeFromFavorites } from '../../utils/storage.js'

export default {
  data() {
    return {
      inputText: '',
      translatedText: '',
      currentTranslationId: '',
      isCurrentFavorite: false,
      isLoading: false,
      errorMessage: '',
      errorCode: '',
      fromLang: 'auto',
      toLang: 'zh-CHS',
      fromLangIndex: 0,
      toLangIndex: 1,
      languages: [
        { code: 'auto', name: '自动检测' },
        { code: 'zh-CHS', name: '中文' },
        { code: 'en', name: '英语' }
      ],
      screenWidth: 375,
      screenHeight: 667,
      isLargeScreen: false,
      phonetic: ''
    }
  },
  computed: {
    languageNames() {
      return this.languages.map(l => l.name)
    },
    fontSizeBase() {
      return this.isLargeScreen ? '32rpx' : '28rpx'
    },
    spacingBase() {
      return this.isLargeScreen ? '32rpx' : '24rpx'
    }
  },
  onLoad(options) {
    this.getSystemInfo()
    
    if (options && options.text) {
      this.inputText = decodeURIComponent(options.text)
      if (options.from) {
        const index = this.languages.findIndex(l => l.code === options.from)
        if (index !== -1) {
          this.fromLangIndex = index
          this.fromLang = options.from
        }
      }
      if (options.to) {
        const index = this.languages.findIndex(l => l.code === options.to)
        if (index !== -1) {
          this.toLangIndex = index
          this.toLang = options.to
        }
      }
      if (this.inputText.trim()) {
        setTimeout(() => {
          this.handleTranslate()
        }, 500)
      }
    }
  },
  onShow() {
    this.getSystemInfo()
  },
  methods: {
    getSystemInfo() {
      try {
        const systemInfo = uni.getSystemInfoSync()
        this.screenWidth = systemInfo.windowWidth
        this.screenHeight = systemInfo.windowHeight
        this.isLargeScreen = systemInfo.windowWidth >= 414
      } catch (e) {
        console.warn('获取系统信息失败:', e)
      }
    },
    onFromLangChange(e) {
      this.fromLangIndex = e.detail.value
      this.fromLang = this.languages[e.detail.value].code
      this.clearResult()
    },
    onToLangChange(e) {
      this.toLangIndex = e.detail.value
      this.toLang = this.languages[e.detail.value].code
      this.clearResult()
    },
    swapLanguages() {
      const tempIndex = this.fromLangIndex
      const tempLang = this.fromLang
      this.fromLangIndex = this.toLangIndex
      this.fromLang = this.toLang
      this.toLangIndex = tempIndex
      this.toLang = tempLang
      this.clearResult()
    },
    onInputChange(e) {
      this.inputText = e.detail.value
      this.clearResult()
    },
    clearResult() {
      this.translatedText = ''
      this.errorMessage = ''
      this.errorCode = ''
      this.currentTranslationId = ''
      this.isCurrentFavorite = false
    },
    async handleTranslate() {
      if (!this.inputText.trim()) {
        uni.showToast({ title: '请输入文本', icon: 'none' });
        return;
      }

      if (this.isLoading) {
        return;
      }

      this.isLoading = true;
      this.errorMessage = '';
      this.errorCode = '';

      try {
        const result = await translate(this.inputText, this.fromLang, this.toLang);
        
        if (result && result.translation) {
          this.translatedText = result.translation[0];
          this.phonetic = result.phonetic || '';
          this.saveTranslation();
          
          uni.showToast({ title: '翻译成功', icon: 'success', duration: 1500 });
        } else {
          throw new Error('翻译结果为空');
        }
      } catch (err) {
        console.error('翻译错误:', err);
        this.errorCode = err.code || 'UNKNOWN';
        this.errorMessage = err.message || '翻译失败，请稍后重试';
        this.phonetic = '';
        
        uni.showToast({ 
          title: this.errorMessage, 
          icon: 'none', 
          duration: 3000 
        });
      } finally {
        this.isLoading = false;
      }
    },
    saveTranslation() {
      const translationItem = {
        sourceText: this.inputText,
        targetText: this.translatedText,
        sourceLang: this.fromLang,
        targetLang: this.toLang,
        isFavorite: false
      }
      saveToHistory(translationItem)
      const history = uni.getStorageSync('translation_history')
      if (history) {
        const historyList = JSON.parse(history)
        if (historyList.length > 0) {
          this.currentTranslationId = historyList[0].id
          this.checkFavorite()
        }
      }
    },
    checkFavorite() {
      const favorites = uni.getStorageSync('favorite_translations')
      if (favorites) {
        const favoriteList = JSON.parse(favorites)
        this.isCurrentFavorite = favoriteList.some(f => f.id === this.currentTranslationId)
      }
    },
    copyResult() {
      uni.setClipboardData({
        data: this.translatedText,
        success: () => {
          uni.showToast({ title: '已复制', icon: 'success' })
        },
        fail: () => {
          uni.showToast({ title: '复制失败', icon: 'none' })
        }
      })
    },
    speakResult() {
      // #ifdef H5
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(this.translatedText)
        utterance.lang = this.toLang === 'zh-CHS' ? 'zh-CN' : this.toLang
        utterance.rate = 0.9
        speechSynthesis.speak(utterance)
      } else {
        uni.showToast({ title: '当前浏览器不支持语音朗读', icon: 'none' })
      }
      // #endif
      // #ifndef H5
      uni.showToast({ title: '语音朗读功能仅支持H5', icon: 'none' })
      // #endif
    },
    toggleFavorite() {
      if (!this.currentTranslationId || !this.translatedText) {
        uni.showToast({ title: '暂无翻译结果', icon: 'none' })
        return
      }

      if (this.isCurrentFavorite) {
        removeFromFavorites(this.currentTranslationId)
        this.isCurrentFavorite = false
        uni.showToast({ title: '已取消收藏', icon: 'none' })
      } else {
        const history = uni.getStorageSync('translation_history')
        if (history) {
          const historyList = JSON.parse(history)
          const item = historyList.find(h => h.id === this.currentTranslationId)
          if (item) {
            addToFavorites(item)
            this.isCurrentFavorite = true
            uni.showToast({ title: '已收藏', icon: 'success' })
          }
        }
      }
    },
    goToHistory() {
      uni.navigateTo({ url: '/pages/history/history' })
    },
    goToSetting() {
      uni.navigateTo({ url: '/pages/setting/setting' })
    }
  }
}
</script>

<style lang="scss" scoped>
.page-container {
  min-height: 100vh;
  padding: 16rpx;
  box-sizing: border-box;
  background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
  
  @media screen and (min-width: 414px) {
    padding: 24rpx;
  }
  
  @media screen and (min-width: 768px) {
    padding: 32rpx;
    max-width: 620px;
    margin: 0 auto;
  }
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16rpx;
  padding-top: calc(16rpx + constant(safe-area-inset-top));
  padding-top: calc(16rpx + env(safe-area-inset-top));
  
  @media screen and (min-width: 414px) {
    padding: 20rpx;
    padding-top: calc(20rpx + constant(safe-area-inset-top));
    padding-top: calc(20rpx + env(safe-area-inset-top));
  }
  
  @media screen and (min-width: 768px) {
    padding: 24rpx;
    padding-top: calc(24rpx + constant(safe-area-inset-top));
    padding-top: calc(24rpx + env(safe-area-inset-top));
  }
}

.title {
  font-size: 40rpx;
  font-weight: bold;
  color: #fff;
  text-shadow: 0 2rpx 4rpx rgba(0,0,0,0.2);
  
  @media screen and (min-width: 360px) {
    font-size: 44rpx;
  }
  
  @media screen and (min-width: 414px) {
    font-size: 52rpx;
  }
  
  @media screen and (min-width: 768px) {
    font-size: 60rpx;
  }
}

.header-actions {
  display: flex;
  gap: 12rpx;
  
  @media screen and (min-width: 414px) {
    gap: 16rpx;
  }
}

.action-btn {
  width: 64rpx;
  height: 64rpx;
  background: rgba(255,255,255,0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26rpx;
  
  @media screen and (min-width: 414px) {
    width: 76rpx;
    height: 76rpx;
    font-size: 32rpx;
  }
  
  @media screen and (min-width: 768px) {
    width: 84rpx;
    height: 84rpx;
    font-size: 36rpx;
  }
}

.main-content {
  background: #fff;
  border-radius: 28rpx;
  padding: 24rpx;
  margin-top: 12rpx;
  
  @media screen and (min-width: 414px) {
    padding: 32rpx;
    margin-top: 16rpx;
    border-radius: 32rpx;
  }
  
  @media screen and (min-width: 768px) {
    padding: 40rpx;
    margin-top: 24rpx;
    border-radius: 40rpx;
    box-shadow: 0 8rpx 32rpx rgba(0,0,0,0.15);
  }
}

.input-section {
  margin-bottom: 20rpx;
  
  @media screen and (min-width: 414px) {
    margin-bottom: 24rpx;
  }
}

.language-row {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-bottom: 12rpx;
  
  @media screen and (min-width: 414px) {
    gap: 16rpx;
    margin-bottom: 16rpx;
  }
}

.lang-picker {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16rpx 20rpx;
  background: #f5f5f5;
  border-radius: 12rpx;
  
  @media screen and (min-width: 414px) {
    padding: 20rpx 24rpx;
    border-radius: 16rpx;
  }
}

.lang-text {
  font-size: 26rpx;
  color: #333;
  
  @media screen and (min-width: 414px) {
    font-size: 28rpx;
  }
  
  @media screen and (min-width: 768px) {
    font-size: 32rpx;
  }
}

.arrow {
  font-size: 18rpx;
  color: #999;
  
  @media screen and (min-width: 414px) {
    font-size: 20rpx;
  }
}

.swap-btn {
  width: 56rpx;
  height: 56rpx;
  background: #667eea;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
  
  @media screen and (min-width: 414px) {
    width: 64rpx;
    height: 64rpx;
    font-size: 28rpx;
  }
  
  @media screen and (min-width: 768px) {
    width: 72rpx;
    height: 72rpx;
    font-size: 32rpx;
  }
}

.input-textarea {
  width: 100%;
  height: 180rpx;
  padding: 16rpx;
  background: #f5f5f5;
  border-radius: 12rpx;
  font-size: 26rpx;
  line-height: 1.6;
  box-sizing: border-box;
  
  @media screen and (min-width: 360px) {
    height: 200rpx;
    font-size: 28rpx;
  }
  
  @media screen and (min-width: 414px) {
    height: 240rpx;
    padding: 20rpx;
    font-size: 30rpx;
    border-radius: 16rpx;
  }
  
  @media screen and (min-width: 768px) {
    height: 280rpx;
    font-size: 34rpx;
    border-radius: 20rpx;
  }
}

.input-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 6rpx;
  
  @media screen and (min-width: 414px) {
    margin-top: 8rpx;
  }
}

.char-count {
  font-size: 20rpx;
  color: #999;
  
  @media screen and (min-width: 414px) {
    font-size: 22rpx;
  }
}

.translate-btn {
  width: 100%;
  height: 80rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20rpx;
  border: none;
  
  text {
    font-size: 28rpx;
    font-weight: bold;
    color: #fff;
  }
  
  &[disabled] {
    background: #e0e0e0;
    
    text {
      color: #999;
    }
  }
  
  @media screen and (min-width: 414px) {
    height: 96rpx;
    margin-bottom: 24rpx;
    border-radius: 48rpx;
    
    text {
      font-size: 32rpx;
    }
  }
  
  @media screen and (min-width: 768px) {
    height: 112rpx;
    border-radius: 56rpx;
    
    text {
      font-size: 36rpx;
    }
  }
}

.result-section {
  background: #fafafa;
  border-radius: 12rpx;
  padding: 20rpx;
  
  @media screen and (min-width: 414px) {
    padding: 24rpx;
    border-radius: 16rpx;
  }
  
  @media screen and (min-width: 768px) {
    padding: 28rpx;
    border-radius: 20rpx;
  }
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12rpx;
  
  @media screen and (min-width: 414px) {
    margin-bottom: 16rpx;
  }
}

.result-label {
  font-size: 24rpx;
  font-weight: bold;
  color: #333;
  
  @media screen and (min-width: 414px) {
    font-size: 26rpx;
  }
  
  @media screen and (min-width: 768px) {
    font-size: 28rpx;
  }
}

.result-actions {
  display: flex;
  gap: 12rpx;
  
  @media screen and (min-width: 414px) {
    gap: 16rpx;
  }
}

.result-action-btn {
  width: 52rpx;
  height: 52rpx;
  background: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22rpx;
  box-shadow: 0 2rpx 6rpx rgba(0,0,0,0.08);
  
  &.favorite-btn.active {
    background: #ffd700;
  }
  
  @media screen and (min-width: 414px) {
    width: 56rpx;
    height: 56rpx;
    font-size: 24rpx;
    box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.1);
  }
  
  @media screen and (min-width: 768px) {
    width: 64rpx;
    height: 64rpx;
    font-size: 28rpx;
  }
}

.result-text {
  font-size: 28rpx;
  line-height: 1.7;
  color: #333;
  word-break: break-all;
  
  @media screen and (min-width: 414px) {
    font-size: 32rpx;
    line-height: 1.8;
  }
  
  @media screen and (min-width: 768px) {
    font-size: 36rpx;
  }
}

.phonetic {
  margin-top: 10rpx;
  font-size: 22rpx;
  color: #999;
  font-style: italic;
  
  @media screen and (min-width: 414px) {
    margin-top: 12rpx;
    font-size: 24rpx;
  }
  
  @media screen and (min-width: 768px) {
    font-size: 26rpx;
  }
}

.error-section {
  background: #fff5f5;
  border: 2rpx solid #ffcccc;
  border-radius: 12rpx;
  padding: 20rpx;
  margin-top: 12rpx;
  
  @media screen and (min-width: 414px) {
    padding: 24rpx;
    margin-top: 16rpx;
    border-radius: 16rpx;
  }
}

.error-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.error-icon {
  font-size: 32rpx;
  margin-bottom: 6rpx;
  
  @media screen and (min-width: 414px) {
    font-size: 36rpx;
    margin-bottom: 8rpx;
  }
}

.error-text {
  font-size: 24rpx;
  color: #d32f2f;
  font-weight: bold;
  
  @media screen and (min-width: 414px) {
    font-size: 26rpx;
  }
}

.error-actions {
  margin-top: 10rpx;
  padding-top: 10rpx;
  border-top: 1rpx solid #ffcccc;
  width: 100%;
  
  @media screen and (min-width: 414px) {
    margin-top: 12rpx;
    padding-top: 12rpx;
  }
}

.error-code {
  font-size: 20rpx;
  color: #999;
  
  @media screen and (min-width: 414px) {
    font-size: 22rpx;
  }
}

.error-tip {
  display: block;
  font-size: 20rpx;
  color: #ff6b6b;
  margin-top: 4rpx;
  
  @media screen and (min-width: 414px) {
    font-size: 22rpx;
    margin-top: 6rpx;
  }
}

.safe-area-bottom {
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
  height: calc(16rpx + constant(safe-area-inset-bottom));
  height: calc(16rpx + env(safe-area-inset-bottom));
  
  @media screen and (min-width: 414px) {
    height: calc(20rpx + constant(safe-area-inset-bottom));
    height: calc(20rpx + env(safe-area-inset-bottom));
  }
}
</style>
