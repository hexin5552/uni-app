<template>
  <view class="favorite" :class="{ dark: isDarkMode }">
    <view class="header">
      <view class="back-btn" @click="goBack">
        <text>←</text>
      </view>
      <text class="title">我的收藏</text>
      <view class="placeholder"></view>
    </view>

    <scroll-view class="list-container" scroll-y>
      <view v-if="list.length === 0" class="empty">
        <text class="empty-icon">⭐</text>
        <text class="empty-text">暂无收藏</text>
      </view>
      <view v-else class="list">
        <view class="item" v-for="item in list" :key="item.id">
          <view class="content" @click="goToTranslate(item)">
            <view class="source">{{ item.sourceText }}</view>
            <view class="target">{{ item.targetText }}</view>
            <view class="info">{{ formatTime(item.timestamp) }} | {{ getLangName(item.sourceLang) }} → {{ getLangName(item.targetLang) }}</view>
          </view>
          <view class="delete" @click.stop="removeFavorite(item)">
            <text>❤️ 取消</text>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import { getFavorites, removeFromFavorites } from '../../utils/storage.js';
import config from '../../config.js';

export default {
  data() {
    return {
      list: [],
      isDarkMode: false
    };
  },
  onShow() {
    this.loadData();
    const theme = uni.getStorageSync('app_theme');
    this.isDarkMode = (theme === 'dark');
  },
  methods: {
    loadData() {
      this.list = getFavorites();
    },
    formatTime(timestamp) {
      if (!timestamp) return '';
      const date = new Date(timestamp);
      return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    },
    getLangName(code) {
      const item = config.youdao.langList.find(l => l.code === code);
      return item ? item.name : code;
    },
    goBack() {
      uni.navigateBack();
    },
    goToTranslate(item) {
      const url = `/pages/index/index?text=${encodeURIComponent(item.sourceText)}&from=${item.sourceLang}&to=${item.targetLang}`;
      uni.navigateTo({ url });
    },
    removeFavorite(item) {
      uni.showModal({
        title: '取消收藏',
        content: '确定取消收藏这条记录吗？',
        success: (res) => {
          if (res.confirm) {
            removeFromFavorites(item.id);
            this.loadData();
            uni.showToast({ title: '已取消收藏', icon: 'none' });
          }
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.favorite {
  min-height: 100vh;
  background: #f5f5f5;
  
  @media screen and (min-width: 768px) {
    max-width: 620px;
    margin: 0 auto;
    background: #e8e8e8;
  }
}
.favorite.dark {
  background: #1e1e1e;
  
  @media screen and (min-width: 768px) {
    background: #1a1a1a;
  }
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16rpx 20rpx;
  background: #fff;
  box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05);
  
  @media screen and (min-width: 414px) {
    padding: 20rpx 24rpx;
  }
  
  @media screen and (min-width: 768px) {
    padding: 24rpx 28rpx;
  }
}
.dark .header {
  background: #2c2c2c;
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
.dark .back-btn {
  background: #3c3c3c;
  color: #fff;
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
.dark .title {
  color: #fff;
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

.list-container {
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

.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80rpx 32rpx;
  
  @media screen and (min-width: 414px) {
    padding: 100rpx 40rpx;
  }
  
  @media screen and (min-width: 768px) {
    padding: 120rpx 48rpx;
  }
}

.empty-icon {
  font-size: 64rpx;
  margin-bottom: 16rpx;
  
  @media screen and (min-width: 414px) {
    font-size: 72rpx;
    margin-bottom: 20rpx;
  }
  
  @media screen and (min-width: 768px) {
    font-size: 80rpx;
    margin-bottom: 24rpx;
  }
}

.empty-text {
  font-size: 26rpx;
  color: #999;
  
  @media screen and (min-width: 414px) {
    font-size: 28rpx;
  }
}
.dark .empty-text {
  color: #666;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
  
  @media screen and (min-width: 414px) {
    gap: 16rpx;
  }
  
  @media screen and (min-width: 768px) {
    gap: 20rpx;
  }
}

.item {
  display: flex;
  background: #fff;
  padding: 20rpx;
  border-radius: 12rpx;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.05);
  
  @media screen and (min-width: 414px) {
    padding: 24rpx;
    border-radius: 16rpx;
    box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05);
  }
  
  @media screen and (min-width: 768px) {
    padding: 28rpx;
    border-radius: 20rpx;
    box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.08);
  }
}
.dark .item {
  background: #2c2c2c;
}

.content {
  flex: 1;
  overflow: hidden;
}

.source {
  font-size: 26rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 8rpx;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  
  @media screen and (min-width: 414px) {
    font-size: 28rpx;
    margin-bottom: 10rpx;
  }
  
  @media screen and (min-width: 768px) {
    font-size: 30rpx;
  }
}
.dark .source {
  color: #fff;
}

.target {
  font-size: 24rpx;
  color: #4caf50;
  margin-bottom: 6rpx;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  
  @media screen and (min-width: 414px) {
    font-size: 26rpx;
    margin-bottom: 8rpx;
  }
  
  @media screen and (min-width: 768px) {
    font-size: 28rpx;
  }
}
.dark .target {
  color: #66bb6a;
}

.info {
  font-size: 20rpx;
  color: #999;
  
  @media screen and (min-width: 414px) {
    font-size: 22rpx;
  }
  
  @media screen and (min-width: 768px) {
    font-size: 24rpx;
  }
}
.dark .info {
  color: #666;
}

.delete {
  font-size: 24rpx;
  color: #ff4081;
  padding: 12rpx 20rpx;
  background: #fff5f8;
  border-radius: 28rpx;
  margin-left: 16rpx;
  
  @media screen and (min-width: 414px) {
    font-size: 26rpx;
    padding: 14rpx 22rpx;
    margin-left: 18rpx;
    border-radius: 30rpx;
  }
  
  @media screen and (min-width: 768px) {
    font-size: 28rpx;
    padding: 16rpx 24rpx;
    margin-left: 20rpx;
    border-radius: 32rpx;
  }
}
.dark .delete {
  background: #3c2c3c;
}
</style>
