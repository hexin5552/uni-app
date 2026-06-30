<template>
  <view class="page-container">
    <view class="header">
      <view class="back-btn" @click="goBack">
        <text>←</text>
      </view>
      <text class="title">历史记录</text>
      <view class="header-action" v-if="historyList.length > 0" @click="showClearConfirm">
        <text>清空</text>
      </view>
      <view class="header-action" v-else></view>
    </view>

    <view class="tabs">
      <view 
        class="tab-item" 
        :class="{ active: activeTab === 'history' }"
        @click="activeTab = 'history'"
      >
        <text>历史</text>
        <text class="tab-badge" v-if="historyList.length > 0">{{ historyList.length }}</text>
      </view>
      <view 
        class="tab-item" 
        :class="{ active: activeTab === 'favorite' }"
        @click="activeTab = 'favorite'"
      >
        <text>收藏</text>
        <text class="tab-badge" v-if="favoriteList.length > 0">{{ favoriteList.length }}</text>
      </view>
    </view>

    <scroll-view class="content-scroll" scroll-y>
      <view class="list-container" v-if="currentList.length > 0">
        <view 
          class="list-item" 
          v-for="item in currentList" 
          :key="item.id"
          @click="goToTranslate(item)"
        >
          <view class="item-content">
            <view class="source-text">{{ item.sourceText }}</view>
            <view class="target-text">{{ item.targetText }}</view>
            <view class="item-meta">
              <text class="lang-info">{{ getLangName(item.sourceLang) }} → {{ getLangName(item.targetLang) }}</text>
              <text class="time-info">{{ formatTime(item.timestamp) }}</text>
            </view>
          </view>
          <view class="item-actions">
            <view 
              class="action-btn favorite"
              :class="{ active: item.isFavorite }"
              @click.stop="toggleFavorite(item)"
            >
              <text>{{ item.isFavorite ? '⭐' : '☆' }}</text>
            </view>
            <view class="action-btn delete" @click.stop="showDeleteConfirm(item)">
              <text>🗑️</text>
            </view>
          </view>
        </view>
      </view>

      <view class="empty-state" v-else>
        <text class="empty-icon">{{ activeTab === 'history' ? '📝' : '⭐' }}</text>
        <text class="empty-text">{{ activeTab === 'history' ? '暂无翻译记录' : '暂无收藏记录' }}</text>
        <text class="empty-hint">{{ activeTab === 'history' ? '去翻译一些内容吧' : '点击星标收藏喜欢的翻译' }}</text>
      </view>
    </scroll-view>

    <view class="safe-area-bottom"></view>
  </view>
</template>

<script>
import { getHistory, removeFromHistory, clearHistory } from '../../utils/storage.js'

