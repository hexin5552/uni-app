<template>
	<view class="search-page">
		<!-- 搜索框 -->
		<view class="search-bar">
			<view class="search-input">
				<text class="icon">🔍</text>
				<input
					class="input"
					v-model="keyword"
					placeholder="搜索回收品类 / 回收公司"
					@confirm="doSearch"
					focus
				/>
			</view>
			<view class="cancel-btn" @click="goBack">取消</view>
		</view>

		<!-- 搜索历史 -->
		<view class="history-section" v-if="!keyword && searchHistory.length > 0">
			<view class="section-header">
				<text class="section-title">搜索历史</text>
				<text class="clear-btn" @click="clearHistory">清除</text>
			</view>
			<view class="history-tags">
				<view
					class="history-tag"
					v-for="(item, index) in searchHistory"
					:key="index"
					@click="searchByHistory(item)"
				>
					{{ item }}
				</view>
			</view>
		</view>

		<!-- 搜索结果 -->
		<view class="result-section" v-if="keyword">
			<view class="result-title" v-if="resultList.length > 0">
				找到 {{ resultList.length }} 个相关结果
			</view>

			<!-- 公司结果 -->
			<view class="result-list" v-if="resultList.length > 0">
				<view
					class="result-item card"
					v-for="(item, index) in resultList"
					:key="index"
					@click="goDetail(item)"
				>
					<image class="result-image" :src="item.image" mode="aspectFill"></image>
					<view class="result-info">
						<text class="result-name">{{ item.name }}</text>
						<text class="result-category">{{ item.category }}</text>
						<view class="result-meta">
							<text>⭐ {{ item.rating }}</text>
							<text>📍 {{ item.area }}</text>
						</view>
					</view>
				</view>
			</view>

			<!-- 无结果 -->
			<view class="empty-state" v-if="resultList.length === 0 && !loading">
				<text class="empty-icon">🔍</text>
				<text class="empty-text">未找到相关结果</text>
			</view>
		</view>

		<!-- 快捷搜索词 -->
		<view class="hot-section" v-if="!keyword">
			<view class="section-title">热门搜索</view>
			<view class="hot-tags">
				<view class="hot-tag" v-for="(tag, index) in hotTags" :key="index" @click="searchByHot(tag)">
					{{ tag }}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { search, getRecycleCompanyList } from '@/utils/request.js';

export default {
	data() {
		return {
			keyword: '',
			searchHistory: [],
			resultList: [],
			loading: false,
			hotTags: ['废纸回收', '塑料回收', '金属回收', '家电回收', '有害垃圾']
		};
	},
	onLoad() {
		this.loadSearchHistory();
	},
	methods: {
		// 加载搜索历史
		loadSearchHistory() {
			const history = uni.getStorageSync('searchHistory');
			if (history) {
				this.searchHistory = history;
			}
		},
		// 保存搜索历史
		saveSearchHistory(keyword) {
			if (!keyword) return;

			let history = uni.getStorageSync('searchHistory') || [];
			// 去重
			history = history.filter(item => item !== keyword);
			// 添加到开头
			history.unshift(keyword);
			// 只保留前10条
			history = history.slice(0, 10);
			uni.setStorageSync('searchHistory', history);
			this.searchHistory = history;
		},
		// 清除历史记录
		clearHistory() {
			uni.showModal({
				title: '提示',
				content: '确定要清除搜索历史吗？',
				success: (res) => {
					if (res.confirm) {
						uni.removeStorageSync('searchHistory');
						this.searchHistory = [];
					}
				}
			});
		},
		// 执行搜索
		doSearch() {
			if (!this.keyword.trim()) {
				uni.showToast({ title: '请输入搜索关键词', icon: 'none' });
				return;
			}

			this.saveSearchHistory(this.keyword);
			this.loading = true;

			search(this.keyword)
				.then(res => {
					this.resultList = res.data || [];
				})
				.catch(e => {
					console.error('搜索失败', e);
					this.resultList = [];
				})
				.finally(() => {
					this.loading = false;
				});
		},
		// 从历史记录搜索
		searchByHistory(keyword) {
			this.keyword = keyword;
			this.doSearch();
		},
		// 从热门搜索
		searchByHot(keyword) {
			this.keyword = keyword;
			this.doSearch();
		},
		// 跳转详情
		goDetail(item) {
			uni.navigateTo({
				url: `/pages/recycle-company/company-detail?id=${item.id}`
			});
		},
		// 返回
		goBack() {
			uni.navigateBack();
		}
	}
};
</script>

<style scoped>
.search-page {
	background-color: #f0f9f4;
	min-height: 100vh;
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

.cancel-btn {
	font-size: 28rpx;
	color: #666666;
}

/* 历史记录 */
.history-section {
	padding: 30rpx;
}

.section-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20rpx;
}

.section-title {
	font-size: 28rpx;
	font-weight: bold;
	color: #333333;
}

.clear-btn {
	font-size: 24rpx;
	color: #999999;
}

.history-tags {
	display: flex;
	flex-wrap: wrap;
	gap: 16rpx;
}

.history-tag {
	background: #ffffff;
	padding: 12rpx 24rpx;
	border-radius: 30rpx;
	font-size: 26rpx;
	color: #666666;
}

/* 热门搜索 */
.hot-section {
	padding: 30rpx;
}

.hot-tags {
	display: flex;
	flex-wrap: wrap;
	gap: 16rpx;
	margin-top: 20rpx;
}

.hot-tag {
	background: linear-gradient(135deg, #4CAF50, #81C784);
	color: #ffffff;
	padding: 12rpx 24rpx;
	border-radius: 30rpx;
	font-size: 26rpx;
}

/* 搜索结果 */
.result-section {
	padding: 20rpx 30rpx;
}

.result-title {
	font-size: 24rpx;
	color: #999999;
	margin-bottom: 20rpx;
}

.result-list {
	display: flex;
	flex-direction: column;
	gap: 20rpx;
}

.card {
	background: #ffffff;
	border-radius: 16rpx;
	padding: 24rpx;
	box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
}

.result-item {
	display: flex;
}

.result-image {
	width: 150rpx;
	height: 120rpx;
	border-radius: 12rpx;
	margin-right: 20rpx;
	flex-shrink: 0;
}

.result-info {
	flex: 1;
	display: flex;
	flex-direction: column;
	justify-content: center;
}

.result-name {
	font-size: 28rpx;
	font-weight: bold;
	color: #333333;
	margin-bottom: 8rpx;
}

.result-category {
	font-size: 24rpx;
	color: #4CAF50;
	margin-bottom: 8rpx;
}

.result-meta {
	display: flex;
	gap: 20rpx;
	font-size: 22rpx;
	color: #999999;
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
</style>
