<template>
	<view class="homeLayout pageBg">
		<custom-nav-bar></custom-nav-bar>
		<view class="banner">
			<swiper circular indicator-color="rgba(255,255,255,0.5)"
			indicator-active-color="#fff" autoplay>
				<swiper-item v-for="(item, index) in 3" :key="index">
					<image :src="bannerImages[index]" mode="aspectFill"></image>
				</swiper-item>
			</swiper>
		</view>
		
		<view class="notice" @click="showNoticePopup = true">
			<view class="left">
				<uni-icons type="sound-filled" size="20"></uni-icons>
				<text class="text">公告</text>
			</view>
			<view class="center">
				<swiper vertical autoplay interval="1500" duration="300" circular>
					<swiper-item>📢 本周热门壁纸更新！新增100+高清壁纸等你来发现</swiper-item>
					<swiper-item>🎁 新用户注册即可获得专属壁纸礼包</swiper-item>
					<swiper-item>🔥 每日签到赢积分，积分兑换精美壁纸</swiper-item>
					<swiper-item>💡 壁纸分享给好友可获得额外奖励</swiper-item>
				</swiper>
			</view>
			<view class="right">
				<uni-icons type="right" size="16" color="#333"></uni-icons>
			</view>
		</view>
		
		<view class="notice-popup" v-if="showNoticePopup" @click="showNoticePopup = false">
			<view class="popup-content" @click.stop>
				<view class="popup-header">
					<view class="popup-title">📢 系统公告</view>
					<view class="popup-close" @click="showNoticePopup = false">
						<uni-icons type="close" size="24" color="#999"></uni-icons>
					</view>
				</view>
				<view class="popup-body">
					<view class="notice-item">
						<view class="notice-icon">📢</view>
						<view class="notice-content">
							<view class="notice-title">本周热门壁纸更新</view>
							<view class="notice-desc">新增100+高清壁纸，涵盖自然风光、城市建筑、动漫游戏等多个分类，等你来发现！</view>
						</view>
					</view>
					<view class="notice-item">
						<view class="notice-icon">🎁</view>
						<view class="notice-content">
							<view class="notice-title">新用户福利</view>
							<view class="notice-desc">新用户注册即可获得专属壁纸礼包，包含精选壁纸10张！</view>
						</view>
					</view>
					<view class="notice-item">
						<view class="notice-icon">🔥</view>
						<view class="notice-content">
							<view class="notice-title">签到赢积分</view>
							<view class="notice-desc">每日签到可获得积分，积分可兑换精美壁纸和专属福利！</view>
						</view>
					</view>
					<view class="notice-item">
						<view class="notice-icon">💡</view>
						<view class="notice-content">
							<view class="notice-title">分享奖励</view>
							<view class="notice-desc">将喜欢的壁纸分享给好友，可获得额外积分奖励！</view>
						</view>
					</view>
				</view>
				<view class="popup-footer">
					<view class="close-btn" @click="showNoticePopup = false">我知道了</view>
				</view>
			</view>
		</view>
		
		<view class="select">
			<common-title>
				<template #name>每日推荐</template>
				<template #custom>
					<view class="date">
						<uni-icons type="calendar" size="18"></uni-icons>
						<view class="text">
							<uni-dateformat :date="Date.now()" format="dd日"></uni-dateformat>
						</view>
					</view>
				</template>
			</common-title>
			<view class="content">
				<scroll-view scroll-x>
					<navigator :url="'/pages/preview/preview?index=' + index + '&position=' + index + '&total=8'" class="box" v-for="(item, index) in 8">
						<image :src="previewImages[index % previewImages.length]" mode="aspectFill"></image>
					</navigator>
				</scroll-view>
			</view>
			
			<view class="theme">
				<common-title>
					<template #name>专题精选</template>
					<template #custom>
						<view class='more' @click="goToClassify">更多</view>
					</template>
				</common-title>
				<view class="content">
					<theme-item v-for="(item, index) in homeCategories" :key="index" :item="item"></theme-item>
					<theme-item :isMore="true"></theme-item>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue'
import { categories, homePreviewImages } from '@/common/data/categories.js'

const bannerImages = ref([
	'/common/images/banner1.jpg',
	'/common/images/banner2.jpg',
	'/common/images/banner3.jpg'
])

const previewImages = ref(homePreviewImages)

const homeCategories = ref(categories.slice(0, 8))