export default {
  data() {
    return {
      activeTab: 'history',
      historyList: [],
      favoriteList: [],
      screenWidth: 375,
      isLargeScreen: false
    }
  },
  computed: {
    currentList() {
      return this.activeTab === 'history' ? this.historyList : this.favoriteList
    }
  },
  onLoad() {
    this.getSystemInfo()
    this.loadData()
  },
  onShow() {
    this.loadData()
  },
  methods: {
    getSystemInfo() {
      try {
        const systemInfo = uni.getSystemInfoSync()
        this.screenWidth = systemInfo.windowWidth
        this.isLargeScreen = systemInfo.windowWidth >= 414
      } catch (e) {
        console.warn('获取系统信息失败:', e)
      }
    },
    loadData() {
      const history = uni.getStorageSync('translation_history')
      const favorites = uni.getStorageSync('favorite_translations')
      
      this.historyList = history ? JSON.parse(history) : []
      this.favoriteList = favorites ? JSON.parse(favorites) : []
    },
    getLangName(code) {
      const langMap = {
        'auto': '自动',
        'zh-CHS': '中文',
        'en': '英语',
        'ja': '日语',
        'ko': '韩语'
      }
      return langMap[code] || code
    },
    formatTime(timestamp) {
      if (!timestamp) return ''
      const date = new Date(timestamp)
      const now = new Date()
      const diff = now.getTime() - date.getTime()
      
      if (diff < 60000) return '刚刚'
      if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`
      if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`
      if (diff < 604800000) return `${Math.floor(diff / 86400000)}天前`
      
      const month = date.getMonth() + 1
      const day = date.getDate()
      const hour = date.getHours().toString().padStart(2, '0')
      const minute = date.getMinutes().toString().padStart(2, '0')
      return `${month}月${day}日 ${hour}:${minute}`
    },
    goBack() {
      uni.navigateBack()
    },
    goToTranslate(item) {
      const url = `/pages/index/index?text=${encodeURIComponent(item.sourceText)}&from=${item.sourceLang}&to=${item.targetLang}`
      uni.navigateTo({ url })
    },
    toggleFavorite(item) {
      const favorites = uni.getStorageSync('favorite_translations')
      let favoriteList = favorites ? JSON.parse(favorites) : []
      
      if (item.isFavorite) {
        favoriteList = favoriteList.filter(f => f.id !== item.id)
        uni.showToast({ title: '已取消收藏', icon: 'none' })
      } else {
        favoriteList.unshift({ ...item, isFavorite: true })
        uni.showToast({ title: '已收藏', icon: 'success' })
      }
      
      uni.setStorageSync('favorite_translations', JSON.stringify(favoriteList))
      this.loadData()
    },
    showDeleteConfirm(item) {
      uni.showModal({
        title: '确认删除',
        content: '确定要删除这条记录吗？',
        success: (res) => {
          if (res.confirm) {
            this.deleteItem(item)
          }
        }
      })
    },
    deleteItem(item) {
      if (this.activeTab === 'history') {
        removeFromHistory(item.id)
      } else {
        let favoriteList = this.favoriteList.filter(f => f.id !== item.id)
        uni.setStorageSync('favorite_translations', JSON.stringify(favoriteList))
      }
      this.loadData()
      uni.showToast({ title: '已删除', icon: 'none' })
    },
    showClearConfirm() {
      uni.showModal({
        title: '确认清空',
        content: `确定要清空所有${this.activeTab === 'history' ? '历史记录' : '收藏'}吗？`,
        confirmColor: '#ff4d4f',
        success: (res) => {
          if (res.confirm) {
            this.clearAll()
          }
        }
      })
    },
    clearAll() {
      if (this.activeTab === 'history') {
        clearHistory()
      } else {
        uni.setStorageSync('favorite_translations', '[]')
      }
      this.loadData()
      uni.showToast({ title: '已清空', icon: 'none' })
    }
  }
}
</script>

<style lang="scss" scoped>
.page-container {
  min-height: 100vh;
  background: #f5f5f5;
  display: flex;
  flex-direction: column;
  
  @media screen and (min-width: 768px) {
    max-width: 620px;
    margin: 0 auto;
    background: #e8e8e8;
  }
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16rpx 20rpx;
  padding-top: calc(16rpx + constant(safe-area-inset-top));
  padding-top: calc(16rpx + env(safe-area-inset-top));
  background: #fff;
  
  @media screen and (min-width: 414px) {
    padding: 20rpx 24rpx;
    padding-top: calc(20rpx + constant(safe-area-inset-top));
    padding-top: calc(20rpx + env(safe-area-inset-top));
  }
  
  @media screen and (min-width: 768px) {
    padding: 24rpx 28rpx;
    padding-top: calc(24rpx + constant(safe-area-inset-top));
    padding-top: calc(24rpx + env(safe-area-inset-top));
  }
}

.back-btn {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
  color: #333;
  
  @media screen and (min-width: 414px) {
    width: 64rpx;
    height: 64rpx;
    font-size: 36rpx;
  }
  
  @media screen and (min-width: 768px) {
    width: 72rpx;
    height: 72rpx;
    font-size: 40rpx;
  }
}

.title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  
  @media screen and (min-width: 414px) {
    font-size: 36rpx;
  }
  
  @media screen and (min-width: 768px) {
    font-size: 40rpx;
  }
}

.header-action {
  font-size: 26rpx;
  color: #ff6b6b;
  
  @media screen and (min-width: 414px) {
    font-size: 28rpx;
  }
}

.tabs {
  display: flex;
  background: #fff;
  padding: 0 20rpx 16rpx;
  gap: 32rpx;
  
  @media screen and (min-width: 414px) {
    padding: 0 24rpx 20rpx;
    gap: 40rpx;
  }
}

