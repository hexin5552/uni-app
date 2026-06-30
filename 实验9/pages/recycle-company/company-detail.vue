<template>
	<view class="company-detail-page">
		<!-- 公司头部 -->
		<view class="header">
			<image class="header-image" :src="companyDetail.image" mode="aspectFill"></image>
			<view class="header-info">
				<text class="company-name">{{ companyDetail.name }}</text>
				<view class="company-tags">
					<text class="tag" v-for="(cat, index) in companyDetail.category.split('、')" :key="index">{{ cat }}</text>
				</view>
				<view class="company-meta">
					<text class="rating">⭐ {{ companyDetail.rating }}</text>
					<text class="area">📍 {{ companyDetail.area }}</text>
				</view>
			</view>
		</view>

		<!-- 预约按钮 -->
		<view class="book-btn" @click="bookRecycle">
			<text class="btn-text">立即预约</text>
		</view>

		<!-- 详细信息卡片 -->
		<view class="info-card card">
			<view class="card-title">服务信息</view>
			<view class="info-row">
				<text class="label">服务范围</text>
				<text class="value">{{ companyDetail.scope }}</text>
			</view>
			<view class="info-row">
				<text class="label">上门区域</text>
				<text class="value">{{ companyDetail.serviceArea }}</text>
			</view>
			<view class="info-row">
				<text class="label">收费标准</text>
				<text class="value">{{ companyDetail.standard }}</text>
			</view>
			<view class="info-row">
				<text class="label">最低起收</text>
				<text class="value">{{ companyDetail.minWeight }}</text>
			</view>
		</view>

		<!-- 联系方式 -->
		<view class="info-card card">
			<view class="card-title">联系方式</view>
			<view class="info-row">
				<text class="label">客服电话</text>
				<text class="value phone" @click="callPhone">{{ companyDetail.phone }}</text>
			</view>
		</view>

		<!-- 用户评价 -->
		<view class="info-card card">
			<view class="card-title">用户评价</view>
			<view class="review-list">
				<view class="review-item" v-for="(review, index) in companyDetail.reviews" :key="index">
					<view class="review-header">
						<text class="review-user">{{ review.user }}</text>
						<text class="review-rating">⭐ {{ review.rating }}</text>
					</view>
					<text class="review-content">{{ review.content }}</text>
				</view>
			</view>
			<view class="no-data" v-if="!companyDetail.reviews || companyDetail.reviews.length === 0">
				<text>暂无评价</text>
			</view>
		</view>
	</view>
</template>

<script>
import { getCompanyDetail } from '@/utils/request.js';

export default {
	data() {
		return {
			companyId: '',
			companyDetail: {
				id: '',
				name: '',
				category: '',
				rating: '',
				area: '',
				minWeight: '',
				image: '',
				scope: '',
				serviceArea: '',
				standard: '',
				phone: '',
				reviews: []
			}
		};
	},
	onLoad(options) {
		if (options.id) {
			this.companyId = options.id;
			this.loadCompanyDetail();
		}
	},
	methods: {
		// 加载公司详情
		async loadCompanyDetail() {
			uni.showLoading({ title: '加载中...' });
			try {
				const res = await getCompanyDetail(this.companyId);
				this.companyDetail = res.data || {};
			} catch (e) {
				console.error('加载公司详情失败', e);
				uni.showToast({ title: '加载失败', icon: 'none' });
			} finally {
				uni.hideLoading();
			}
		},
		// 拨打电话
		callPhone() {
			if (this.companyDetail.phone) {
				uni.makePhoneCall({
					phoneNumber: this.companyDetail.phone
				});
			}
		},
		// 预约回收
		bookRecycle() {
			const token = uni.getStorageSync('token');
			if (!token) {
				uni.navigateTo({
					url: '/pages/login/index'
				});
				return;
			}
			uni.showToast({
				title: '预约成功',
				icon: 'success'
			});
		}
	}
};
</script>

<style scoped>
.company-detail-page {
	background-color: #f0f9f4;
	min-height: 100vh;
	padding-bottom: 40rpx;
}

/* 头部 */
.header {
	background: linear-gradient(135deg, #4CAF50, #81C784);
	padding: 30rpx;
	color: #ffffff;
}

.header-image {
	width: 100%;
	height: 300rpx;
	border-radius: 16rpx;
	margin-bottom: 20rpx;
}

.header-info {
	padding: 0 10rpx;
}

.company-name {
	font-size: 36rpx;
	font-weight: bold;
	display: block;
	margin-bottom: 16rpx;
}

.company-tags {
	margin-bottom: 16rpx;
}

.tag {
	display: inline-block;
	background: rgba(255, 255, 255, 0.2);
	padding: 8rpx 20rpx;
	border-radius: 20rpx;
	font-size: 24rpx;
	margin-right: 12rpx;
}

.company-meta {
	display: flex;
	font-size: 26rpx;
}

.rating {
	margin-right: 30rpx;
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

/* 卡片 */
.card {
	margin: 0 30rpx 20rpx;
	background: #ffffff;
	border-radius: 16rpx;
	padding: 30rpx;
	box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
}

.card-title {
	font-size: 30rpx;
	font-weight: bold;
	color: #333333;
	margin-bottom: 24rpx;
	padding-bottom: 20rpx;
	border-bottom: 1rpx solid #f0f0f0;
}

.info-row {
	display: flex;
	flex-direction: column;
	padding: 16rpx 0;
	border-bottom: 1rpx solid #f5f5f5;
}

.info-row:last-child {
	border-bottom: none;
}

.info-row .label {
	font-size: 26rpx;
	color: #999999;
	margin-bottom: 8rpx;
}

.info-row .value {
	font-size: 28rpx;
	color: #333333;
}

.info-row .phone {
	color: #4CAF50;
}

/* 评价列表 */
.review-list {
	display: flex;
	flex-direction: column;
}

.review-item {
	padding: 20rpx 0;
	border-bottom: 1rpx solid #f5f5f5;
}

.review-item:last-child {
	border-bottom: none;
}

.review-header {
	display: flex;
	justify-content: space-between;
	margin-bottom: 10rpx;
}

.review-user {
	font-size: 28rpx;
	color: #333333;
}

.review-rating {
	font-size: 26rpx;
	color: #999999;
}

.review-content {
	font-size: 26rpx;
	color: #666666;
	line-height: 1.5;
}

.no-data {
	text-align: center;
	padding: 30rpx 0;
	color: #999999;
	font-size: 26rpx;
}
</style>
