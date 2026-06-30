<template>
	<view class="order-detail-page">
		<!-- 订单状态 -->
		<view class="status-header">
			<text class="status-text">{{ orderDetail.status }}</text>
			<text class="status-desc">{{ getStatusDesc(orderDetail.status) }}</text>
		</view>

		<!-- 订单信息卡片 -->
		<view class="info-card card">
			<view class="card-title">订单信息</view>
			<view class="info-row">
				<text class="label">订单编号</text>
				<text class="value">{{ orderDetail.id }}</text>
			</view>
			<view class="info-row">
				<text class="label">回收品类</text>
				<text class="value">{{ orderDetail.category }}</text>
			</view>
			<view class="info-row">
				<text class="label">预约时间</text>
				<text class="value">{{ orderDetail.time }}</text>
			</view>
			<view class="info-row">
				<text class="label">回收地址</text>
				<text class="value">{{ orderDetail.address }}</text>
			</view>
			<view class="info-row">
				<text class="label">预估重量</text>
				<text class="value">{{ orderDetail.weight }}</text>
			</view>
			<view class="info-row">
				<text class="label">预估金额</text>
				<text class="value price">{{ orderDetail.amount }}</text>
			</view>
			<view class="info-row">
				<text class="label">下单时间</text>
				<text class="value">{{ orderDetail.createTime }}</text>
			</view>
		</view>

		<!-- 回收员信息 -->
		<view class="info-card card" v-if="orderDetail.status !== '待接单' && orderDetail.status !== '已取消'">
			<view class="card-title">回收员信息</view>
			<view class="info-row" v-if="orderDetail.recycler">
				<text class="label">回收员</text>
				<text class="value">{{ orderDetail.recycler }}</text>
			</view>
			<view class="info-row" v-if="orderDetail.recyclerPhone">
				<text class="label">联系电话</text>
				<text class="value" @click="callPhone(orderDetail.recyclerPhone)">{{ orderDetail.recyclerPhone }}</text>
			</view>
			<view class="no-data" v-if="!orderDetail.recycler">
				<text>回收员信息暂未分配</text>
			</view>
		</view>

		<!-- 操作按钮 -->
		<view class="action-btns" v-if="orderDetail.status === '待接单'">
			<view class="btn-cancel" @click="cancelOrder">取消订单</view>
		</view>
	</view>
</template>

<script>
import { getOrderDetail } from '@/utils/request.js';

export default {
	data() {
		return {
			orderId: '',
			orderDetail: {
				id: '',
				category: '',
				time: '',
				address: '',
				weight: '',
				amount: '',
				status: '',
				recycler: '',
				recyclerPhone: '',
				createTime: ''
			}
		};
	},
	onLoad(options) {
		if (options.id) {
			this.orderId = options.id;
			this.loadOrderDetail();
		}
	},
	methods: {
		// 加载订单详情
		async loadOrderDetail() {
			uni.showLoading({ title: '加载中...' });
			try {
				const res = await getOrderDetail(this.orderId);
				this.orderDetail = res.data || {};
			} catch (e) {
				console.error('加载订单详情失败', e);
				uni.showToast({ title: '加载失败', icon: 'none' });
			} finally {
				uni.hideLoading();
			}
		},
		// 获取状态描述
		getStatusDesc(status) {
			const descMap = {
				'待接单': '等待回收员接单',
				'已接单': '回收员已接单，请等待上门回收',
				'已完成': '订单已完成，感谢您的环保贡献',
				'已取消': '订单已取消'
			};
			return descMap[status] || '';
		},
		// 拨打电话
		callPhone(phone) {
			uni.makePhoneCall({
				phoneNumber: phone
			});
		},
		// 取消订单
		cancelOrder() {
			uni.showModal({
				title: '提示',
				content: '确定要取消该订单吗？',
				success: (res) => {
					if (res.confirm) {
						uni.showToast({ title: '订单已取消', icon: 'success' });
						setTimeout(() => {
							uni.navigateBack();
						}, 1500);
					}
				}
			});
		}
	}
};
</script>

<style scoped>
.order-detail-page {
	background-color: #f0f9f4;
	min-height: 100vh;
	padding-bottom: 40rpx;
}

/* 状态头部 */
.status-header {
	background: linear-gradient(135deg, #4CAF50, #81C784);
	padding: 40rpx 30rpx;
	color: #ffffff;
}

.status-text {
	font-size: 36rpx;
	font-weight: bold;
	display: block;
	margin-bottom: 10rpx;
}

.status-desc {
	font-size: 26rpx;
	opacity: 0.9;
}

/* 卡片 */
.card {
	margin: 30rpx;
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
	justify-content: space-between;
	align-items: center;
	padding: 16rpx 0;
}

.info-row .label {
	font-size: 28rpx;
	color: #999999;
}

.info-row .value {
	font-size: 28rpx;
	color: #333333;
}

.info-row .price {
	color: #4CAF50;
	font-weight: bold;
}

.no-data {
	text-align: center;
	padding: 30rpx 0;
	color: #999999;
	font-size: 26rpx;
}

/* 操作按钮 */
.action-btns {
	padding: 40rpx 30rpx;
}

.btn-cancel {
	background: #ffffff;
	color: #999999;
	border: 2rpx solid #e0e0e0;
	border-radius: 40rpx;
	padding: 24rpx;
	text-align: center;
	font-size: 28rpx;
}
</style>
