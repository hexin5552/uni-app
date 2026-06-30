<template>
	<view class="company-page">
		<!-- 顶部搜索框 -->
		<view class="search-bar">
			<view class="search-input">
				<text class="icon">🔍</text>
				<input
					class="input"
					v-model="keyword"
					placeholder="搜索回收公司"
					@input="onSearch"
					@confirm="searchCompany"
				/>
			</view>
			<view class="search-btn" @click="searchCompany">搜索</view>
		</view>

		<!-- 公司列表 -->
		<view class="company-list">
			<view
				class="company-item card"
				v-for="(company, index) in companyList"
				:key="index"
				@click="goCompanyDetail(company)"
			>
				<image class="company-image" :src="company.image" mode="aspectFill"></image>
				<view class="company-info">
					<text class="company-name">{{ company.name }}</text>
					<view class="company-tags">
						<text class="tag">{{ company.category }}</text>
					</view>
					<view class="company-meta">
						<text class="rating">⭐ {{ company.rating }}</text>
						<text class="area">{{ company.area }}</text>
						<text class="min-weight">起收: {{ company.minWeight }}</text>
					</view>
				</view>
			</view>

			<!-- 无搜索结果 -->
			<view class="empty-state" v-if="companyList.length === 0 && !loading">
				<text class="empty-icon">🏭</text>
				<text class="empty-text">未找到相关回收企业</text>
			</view>
		</view>

		<!-- 加载状态 -->
		<view class="loading-state" v-if="loading">
			<text>加载中...</text>
		</view>
	</view>
</template>

<script>
import { getRecycleCompanyList, search } from '@/utils/request.js';

export default {
	data() {
		return {
			keyword: '',
			companyList: [],
			allCompanyList: [],
			loading: false
		};
	},
	onLoad() {
		this.loadCompanyList();
	},
	methods: {
		// 加载公司列表
		async loadCompanyList() {
			this.loading = true;
			try {
				const res = await getRecycleCompanyList();
				this.allCompanyList = res.data || [];
				this.companyList = this.allCompanyList;
			} catch (e) {
				console.error('加载公司列表失败', e);
				this.companyList = [];
			} finally {
				this.loading = false;
			}
		},
		// 搜索输入
		onSearch() {
			if (!this.keyword) {
				this.companyList = this.allCompanyList;
			}
		},
		// 搜索公司
		searchCompany() {
			if (!this.keyword.trim()) {
				this.companyList = this.allCompanyList;
				return;
			}

			const kw = this.keyword.toLowerCase();
			this.companyList = this.allCompanyList.filter(item => {
				return (
					item.name.toLowerCase().includes(kw) ||
					item.category.toLowerCase().includes(kw) ||
					item.area.toLowerCase().includes(kw)
				);
			});

			if (this.companyList.length === 0) {
				uni.showToast({
					title: '未找到相关回收企业',
					icon: 'none'
				});
			}
		},
		// 跳转公司详情
		goCompanyDetail(company) {
			uni.navigateTo({
				url: `/pages/recycle-company/company-detail?id=${company.id}`
			});
		}
	}
};
</script>

<style scoped>
.company-page {
	background-color: #f0f9f4;
	min-height: 100vh;
	padding-bottom: 40rpx;
}

/* 搜索栏 */
.search-bar {
	display: flex;
	align-items: center;
	padding: 20rpx 30rpx;
	background: #ffffff;
	position: sticky;
	top: 0;
	z-index: 10;
}

.search-input {
	flex: 1;
	display: flex;
	align-items: center;
	background: #f5f5f5;
	border-radius: 40rpx;
	padding: 16rpx 24rpx;
	margin-right: 20rpx;
}

.search-input .icon {
	margin-right: 12rpx;
	font-size: 28rpx;
}

.search-input .input {
	flex: 1;
	font-size: 28rpx;
}

.search-btn {
	background: #4CAF50;
	color: #ffffff;
	padding: 16rpx 32rpx;
	border-radius: 40rpx;
	font-size: 28rpx;
}

/* 公司列表 */
.company-list {
	padding: 20rpx 30rpx;
}

.card {
	background: #ffffff;
	border-radius: 16rpx;
	padding: 24rpx;
	margin-bottom: 20rpx;
	box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
}

.company-item {
	display: flex;
}

.company-image {
	width: 180rpx;
	height: 140rpx;
	border-radius: 12rpx;
	margin-right: 24rpx;
	flex-shrink: 0;
}

.company-info {
	flex: 1;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
}

.company-name {
	font-size: 30rpx;
	font-weight: bold;
	color: #333333;
	margin-bottom: 12rpx;
}

.company-tags {
	margin-bottom: 12rpx;
}

.tag {
	display: inline-block;
	background: #E8F5E9;
	color: #4CAF50;
	font-size: 22rpx;
	padding: 6rpx 16rpx;
	border-radius: 20rpx;
	margin-right: 10rpx;
}

.company-meta {
	display: flex;
	font-size: 24rpx;
	color: #999999;
}

.rating {
	margin-right: 20rpx;
}

.area {
	margin-right: 20rpx;
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
