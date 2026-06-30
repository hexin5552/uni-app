<script>
export default {
  onLaunch: function() {
    this.initResponsiveScale()
    this.initPlatformInfo()
  },
  onShow: function() {},
  onHide: function() {},
  methods: {
    initResponsiveScale() {
      const systemInfo = uni.getSystemInfoSync()
      const screenWidth = systemInfo.windowWidth
      const screenHeight = systemInfo.windowHeight
      
      const designWidth = 375
      const designHeight = 667
      
      const scaleX = screenWidth / designWidth
      const scaleY = screenHeight / designHeight
      const scale = Math.min(scaleX, scaleY)
      
      const root = document.documentElement || document.body
      if (root) {
        root.style.setProperty('--scale', scale)
      }
      
      uni.setStorageSync('screenScale', scale)
      uni.setStorageSync('screenWidth', screenWidth)
      uni.setStorageSync('screenHeight', screenHeight)
    },
    initPlatformInfo() {
      const systemInfo = uni.getSystemInfoSync()
      const platform = {
        os: systemInfo.system || '',
        platform: systemInfo.platform || '',
        model: systemInfo.model || '',
        version: systemInfo.version || '',
        screenWidth: systemInfo.windowWidth,
        screenHeight: systemInfo.windowHeight,
        pixelRatio: systemInfo.pixelRatio,
        statusBarHeight: systemInfo.statusBarHeight || 0,
        isIPhoneX: this.isIPhoneX(systemInfo)
      }
      
      uni.setStorageSync('platformInfo', JSON.stringify(platform))
    },
    isIPhoneX(systemInfo) {
      const model = systemInfo.model || ''
      const height = systemInfo.windowHeight || 0
      return model.includes('iPhone X') || 
             model.includes('iPhone 11') || 
             model.includes('iPhone 12') || 
             model.includes('iPhone 13') || 
             model.includes('iPhone 14') ||
             height >= 812
    }
  }
}
</script>

<style lang="scss">
@import './uni.scss';

page {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 28rpx;
  line-height: 1.5;
  color: $uni-text-color;
  background-color: $uni-bg-color;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  box-sizing: border-box;
}

view, text {
  box-sizing: border-box;
}

button {
  margin: 0;
  padding: 0;
  background: transparent;
  border: none;
  
  &::after {
    border: none;
  }
}

image {
  display: block;
}

.page-container {
  min-height: 100vh;
  padding-top: constant(safe-area-inset-top);
  padding-top: env(safe-area-inset-top);
}

.safe-area-bottom {
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}

.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.flex-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.flex-start {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.flex-col {
  display: flex;
  flex-direction: column;
}

.text-ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.text-ellipsis-multi {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

@media screen and (max-width: 320px) {
  :root {
    font-size: 24rpx;
  }
}

@media screen and (min-width: 414px) {
  :root {
    font-size: 32rpx;
  }
}

@media screen and (min-width: 768px) {
  :root {
    font-size: 40rpx;
  }
}
</style>
