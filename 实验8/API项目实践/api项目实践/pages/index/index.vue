<template>
	<view class="container">
		<view class="header">
			<text class="header-title">API 项目实践</text>
			<text class="header-subtitle">uni-app 多功能工具集</text>
		</view>
		
		<view class="card-list">
			<view class="card" @click="goToTimer">
				<view class="card-icon timer-icon">
					<text>⏱️</text>
				</view>
				<view class="card-info">
					<text class="card-title">计时器</text>
					<text class="card-desc">番茄钟 + 自定义倒计时</text>
				</view>
				<view class="card-arrow">
					<text>></text>
				</view>
			</view>
			
			<view class="card" @click="goToAudio">
				<view class="card-icon audio-icon">
					<text>🎵</text>
				</view>
				<view class="card-info">
					<text class="card-title">音频播放器</text>
					<text class="card-desc">音乐播放 + 播放列表</text>
				</view>
				<view class="card-arrow">
					<text>></text>
				</view>
			</view>
			
			<view class="card" @click="goToVideo">
				<view class="card-icon video-icon">
					<text>🎬</text>
				</view>
				<view class="card-info">
					<text class="card-title">视频播放器</text>
					<text class="card-desc">视频播放 + 播放历史</text>
				</view>
				<view class="card-arrow">
					<text>></text>
				</view>
			</view>
		</view>
		
		<view class="footer">
			<text class="footer-text">点击上方卡片进入对应功能</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: 'API项目实践'
			}
		},
		methods: {
			goToTimer() {
				uni.switchTab({
					url: '/pages/timer/index',
					fail: () => {
						uni.showToast({ title: '跳转失败', icon: 'none' })
					}
				})
			},
			goToAudio() {
				uni.switchTab({
					url: '/pages/audio/index',
					fail: () => {
						uni.showToast({ title: '跳转失败', icon: 'none' })
					}
				})
			},
			goToVideo() {
				uni.switchTab({
					url: '/pages/video/index',
					fail: () => {
						uni.showToast({ title: '跳转失败', icon: 'none' })
					}
				})
			}
		}
	}
</script>

<style scoped>
.container {
	padding: 40rpx;
	min-height: 100vh;
	background: linear-gradient(180deg, #f5f7fa 0%, #e4e8ed 100%);
}

.header {
	text-align: center;
	margin-bottom: 60rpx;
	padding-top: 60rpx;
}

.header-title {
	font-size: 48rpx;
	font-weight: bold;
	color: #333;
	display: block;
	margin-bottom: 16rpx;
}

.header-subtitle {
	font-size: 28rpx;
	color: #999;
}

.card-list {
	display: flex;
	flex-direction: column;
	gap: 30rpx;
}

.card {
	display: flex;
	align-items: center;
	background: #fff;
	border-radius: 24rpx;
	padding: 36rpx;
	box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.08);
	transition: all 0.3s;
}

.card:active {
	transform: scale(0.98);
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
}

.card-icon {
	width: 100rpx;
	height: 100rpx;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-right: 30rpx;
	font-size: 50rpx;
}

.timer-icon {
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.audio-icon {
	background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
}

.video-icon {
	background: linear-gradient(135deg, #eb3349 0%, #f45c43 100%);
}

.card-info {
	flex: 1;
}

.card-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
	display: block;
	margin-bottom: 8rpx;
}

.card-desc {
	font-size: 24rpx;
	color: #999;
}

.card-arrow {
	font-size: 28rpx;
	color: #ccc;
	padding-left: 20rpx;
}

.footer {
	margin-top: 60rpx;
	text-align: center;
}

.footer-text {
	font-size: 24rpx;
	color: #bbb;
}
</style>
