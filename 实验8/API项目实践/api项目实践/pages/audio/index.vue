<template>
  <view class="container">
    <view class="player-card">
      <view class="cover">
        <text class="cover-emoji">🎵</text>
      </view>
      <view class="song-info">
        <text class="song-name">{{ currentSong.name }}</text>
        <text class="artist-name">SoundHelix</text>
      </view>

      <view class="progress-area">
        <text class="time">{{ formattedCurrentTime }}</text>
        <slider 
          class="progress-slider"
          :value="progress" 
          :max="duration"
          activeColor="#4CAF50"
          backgroundColor="#ddd"
          block-size="20"
          @change="onProgressChange"
        />
        <text class="time">{{ formattedDuration }}</text>
      </view>

      <view class="volume-area">
        <text class="volume-icon">🔊</text>
        <slider 
          class="volume-slider"
          :value="volume" 
          :max="100"
          activeColor="#4CAF50"
          backgroundColor="#ddd"
          block-size="16"
          @change="onVolumeChange"
        />
      </view>

      <view class="control-area">
        <view class="mode-btn" @click="switchLoopMode">
          <text>{{ loopModeText }}</text>
        </view>
        <view class="control-btns">
          <view class="btn" @click="prevSong">
            <text>⏮</text>
          </view>
          <view class="btn play-btn" @click="togglePlay">
            <text>{{ isPlaying ? '⏸' : '▶' }}</text>
          </view>
          <view class="btn" @click="nextSong">
            <text>⏭</text>
          </view>
        </view>
        <view class="stop-btn" @click="stopPlay">
          <text>⏹</text>
        </view>
      </view>
    </view>

    <view class="playlist-area">
      <view class="section-title">播放列表</view>
      <scroll-view scroll-y class="playlist">
        <view 
          v-for="(song, index) in playlist" 
          :key="index"
          class="playlist-item"
          :class="{ active: currentIndex === index }"
          @click="playSong(index)"
        >
          <text class="song-index">{{ index + 1 }}</text>
          <text class="song-title">{{ song.name }}</text>
          <text v-if="currentIndex === index && isPlaying" class="playing-icon">🎶</text>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      playlist: [
        { name: 'SoundHelix Song 1', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
        { name: 'SoundHelix Song 2', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
        { name: 'SoundHelix Song 3', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' }
      ],
      currentIndex: 0,
      isPlaying: false,
      progress: 0,
      duration: 0,
      volume: 80,
      loopMode: 'list',
      audioContext: null
    }
  },
  computed: {
    currentSong() {
      return this.playlist[this.currentIndex] || this.playlist[0]
    },
    formattedCurrentTime() {
      return this.formatTime(this.progress)
    },
    formattedDuration() {
      return this.formatTime(this.duration)
    },
    loopModeText() {
      const modes = {
        single: '🔂 单曲',
        list: '🔁 列表',
        order: '➡️ 顺序'
      }
      return modes[this.loopMode]
    }
  },
  methods: {
    formatTime(seconds) {
      const mins = Math.floor(seconds / 60)
      const secs = Math.floor(seconds % 60)
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    },
    initAudio() {
      if (this.audioContext) {
        this.audioContext.destroy()
      }
      this.audioContext = uni.createInnerAudioContext()
      this.audioContext.volume = this.volume / 100
      
      this.audioContext.onTimeUpdate = () => {
        if (this.audioContext) {
          this.progress = this.audioContext.currentTime || 0
          this.duration = this.audioContext.duration || 0
        }
      }
      
      this.audioContext.onEnded = () => {
        this.handleSongEnd()
      }
      
      this.audioContext.onError = (err) => {
        console.error('音频播放错误:', err)
        uni.showToast({ title: '播放失败', icon: 'none' })
        this.isPlaying = false
      }
    },
    togglePlay() {
      if (!this.audioContext) {
        this.initAudio()
      }
      if (this.isPlaying) {
        this.audioContext.pause()
        this.isPlaying = false
      } else {
        this.audioContext.src = this.currentSong.url
        this.audioContext.play().catch(() => {
          uni.showToast({ title: '播放失败，请重试', icon: 'none' })
          this.isPlaying = false
        })
        this.isPlaying = true
      }
    },
    stopPlay() {
      if (this.audioContext) {
        this.audioContext.stop()
        this.isPlaying = false
        this.progress = 0
        this.duration = 0
      }
    },
    playSong(index) {
      if (!this.audioContext) {
        this.initAudio()
      }
      this.currentIndex = index
      this.progress = 0
      this.duration = 0
      this.audioContext.src = this.currentSong.url
      this.audioContext.play().catch(() => {
        uni.showToast({ title: '播放失败，请重试', icon: 'none' })
        this.isPlaying = false
      })
      this.isPlaying = true
    },
    prevSong() {
      if (this.loopMode === 'single') {
        this.playSong(this.currentIndex)
      } else {
        let newIndex = this.currentIndex - 1
        if (newIndex < 0) {
          newIndex = this.playlist.length - 1
        }
        this.playSong(newIndex)
      }
    },
    nextSong() {
      this.handleSongEnd()
    },
    handleSongEnd() {
      if (this.loopMode === 'single') {
        this.playSong(this.currentIndex)
      } else if (this.loopMode === 'list') {
        let newIndex = (this.currentIndex + 1) % this.playlist.length
        this.playSong(newIndex)
      } else {
        if (this.currentIndex < this.playlist.length - 1) {
          this.playSong(this.currentIndex + 1)
        } else {
          this.isPlaying = false
          this.progress = 0
          this.duration = 0
        }
      }
    },
    switchLoopMode() {
      const modes = ['list', 'single', 'order']
      const currentIndex = modes.indexOf(this.loopMode)
      this.loopMode = modes[(currentIndex + 1) % modes.length]
      uni.showToast({ title: this.loopModeText, icon: 'none' })
    },
    onProgressChange(e) {
      if (this.audioContext) {
        this.audioContext.seek(e.detail.value)
        this.progress = e.detail.value
      }
    },
    onVolumeChange(e) {
      this.volume = e.detail.value
      if (this.audioContext) {
        this.audioContext.volume = this.volume / 100
      }
    }
  },
  onUnload() {
    if (this.audioContext) {
      this.audioContext.destroy()
      this.audioContext = null
    }
  },
  beforeDestroy() {
    if (this.audioContext) {
      this.audioContext.destroy()
      this.audioContext = null
    }
  }
}
</script>

