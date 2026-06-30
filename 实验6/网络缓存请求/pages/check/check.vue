<template>
  <view class="test-container">
    <!-- 顶部标题 -->
    <view class="header">
      <text class="title">🧪 功能测试中心</text>
      <text class="subtitle">点击每个功能卡片，测试对应功能是否正常</text>
    </view>

    <!-- 1. 网络请求测试 -->
    <view class="test-card" :class="{ success: testResults.network, error: testResults.network === false }">
      <view class="card-header">
        <text class="card-icon">🌐</text>
        <view class="card-title-area">
          <text class="card-title">网络请求</text>
          <text class="card-desc">测试 uni.request 是否能正常发送请求</text>
        </view>
        <view class="card-status" :class="{ done: testResults.network }">
          {{ testResults.network === undefined ? '待测试' : (testResults.network ? '✅ 通过' : '❌ 失败') }}
        </view>
      </view>
      <view class="card-content">
        <view class="test-area">
          <button class="test-btn" @click="testNetwork">开始测试</button>
        </view>
        <view v-if="testLogs.network" class="result-area">
          <text class="result-title">📝 测试结果：</text>
          <view class="log-list">
            <text v-for="(log, i) in testLogs.network" :key="i" class="log-item">{{ log }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 2. 数据缓存测试 -->
    <view class="test-card" :class="{ success: testResults.cache, error: testResults.cache === false }">
      <view class="card-header">
        <text class="card-icon">💾</text>
        <view class="card-title-area">
          <text class="card-title">数据缓存</text>
          <text class="card-desc">测试本地存储读写功能是否正常</text>
        </view>
        <view class="card-status" :class="{ done: testResults.cache }">
          {{ testResults.cache === undefined ? '待测试' : (testResults.cache ? '✅ 通过' : '❌ 失败') }}
        </view>
      </view>
      <view class="card-content">
        <view class="test-area">
          <button class="test-btn" @click="testCache">开始测试</button>
          <button class="test-btn secondary" @click="showCacheInfo">查看缓存</button>
        </view>
        <view v-if="testLogs.cache" class="result-area">
          <text class="result-title">📝 测试结果：</text>
          <view class="log-list">
            <text v-for="(log, i) in testLogs.cache" :key="i" class="log-item">{{ log }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 3. 离线阅读测试 -->
    <view class="test-card" :class="{ success: testResults.offline, error: testResults.offline === false }">
      <view class="card-header">
        <text class="card-icon">📖</text>
        <view class="card-title-area">
          <text class="card-title">离线阅读</text>
          <text class="card-desc">断网后也能看已缓存的新闻</text>
        </view>
        <view class="card-status" :class="{ done: testResults.offline }">
          {{ testResults.offline === undefined ? '待测试' : (testResults.offline ? '✅ 通过' : '❌ 失败') }}
        </view>
      </view>
      <view class="card-content">
        <view class="test-area">
          <button class="test-btn" @click="goToNewsForCache">1️⃣ 先去看新闻缓存</button>
          <button class="test-btn secondary" @click="checkOfflineCache">2️⃣ 检查离线数据</button>
        </view>
        <view class="offline-guide">
          <view class="guide-step">
            <text class="step-num">1️⃣</text>
            <view class="step-content">
              <text class="step-title">去看新闻</text>
              <text class="step-desc">点击上面按钮，随便看一条新闻详情，系统会自动缓存</text>
            </view>
          </view>
          <view class="guide-step">
            <text class="step-num">2️⃣</text>
            <view class="step-content">
              <text class="step-title">模拟断网</text>
              <text class="step-desc">打开浏览器按 F12 → 点击 Network → 勾选 Offline</text>
            </view>
          </view>
          <view class="guide-step">
            <text class="step-num">3️⃣</text>
            <view class="step-content">
              <text class="step-title">验证离线</text>
              <text class="step-desc">再次点击刚才看过的新闻，应该能正常显示！</text>
            </view>
          </view>
        </view>
        <view v-if="cachedNewsCount > 0" class="cache-info">
          <text class="cache-label">📚 已缓存新闻数量：</text>
          <text class="cache-count">{{ cachedNewsCount }} 条</text>
        </view>
      </view>
    </view>

    <!-- 4. 网络检测测试 -->
    <view class="test-card" :class="{ success: testResults.networkCheck, error: testResults.networkCheck === false }">
      <view class="card-header">
        <text class="card-icon">📶</text>
        <view class="card-title-area">
          <text class="card-title">网络检测</text>
          <text class="card-desc">实时检测当前网络连接状态</text>
        </view>
        <view class="card-status" :class="{ done: testResults.networkCheck }">
          {{ testResults.networkCheck === undefined ? '待测试' : (testResults.networkCheck ? '✅ 通过' : '⚠️ 无网络') }}
        </view>
      </view>
      <view class="card-content">
        <view class="test-area">
          <button class="test-btn" @click="testNetworkStatus">检测网络</button>
        </view>
        <view class="network-status" :class="{ online: currentNetwork }">
          <text class="network-icon">{{ currentNetwork ? '🟢' : '🔴' }}</text>
          <text class="network-text">{{ currentNetwork ? '当前网络在线' : '当前网络离线' }}</text>
        </view>
      </view>
    </view>

    <!-- 5. 下拉刷新测试 -->
    <view class="test-card" :class="{ success: testResults.refresh, error: testResults.refresh === false }">
      <view class="card-header">
        <text class="card-icon">🔄</text>
        <view class="card-title-area">
          <text class="card-title">下拉刷新</text>
          <text class="card-desc">从上往下滑动刷新新闻列表</text>
        </view>
        <view class="card-status" :class="{ done: testResults.refresh }">
          {{ testResults.refresh === undefined ? '待测试' : (testResults.refresh ? '✅ 通过' : '❌ 失败') }}
        </view>
      </view>
      <view class="card-content">
        <view class="test-area">
          <button class="test-btn" @click="goToNews">🚀 去新闻列表测试</button>
        </view>
        <view class="refresh-guide">
          <view class="refresh-demo">
            <view class="swipe-hand">👆</view>
            <view class="swipe-arrow">⬇️</view>
            <text class="swipe-text">从顶部往下滑</text>
          </view>
          <view class="refresh-steps">
            <view class="refresh-step">
              <text class="step-bullet">○</text>
              <text class="step-text">进入新闻列表页</text>
            </view>
            <view class="refresh-step">
              <text class="step-bullet">○</text>
              <text class="step-text">用手指从屏幕顶部往下滑</text>
            </view>
            <view class="refresh-step">
              <text class="step-bullet">○</text>
              <text class="step-text">看到刷新动画和加载提示</text>
            </view>
            <view class="refresh-step">
              <text class="step-bullet">○</text>
              <text class="step-text">刷新完成后显示"刷新成功"</text>
            </view>
          </view>
        </view>
        <view v-if="refreshTipsShown" class="success-tip-box">
          <text class="success-icon">🎉</text>
          <text class="success-text">刷新测试完成！</text>
        </view>
      </view>
    </view>

    <!-- 6. 错误处理测试 -->
    <view class="test-card" :class="{ success: testResults.error, error: testResults.error === false }">
      <view class="card-header">
        <text class="card-icon">🛡️</text>
        <view class="card-title-area">
          <text class="card-title">错误处理</text>
          <text class="card-desc">测试错误提示是否友好清晰</text>
        </view>
        <view class="card-status" :class="{ done: testResults.error }">
          {{ testResults.error === undefined ? '待测试' : (testResults.error ? '✅ 通过' : '❌ 失败') }}
        </view>
      </view>
      <view class="card-content">
        <view class="test-area">
          <button class="test-btn" @click="testError">模拟错误</button>
        </view>
        <view class="tips-box">
          <text class="tips-title">💡 使用提示：</text>
          <text class="tips-text">点击按钮后会看到错误提示弹窗</text>
          <text class="tips-text">断网刷新列表时也会看到错误提示</text>
        </view>
      </view>
    </view>

    <!-- 7. 页面跳转测试 -->
    <view class="test-card" :class="{ success: testResults.navigation, error: testResults.navigation === false }">
      <view class="card-header">
        <text class="card-icon">📱</text>
        <view class="card-title-area">
          <text class="card-title">页面跳转</text>
          <text class="card-desc">测试页面之间的跳转是否正常</text>
        </view>
        <view class="card-status" :class="{ done: testResults.navigation }">
          {{ testResults.navigation === undefined ? '待测试' : (testResults.navigation ? '✅ 通过' : '❌ 失败') }}
        </view>
      </view>
      <view class="card-content">
        <view class="nav-buttons">
          <button class="nav-btn" @click="goToNews">📖 新闻列表</button>
          <button class="nav-btn" @click="goToDetail">📝 新闻详情</button>
        </view>
        <view class="tips-box">
          <text class="tips-title">💡 使用提示：</text>
          <text class="tips-text">点击按钮跳转到对应页面</text>
          <text class="tips-text">从新闻列表点击新闻也能跳转到详情页</text>
        </view>
      </view>
    </view>

    <!-- 完成统计 -->
    <view class="summary-section">
      <view class="summary-header">
        <text class="summary-title">📊 测试进度</text>
        <text class="summary-count">{{ completedCount }}/{{ totalCount }} 项完成</text>
      </view>
      <view class="summary-bar">
        <view class="summary-fill" :style="{width: progressPercent + '%'}"></view>
      </view>
      <view class="summary-tips">
        <text v-if="completedCount === totalCount" class="success-tip">🎉 恭喜！所有功能测试完成！</text>
        <text v-else class="progress-tip">继续测试剩余 {{ totalCount - completedCount }} 项功能</text>
      </view>
    </view>
  </view>
</template>

<script>
import { request } from '@/utils/request.js';
import { setCache, getCache, clearAllNewsCache } from '@/utils/cache.js';
import { checkNetwork, onNetworkChange } from '@/utils/network.js';

export default {
  data() {
    return {
      testResults: {
        network: undefined,
        cache: undefined,
        offline: undefined,
        networkCheck: undefined,
        refresh: undefined,
        error: undefined,
        navigation: undefined
      },
      testLogs: {
        network: null,
        cache: null,
        offline: null
      },
      currentNetwork: null,
      cachedNewsCount: 0,
      refreshTipsShown: false
    };
  },
  computed: {
    completedCount() {
      return Object.values(this.testResults).filter(v => v === true).length;
    },
    totalCount() {
      return Object.keys(this.testResults).length;
    },
    progressPercent() {
      return Math.round((this.completedCount / this.totalCount) * 100);
    }
  },
  onLoad() {
    this.checkInitialNetwork();
    onNetworkChange((isConnected) => {
      this.currentNetwork = isConnected;
    });
  },
  methods: {
    async checkInitialNetwork() {
      this.currentNetwork = await checkNetwork();
    },
    async testNetwork() {
      this.testLogs.network = ['🔄 正在发送网络请求...'];
      uni.showLoading({ title: '测试中...' });
      try {
        const data = await request({ url: 'https://jsonplaceholder.typicode.com/posts/1' });
        this.testLogs.network.push('✅ 请求成功！');
        this.testLogs.network.push('📄 返回数据：标题=' + data.title.substring(0, 20) + '...');
        this.testResults.network = true;
        uni.showToast({ title: '网络请求测试通过！', icon: 'success' });
      } catch (e) {
        this.testLogs.network.push('❌ 请求失败：' + (e.message || '未知错误'));
        this.testResults.network = false;
      }
      uni.hideLoading();
    },
    async testCache() {
      this.testLogs.cache = ['🔄 正在测试缓存功能...'];
      uni.showLoading({ title: '测试中...' });
      try {
        const testKey = 'test_cache_' + Date.now();
        const testData = { message: '测试数据', time: new Date().toLocaleString() };
        
        this.testLogs.cache.push('📝 写入缓存数据...');
        setCache(testKey, testData, 1);
        
        this.testLogs.cache.push('📖 读取缓存数据...');
        const cached = getCache(testKey);
        
        if (cached && cached.message === testData.message) {
          this.testLogs.cache.push('✅ 缓存读写成功！');
          this.testLogs.cache.push('📄 读取到的数据：' + cached.message);
          this.testResults.cache = true;
          uni.showToast({ title: '缓存测试通过！', icon: 'success' });
        } else {
          this.testLogs.cache.push('❌ 缓存读取失败');
          this.testResults.cache = false;
        }
      } catch (e) {
        this.testLogs.cache.push('❌ 测试失败：' + (e.message || '未知错误'));
        this.testResults.cache = false;
      }
      uni.hideLoading();
    },
    showCacheInfo() {
      const info = uni.getStorageInfoSync();
      uni.showModal({
        title: '缓存信息',
        content: `缓存数量：${info.keys.length}个\n占用空间：${(info.currentSize / 1024).toFixed(2)}KB`,
        showCancel: false
      });
    },
    goToNewsForCache() {
      uni.navigateTo({
        url: '/pages/news/news?from=cache-test'
      });
    },
    checkOfflineCache() {
      const info = uni.getStorageInfoSync();
      const newsKeys = info.keys.filter(key => key.startsWith('news_'));
      this.cachedNewsCount = newsKeys.length;
      
      let cacheDetails = '';
      newsKeys.forEach(key => {
        const value = uni.getStorageSync(key);
        const expireMinutes = value?.expireTime ? (value.expireTime / 1000 / 60).toFixed(0) : '未知';
        const ageMinutes = value?.timestamp ? ((Date.now() - value.timestamp) / 1000 / 60).toFixed(0) : '未知';
        cacheDetails += `\n• ${key}\n  - 已存在: ${ageMinutes}分钟\n  - 有效期: ${expireMinutes}分钟`;
      });
      
      if (this.cachedNewsCount > 0) {
        uni.showModal({
          title: '📚 缓存检查结果',
          content: `已找到 ${this.cachedNewsCount} 条缓存数据：${cacheDetails}\n\n离线阅读功能已准备就绪！\n\n您可以：\n1. 在浏览器中按 F12\n2. 点击 Network\n3. 勾选 Offline\n4. 再次打开已缓存的新闻`,
          showCancel: false,
          confirmText: '知道了'
        });
      } else {
        uni.showModal({
          title: '⚠️ 还没有缓存',
          content: '请先去新闻列表查看至少一条新闻详情，系统会自动缓存',
          showCancel: false
        });
      }
    },
    async testOffline() {
      this.testLogs.offline = ['🔍 正在检查离线阅读功能...'];
      uni.showLoading({ title: '测试中...' });
      
      const hasNetwork = await checkNetwork();
      
      if (!hasNetwork) {
        this.testLogs.offline.push('⚠️ 当前处于离线状态');
        const info = uni.getStorageInfoSync();
        const newsKeys = info.keys.filter(key => key.startsWith('news_detail_'));
        
        if (newsKeys.length > 0) {
          this.testLogs.offline.push('✅ 已缓存的新闻可以正常查看！');
          this.testResults.offline = true;
          uni.showToast({ title: '离线阅读测试通过！', icon: 'success' });
        } else {
          this.testLogs.offline.push('❌ 没有找到缓存数据，请先在线查看新闻');
          this.testResults.offline = false;
        }
      } else {
        this.testLogs.offline.push('✅ 当前在线，请先查看新闻进行缓存');
        this.testLogs.offline.push('💡 然后在浏览器中勾选 Offline 再测试');
        this.testResults.offline = true;
        uni.showToast({ title: '请先查看新闻缓存，再断网测试', icon: 'none' });
      }
      uni.hideLoading();
    },
    async testNetworkStatus() {
      const hasNetwork = await checkNetwork();
      this.currentNetwork = hasNetwork;
      this.testResults.networkCheck = hasNetwork;
      uni.showToast({ 
        title: hasNetwork ? '网络连接正常！' : '当前无网络连接', 
        icon: hasNetwork ? 'success' : 'none' 
      });
    },
    testError() {
      this.testResults.error = true;
      uni.showToast({
        title: '这是一个错误提示示例',
        icon: 'none',
        duration: 2000
      });
    },
    goToNews() {
      this.testResults.navigation = true;
      uni.navigateTo({
        url: '/pages/news/news'
      });
    },
    goToDetail() {
      this.testResults.navigation = true;
      uni.navigateTo({
        url: '/pages/detail/detail?id=1'
      });
    }
  }
};
</script>

<style scoped>
.test-container {
  padding: 30rpx;
  background: #f5f5f5;
  min-height: 100vh;
}

.header {
  text-align: center;
  padding: 40rpx;
  margin-bottom: 30rpx;
}

.title {
  font-size: 44rpx;
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 15rpx;
}

.subtitle {
  font-size: 28rpx;
  color: #666;
}

.test-card {
  background: white;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.08);
  border-left: 8rpx solid #e0e0e0;
  transition: all 0.3s;
}

.test-card.success {
  border-left-color: #4caf50;
  background: linear-gradient(90deg, rgba(76,175,80,0.05) 0%, white 100%);
}

.test-card.error {
  border-left-color: #f44336;
  background: linear-gradient(90deg, rgba(244,67,54,0.05) 0%, white 100%);
}

.card-header {
  display: flex;
  align-items: center;
  margin-bottom: 25rpx;
}

.card-icon {
  font-size: 56rpx;
  margin-right: 20rpx;
}

.card-title-area {
  flex: 1;
}

.card-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 5rpx;
}

