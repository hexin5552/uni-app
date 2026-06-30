<template>
	<view class="order-page">
		<!-- 顶部Tab标签栏 -->
		<view class="tab-bar">
			<view
				class="tab-item"
				v-for="(tab, index) in tabs"
				:key="index"
				:class="{ active: currentTab === index }"
				@click="switchTab(index)"
			>
				<text>{{ tab.name }}</text>
				<view class="tab-line" v-if="currentTab === index"></view>
			</view>
		</view>

		<!-- 未登录提示 -->
		<view class="login-tip" v-if="!isLoggedIn">
			<view class="tip-card">
				<text class="tip-text">登录后查看我的订单</text>
				<view class="tip-btn" @click="goLogin">去登录</view>
			</view>
		</view>

		<!-- 订单列表 -->
		<view class="order-list" v-else>
			<view class="order-item card" v-for="(order, index) in orderList" :key="index" @click="goOrderDetail(order)">
				<view class="order-header">
					<text class="order-category">{{ order.category }}</text>
					<text class="order-status" :class="getStatusClass(order.status)">{{ order.status }}</text>
				</view>
				<view class="order-info">
					<view class="info-row">
						<text class="label">预约时间:</text>
						<text class="value">{{ order.time }}</text>
					</view>
					<view class="info-row">
						<text class="label">回收地址:</text>
						<text class="value">{{ order.address }}</text>
					</view>
					<view class="info-row">
						<text class="label">预估重量:</text>
						<text class="value">{{ order.weight }}</text>
					</view>
					<view class="info-row">
						<text class="label">预估金额:</text>
						<text class="value price">{{ order.amount }}</text>
					</view>
				</view>
			</view>

			<!-- 无订单空白页 -->
			<view class="empty-state" v-if="orderList.length === 0 && !loading">
				<text class="empty-icon">📋</text>
				<text class="empty-text">暂无对应订单</text>
			</view>
		</view>

		<!-- 加载状态 -->
		<view class="loading-state" v-if="loading">
			<text>加载中...</text>
		</view>
	</view>
</template>

<script>
import { getOrderList } from '@/utils/request.js';

export default {
	data() {
		return {
			tabs: [
				{ name: '待接单', type: 'pending' },
				{ name: '已接单', type: 'accepted' },
				{ name: '已完成', type: 'completed' },
				{ name: '已取消', type: 'cancelled' }
			],
			currentTab: 0,
			orderList: [],
			isLoggedIn: false,
			loading: false
		};
	},
	onLoad() {
		this.checkLoginStatus();
	},
	onShow() {
		this.checkLoginStatus();
	},
	methods: {
		// 检查登录状态
		checkLoginStatus() {
			const token = uni.getStorageSync('token');
			this.isLoggedIn = !!token;
			if (this.isLoggedIn) {
				this.loadOrderList();
			}
		},
		// 切换Tab
		switchTab(index) {
			if (this.currentTab === index) return;
			this.currentTab = index;
			this.loadOrderList();
		},
		// 加载订单列表
		async loadOrderList() {
			if (!this.isLoggedIn) return;

			this.loading = true;
			try {
				const type = this.tabs[this.currentTab].type;
				const res = await getOrderList(type);
				this.orderList = res.data || [];
			} catch (e) {
				console.error('加载订单失败', e);
				this.orderList = [];
			} finally {
				this.loading = false;
			}
		},
		// 获取状态样式类
		getStatusClass(status) {
			const classMap = {
				'待接单': 'status-pending',
				'已接单': 'status-accepted',
				'已完成': 'status-completed',
				'已取消': 'status-cancelled'
			};
			return classMap[status] || '';
		},
		// 跳转登录
		goLogin() {
			uni.navigateTo({
				url: '/pages/login/index'
			});
		},
		// 跳转订单详情
		goOrderDetail(order) {
			uni.navigateTo({
				url: `/pages/order/order-detail?id=${order.id}`
			});
		}
	}
};
</script>

<style scoped>
.order-page {
	background-color: #f0f9f4;
	min-height: 100vh;
}

/* Tab标签栏 */
.tab-bar {
	display: flex;
	background: #ffffff;
	padding: 0 20rpx;
	position: sticky;
	top: 0;
	z-index: 10;
}

.tab-item {
	flex: 1;
	height: 88rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	position: relative;
}

.tab-item text {
	font-size: 28rpx;
	color: #666666;
}

.tab-item.active text {
	color: #4CAF50;
	font-weight: bold;
}

.tab-line {
	position: absolute;
	bottom: 0;
	width: 60rpx;
	height: 4rpx;
	background: #4CAF50;
	border-radius: 2rpx;
}

/* 未登录提示 */
.login-tip {
	padding: 200rpx 60rpx;
}

.tip-card {
	background: #ffffff;
	border-radius: 16rpx;
	padding: 60rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
}

.tip-text {
	font-size: 28rpx;
	color: #666666;
	margin-bottom: 30rpx;
}

.tip-btn {
	background: linear-gradient(135deg, #4CAF50, #388E3C);
	color: #ffffff;
	font-size: 28rpx;
	padding: 20rpx 60rpx;
	border-radius: 40rpx;
}

/* 订单列表 */
.order-list {
	padding: 20rpx 30rpx;
}

.card {
	background: #ffffff;
	border-radius: 16rpx;
	padding: 30rpx;
	margin-bottom: 20rpx;
	box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
}

.order-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding-bottom: 20rpx;
	border-bottom: 1rpx solid #f0f0f0;
	margin-bottom: 20rpx;
}

.order-category {
	font-size: 30rpx;
	font-weight: bold;
	color: #333333;
}

.order-status {
	font-size: 24rpx;
	padding: 6rpx 16rpx;
	border-radius: 20rpx;
}

.status-pending {
	background: #FFF3E0;
	color: #FF9800;
}

.status-accepted {
	background: #E3F2FD;
	color: #2196F3;
}

.status-completed {
	background: #E8F5E9;
	color: #4CAF50;
}

.status-cancelled {
	background: #F5F5F5;
	color: #999999;
}

.order-info {
	display: flex;
	flex-direction: column;
	gap: 12rpx;
}

.info-row {
	display: flex;
	font-size: 26rpx;
}

.info-row .label {
	color: #999999;
	width: 140rpx;
}

.info-row .value {
	color: #666666;
	flex: 1;
}

.info-row .price {
	color: #4CAF50;
	font-weight: bold;
}

/* 空白状态 */
.empty-state {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 100rpx 0;
}

.empty-icon {
	font-size: 100rpx;
	margin-bottom: 20rpx;
}

.empty-text {
	font-size: 28rpx;
	color: #999999;
}

/* 加载状态 */
.loading-state {
	text-align: center;
	padding: 40rpx;
	color: #999999;
	font-size: 26rpx;
}
</style>
