<template>
	<view class="favorites pageBg">
		<view class="header">
			<view class="back" @click="goBack">
				<uni-icons type="back" size="24"></uni-icons>
			</view>
			<view class="title">我的收藏</view>
			<view class="placeholder"></view>
		</view>
		
		<view class="content" v-if="favoriteList.length > 0">
			<view class="image-grid">
				<view 
					class="image-item" 
					v-for="(item, index) in favoriteList" 
					:key="index" 
					@click="previewImage(item.index)"
					@longpress="showDeleteConfirm(item, index)"
				>
					<image :src="item.image" mode="aspectFill"></image>
					<view class="check" @click.stop="toggleFavorite(item, index)">
						<uni-icons type="heart-filled" size="24" color="#f5222d"></uni-icons>
					</view>
				</view>
			</view>
		</view>
		
		<view class="empty" v-else>
			<view class="icon">
				<uni-icons type="heart" size="60" color="#ccc"></uni-icons>
			</view>
			<view class="text">暂无收藏记录</view>
			<view class="tip">快去收藏喜欢的壁纸吧</view>
		</view>
		
		<view class="delete-mask" v-if="showConfirm" @click="closeConfirm">
			<view class="confirm-popup" @click.stop>
				<view class="confirm-title">取消收藏</view>
				<view class="confirm-content">确定要取消收藏这张壁纸吗？</view>
				<view class="confirm-buttons">
					<button class="btn-cancel" @click="closeConfirm">取消</button>
					<button class="btn-confirm" @click="confirmDelete">确定</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { homePreviewImages } from '@/common/data/categories.js'

const favoriteList = ref([])
const showConfirm = ref(false)
const deleteItem = ref(null)
const deleteIndex = ref(-1)

onMounted(() => {
	loadFavorites()
})

const loadFavorites = () => {
	try {
		const collected = uni.getStorageSync('collectedImages') || {}
		const list = []
		Object.keys(collected).forEach(key => {
			if (collected[key]) {
				const index = parseInt(key)
				if (!isNaN(index) && homePreviewImages[index]) {
					list.push({
						image: homePreviewImages[index],
						index: index
					})
				}
			}
		})
		favoriteList.value = list
	} catch (e) {
		console.log('读取收藏记录失败:', e)
	}
}

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
	const actualIndex = favoriteList.value[index]?.index || 0
	uni.navigateTo({
		url: `/pages/preview/preview?position=${index}&total=${favoriteList.value.length}&index=${actualIndex}&source=favorite`
	})
}

const showDeleteConfirm = (item, index) => {
	deleteItem.value = item
	deleteIndex.value = index
	showConfirm.value = true
}

const closeConfirm = () => {
	showConfirm.value = false
	deleteItem.value = null
	deleteIndex.value = -1
}

const confirmDelete = () => {
	if (deleteItem.value && deleteIndex.value >= 0) {
		try {
			const collected = uni.getStorageSync('collectedImages') || {}
			delete collected[deleteItem.value.index]
			uni.setStorageSync('collectedImages', collected)
			
			favoriteList.value.splice(deleteIndex.value, 1)
			
			uni.showToast({
				title: '已取消收藏',
				icon: 'success'
			})
		} catch (e) {
			console.log('取消收藏失败:', e)
			uni.showToast({
				title: '取消失败',
				icon: 'none'
			})
		}
	}
	closeConfirm()
}

const toggleFavorite = (item, index) => {
	deleteItem.value = item
	deleteIndex.value = index
	
	try {
		const collected = uni.getStorageSync('collectedImages') || {}
		delete collected[item.index]
		uni.setStorageSync('collectedImages', collected)
		
		favoriteList.value.splice(index, 1)
		
		uni.showToast({
			title: '已取消收藏',
			icon: 'success'
		})
	} catch (e) {
		console.log('取消收藏失败:', e)
		uni.showToast({
			title: '取消失败',
			icon: 'none'
		})
	}
}
</script>

<style lang="scss" scoped>
	.favorites{
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
				:deep(.uni-icons){
					color: #f5222d !important;
				}
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

		.delete-mask{
			position: fixed;
			left: 0;
			right: 0;
			top: 0;
			bottom: 0;
			background: rgba(0,0,0,0.5);
			z-index: 1000;
			display: flex;
			align-items: center;
			justify-content: center;
		}
		.confirm-popup{
			width: 500rpx;
			background: #fff;
			border-radius: 20rpx;
			overflow: hidden;
		}
		.confirm-title{
			font-size: 32rpx;
			font-weight: 600;
			color: #333;
			padding: 30rpx;
			text-align: center;
			border-bottom: 1px solid #eee;
		}
		.confirm-content{
			font-size: 28rpx;
			color: #666;
			padding: 40rpx 30rpx;
			text-align: center;
		}
		.confirm-buttons{
			display: flex;
			border-top: 1px solid #eee;
			button{
				flex: 1;
				height: 80rpx;
				line-height: 80rpx;
				font-size: 28rpx;
				border: none;
				border-radius: 0;
			}
			.btn-cancel{
				color: #666;
				border-right: 1px solid #eee;
			}
			.btn-confirm{
				color: $brand-theme-color;
			}
		}
	}
</style>