.card-desc {
  font-size: 24rpx;
  color: #999;
}

.card-status {
  padding: 10rpx 20rpx;
  background: #f0f0f0;
  border-radius: 20rpx;
  font-size: 24rpx;
  color: #666;
}

.card-status.done {
  background: #e8f5e9;
  color: #4caf50;
  font-weight: bold;
}

.card-content {
  padding-top: 20rpx;
  border-top: 1rpx solid #f0f0f0;
}

.test-area {
  display: flex;
  gap: 15rpx;
  margin-bottom: 20rpx;
}

.test-btn {
  flex: 1;
  padding: 25rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12rpx;
  font-size: 28rpx;
  font-weight: bold;
}

.test-btn.secondary {
  background: #f0f0f0;
  color: #666;
}

.result-area {
  background: #f8f9fa;
  border-radius: 12rpx;
  padding: 20rpx;
}

.result-title {
  font-size: 26rpx;
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 15rpx;
}

.log-list {
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}

.log-item {
  font-size: 24rpx;
  color: #666;
  padding: 8rpx 0;
}

.tips-box {
  background: #fff3cd;
  border-radius: 12rpx;
  padding: 20rpx;
}

.tips-title {
  font-size: 26rpx;
  font-weight: bold;
  color: #856404;
  display: block;
  margin-bottom: 15rpx;
}