.tab-item {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding-bottom: 12rpx;
  font-size: 26rpx;
  color: #999;
  border-bottom: 4rpx solid transparent;
  
  &.active {
    color: #667eea;
    border-bottom-color: #667eea;
    font-weight: bold;
  }
  
  @media screen and (min-width: 414px) {
    padding-bottom: 16rpx;
    font-size: 28rpx;
  }
  
  @media screen and (min-width: 768px) {
    font-size: 30rpx;
  }
}

.tab-badge {
  background: #ff6b6b;
  color: #fff;
  font-size: 18rpx;
  padding: 4rpx 10rpx;
  border-radius: 16rpx;
  
  @media screen and (min-width: 414px) {
    font-size: 20rpx;
    padding: 4rpx 12rpx;
    border-radius: 20rpx;
  }
}

.content-scroll {
  flex: 1;
  padding: 12rpx;
  
  @media screen and (min-width: 414px) {
    padding: 16rpx;
  }
  
  @media screen and (min-width: 768px) {
    padding: 20rpx;
  }
}

.list-container {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
  
  @media screen and (min-width: 414px) {
    gap: 16rpx;
  }
}

.list-item {
  background: #fff;
  border-radius: 12rpx;
  padding: 20rpx;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  
  @media screen and (min-width: 414px) {
    padding: 24rpx;
    border-radius: 16rpx;
  }
  
  @media screen and (min-width: 768px) {
    padding: 28rpx;
    border-radius: 20rpx;
    box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.08);
  }
}

.item-content {
  flex: 1;
  min-width: 0;
}

.source-text {
  font-size: 26rpx;
  color: #333;
  font-weight: bold;
  margin-bottom: 6rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  
  @media screen and (min-width: 414px) {
    font-size: 28rpx;
    margin-bottom: 8rpx;
  }
  
  @media screen and (min-width: 768px) {
    font-size: 30rpx;
  }
}

.target-text {
  font-size: 24rpx;
  color: #666;
  margin-bottom: 10rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  
  @media screen and (min-width: 414px) {
    font-size: 26rpx;
    margin-bottom: 12rpx;
  }
  
  @media screen and (min-width: 768px) {
    font-size: 28rpx;
  }
}

.item-meta {
  display: flex;
  gap: 12rpx;
  
  @media screen and (min-width: 414px) {
    gap: 16rpx;
  }
}

.lang-info {
  font-size: 20rpx;
  color: #999;
  
  @media screen and (min-width: 414px) {
    font-size: 22rpx;
  }
}

.time-info {
  font-size: 20rpx;
  color: #999;
  
  @media screen and (min-width: 414px) {
    font-size: 22rpx;
  }
}

.item-actions {
  display: flex;
  flex-direction: column;
  gap: 10rpx;
  margin-left: 12rpx;
  
  @media screen and (min-width: 414px) {
    gap: 12rpx;
    margin-left: 16rpx;
  }
}

.action-btn {
  width: 50rpx;
  height: 50rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  border-radius: 50%;
  font-size: 22rpx;
  
  &.favorite.active {
    background: #ffd700;
  }
  
  &.delete {
    background: #fff5f5;
  }
  
  @media screen and (min-width: 414px) {
    width: 56rpx;
    height: 56rpx;
    font-size: 24rpx;
  }
  
  @media screen and (min-width: 768px) {
    width: 60rpx;
    height: 60rpx;
    font-size: 26rpx;
  }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100rpx 32rpx;
  
  @media screen and (min-width: 414px) {
    padding: 120rpx 40rpx;
  }
}

.empty-icon {
  font-size: 72rpx;
  margin-bottom: 20rpx;
  
  @media screen and (min-width: 414px) {
    font-size: 80rpx;
    margin-bottom: 24rpx;
  }
}

.empty-text {
  font-size: 28rpx;
  color: #666;
  margin-bottom: 10rpx;
  
  @media screen and (min-width: 414px) {
    font-size: 30rpx;
    margin-bottom: 12rpx;
  }
}

.empty-hint {
  font-size: 24rpx;
  color: #999;
  
  @media screen and (min-width: 414px) {
    font-size: 26rpx;
  }
}

.safe-area-bottom {
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}
</style>
