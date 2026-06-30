<template>
  <view class="detail-container" v-if="detail">
    <text class="title">{{ detail.title }}</text>
    <text class="time">{{ detail.publishTime }}</text>
    <view class="content">
      <text>{{ detail.content }}</text>
    </view>
    <view v-if="isOffline" class="offline-tip">当前为离线阅读模式，内容来自本地缓存</view>
    <view v-else class="online-tip">在线模式，数据已自动缓存</view>
  </view>
  <view v-else class="empty">
    <text>暂无内容</text>
    <button type="primary" size="mini" @click="retryLoad">重试</button>
  </view>
</template>

<script>
import { getNewsDetail } from '@/api/news.js';
import { checkNetwork } from '@/utils/network.js';

export default {
  data() {
    return {
      id: null,
      detail: null,
      isOffline: false
    };
  },
  onLoad(options) {
    this.id = options.id;
    this.loadDetail();
  },
  methods: {
    async loadDetail() {
      console.log('loadDetail id:', this.id);
      const hasNetwork = await checkNetwork();
      
      try {
        const result = await getNewsDetail(this.id, hasNetwork);
        this.detail = result.data;
        
        if (!hasNetwork && result.fromCache) {
          this.isOffline = true;
        } else {
          this.isOffline = false;
        }
      } catch (err) {
        console.error('获取详情失败', err);
        if (err.message.includes('无网络连接')) {
          uni.showToast({ title: '无网络，请先在线查看新闻缓存', icon: 'none' });
        } else {
          uni.showToast({ title: '加载失败，请检查网络', icon: 'none' });
        }
        this.detail = null;
      }
    },
    retryLoad() {
      this.loadDetail();
    }
  }
};
</script>

<style scoped>
.detail-container { padding: 40rpx; }
.title { font-size: 44rpx; font-weight: bold; display: block; margin-bottom: 20rpx; }
.time { font-size: 28rpx; color: #999; margin-bottom: 30rpx; display: block; }
.content { font-size: 32rpx; line-height: 1.6; color: #333; }
.offline-tip { margin-top: 50rpx; background: #f0f0f0; padding: 20rpx; text-align: center; color: #f60; border-radius: 8rpx; }
.online-tip { margin-top: 50rpx; background: #e6f7e6; padding: 20rpx; text-align: center; color: #090; border-radius: 8rpx; }
.empty { text-align: center; padding: 200rpx; }
</style>