.tips-text {
  font-size: 24rpx;
  color: #856404;
  display: block;
  margin-bottom: 8rpx;
  line-height: 1.5;
}

.network-status {
  display: flex;
  align-items: center;
  padding: 20rpx;
  background: #fef0f0;
  border-radius: 12rpx;
}

.network-status.online {
  background: #f0fdf4;
}

.network-icon {
  font-size: 32rpx;
  margin-right: 15rpx;
}

.network-text {
  font-size: 28rpx;
  color: #dc2626;
}

.network-status.online .network-text {
  color: #166534;
}

.nav-buttons {
  display: flex;
  gap: 15rpx;
  margin-bottom: 20rpx;
}

.nav-btn {
  flex: 1;
  padding: 25rpx;
  background: #e3f2fd;
  color: #1976d2;
  border: none;
  border-radius: 12rpx;
  font-size: 28rpx;
  font-weight: bold;
}

.summary-section {
  background: white;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-top: 30rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.08);
}

.summary-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.summary-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.summary-count {
  font-size: 28rpx;
  color: #667eea;
  font-weight: bold;
}

.summary-bar {
  height: 20rpx;
  background: #e0e0e0;
  border-radius: 10rpx;
  overflow: hidden;
  margin-bottom: 20rpx;
}

.summary-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  border-radius: 10rpx;
  transition: width 0.5s ease;
}

