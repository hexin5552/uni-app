<template>
  <view class="container">
    <view class="player-area">
      <video 
        id="videoPlayer"
        :src="currentVideo.url"
        controls
        class="video"
        @timeupdate="onTimeUpdate"
        @fullscreenchange="onFullScreenChange"
        @error="onVideoError"
        @loadedmetadata="onLoadedMetadata"
      />
      
      <view class="video-controls">
        <view class="control-row">
          <view class="speed-area">
            <text class="label">播放速度:</text>
            <view class="speed-btns">
              <view 
                v-for="speed in speeds" 
                :key="speed"
                class="speed-btn"
                :class="{ active: currentSpeed === speed }"
                @click="setSpeed(speed)"
              >
                {{ speed }}x
              </view>
            </view>
          </view>
          
          <view class="fullscreen-btn" @click="toggleFullScreen">
            <text>{{ isFullScreen ? '⛶' : '⛶' }}</text>
          </view>
        </view>
      </view>
      
      <view class="video-info">
        <text class="video-title">{{ currentVideo.title }}</text>
        <text class="video-progress">当前进度: {{ formattedProgress }}</text>
      </view>
    </view>

    <view class="video-list-area">
      <view class="section-title">视频列表</view>
      <scroll-view scroll-y class="video-list">
        <view 
          v-for="(video, index) in videoList" 
          :key="index"
          class="video-item"
          :class="{ active: currentIndex === index }"
          @click="playVideo(index)"
        >
          <view class="video-thumb">
            <text class="thumb-emoji">📹</text>
          </view>
          <view class="video-item-info">
            <text class="video-item-title">{{ video.title }}</text>
            <text class="video-item-desc">点击播放</text>
          </view>
        </view>
      </scroll-view>
    </view>

    <view class="history-area">
      <view class="section-header">
        <text class="section-title">播放历史</text>
        <view v-if="playHistory.length > 0" class="clear-btn" @click="clearHistory">
          <text>清空</text>
        </view>
      </view>
      
      <scroll-view scroll-y class="history-list" v-if="playHistory.length > 0">
        <view 
          v-for="(item, index) in playHistory" 
          :key="index"
          class="history-item"
          @click="resumeFromHistory(item)"
        >
          <text class="history-title">{{ item.title }}</text>
          <text class="history-progress">上次观看: {{ formatTime(item.currentTime) }}</text>
        </view>
      </scroll-view>
      <view v-else class="empty-history">
        <text>暂无播放历史</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      videoList: [
        { 
          title: 'Big Buck Bunny', 
          url: 'https://www.w3schools.com/html/mov_bbb.mp4' 
        },
        { 
          title: 'For Bigger Blazes', 
          url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4' 
        },
        { 
          title: 'Elephant Dream', 
          url: 'https://download.blender.org/peach/trailer/trailer_1080p.ogg' 
        }
      ],
      currentIndex: 0,
      currentSpeed: 1.0,
      speeds: [0.5, 1.0, 1.5, 2.0],
      currentTime: 0,
      duration: 0,
      isFullScreen: false,
      playHistory: [],
      videoContext: null
    }
  },
  computed: {
    currentVideo() {
      return this.videoList[this.currentIndex] || this.videoList[0]
    },
    formattedProgress() {
      return this.formatTime(this.currentTime)
    }
  },
  methods: {
    formatTime(seconds) {
      const mins = Math.floor(seconds / 60)
      const secs = Math.floor(seconds % 60)
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    },
    initVideoContext() {
      setTimeout(() => {
        this.videoContext = uni.createVideoContext('videoPlayer')
        if (this.videoContext) {
          this.videoContext.playbackRate = this.currentSpeed
        }
      }, 300)
    },
    playVideo(index) {
      this.saveCurrentProgress()
      this.currentIndex = index
      this.currentTime = 0
      if (this.videoContext) {
        this.videoContext.play()
      }
    },
    setSpeed(speed) {
      this.currentSpeed = speed
      if (this.videoContext) {
        this.videoContext.playbackRate = speed
      }
      uni.showToast({ title: `${speed}x`, icon: 'none' })
    },
    toggleFullScreen() {
      if (this.videoContext) {
        if (this.isFullScreen) {
          this.videoContext.exitFullScreen()
        } else {
          this.videoContext.requestFullScreen({ direction: 0 })
        }
      }
    },
    onTimeUpdate(e) {
      this.currentTime = e.detail.currentTime
    },
    onLoadedMetadata(e) {
      this.duration = e.detail.duration || 0
    },
    onFullScreenChange(e) {
      this.isFullScreen = e.detail.fullScreen
    },
    onVideoError(e) {
      console.error('视频播放错误:', e)
      uni.showToast({ title: '视频加载失败', icon: 'none' })
    },
    loadHistory() {
      try {
        const history = uni.getStorageSync('videoPlayHistory')
        if (history) {
          this.playHistory = JSON.parse(history)
        }
      } catch (e) {
        console.error('读取历史记录失败:', e)
        this.playHistory = []
      }
    },
    saveCurrentProgress() {
      if (this.currentTime > 0 && this.currentVideo.url) {
        const record = {
          title: this.currentVideo.title,
          url: this.currentVideo.url,
          currentTime: this.currentTime,
          timestamp: Date.now()
        }
        
        const existsIndex = this.playHistory.findIndex(item => item.url === record.url)
        if (existsIndex >= 0) {
          this.playHistory.splice(existsIndex, 1)
        }
        
        this.playHistory.unshift(record)
        
        if (this.playHistory.length > 10) {
          this.playHistory = this.playHistory.slice(0, 10)
        }
        
        try {
          uni.setStorageSync('videoPlayHistory', JSON.stringify(this.playHistory))
        } catch (e) {
          console.error('保存历史记录失败:', e)
        }
      }
    },
    resumeFromHistory(item) {
      const index = this.videoList.findIndex(v => v.url === item.url)
      if (index >= 0) {
        this.currentIndex = index
        this.currentTime = item.currentTime
        setTimeout(() => {
          if (this.videoContext) {
            this.videoContext.seek(item.currentTime)
            this.videoContext.play()
          }
        }, 500)
      } else {
        uni.showToast({ title: '视频不存在', icon: 'none' })
      }
    },
    clearHistory() {
      uni.showModal({
        title: '确认清空',
        content: '确定要清空播放历史吗？',
        success: (res) => {
          if (res.confirm) {
            this.playHistory = []
            uni.removeStorageSync('videoPlayHistory')
            uni.showToast({ title: '已清空', icon: 'success' })
          }
        }
      })
    }
  },
  onLoad() {
    this.initVideoContext()
    this.loadHistory()
  },
  onShow() {
    this.initVideoContext()
  },
  onUnload() {
    this.saveCurrentProgress()
    this.videoContext = null
  },
  beforeDestroy() {
    this.saveCurrentProgress()
    this.videoContext = null
  }
}
</script>

