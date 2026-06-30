<template>
	<view class="index-page">
		<!-- 顶部搜索栏 -->
		<view class="search-bar" @click="goSearch">
			<view class="search-input">
				<text class="icon">🔍</text>
				<text class="placeholder">搜索回收品类 / 回收公司</text>
			</view>
		</view>

		<!-- 轮播图 -->
		<view class="banner-section">
			<swiper class="banner-swiper" autoplay circular indicator-dots indicator-color="rgba(255,255,255,0.5)" indicator-active-color="#4CAF50">
				<swiper-item v-for="(item, index) in bannerList" :key="index">
					<image class="banner-image" :src="item.image" mode="aspectFill"></image>
				</swiper-item>
			</swiper>
		</view>

		<!-- 快捷功能区 -->
		<view class="quick-actions card">
			<view class="section-title">快捷功能</view>
			<view class="action-grid">
				<view class="action-item" v-for="(item, index) in actionList" :key="index" @click="handleAction(item)">
					<view class="action-icon" :style="{ background: item.bgColor }">
						<text>{{ item.icon }}</text>
					</view>
					<text class="action-text">{{ item.name }}</text>
				</view>
			</view>
		</view>

		<!-- 回收操作流程 -->
		<view class="process-section card">
			<view class="section-title">回收流程</view>
			<view class="process-steps">
				<view class="step-item" v-for="(step, index) in processSteps" :key="index">
					<view class="step-icon" :class="{ active: index <= currentStep }">
						<text>{{ step.icon }}</text>
					</view>
					<text class="step-text">{{ step.name }}</text>
					<view class="step-arrow" v-if="index < processSteps.length - 1">→</view>
				</view>
			</view>
		</view>

		<!-- 预约回收按钮 -->
		<view class="book-btn" @click="goRecycleCompany">
			<text class="btn-text">预约上门回收</text>
		</view>

		<!-- 爱心活动板块 -->
		<view class="activity-section card">
			<view class="section-title">环保公益活动</view>
			<view class="activity-list">
				<view class="activity-item" v-for="(item, index) in activityList" :key="index">
					<image class="activity-image" :src="item.image" mode="aspectFill"></image>
					<view class="activity-info">
						<text class="activity-title">{{ item.title }}</text>
						<text class="activity-desc">{{ item.desc }}</text>
						<text class="activity-time">活动时间: {{ item.time }}</text>
						<view class="activity-btn" @click="joinActivity(item)">立即参与</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { getBannerList, getActivityList } from '@/utils/request.js';

export default {
	data() {
		return {
			bannerList: [],
			activityList: [],
			currentStep: 0,
			actionList: [
				{ id: 1, name: '废纸回收', icon: '📄', bgColor: '#E3F2FD' },
				{ id: 2, name: '塑料回收', icon: '🛢️', bgColor: '#E8F5E9' },
				{ id: 3, name: '金属回收', icon: '🔩', bgColor: '#FFF3E0' },
				{ id: 4, name: '家电回收', icon: '📺', bgColor: '#F3E5F5' },
				{ id: 5, name: '有害垃圾', icon: '☠️', bgColor: '#FFEBEE' },
				{ id: 6, name: '环保数据', icon: '📊', bgColor: '#E0F7FA' }
			],
			processSteps: [
				{ name: '一键预约', icon: '📝' },
				{ name: '上门回收', icon: '🚚' },
				{ name: '称重结算', icon: '⚖️' },
				{ name: '环保积分', icon: '💰' }
			]
		};
	},
	onLoad() {
		this.loadBannerData();
		this.loadActivityData();
		this.animateSteps();
	},
	methods: {
		// 加载轮播图数据
		async loadBannerData() {
			try {
				const res = await getBannerList();
				this.bannerList = res.data || [];
			} catch (e) {
				console.error('加载轮播图失败', e);
			}
		},
		// 加载活动数据
		async loadActivityData() {
			try {
				const res = await getActivityList();
				this.activityList = res.data || [];
			} catch (e) {
				console.error('加载活动失败', e);
			}
		},
		// 动画展示步骤
		animateSteps() {
			let step = 0;
			setInterval(() => {
				this.currentStep = step % 4;
				step++;
			}, 2000);
		},
		// 跳转搜索页
		goSearch() {
			uni.navigateTo({
				url: '/pages/search/index'
			});
		},
		// 跳转回收公司页面
		goRecycleCompany() {
			uni.switchTab({
				url: '/pages/recycle-company/index'
			});
		},
		// 处理快捷功能点击
		handleAction(item) {
			if (item.name === '环保数据') {
				uni.navigateTo({
					url: '/pages/mine/data-view'
				});
			} else {
				uni.showToast({
					title: item.name,
					icon: 'none'
				});
			}
		},
		// 参与活动
		joinActivity(item) {
			const token = uni.getStorageSync('token');
			if (!token) {
				uni.navigateTo({
					url: '/pages/login/index'
				});
				return;
			}
			uni.showToast({
				title: '参与成功',
				icon: 'success'
			});
		}
	}
};
</script>

