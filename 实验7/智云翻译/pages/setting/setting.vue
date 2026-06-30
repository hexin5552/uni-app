<template>
  <view class="container" :class="themeClass">
    <view class="header">
      <view class="back-btn" @click="goBack">
        <text>←</text>
      </view>
      <text class="title">设置</text>
      <view class="placeholder"></view>
    </view>

    <scroll-view class="content" scroll-y>
      <view class="section">
        <view class="section-title">主题设置</view>
        <view class="setting-item">
          <view class="item-label">
            <text class="icon">🎨</text>
            <text>主题模式</text>
          </view>
          <view class="theme-switch">
            <view 
              class="switch-option" 
              :class="{ active: currentTheme === 'light' }"
              @click="setTheme('light')"
            >
              <text>浅色</text>
            </view>
            <view 
              class="switch-option" 
              :class="{ active: currentTheme === 'dark' }"
              @click="setTheme('dark')"
            >
              <text>深色</text>
            </view>
          </view>
        </view>
      </view>

      <view class="section">
        <view class="section-title">数据管理</view>
        <view class="setting-item" @click="clearHistoryData">
          <view class="item-label">
            <text class="icon">🗑️</text>
            <text>清除历史记录</text>
          </view>
          <text class="item-arrow">›</text>
        </view>
        <view class="setting-item" @click="clearFavoriteData">
          <view class="item-label">
            <text class="icon">⭐</text>
            <text>清除收藏</text>
          </view>
          <text class="item-arrow">›</text>
        </view>
        <view class="setting-item danger" @click="clearAllCache">
          <view class="item-label">
            <text class="icon">⚠️</text>
            <text>清除全部缓存</text>
          </view>
          <text class="item-arrow">›</text>
        </view>
      </view>

      <view class="section">
        <view class="section-title">词库信息</view>
        <view class="demo-info">
          <text class="demo-desc">本应用使用英语四级核心词库，支持中英文互译</text>
          <text class="demo-count">词库包含 {{ wordCount }} 个核心词汇</text>
        </view>
      </view>

      <view class="section">
        <view class="section-title">关于</view>
        <view class="setting-item">
          <view class="item-label">
            <text class="icon">📱</text>
            <text>版本</text>
          </view>
          <text class="item-value">1.0.0</text>
        </view>
        <view class="setting-item">
          <view class="item-label">
            <text class="icon">ℹ️</text>
            <text>关于我们</text>
          </view>
          <text class="item-arrow">›</text>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import { setTheme, clearHistory, clearAllCache } from '../../utils/storage.js'
import { CET4Words } from '../../utils/demoData.js'

export default {
  data() {
    return {
      currentTheme: 'light',
      wordCount: 0
    }
  },
  computed: {
    themeClass() {
      return this.currentTheme
    }
  },
  onLoad() {
    this.currentTheme = uni.getStorageSync('app_theme') || 'light';
    this.wordCount = CET4Words.length;
  },
  methods: {
    goBack() {
      uni.navigateBack()
    },
    setTheme(theme) {
      this.currentTheme = theme
      setTheme(theme)
      uni.showToast({ 
        title: theme === 'dark' ? '已切换深色模式' : '已切换浅色模式', 
        icon: 'none' 
      })
      setTimeout(() => {
        uni.reLaunch({ url: '/pages/index/index' })
      }, 1000)
    },
    clearHistoryData() {
      uni.showModal({
        title: '清除历史记录',
        content: '确定要清除所有历史记录吗？此操作不可恢复。',
        success: (res) => {
          if (res.confirm) {
            clearHistory()
            uni.showToast({ title: '已清除', icon: 'success' })
          }
        }
      })
    },
    clearFavoriteData() {
      uni.showModal({
        title: '清除收藏',
        content: '确定要清除所有收藏吗？此操作不可恢复。',
        success: (res) => {
          if (res.confirm) {
            uni.removeStorageSync('favorite_translations')
            uni.showToast({ title: '已清除', icon: 'success' })
          }
        }
      })
    },
    clearAllCache() {
      uni.showModal({
        title: '清除全部缓存',
        content: '确定要清除所有数据吗？此操作不可恢复。',
        success: (res) => {
          if (res.confirm) {
            clearAllCache();
            uni.showToast({ title: '已清除', icon: 'success' });
          }
        }
      });
    }
  }
}
</script>

<style lang="scss">
.container {
  min-height: 100vh;
  background: #f5f5f5;
  
  &.dark {
    background: #1a1a2e;
  }
  
  @media screen and (min-width: 768px) {
    max-width: 620px;
    margin: 0 auto;
    
    &.dark {
      background: #12121a;
    }
  }
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16rpx 20rpx;
  background: #fff;
  box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05);
  
  .dark & {
    background: #2d2d44;
  }
  
  @media screen and (min-width: 414px) {
    padding: 20rpx 24rpx;
  }
  
  @media screen and (min-width: 768px) {
    padding: 24rpx 28rpx;
  }
}