/* 离线阅读指引样式 */
.offline-guide {
  background: #f0f9ff;
  border-radius: 16rpx;
  padding: 25rpx;
  margin-bottom: 20rpx;
}

.guide-step {
  display: flex;
  align-items: flex-start;
  padding: 15rpx 0;
  border-bottom: 1rpx dashed #cce7ff;
}

.guide-step:last-child {
  border-bottom: none;
}

.step-num {
  font-size: 36rpx;
  margin-right: 20rpx;
}

.step-content {
  flex: 1;
}

.step-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #1e88e5;
  display: block;
  margin-bottom: 8rpx;
}

.step-desc {
  font-size: 24rpx;
  color: #666;
  line-height: 1.5;
}

.cache-info {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20rpx;
  background: #e8f5e9;
  border-radius: 12rpx;
}

.cache-label {
  font-size: 26rpx;
  color: #4caf50;
}

.cache-count {
  font-size: 32rpx;
  font-weight: bold;
  color: #2e7d32;
  margin-left: 10rpx;
}

/* 下拉刷新指引样式 */
.refresh-guide {
  background: #fff3e0;
  border-radius: 16rpx;
  padding: 25rpx;
}

.refresh-demo {
  text-align: center;
  margin-bottom: 25rpx;
  padding: 20rpx;
  background: white;
  border-radius: 12rpx;
}

