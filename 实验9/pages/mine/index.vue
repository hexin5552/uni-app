<template>
	<view class="mine-page">
		<!-- 顶部用户信息区 -->
		<view class="user-header" :class="{ loggedIn: isLoggedIn }">
			<!-- 未登录状态 -->
			<view class="user-info-unlogin" v-if="!isLoggedIn" @click="goLogin">
				<view class="avatar-unlogin">👤</view>
				<text class="unlogin-text">点击登录账号</text>
				<view class="login-btn">登录</view>
			</view>

			<!-- 已登录状态 -->
			<view class="user-info-logged" v-else>
				<view class="avatar">{{ userInfo.avatar || '👤' }}</view>
				<text class="nickname">{{ userInfo.nickname }}</text>
				<view class="points">
					<text class="points-icon">💰</text>
					<text class="points-value">{{ userInfo.points || 0 }} 积分</text>
				</view>
			</view>
		</view>

		<!-- 签到模块 -->
		<view class="sign-card card" v-if="isLoggedIn">
			<view class="sign-header">
				<text class="sign-title">每日签到</text>
				<text class="sign-tip">连续签到可获得更多积分</text>
			</view>
			<view class="sign-calendar">
				<view class="calendar-grid">
					<view
						class="calendar-day"
						v-for="(day, index) in calendarDays"
						:key="index"
						:class="{ signed: day <= today, today: day === today }"
					>
						{{ day }}
					</view>
				</view>
			</view>
			<view class="sign-btn" :class="{ disabled: hasSigned }" @click="doSign">
				<text>{{ hasSigned ? '今日已签到' : '立即签到' }}</text>
			</view>
		</view>

		<!-- 功能菜单列表 -->
		<view class="menu-list card">
			<view class="menu-item" v-for="(menu, index) in menuList" :key="index" @click="handleMenu(menu)">
				<view class="menu-left">
					<text class="menu-icon">{{ menu.icon }}</text>
					<text class="menu-text">{{ menu.name }}</text>
				</view>
				<text class="menu-arrow">›</text>
			</view>
		</view>

		<!-- 退出登录 -->
		<view class="logout-btn" v-if="isLoggedIn" @click="logout">
			<text>退出登录</text>
		</view>
	</view>
</template>

<script>
import { signIn, getUserInfo } from '@/utils/request.js';

export default {
	data() {
		return {
			isLoggedIn: false,
			userInfo: {
				nickname: '环保达人',
				avatar: '',
				points: 520
			},
			hasSigned: false,
			today: new Date().getDate(),
			calendarDays: [1, 2, 3, 4, 5, 6, 7],
			menuList: [
				{ id: 1, name: '我的积分', icon: '💰', path: '' },
				{ id: 2, name: '回收记录', icon: '📋', path: '/pages/order/index' },
				{ id: 3, name: '环保数据', icon: '📊', path: '/pages/mine/data-view' },
				{ id: 4, name: '意见反馈', icon: '💬', path: '' },
				{ id: 5, name: '设置', icon: '⚙️', path: '' }
			]
		};
	},
	onLoad() {
		this.checkLoginStatus();
	},
	onShow() {
		this.checkLoginStatus();
		this.checkSignStatus();
	},
	methods: {
		// 检查登录状态
		checkLoginStatus() {
			const token = uni.getStorageSync('token');
			const userInfoStorage = uni.getStorageSync('userInfo');
			this.isLoggedIn = !!token;
			if (userInfoStorage) {
				this.userInfo = userInfoStorage;
			}
		},
		// 检查签到状态
		checkSignStatus() {
			const signDate = uni.getStorageSync('signDate');
			const today = this.formatDate(new Date());
			this.hasSigned = signDate === today;
		},
		// 格式化日期
		formatDate(date) {
			const year = date.getFullYear();
			const month = String(date.getMonth() + 1).padStart(2, '0');
			const day = String(date.getDate()).padStart(2, '0');
			return `${year}-${month}-${day}`;
		},
		// 签到
		async doSign() {
			if (this.hasSigned) {
				uni.showToast({ title: '今日已签到', icon: 'none' });
				return;
			}

			try {
				uni.showLoading({ title: '签到中...' });
				const res = await signIn();
				this.hasSigned = true;
				this.userInfo.points = (this.userInfo.points || 0) + (res.data.points || 10);

				// 更新本地存储的用户信息
				uni.setStorageSync('userInfo', this.userInfo);

				uni.showToast({
					title: `签到成功 +${res.data.points}积分`,
					icon: 'success'
				});
			} catch (e) {
				uni.showToast({ title: e.msg || '签到失败', icon: 'none' });
			} finally {
				uni.hideLoading();
			}
		},
		// 处理菜单点击
		handleMenu(menu) {
			if (!menu.path) {
				uni.showToast({ title: menu.name, icon: 'none' });
				return;
			}
			uni.navigateTo({ url: menu.path });
		},
		// 跳转登录
		goLogin() {
			uni.navigateTo({
				url: '/pages/login/index'
			});
		},
		// 退出登录
		logout() {
			uni.showModal({
				title: '提示',
				content: '确定要退出登录吗？',
				success: (res) => {
					if (res.confirm) {
						uni.removeStorageSync('token');
						uni.removeStorageSync('userInfo');
						uni.removeStorageSync('signDate');
						this.isLoggedIn = false;
						this.userInfo = {};
						uni.showToast({ title: '已退出登录', icon: 'success' });
					}
				}
			});
		}
	}
};
</script>

