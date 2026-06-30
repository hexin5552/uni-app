<template>
  <view class="detail">
    <view class="detail-title">{{ detail.title }}</view>
    <view class="detail-content">
      <text>{{ detail.content }}</text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      detail: { title: '加载中...', content: '' }
    }
  },
  onShow() {
    // 每次显示页面时，从全局获取最新的详情数据
    const globalData = getApp().globalData.detailData || {}
    this.detail = {
      title: globalData.title || '广州起义纪念馆',
      content: globalData.content || '广州起义纪念馆位于广州市起义路，是为纪念1927年中国共产党领导的广州起义而建立的。馆内陈列大量历史文物和照片，再现了当年的壮烈场景。'
    }
  }
}
</script>

<style>
.detail {
  padding: 40rpx;
}
.detail-title {
  font-size: 48rpx;
  font-weight: bold;
  color: #C00000;
  margin-bottom: 30rpx;
  text-align: center;
}
.detail-content {
  font-size: 34rpx;
  line-height: 1.8;
  background-color: #f5f5f5;
  padding: 40rpx;
  border-radius: 24rpx;
}
</style>