.back-btn {
  width: 60rpx;
  height: 60rpx;
  background: #f0f0f0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
  color: #333;
  
  .dark & {
    background: #3d3d5c;
    color: #fff;
  }
  
  @media screen and (min-width: 414px) {
    width: 68rpx;
    height: 68rpx;
    font-size: 36rpx;
  }
  
  @media screen and (min-width: 768px) {
    width: 76rpx;
    height: 76rpx;
    font-size: 40rpx;
  }
}

.title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  
  .dark & {
    color: #fff;
  }
  
  @media screen and (min-width: 414px) {
    font-size: 36rpx;
  }
  
  @media screen and (min-width: 768px) {
    font-size: 40rpx;
  }
}

.placeholder {
  width: 60rpx;
  
  @media screen and (min-width: 414px) {
    width: 68rpx;
  }
  
  @media screen and (min-width: 768px) {
    width: 76rpx;
  }
}

.content {
  height: calc(100vh - 108rpx);
  padding: 12rpx;
  
  @media screen and (min-width: 414px) {
    height: calc(100vh - 120rpx);
    padding: 16rpx;
  }
  
  @media screen and (min-width: 768px) {
    height: calc(100vh - 136rpx);
    padding: 20rpx;
  }
}

.section {
  background: #fff;
  border-radius: 16rpx;
  padding: 16rpx;
  margin-bottom: 16rpx;
  overflow: hidden;
  
  .dark & {
    background: #2d2d44;
  }
  
  @media screen and (min-width: 414px) {
    padding: 20rpx;
    margin-bottom: 20rpx;
    border-radius: 20rpx;
  }
  
  @media screen and (min-width: 768px) {
    padding: 24rpx;
    border-radius: 24rpx;
    box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.08);
  }
}

.section-title {
  font-size: 24rpx;
  color: #999;
  padding: 8rpx 0 16rpx;
  
  .dark & {
    color: #666;
  }
  
  @media screen and (min-width: 414px) {
    font-size: 26rpx;
    padding: 10rpx 0 20rpx;
  }
}

.setting-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
  
  .dark & {
    border-bottom-color: #444;
  }
  
  &:last-child {
    border-bottom: none;
  }
  
  &.danger {
    .item-label text:last-child {
      color: #ff6b6b;
    }
  }
  
  @media screen and (min-width: 414px) {
    padding: 24rpx 0;
  }
}

.item-label {
  display: flex;
  align-items: center;
  gap: 12rpx;
  
  .icon {
    font-size: 28rpx;
  }
  
  text:last-child {
    font-size: 28rpx;
    color: #333;
    
    .dark & {
      color: #fff;
    }
  }
  
  @media screen and (min-width: 414px) {
    gap: 16rpx;
    
    .icon {
      font-size: 32rpx;
    }
    
    text:last-child {
      font-size: 30rpx;
    }
  }
}

.item-arrow {
  font-size: 32rpx;
  color: #ccc;
  
  .dark & {
    color: #555;
  }
  
  @media screen and (min-width: 414px) {
    font-size: 36rpx;
  }
}

.item-value {
  font-size: 26rpx;
  color: #999;
  
  .dark & {
    color: #666;
  }
  
  @media screen and (min-width: 414px) {
    font-size: 28rpx;
  }
}

.theme-switch {
  display: flex;
  background: #f5f5f5;
  border-radius: 28rpx;
  padding: 6rpx;
  
  .dark & {
    background: #3d3d5c;
  }
  
  @media screen and (min-width: 414px) {
    border-radius: 32rpx;
    padding: 8rpx;
  }
}

.switch-option {
  padding: 10rpx 20rpx;
  border-radius: 20rpx;
  
  text {
    font-size: 24rpx;
    color: #666;
    
    .dark & {
      color: #aaa;
    }
  }
  
  &.active {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    
    text {
      color: #fff;
    }
  }
  
  @media screen and (min-width: 414px) {
    padding: 12rpx 24rpx;
    border-radius: 24rpx;
    
    text {
      font-size: 26rpx;
    }
  }
}

.demo-info {
  padding: 12rpx;
  background: #f0f0f0;
  border-radius: 10rpx;
  
  .dark & {
    background: #3d3d3d;
  }
  
  @media screen and (min-width: 414px) {
    padding: 16rpx;
    border-radius: 12rpx;
  }
}

.demo-desc {
  display: block;
  font-size: 22rpx;
  color: #666;
  line-height: 1.6;
  
  .dark & {
    color: #aaa;
  }
  
  @media screen and (min-width: 414px) {
    font-size: 24rpx;
  }
}

.demo-count {
  display: block;
  margin-top: 6rpx;
  font-size: 20rpx;
  color: #999;
  
  .dark & {
    color: #777;
  }
  
  @media screen and (min-width: 414px) {
    margin-top: 8rpx;
    font-size: 22rpx;
  }
}
</style>
