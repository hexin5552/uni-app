<template>
  <view class="container">
    <view class="mode-switch">
      <view 
        class="mode-btn" 
        :class="{ active: currentMode === 'pomodoro' }"
        @click="switchMode('pomodoro')"
      >
        番茄钟
      </view>
      <view 
        class="mode-btn" 
        :class="{ active: currentMode === 'countdown' }"
        @click="switchMode('countdown')"
      >
        倒计时
      </view>
    </view>

    <view class="display-area">
      <view class="time-display">{{ formattedTime }}</view>
    </view>

    <view v-if="currentMode === 'countdown'" class="input-area">
      <view class="input-group">
        <text class="label">分钟</text>
        <input 
          type="number" 
          v-model="inputMinutes" 
          class="input" 
          placeholder="0"
          @blur="updateTotalTime"
        />
      </view>
      <view class="input-group">
        <text class="label">秒</text>
        <input 
          type="number" 
          v-model="inputSeconds" 
          class="input" 
          placeholder="0"
          @blur="updateTotalTime"
        />
      </view>
    </view>

    <view class="control-area">
      <view class="control-btn" @click="startTimer">
        <text>开始</text>
      </view>
      <view class="control-btn" @click="pauseTimer">
        <text>暂停</text>
      </view>
      <view class="control-btn" @click="resetTimer">
        <text>重置</text>
      </view>
    </view>

    <view class="status-text">{{ statusText }}</view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      currentMode: 'pomodoro',
      totalSeconds: 1500,
      remainingSeconds: 1500,
      inputMinutes: '0',
      inputSeconds: '0',
      timer: null,
      isRunning: false,
      statusText: ''
    }
  },
  computed: {
    formattedTime() {
      const mins = Math.floor(this.remainingSeconds / 60)
      const secs = this.remainingSeconds % 60
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
  },
  methods: {
    switchMode(mode) {
      this.currentMode = mode
      this.stopTimer()
      if (mode === 'pomodoro') {
        this.totalSeconds = 1500
        this.remainingSeconds = 1500
        this.statusText = '番茄钟模式 - 专注25分钟'
      } else {
        this.updateTotalTime()
        this.statusText = '倒计时模式 - 设置时间后开始'
      }
    },
    updateTotalTime() {
      const mins = parseInt(this.inputMinutes) || 0
      const secs = parseInt(this.inputSeconds) || 0
      this.totalSeconds = mins * 60 + secs
      this.remainingSeconds = this.totalSeconds
    },
    startTimer() {
      if (this.isRunning) return
      if (this.remainingSeconds <= 0) {
        uni.showToast({ title: '请先设置时间', icon: 'none' })
        return
      }
      this.isRunning = true
      this.statusText = this.currentMode === 'pomodoro' ? '专注中...' : '倒计时中...'
      this.timer = setInterval(() => {
        this.remainingSeconds--
        if (this.remainingSeconds <= 0) {
          this.timerEnd()
        }
      }, 1000)
    },
    pauseTimer() {
      this.stopTimer()
      this.statusText = '已暂停'
    },
    resetTimer() {
      this.stopTimer()
      if (this.currentMode === 'pomodoro') {
        this.remainingSeconds = 1500
        this.totalSeconds = 1500
      } else {
        this.updateTotalTime()
      }
      this.statusText = this.currentMode === 'pomodoro' ? '番茄钟已重置' : '倒计时已重置'
    },
    stopTimer() {
      this.isRunning = false
      if (this.timer) {
        clearInterval(this.timer)
        this.timer = null
      }
    },
    timerEnd() {
      this.stopTimer()
      uni.vibrateShort({})
      uni.showModal({
        title: '计时结束',
        content: this.currentMode === 'pomodoro' ? '番茄钟结束，休息一下吧！' : '倒计时结束！',
        showCancel: false,
        success: () => {
          this.resetTimer()
        }
      })
    }
  },
  onUnload() {
    this.stopTimer()
  },
  beforeDestroy() {
    this.stopTimer()
  }
}
</script>

<style scoped>
.container {
  padding: 40rpx;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.mode-switch {
  display: flex;
  margin-bottom: 60rpx;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 40rpx;
  padding: 8rpx;
}

.mode-btn {
  padding: 20rpx 48rpx;
  border-radius: 32rpx;
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.8);
  transition: all 0.3s;
}

.mode-btn.active {
  background: #fff;
  color: #667eea;
}

.display-area {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 40rpx;
  padding: 80rpx 120rpx;
  margin-bottom: 40rpx;
  box-shadow: 0 20rpx 60rpx rgba(0, 0, 0, 0.2);
}

.time-display {
  font-size: 96rpx;
  font-weight: bold;
  color: #333;
  font-family: 'Courier New', monospace;
}

.input-area {
  display: flex;
  gap: 40rpx;
  margin-bottom: 40rpx;
}

.input-group {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.label {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 12rpx;
}

.input {
  width: 120rpx;
  height: 80rpx;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16rpx;
  text-align: center;
  font-size: 36rpx;
  color: #333;
}

.control-area {
  display: flex;
  gap: 30rpx;
}

.control-btn {
  padding: 24rpx 56rpx;
  background: #fff;
  border-radius: 32rpx;
  font-size: 28rpx;
  color: #667eea;
  font-weight: bold;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.15);
}

.status-text {
  margin-top: 40rpx;
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.9);
}
</style>
