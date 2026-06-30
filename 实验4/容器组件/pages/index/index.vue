<template>
	<scroll-view class="page-container" scroll-y @scrolltolower="onReachBottom">
		<!-- 顶部轮播图 -->
		<view class="swiper-container">
			<swiper class="swiper" autoplay indicator-dots circular interval="3000">
				<swiper-item v-for="(item, index) in swiperList" :key="index">
					<image :src="item.image" class="swiper-image"></image>
				</swiper-item>
			</swiper>
		</view>

		<!-- 横向导航分类栏 -->
		<scroll-view class="nav-container" scroll-x show-scrollbar="false">
			<view 
				v-for="(item, index) in navList" 
				:key="index"
				class="nav-item"
				:class="{ active: activeNav === index }"
				@click="switchNav(index)"
			>
				{{ item.name }}
			</view>
		</scroll-view>

		<!-- 新闻列表 -->
		<view class="news-container">
			<view 
				v-for="(item, index) in newsList" 
				:key="index"
				class="news-item"
			>
				<image :src="item.image" class="news-image"></image>
				<view class="news-info">
					<text class="news-title">{{ item.title }}</text>
					<view class="news-meta">
						<text class="news-source">{{ item.source }}</text>
						<text class="news-comments">{{ item.comments }} 评论</text>
					</view>
				</view>
			</view>
			
			<!-- 加载更多 -->
			<view class="load-more" v-if="loading">
				<text>加载中...</text>
			</view>
			<view class="load-more" v-else-if="noMore">
				<text>没有更多了</text>
			</view>
		</view>
	</scroll-view>
</template>

<script>
	export default {
		data() {
			return {
				// 轮播图数据
				swiperList: [
					{ image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=news%20banner%201&image_size=landscape_16_9' },
					{ image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=news%20banner%202&image_size=landscape_16_9' },
					{ image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=news%20banner%203&image_size=landscape_16_9' }
				],
				// 导航分类数据
				navList: [
					{ name: '推荐' },
					{ name: '要闻' },
					{ name: '科技' },
					{ name: '娱乐' },
					{ name: '体育' },
					{ name: '财经' },
					{ name: '社会' }
				],
				// 当前激活的导航
				activeNav: 0,
				// 新闻列表数据
				newsList: [],
				// 加载状态
				loading: false,
				// 是否没有更多数据
				noMore: false,
				// 当前页码
				page: 1
			}
		},
		onLoad() {
			// 初始化加载新闻数据
			this.loadNews();
		},
		methods: {
			// 切换导航
			switchNav(index) {
				this.activeNav = index;
				// 切换导航时重置数据
				this.page = 1;
				this.newsList = [];
				this.noMore = false;
				this.loadNews();
			},
			// 加载新闻数据
			loadNews() {
				if (this.loading || this.noMore) return;
				
				this.loading = true;
				
				// 模拟网络请求延迟
				setTimeout(() => {
					// 生成模拟新闻数据
				const newNews = [];
				for (let i = 0; i < 5; i++) {
					const id = (this.page - 1) * 5 + i + 1;
					newNews.push({
						title: `新闻标题 ${id} - 这是一条模拟的新闻内容，用于测试新闻列表的展示效果`,
						source: `来源 ${id}`,
						comments: Math.floor(Math.random() * 1000),
						image: '/static/logo.png'
					});
				}
					
					// 添加到新闻列表
					this.newsList = [...this.newsList, ...newNews];
					
					// 模拟分页，假设只有3页数据
					if (this.page >= 3) {
						this.noMore = true;
					}
					
					this.page++;
					this.loading = false;
				}, 1000);
			},
			// 上拉加载更多
			onReachBottom() {
				this.loadNews();
			}
		}
	}
</script>

<style>
	/* 全局样式重置 */
	* {
		box-sizing: border-box;
	}
	
	.page-container {
		height: 100vh;
		width: 100%;
		max-width: 1200px;
		margin: 0 auto;
	}

	/* 轮播图样式 */
	.swiper-container {
		height: 300rpx;
		width: 100%;
		max-width: 1200px;
		margin: 0 auto;
		position: relative;
	}
	
	.swiper {
		height: 100%;
		width: 100%;
	}
	
	.swiper-item {
		height: 100%;
		width: 100%;
	}
	
	.swiper-image {
		height: 100%;
		width: 100%;
		object-fit: cover;
	}

	/* 导航栏样式 */
	.nav-container {
		white-space: nowrap;
		padding: 20rpx 0;
		background-color: #fff;
		border-bottom: 1rpx solid #f0f0f0;
	}
	
	.nav-item {
		display: inline-block;
		padding: 0 30rpx;
		font-size: 32rpx;
		color: #666;
		height: 60rpx;
		line-height: 60rpx;
	}
	
	.nav-item.active {
		color: #007aff;
		font-weight: bold;
		position: relative;
	}
	
	.nav-item.active::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
		height: 4rpx;
		width: 40rpx;
		background-color: #007aff;
		border-radius: 2rpx;
	}

	/* 新闻列表样式 */
	.news-container {
		padding: 20rpx;
		background-color: #f5f5f5;
	}
	
	.news-item {
		display: flex;
		background-color: #fff;
		border-radius: 12rpx;
		padding: 20rpx;
		margin-bottom: 20rpx;
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
	}
	
	.news-image {
		height: 160rpx;
		width: 240rpx;
		border-radius: 8rpx;
		margin-right: 20rpx;
		object-fit: cover;
	}
	
	.news-info {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}
	
	.news-title {
		font-size: 32rpx;
		line-height: 44rpx;
		color: #333;
		margin-bottom: 10rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	}
	
	.news-meta {
		display: flex;
		justify-content: space-between;
		font-size: 24rpx;
		color: #999;
	}

	/* 加载更多样式 */
	.load-more {
		text-align: center;
		padding: 30rpx 0;
		font-size: 28rpx;
		color: #999;
	}

	/* 响应式设计 */
	@media (min-width: 768px) {
		/* 平板和电脑端样式 */
		.swiper-container {
			height: 400rpx;
		}
		
		.swiper {
			width: 100%;
		}
		
		.nav-item {
			font-size: 36rpx;
			height: 70rpx;
			line-height: 70rpx;
		}
		
		.news-item {
			padding: 30rpx;
			margin-bottom: 30rpx;
		}
		
		.news-image {
			height: 200rpx;
			width: 300rpx;
		}
		
		.news-title {
			font-size: 36rpx;
			line-height: 50rpx;
		}
		
		.news-meta {
			font-size: 28rpx;
		}
	}

	@media (min-width: 1024px) {
		/* 电脑端样式 */
		.swiper-container {
			height: 500rpx;
		}
		
		.swiper {
			width: 100%;
		}
		
		.nav-item {
			font-size: 40rpx;
			height: 80rpx;
			line-height: 80rpx;
		}
		
		.news-item {
			padding: 40rpx;
			margin-bottom: 40rpx;
		}
		
		.news-image {
			height: 240rpx;
			width: 360rpx;
		}
		
		.news-title {
			font-size: 40rpx;
			line-height: 56rpx;
		}
		
		.news-meta {
			font-size: 32rpx;
		}
	}
</style>
