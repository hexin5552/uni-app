<template>
	<view class="userLayout pageBg">
		<view class="useInfo">
			<view class="avatar">
				<image src="/static/pages/logo.jpg" mode="aspectFill"></image>
			</view>
			<view class="ip">100.100.100.100</view>
			<view class="address">来自：安徽</view>
		</view>
		
		<view class="section">
			<view class="list">
				<view class="row" @click="goToDownloads">
					<view class="left">
						<uni-icons type="download-filled" size="20"></uni-icons>
						<view class="text">我的下载</view>
					</view>
					<view class="right">
						<view class="count">{{ downloadCount }}</view>
						<uni-icons type="right" size="15" color="#aaa"></uni-icons>
					</view>
				</view>
				
				<view class="row" @click="goToScores">
					<view class="left">
						<uni-icons type="star-filled" size="20"></uni-icons>
						<view class="text">我的评分</view>
					</view>
					<view class="right">
						<view class="count">{{ scoreCount }}</view>
						<uni-icons type="right" size="15" color="#aaa"></uni-icons>
					</view>
				</view>
				
				<view class="row" @click="goToFavorites">
					<view class="left">
						<uni-icons type="heart-filled" size="20"></uni-icons>
						<view class="text">我的收藏</view>
					</view>
					<view class="right">
						<view class="count">{{ favoriteCount }}</view>
						<uni-icons type="right" size="15" color="#aaa"></uni-icons>
					</view>
				</view>
				
				<view class="row">
					<view class="left">
						<uni-icons type="chatboxes-filled" size="20"></uni-icons>
						<view class="text">联系客服</view>
					</view>
					<view class="right">
						<uni-icons type="right" size="15" color="#aaa"></uni-icons>
					</view>
					<!-- #ifdef MP -->
					<button open-type="contact">联系客服</button>
					<!-- #endif -->
					<!-- #ifndef MP -->
					<button @click="clickContact">拨打电话</button>
					<!-- #endif -->
				</view>
			</view>
		</view>
		
		<view class="section">
			<view class="list">
				<view class="row" @click="goToSubscribe">
					<view class="left">
						<uni-icons type="notification-filled" size="20"></uni-icons>
						<view class="text">订阅更新</view>
					</view>
					<view class="right">
						<uni-icons type="right" size="15" color="#aaa"></uni-icons>
					</view>
				</view>
				
				<view class="row" @click="goToFAQ">
					<view class="left">
						<uni-icons type="flag-filled" size="20"></uni-icons>
						<view class="text">常见问题</view>
					</view>
					<view class="right">
						<uni-icons type="right" size="15" color="#aaa"></uni-icons>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { onShow } from '@dcloudio/uni-app'

const downloadCount = ref(0)
const scoreCount = ref(0)
const favoriteCount = ref(0)

const updateCounts = () => {
	try {
		const downloaded = uni.getStorageSync('downloadedImages') || {}
		downloadCount.value = Object.keys(downloaded).filter(key => downloaded[key]).length
	} catch (e) {
		console.log('读取下载记录失败:', e)
		downloadCount.value = 0
	}
	
	try {
		const scored = uni.getStorageSync('scoredImages') || {}
		scoreCount.value = Object.keys(scored).filter(key => scored[key]).length
	} catch (e) {
		console.log('读取评分记录失败:', e)
		scoreCount.value = 0
	}
	
	try {
		const collected = uni.getStorageSync('collectedImages') || {}
		favoriteCount.value = Object.keys(collected).filter(key => collected[key]).length
	} catch (e) {
		console.log('读取收藏记录失败:', e)
		favoriteCount.value = 0
	}
}

onMounted(() => {
	updateCounts()
})

onShow(() => {
	updateCounts()
})

const goToDownloads = () => {
	uni.navigateTo({
		url: "/pages/downloads/downloads"
	});
};

const goToScores = () => {
	uni.navigateTo({
		url: "/pages/scores/scores"
	});
};

const goToFavorites = () => {
	uni.navigateTo({
		url: "/pages/favorites/favorites"
	});
};

const goToSubscribe = () => {
	uni.showToast({
		title: '订阅更新功能开发中',
		icon: 'none'
	});
};

const goToFAQ = () => {
	uni.showToast({
		title: '常见问题功能开发中',
		icon: 'none'
	});
};

const clickContact = () => {
	uni.makePhoneCall({
		phoneNumber: "13798407421"
	});
};
</script>

<style lang="scss" scoped>
	.userLayout {
		.useInfo {
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
			padding: 50rpx 0;
			.avatar {
				width: 160rpx;
				height: 160rpx;
				border-radius: 50%;
				overflow: hidden;
				image {
					width: 100%;
					height: 100%;
				}
			}
			.ip {
				font-size: 44rpx;
				color: #333;
				padding: 20rpx 0 5rpx;
			}
			.address {
				font-size: 28rpx;
				color: #aaa;
			}
		}
		.section {
			width: 690rpx;
			margin: 20rpx auto;
			border: 1px solid #eee;
			border-radius: 10rpx;
			box-shadow: 0 0 30rpx rgba(0, 0, 0, 0.05);
			background: #fff;
			.list {
				.row {
					display: flex;
					justify-content: space-between;
					align-items: center;
					padding: 0 30rpx;
					height: 100rpx;
					border-bottom: 1px solid #eee;
					position: relative;
					background-color: #fff;
					width: 100%;
					box-sizing: border-box;
					
					&:last-child {
						border-bottom: none;
					}
					.left {
						display: flex;
						align-items: center;
						flex: 1;
						:deep(.uni-icons) {
							color: $brand-theme-color !important;
							vertical-align: middle;
						}
						.text {
							padding-left: 20rpx;
							color: #666;
							font-size: 30rpx;
							line-height: 1;
						}
					}
					.right {
						display: flex;
						align-items: center;
						flex-shrink: 0;
						.count {
							font-size: 30rpx;
							color: #999;
							margin-right: 10rpx;
							line-height: 1;
						}
						:deep(.uni-icons) {
							vertical-align: middle;
						}
					}
					button{
						position: absolute;
						top: 0;
						left: 0;
						width: 100%;
						height: 100rpx;
						opacity: 0;
					}
				}
			}
		}
	}
</style>