.swipe-hand {
  font-size: 60rpx;
  display: block;
  margin-bottom: 10rpx;
}

.swipe-arrow {
  font-size: 48rpx;
  display: block;
  margin-bottom: 15rpx;
  animation: bounce 1s infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(10rpx); }
}

.swipe-text {
  font-size: 28rpx;
  color: #ff9800;
  font-weight: bold;
}

.refresh-steps {
  display: flex;
  flex-direction: column;
  gap: 15rpx;
}

.refresh-step {
  display: flex;
  align-items: center;
}

.step-bullet {
  font-size: 20rpx;
  color: #ff9800;
  margin-right: 15rpx;
}

.refresh-step .step-text {
  font-size: 26rpx;
  color: #555;
}

.success-tip-box {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 25rpx;
  background: #e8f5e9;
  border-radius: 12rpx;
  margin-top: 20rpx;
}

.success-icon {
  font-size: 40rpx;
  margin-right: 15rpx;
}

.success-text {
  font-size: 28rpx;
  color: #4caf50;
  font-weight: bold;
}

.summary-tips {
  text-align: center;
}

.success-tip {
  font-size: 28rpx;
  color: #4caf50;
  font-weight: bold;
}

.progress-tip {
  font-size: 26rpx;
  color: #666;
}
</style>