<style scoped>
.container {
  padding: 40rpx;
  min-height: 100vh;
  background: linear-gradient(180deg, #1a1a2e 0%, #16213e 100%);
}

.player-card {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 32rpx;
  padding: 40rpx;
  margin-bottom: 30rpx;
  backdrop-filter: blur(10px);
}

.cover {
  width: 280rpx;
  height: 280rpx;
  margin: 0 auto 30rpx;
  background: linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cover-emoji {
  font-size: 120rpx;
}

.song-info {
  text-align: center;
  margin-bottom: 30rpx;
}

.song-name {
  font-size: 36rpx;
  font-weight: bold;
  color: #fff;
  display: block;
  margin-bottom: 8rpx;
}

.artist-name {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.6);
}

.progress-area {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}

.time {
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.8);
  width: 80rpx;
}

.progress-slider {
  flex: 1;
  margin: 0 16rpx;
}

.volume-area {
  display: flex;
  align-items: center;
  margin-bottom: 30rpx;
  padding: 0 10rpx;
}

.volume-icon {
  font-size: 28rpx;
  width: 40rpx;
}

.volume-slider {
  flex: 1;
  margin-left: 16rpx;
}

.control-area {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.mode-btn {
  padding: 12rpx 20rpx;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20rpx;
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.9);
}

.control-btns {
  display: flex;
  align-items: center;
  gap: 40rpx;
}

.btn {
  width: 80rpx;
  height: 80rpx;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
}

.play-btn {
  width: 100rpx;
  height: 100rpx;
  background: #4CAF50;
  font-size: 40rpx;
}

.stop-btn {
  width: 60rpx;
  height: 60rpx;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
}

.playlist-area {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 32rpx;
  padding: 30rpx;
}

.section-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #fff;
  margin-bottom: 20rpx;
}

.playlist {
  max-height: 400rpx;
}

.playlist-item {
  display: flex;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 1rpx solid rgba(255, 255, 255, 0.1);
}

.playlist-item:last-child {
  border-bottom: none;
}

.playlist-item.active {
  background: rgba(76, 175, 80, 0.2);
  padding: 20rpx;
  margin: 0 -20rpx;
  border-radius: 16rpx;
}

.song-index {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.5);
  width: 40rpx;
  margin-right: 20rpx;
}

.song-title {
  flex: 1;
  font-size: 26rpx;
  color: #fff;
}

.playing-icon {
  font-size: 24rpx;
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
</style>
