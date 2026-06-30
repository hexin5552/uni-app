<template>
	<view class="downloads pageBg">
		<view class="header">
			<view class="back" @click="goBack">
				<uni-icons type="back" size="24"></uni-icons>
			</view>
			<view class="title">我的下载</view>
			<view class="placeholder"></view>
		</view>
		
		<view class="content" v-if="downloadList.length > 0">
			<view class="image-grid">
				<view class="image-item" v-for="(item, index) in downloadList" :key="index" @click="previewImage(index)">
					<image :src="item" mode="aspectFill"></image>
					<view class="check">
						<uni-icons type="checkmarkempty" size="24" color="#fff"></uni-icons>
					</view>
				</view>
			</view>
		</view>
		
		<view class="empty" v-else>
			<view class="icon">
				<uni-icons type="download" size="60" color="#ccc"></uni-icons>
			</view>
			<view class="text">暂无下载记录</view>
			<view class="tip">快去下载喜欢的壁纸吧</view>
		</view>
	</view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { homePreviewImages } from '@/common/data/categories.js'

const downloadList = ref([])
const downloadIndexes = ref([])

onMounted(() => {
	try {
		const downloaded = uni.getStorageSync('downloadedImages') || {}
		const list = []
		const indexes = []
		Object.keys(downloaded).forEach(key => {
			if (downloaded[key]) {
				const index = parseInt(key)
				if (!isNaN(index) && homePreviewImages[index]) {
					list.push(homePreviewImages[index])
					indexes.push(index)
				}
			}
		})
		downloadList.value = list
		downloadIndexes.value = indexes
	} catch (e) {
		console.log('读取下载记录失败:', e)
	}
})

const goBack = () => {
	uni.navigateBack({
		fail: () => {
			uni.switchTab({
				url: '/pages/user/user'
			})
		}
	})
}

const previewImage = (index) => {
	const actualIndex = downloadIndexes.value[index]
	uni.navigateTo({
		url: `/pages/preview/preview?position=${index}&total=${downloadList.value.length}&index=${actualIndex}&source=download`
	})
}
</script>

<style lang="scss" scoped>
	.downloads{
		min-height: 100vh;
		.header{
			display: flex;
			align-items: center;
			justify-content: space-between;
			height: 88rpx;
			padding: 0 30rpx;
			background: rgba(255,255,255,0.8);
			backdrop-filter: blur(10rpx);
			position: fixed;
			top: 0;
			left: 0;
			right: 0;
			z-index: 100;
			.back, .placeholder{
				width: 60rpx;
				height: 60rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				:deep(.uni-icons){
					color: $brand-theme-color !important;
				}
			}
			.title{
				font-size: 32rpx;
				font-weight: 600;
				color: #333;
			}
		}
		.content{
			padding-top: 100rpx;
		}
		.image-grid{
			display: grid;
			grid-template-columns: repeat(3,1fr);
			gap: 10rpx;
			padding: 100rpx 15rpx 15rpx;
		}
		.image-item{
			height: 240rpx;
			position: relative;
			border-radius: 12rpx;
			overflow: hidden;
			box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.08);
			transition: all 0.3s ease;
			image{
				width: 100%;
				height: 100%;
				display: block;
				transition: transform 0.3s ease;
			}
			.check{
				position: absolute;
				top: 10rpx;
				right: 10rpx;
				width: 40rpx;
				height: 40rpx;
				background: rgba(0,0,0,0.5);
				border-radius: 50%;
				display: flex;
				align-items: center;
				justify-content: center;
				backdrop-filter: blur(10rpx);
			}
			&:active{
				transform: scale(0.96);
				box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.12);
				image{
					transform: scale(1.05);
				}
			}
		}
		.empty{
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			padding-top: 200rpx;
			.icon{
				width: 160rpx;
				height: 160rpx;
				background: #f5f5f5;
				border-radius: 50%;
				display: flex;
				align-items: center;
				justify-content: center;
				margin-bottom: 30rpx;
			}
			.text{
				font-size: 32rpx;
				color: #666;
				margin-bottom: 15rpx;
			}
			.tip{
				font-size: 26rpx;
				color: #999;
			}
		}
	}
</style>