const showNoticePopup = ref(false)

const goToClassify = () => {
	uni.switchTab({
		url: '/pages/classify/classify'
	})
}
</script>

<style lang="scss" scoped>
	.homeLayout{
		.banner{
			width: 750rpx;
			padding: 30rpx 0;
			swiper{
				width: 750rpx;
				height: 340rpx;
				&-item{
					width: 100%;
					height: 100%;
					padding: 0 30rpx;
					image{
						width: 100%;
						height: 100%;
						border-radius: 10rpx;
					}
				}
			}
		}
		
		.notice{
			width: 690rpx;
			height: 80rpx;
			line-height: 80rpx;
			background: #f9f9f9;
			margin: 0 auto;
			border-radius: 80rpx;
			display: flex;
			.left{
				width: 140rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				:deep(){
					.uni-icons{
						color: $brand-theme-color !important;
					}
				}
				.text{
					color: $brand-theme-color;
					font-weight: 600;
					font-size: 20rpx;
				}
			}
			.center{
				flex: 1;
				swiper{
					height: 100%;
					&-item{
						height: 100%;
						font-size: 30rpx;
						color: #333;
						overflow: hidden;
						white-space: nowrap;
						text-overflow: ellipsis;
					}
				}
			}
			.right{
				width: 70rpx;
				display: flex;
				align-items: center;
				justify-content: center;
			}
			&:active{
				background: #f0f0f0;
			}
		}
		
		.notice-popup{
			position: fixed;
			left: 0;
			right: 0;
			top: 0;
			bottom: 0;
			background: rgba(0,0,0,0.5);
			display: flex;
			align-items: center;
			justify-content: center;
			z-index: 1000;
			.popup-content{
				width: 600rpx;
				background: #fff;
				border-radius: 24rpx;
				overflow: hidden;
				.popup-header{
					display: flex;
					align-items: center;
					justify-content: space-between;
					padding: 30rpx;
					border-bottom: 1rpx solid #eee;
					.popup-title{
						font-size: 34rpx;
						font-weight: 600;
						color: #333;
					}
					.popup-close{
						width: 60rpx;
						height: 60rpx;
						display: flex;
						align-items: center;
						justify-content: center;
					}
				}
				.popup-body{
					padding: 30rpx;
					max-height: 70vh;
					overflow-y: auto;
					.notice-item{
						display: flex;
						padding: 20rpx 0;
						border-bottom: 1rpx solid #f5f5f5;
						&:last-child{
							border-bottom: none;
						}
						.notice-icon{
							font-size: 40rpx;
							margin-right: 20rpx;
						}
						.notice-content{
							flex: 1;
							.notice-title{
								font-size: 30rpx;
								font-weight: 600;
								color: #333;
								margin-bottom: 10rpx;
							}
							.notice-desc{
								font-size: 26rpx;
								color: #666;
								line-height: 1.6;
							}
						}
					}
				}
				.popup-footer{
					padding: 30rpx;
					border-top: 1rpx solid #eee;
					.close-btn{
						width: 100%;
						height: 80rpx;
						line-height: 80rpx;
						text-align: center;
						background: $brand-theme-color;
						color: #fff;
						border-radius: 40rpx;
						font-size: 30rpx;
						font-weight: 500;
					}
				}
			}
		}
		
		.select{
			padding-top: 50rpx;
			.date{
				color: $brand-theme-color;
				display: flex;
				align-items: center;
				:deep(){
					.uni-icons{
						color: $brand-theme-color !important;
					}
				}
				.text{
					margin-left: 5rpx;
				}
			}
			.content{
				width: 720rpx;
				margin-left: 30rpx;
				margin-top: 30rpx;
				scroll-view{
					white-space: nowrap;
					.box{
						width: 200rpx;
						height: 430rpx;
						display: inline-block;
						margin-right: 15rpx;
						image{
							width: 100%;
							height: 100%;
							border-radius: 10rpx;
						}
						&:last-child{margin-right: 30rpx;}
					}
				}
			}
		}
		
		.theme{
			padding: 50rpx 0;
			.more{
				font-size: 32rpx;
				color: #888;
			}
			.content{
				margin-top: 30rpx;
				padding: 0 30rpx;
				display: grid;
				gap: 15rpx;
				grid-template-columns: repeat(3,1fr);
			}
		}
	}
</style>
