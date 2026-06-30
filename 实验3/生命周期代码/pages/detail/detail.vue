<template>
  <view class="detail">
    <view class="info">
      <view class="info-item">当前页面：详情页</view>
      <view class="info-item">加载时间：{{ loadTime }}</view>
      <view class="info-item">实时时间：{{ currentTime }}</view>
      <view class="info-item">
        生命周期状态：
        <view class="status-indicator" :class="statusClass">{{ lifecycleStatus }}</view>
      </view>
    </view>
    <view class="params" :class="{ 'params-animated': isParamsVisible }">
      <view class="params-title">页面参数</view>
      <view class="item">ID：{{ info.id }}</view>
      <view class="item">标题：{{ info.title }}</view>
      <view class="item">内容：{{ info.content }}</view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      info: {},
      loadTime: '',
      currentTime: '',
      lifecycleStatus: '未加载',
      statusClass: 'status-default',
      isParamsVisible: false
    }
  },
  // 页面加载，接收上一页传递的参数
  onLoad(option) {
    this.loadTime = new Date().toLocaleString()
    this.updateStatus('onLoad 触发', 'status-load')
    console.log('🔍 详情页生命周期：onLoad —— 接收参数：', option)
    this.info = option // 保存参数
    this.startTime()
  },
  onShow() {
    this.updateStatus('onShow 触发', 'status-show')
    console.log('🔍 详情页生命周期：onShow —— 页面显示')
  },
  onReady() {
    this.updateStatus('onReady 触发', 'status-ready')
    console.log('🔍 详情页生命周期：onReady —— 页面渲染完成')
    // 延迟显示参数，添加动画效果
    setTimeout(() => {
      this.isParamsVisible = true
    }, 300)
  },
  onUnload() {
    console.log('🔍 详情页生命周期：onUnload —— 页面已卸载')
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
    }
  }
}
</script>

<style scoped>
.detail {
  padding: 40rpx;
  font-size: 32rpx;
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
.params {
  background-color: #f0f8ff;
  padding: 20rpx;
  border-radius: 10rpx;
  border-left: 4rpx solid #007aff;
  opacity: 0;
  transform: translateY(20rpx);
  transition: all 0.5s ease-out;
}
.params-animated {
  opacity: 1;
  transform: translateY(0);
}
.params-title {
  font-size: 30rpx;
  font-weight: bold;
  margin-bottom: 20rpx;
  color: #007aff;
}
.item {
  margin: 15rpx 0;
  padding: 10rpx;
  background-color: rgba(0, 122, 255, 0.05);
  border-radius: 5rpx;
}

@keyframes slideUp {
  from { transform: translateY(20rpx); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
</style>