<style scoped>
.mine-page {
	background-color: #f0f9f4;
	min-height: 100vh;
	padding-bottom: 40rpx;
}

/* 用户头部 */
.user-header {
	padding: 60rpx 30rpx;
	background: linear-gradient(135deg, #4CAF50, #81C784);
	min-height: 280rpx;
}

.user-info-unlogin {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 40rpx 0;
}

.avatar-unlogin {
	width: 140rpx;
	height: 140rpx;
	border-radius: 50%;
	background: rgba(255, 255, 255, 0.2);
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 70rpx;
	margin-bottom: 20rpx;
}

.unlogin-text {
	color: #ffffff;
	font-size: 28rpx;
	margin-bottom: 24rpx;
}

.login-btn {
	background: #ffffff;
	color: #4CAF50;
	font-size: 28rpx;
	font-weight: bold;
	padding: 16rpx 60rpx;
	border-radius: 40rpx;
}

.user-info-logged {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 30rpx 0;
}

.avatar {
	width: 140rpx;
	height: 140rpx;
	border-radius: 50%;
	background: rgba(255, 255, 255, 0.2);
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 70rpx;
	margin-bottom: 20rpx;
}

.nickname {
	color: #ffffff;
	font-size: 32rpx;
	font-weight: bold;
	margin-bottom: 16rpx;
}

.points {
	display: flex;
	align-items: center;
	background: rgba(255, 255, 255, 0.2);
	padding: 12rpx 30rpx;
	border-radius: 30rpx;
}

.points-icon {
	font-size: 28rpx;
	margin-right: 8rpx;
}

.points-value {
	color: #ffffff;
	font-size: 26rpx;
}

/* 签到卡片 */
.sign-card {
	margin: -60rpx 30rpx 30rpx;
	background: #ffffff;
	border-radius: 16rpx;
	padding: 30rpx;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
}

.sign-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 24rpx;
}

.sign-title {
	font-size: 30rpx;
	font-weight: bold;
	color: #333333;
}

.sign-tip {
	font-size: 24rpx;
	color: #999999;
}

.sign-calendar {
	margin-bottom: 24rpx;
}

.calendar-grid {
	display: flex;
	justify-content: space-around;
}

.calendar-day {
	width: 60rpx;
	height: 60rpx;
	border-radius: 50%;
	background: #f5f5f5;
	color: #999999;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 26rpx;
}

.calendar-day.today {
	background: #E8F5E9;
	color: #4CAF50;
	font-weight: bold;
}

.calendar-day.signed {
	background: #4CAF50;
	color: #ffffff;
}

.sign-btn {
	background: linear-gradient(135deg, #4CAF50, #388E3C);
	color: #ffffff;
	text-align: center;
	padding: 24rpx;
	border-radius: 40rpx;
	font-size: 28rpx;
	font-weight: bold;
}

.sign-btn.disabled {
	background: #E0E0E0;
	color: #999999;
}

/* 菜单列表 */
.menu-list {
	margin: 0 30rpx;
	background: #ffffff;
	border-radius: 16rpx;
	padding: 0 30rpx;
	box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
}

.menu-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 30rpx 0;
	border-bottom: 1rpx solid #f5f5f5;
}

.menu-item:last-child {
	border-bottom: none;
}

.menu-left {
	display: flex;
	align-items: center;
}

.menu-icon {
	font-size: 36rpx;
	margin-right: 20rpx;
}

.menu-text {
	font-size: 28rpx;
	color: #333333;
}

.menu-arrow {
	font-size: 32rpx;
	color: #cccccc;
}

/* 退出按钮 */
.logout-btn {
	margin: 40rpx 30rpx 0;
	background: #ffffff;
	border: 2rpx solid #e0e0e0;
	border-radius: 40rpx;
	padding: 24rpx;
	text-align: center;
}

.logout-btn text {
	font-size: 28rpx;
	color: #999999;
}
</style>
