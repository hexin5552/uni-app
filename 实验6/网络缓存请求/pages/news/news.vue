<template>
  <view class="container">
    <view class="news-list">
      <view class="news-card" v-for="item in newsList" :key="item.id" @click="goToDetail(item.id)">
        <text class="title">{{ item.title }}</text>
        <text class="time">{{ item.publishTime }}</text>
        <text class="summary">{{ item.summary }}</text>
      </view>
    </view>
    <view v-if="newsList.length === 0 && !loading" class="empty">暂无新闻，请检查网络后重试</view>
  </view>
</template>

<script>
import { getNewsList } from '@/api/news.js';
import { checkNetwork } from '@/utils/network.js';

export default {
  data() {
    return {
      newsList: [],
      loading: false
    };
  },
  onLoad() {
    this.loadNews();
  },
  onPullDownRefresh() {
    this.loadNews(true);
  },
  methods: {
    async loadNews(isRefresh = false) {
      this.loading = true;
      const hasNetwork = await checkNetwork();
      if (!hasNetwork) {
        uni.showToast({ title: '无网络连接，无法刷新列表', icon: 'none' });
        this.loading = false;
        uni.stopPullDownRefresh();
        return;
      }
      try {
        const data = await getNewsList();
        this.newsList = data;
        if (isRefresh) {
          uni.showToast({ title: '刷新成功', icon: 'success' });
        }
      } catch (err) {
        console.error('加载列表失败', err);
        uni.showToast({ title: '加载失败，请重试', icon: 'none' });
      } finally {
        this.loading = false;
        if (isRefresh) uni.stopPullDownRefresh();
      }
    },
    goToDetail(id) {
      uni.navigateTo({
        url: `/pages/detail/detail?id=${id}`
      });
    }
  }
};
</script>

<style scoped>
.container { padding: 20rpx; }
.news-card {
  background: #fff;
  margin-bottom: 20rpx;
  padding: 30rpx;
  border-radius: 16rpx;
  box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.1);
}
.title { font-size: 36rpx; font-weight: bold; display: block; margin-bottom: 10rpx; }
.time { font-size: 24rpx; color: #999; margin-bottom: 10rpx; display: block; }
.summary { font-size: 28rpx; color: #666; }
.empty { text-align: center; padding: 100rpx; color: #999; }
</style>
