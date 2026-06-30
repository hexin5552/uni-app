<template>
	<view class="scores pageBg">
		<view class="header">
			<view class="back" @click="goBack">
				<uni-icons type="back" size="24"></uni-icons>
			</view>
			<view class="title">我的评分</view>
			<view class="placeholder"></view>
		</view>
		
		<view class="content" v-if="scoreList.length > 0">
			<view class="score-list">
				<view class="score-item" v-for="(item, index) in scoreList" :key="index" @click="previewImage(item.index)">
					<image :src="item.image" mode="aspectFill"></image>
					<view class="info">
						<view class="rating">
							<uni-rate :value="item.score" readonly allow-half />
							<text class="score-text">{{ item.score }}分</text>
						</view>
						<view class="time">{{ item.time }}</view>
					</view>
				</view>
			</view>
		</view>
		
		<view class="empty" v-else>
			<view class="icon">
				<uni-icons type="star" size="60" color="#ccc"></uni-icons>
			</view>
			<view class="text">暂无评分记录</view>
			<view class="tip">快去给喜欢的壁纸评分吧</view>
		</view>
	</view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { homePreviewImages } from '@/common/data/categories.js'

const scoreList = ref([])

onMounted(() => {
	try {
		const scored = uni.getStorageSync('scoredImages') || {}
		const list = []
		Object.keys(scored).forEach(key => {
			if (scored[key]) {
				const index = parseInt(key)
				if (!isNaN(index) && homePreviewImages[index]) {
					list.push({
						image: homePreviewImages[index],
						score: scored[key],
						time: new Date().toLocaleDateString(),
						index: index
					})
				}
			}
		})
		scoreList.value = list
	} catch (e) {
		console.log('读取评分记录失败:', e)
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
	const actualIndex = scoreList.value[index]?.index || 0
	uni.navigateTo({
		url: `/pages/preview/preview?position=${index}&total=${scoreList.value.length}&index=${actualIndex}&source=score`
	})
}
</script>

<style lang="scss" scoped>
	.scores{
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
		.score-list{
			padding: 100rpx 30rpx 30rpx;
		}
		.score-item{
			display: flex;
			background: #fff;
			border-radius: 16rpx;
			overflow: hidden;
			margin-bottom: 20rpx;
			box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.08);
			transition: all 0.3s ease;
			image{
				width: 160rpx;
				height: 160rpx;
				flex-shrink: 0;
				transition: transform 0.3s ease;
			}
			.info{
				flex: 1;
				padding: 20rpx;
				display: flex;
				flex-direction: column;
				justify-content: center;
			}
			.rating{
				display: flex;
				align-items: center;
				margin-bottom: 10rpx;
			}
			.score-text{
				font-size: 28rpx;
				color: $brand-theme-color;
				font-weight: 600;
				margin-left: 10rpx;
			}
			.time{
				font-size: 24rpx;
				color: #999;
			}
			&:active{
				transform: scale(0.98);
				box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.12);
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