<style scoped>
.container {
  padding: 40rpx;
  min-height: 100vh;
  background: linear-gradient(180deg, #2d3436 0%, #000 100%);
}

.player-area {
  margin-bottom: 30rpx;
}

.video {
  width: 100%;
  height: 420rpx;
  border-radius: 16rpx;
  background: #000;
}

.video-controls {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16rpx;
  padding: 20rpx;
  margin-top: 16rpx;
}

.control-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.speed-area {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.label {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.7);
}

.speed-btns {
  display: flex;
  gap: 12rpx;
}

.speed-btn {
  padding: 12rpx 20rpx;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12rpx;
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.8);
}

.speed-btn.active {
  background: #e74c3c;
  color: #fff;
}

.fullscreen-btn {
  width: 60rpx;
  height: 60rpx;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
}

.video-info {
  margin-top: 16rpx;
  padding: 0 8rpx;
}

.video-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #fff;
  display: block;
  margin-bottom: 8rpx;
}

.video-progress {
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.6);
}

.video-list-area {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 24rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.section-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #fff;
  margin-bottom: 20rpx;
}

.video-list {
  max-height: 300rpx;
}

.video-item {
  display: flex;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 1rpx solid rgba(255, 255, 255, 0.1);
}

.video-item:last-child {
  border-bottom: none;
}

.video-item.active {
  background: rgba(231, 76, 60, 0.2);
  padding: 20rpx;
  margin: 0 -20rpx;
  border-radius: 16rpx;
}

.video-thumb {
  width: 80rpx;
  height: 60rpx;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20rpx;
}

.thumb-emoji {
  font-size: 32rpx;
}

.video-item-info {
  flex: 1;
}

.video-item-title {
  font-size: 26rpx;
  color: #fff;
  display: block;
  margin-bottom: 4rpx;
}

.video-item-desc {
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.5);
}

.history-area {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 24rpx;
  padding: 30rpx;
}

.clear-btn {
  padding: 8rpx 20rpx;
  background: rgba(231, 76, 60, 0.8);
  border-radius: 16rpx;
  font-size: 22rpx;
  color: #fff;
}

.history-list {
  max-height: 250rpx;
}

.history-item {
  padding: 16rpx 0;
  border-bottom: 1rpx solid rgba(255, 255, 255, 0.1);
}

.history-item:last-child {
  border-bottom: none;
}

.history-title {
  font-size: 26rpx;
  color: #fff;
  display: block;
  margin-bottom: 4rpx;
}

.history-progress {
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.5);
}

.empty-history {
  text-align: center;
  padding: 40rpx;
  color: rgba(255, 255, 255, 0.4);
  font-size: 24rpx;
}
</style>
