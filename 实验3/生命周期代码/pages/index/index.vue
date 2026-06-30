<template>
  <view class="container">
    <view class="title">生命周期函数实验</view>
    <view class="info">
      <view class="info-item">当前页面：首页</view>
      <view class="info-item">加载时间：{{ loadTime }}</view>
      <view class="info-item">实时时间：{{ currentTime }}</view>
      <view class="info-item">
        生命周期状态：
        <view class="status-indicator" :class="statusClass">{{ lifecycleStatus }}</view>
      </view>
    </view>
    <button type="primary" @click="goToList">跳转到列表页</button>
  </view>
</template>

<script>
export default {
  data() {
    return {
      loadTime: '',
      currentTime: '',
      lifecycleStatus: '未加载',
      statusClass: 'status-default'
    }
  },
  onLoad() {
    this.loadTime = new Date().toLocaleString()
    this.updateStatus('onLoad 触发', 'status-load')
    console.log('🏠 首页生命周期：onLoad —— 页面加载')
    this.startTime()
  },
  onShow() {
    this.updateStatus('onShow 触发', 'status-show')
    console.log('🏠 首页生命周期：onShow —— 页面显示')
  },
  onReady() {
    this.updateStatus('onReady 触发', 'status-ready')
    console.log('🏠 首页生命周期：onReady —— 页面渲染完成')
  },
  methods: {
    updateStatus(status, className) {
      this.lifecycleStatus = status
      this.statusClass = className
      // 添加闪烁效果
      this.statusClass += ' status-blink'
      setTimeout(() => {
        this.statusClass = className
      }, 1000)
    },
    startTime() {
      setInterval(() => {
        this.currentTime = new Date().toLocaleTimeString()
      }, 1000)
    },
    goToList() {
      uni.navigateTo({
        url: '/pages/list/list'
      })
    }
  }
}
</script>

<style scoped>
.container {
  padding: 40rpx;
}
.title {
  font-size: 36rpx;
  margin-bottom: 30rpx;
  text-align: center;
  animation: fadeIn 1s ease-in-out;
}
.info {
  background-color: #fff;
  padding: 20rpx;
  border-radius: 10rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.1);
  animation: slideUp 0.5s ease-out;
}
.info-item {
  margin: 15rpx 0;
  font-size: 28rpx;
  color: #666;
}
.status-indicator {
  display: inline-block;
  padding: 5rpx 15rpx;
  border-radius: 20rpx;
  font-size: 24rpx;
  font-weight: bold;
}
.status-default {
  background-color: #e0e0e0;
  color: #666;
}
.status-load {
  background-color: #ffcc00;
  color: #fff;
}
.status-show {
  background-color: #007aff;
  color: #fff;
}
.status-ready {
  background-color: #4cd964;
  color: #fff;
}
.status-blink {
  animation: blink 1s ease-in-out;
}
button {
  margin-top: 20rpx;
  animation: pulse 2s infinite;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes slideUp {
  from { transform: translateY(20rpx); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}
</style>