<style scoped>
.index-page {
	background-color: #f0f9f4;
	min-height: 100vh;
	padding-bottom: 30rpx;
}

/* 搜索栏 */
.search-bar {
	padding: 20rpx 30rpx;
	background: linear-gradient(135deg, #4CAF50, #81C784);
}

.search-input {
	display: flex;
	align-items: center;
	background: #ffffff;
	border-radius: 8rpx;
	padding: 20rpx 24rpx;
}

.search-input .icon {
	margin-right: 16rpx;
	font-size: 28rpx;
}

.search-input .placeholder {
	color: #999999;
	font-size: 28rpx;
}

/* 轮播图 */
.banner-section {
	padding: 20rpx 30rpx;
}

.banner-swiper {
	height: 300rpx;
	border-radius: 16rpx;
	overflow: hidden;
}

.banner-image {
	width: 100%;
	height: 100%;
}

/* 卡片 */
.card {
	margin: 0 30rpx 20rpx;
	background: #ffffff;
	border-radius: 16rpx;
	padding: 30rpx;
	box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
}

.section-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333333;
	margin-bottom: 24rpx;
}

/* 快捷功能 */
.action-grid {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 30rpx;
}

.action-item {
	display: flex;
	flex-direction: column;
	align-items: center;
}

.action-icon {
	width: 100rpx;
	height: 100rpx;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 48rpx;
	margin-bottom: 12rpx;
}

.action-text {
	font-size: 24rpx;
	color: #666666;
}

/* 回收流程 */
.process-steps {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 20rpx 0;
}

.step-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	position: relative;
}

.step-icon {
	width: 80rpx;
	height: 80rpx;
	border-radius: 50%;
	background: #E8F5E9;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 36rpx;
	margin-bottom: 12rpx;
	transition: all 0.3s;
}

.step-icon.active {
	background: #4CAF50;
	transform: scale(1.1);
}

.step-text {
	font-size: 22rpx;
	color: #666666;
}

.step-arrow {
	position: absolute;
	right: -40rpx;
	color: #4CAF50;
	font-size: 24rpx;
}

/* 预约按钮 */
.book-btn {
	margin: 30rpx;
	background: linear-gradient(135deg, #4CAF50, #388E3C);
	border-radius: 50rpx;
	padding: 28rpx;
	text-align: center;
	box-shadow: 0 4rpx 16rpx rgba(76, 175, 80, 0.3);
}

.btn-text {
	color: #ffffff;
	font-size: 32rpx;
	font-weight: bold;
}

/* 活动列表 */
.activity-list {
	display: flex;
	flex-direction: column;
}

.activity-item {
	display: flex;
	padding: 20rpx 0;
	border-bottom: 1rpx solid #f0f0f0;
}

.activity-item:last-child {
	border-bottom: none;
}

.activity-image {
	width: 200rpx;
	height: 150rpx;
	border-radius: 12rpx;
	margin-right: 20rpx;
	flex-shrink: 0;
}

.activity-info {
	flex: 1;
	display: flex;
	flex-direction: column;
}

.activity-title {
	font-size: 28rpx;
	font-weight: bold;
	color: #333333;
	margin-bottom: 8rpx;
}

.activity-desc {
	font-size: 24rpx;
	color: #666666;
	margin-bottom: 8rpx;
}

.activity-time {
	font-size: 22rpx;
	color: #999999;
	margin-bottom: 12rpx;
}

.activity-btn {
	background: #4CAF50;
	color: #ffffff;
	font-size: 24rpx;
	padding: 12rpx 24rpx;
	border-radius: 30rpx;
	text-align: center;
	width: 160rpx;
}
</style>
