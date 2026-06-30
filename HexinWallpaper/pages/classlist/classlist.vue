<template>
	<view class="classlist pageBg">
		<view class="header">
			<view class="back" @click="goBack">
				<uni-icons type="back" size="24"></uni-icons>
			</view>
			<view class="title">{{ categoryName }}</view>
			<view class="placeholder"></view>
		</view>
		<view class="content">
			<navigator :url="'/pages/preview/preview?index=' + ((categoryId - 1) * 5 + index) + '&position=' + index + '&total=' + categoryImages.length + '&category=' + categoryId" class="item" v-for="(item, index) in categoryImages" :key="index">
				<image :src="item" mode="aspectFill"></image>
			</navigator>
		</view>
	</view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { homePreviewImages } from '@/common/data/categories.js'

const categoryId = ref(1)
const categoryName = ref('壁纸精选')
const categoryImages = ref([])

onMounted(() => {
	try {
		const pages = getCurrentPages()
		const currentPage = pages[pages.length - 1]
		const options = currentPage.$page?.options || currentPage.options || {}
		
		if (options.id) {
			categoryId.value = parseInt(options.id) || 1
		}
		if (options.name) {
			categoryName.value = decodeURIComponent(options.name) || '壁纸精选'
		}
		
		const startIndex = (categoryId.value - 1) * 5
		const endIndex = Math.min(startIndex + 9, homePreviewImages.length)
		categoryImages.value = homePreviewImages.slice(startIndex, endIndex)
		if (categoryImages.value.length === 0) {
			categoryImages.value = homePreviewImages.slice(0, 9)
		}
	} catch (e) {
		console.log('获取分类参数失败:', e)
		categoryImages.value = homePreviewImages.slice(0, 9)
	}
})

const goBack = () => {
	uni.navigateBack({
		fail: () => {
			uni.switchTab({
				url: '/pages/index/index'
			})
		}
	})
}
</script>

<style lang="scss" scoped>
	.classlist{
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
			display: grid;
			grid-template-columns: repeat(3,1fr);
			gap: 10rpx;
			padding: 100rpx 15rpx 15rpx;
			.item{
				height: 440rpx;
				border-radius: 16rpx;
				overflow: hidden;
				box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.1);
				transition: all 0.3s ease;
				image{
					width: 100%;
					height: 100%;
					display: block;
					transition: transform 0.3s ease;
				}
				&:active{
					transform: scale(0.96);
					box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.15);
					image{
						transform: scale(1.05);
					}
				}
			}
		}
	}
</style>
