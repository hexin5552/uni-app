<template>
  <view class="container">
    <view class="info">
      <view class="info-item">当前页面：列表页</view>
      <view class="info-item">加载时间：{{ loadTime }}</view>
      <view class="info-item">实时时间：{{ currentTime }}</view>
      <view class="info-item">
        生命周期状态：
        <view class="status-indicator" :class="statusClass">{{ lifecycleStatus }}</view>
      </view>
    </view>
    <!-- uni-ui 列表组件 -->
    <uni-list>
      <uni-list-item
        v-for="(item, index) in listData"
        :key="item.id"
        :title="'点击查看详情'"
        :note="item.title"
        @click="goToDetail(item)"
        :class="'list-item'"
        :style="{ animationDelay: index * 0.1 + 's' }"
      />
    </uni-list>
  </view>
</template>

<script>
export default {
  data() {
    return {
      listData: [
        { id: 1, title: '实验项目1', content: '生命周期函数应用' },
        { id: 2, title: '实验项目2', content: '页面跳转与参数传递' }
      ],
      loadTime: '',
      currentTime: '',
      lifecycleStatus: '未加载',
      statusClass: 'status-default'
    }
  },
  // 页面加载时触发（获取参数、请求数据）
  onLoad(option) {
    this.loadTime = new Date().toLocaleString()
    this.updateStatus('onLoad 触发', 'status-load')
    console.log('📋 列表页生命周期：onLoad —— 页面加载，可请求数据')
    this.startTime()
  },
  // 页面显示时触发
  onShow() {
    this.updateStatus('onShow 触发', 'status-show')
    console.log('📋 列表页生命周期：onShow —— 页面显示')
  },
  // 页面初次渲染完成时触发
  onReady() {
    this.updateStatus('onReady 触发', 'status-ready')
    console.log('📋 列表页生命周期：onReady —— 页面渲染完成')
  },
  // 页面卸载时触发
  onUnload() {
    console.log('📋 列表页生命周期：onUnload —— 页面销毁')
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
    // 跳转到详情页并传递参数
    goToDetail(item) {
      uni.navigateTo({
        url: `/pages/detail/detail?id=${item.id}&title=${item.title}&content=${item.content}`
      })
    }
  }
}
</script>

<style scoped>
.container {
  padding: 40rpx;
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
.list-item {
  animation: slideIn 0.5s ease-out forwards;
  opacity: 0;
}

@keyframes slideUp {
  from { transform: translateY(20rpx); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
@keyframes slideIn {
  from { transform: translateX(-20rpx); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}
@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
</style>
