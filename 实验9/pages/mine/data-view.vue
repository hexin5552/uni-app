<template>
	<view class="data-view-page">
		<!-- 环保贡献数据 -->
		<view class="contribution-card card">
			<view class="card-title">我的环保贡献</view>
			<view class="contribution-grid">
				<view class="contribution-item">
					<text class="contribution-icon">🌱</text>
					<text class="contribution-value">{{ statistics.carbonReduction || 0 }}</text>
					<text class="contribution-label">减碳量(kg)</text>
				</view>
				<view class="contribution-item">
					<text class="contribution-icon">💎</text>
					<text class="contribution-value">{{ statistics.resourceSaving || 0 }}</text>
					<text class="contribution-label">资源节约(kg)</text>
				</view>
			</view>
		</view>

		<!-- 月度回收柱状图 -->
		<view class="chart-card card">
			<view class="card-title">月度各类垃圾回收总量</view>
			<view class="chart-container">
				<!-- 模拟柱状图 -->
				<view class="bar-chart">
					<view class="bar-item" v-for="(item, index) in statistics.monthlyData" :key="index">
						<view class="bar-group">
							<view class="bar" :style="{ height: (item.paper / maxPaperValue * 180) + 'rpx', background: '#4CAF50' }"></view>
							<view class="bar" :style="{ height: (item.plastic / maxPaperValue * 180) + 'rpx', background: '#81C784' }"></view>
							<view class="bar" :style="{ height: (item.metal / maxPaperValue * 180) + 'rpx', background: '#A5D6A7' }"></view>
							<view class="bar" :style="{ height: (item.harmful / maxPaperValue * 180) + 'rpx', background: '#C8E6C9' }"></view>
						</view>
						<text class="bar-label">{{ item.month }}</text>
					</view>
				</view>
				<view class="chart-legend">
					<view class="legend-item">
						<view class="legend-color" style="background: #4CAF50;"></view>
						<text>纸类</text>
					</view>
					<view class="legend-item">
						<view class="legend-color" style="background: #81C784;"></view>
						<text>塑料</text>
					</view>
					<view class="legend-item">
						<view class="legend-color" style="background: #A5D6A7;"></view>
						<text>金属</text>
					</view>
					<view class="legend-item">
						<view class="legend-color" style="background: #C8E6C9;"></view>
						<text>有害</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 个人回收占比饼图 -->
		<view class="chart-card card">
			<view class="card-title">个人各类回收占比</view>
			<view class="chart-container">
				<view class="pie-chart">
					<!-- 简化饼图实现 -->
					<view class="pie-item" v-for="(item, index) in statistics.personalRatio" :key="index">
						<view class="pie-color" :style="{ background: pieColors[index] }"></view>
						<text class="pie-name">{{ item.name }}</text>
						<text class="pie-value">{{ item.value }}%</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 城市整体回收占比 -->
		<view class="chart-card card">
			<view class="card-title">城市整体回收占比</view>
			<view class="chart-container">
				<view class="pie-chart">
					<view class="pie-item" v-for="(item, index) in statistics.cityRatio" :key="index">
						<view class="pie-color" :style="{ background: pieColors[index] }"></view>
						<text class="pie-name">{{ item.name }}</text>
						<text class="pie-value">{{ item.value }}%</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 环保小知识 -->
		<view class="tips-card card">
			<view class="card-title">环保小知识</view>
			<view class="tips-list">
				<view class="tip-item">
					<text class="tip-icon">💡</text>
					<text class="tip-text">回收1吨废纸可以减少砍伐17棵树木</text>
				</view>
				<view class="tip-item">
					<text class="tip-icon">💡</text>
					<text class="tip-text">塑料回收可减少约60%的能源消耗</text>
				</view>
				<view class="tip-item">
					<text class="tip-icon">💡</text>
					<text class="tip-text">金属回收可以无限循环利用而不损失质量</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { getRecycleStatistics } from '@/utils/request.js';

export default {
	data() {
		return {
			statistics: {
				monthlyData: [],
				personalRatio: [],
				cityRatio: [],
				carbonReduction: 0,
				resourceSaving: 0
			},
			pieColors: ['#4CAF50', '#81C784', '#A5D6A7', '#C8E6C9'],
			maxPaperValue: 200
		};
	},
	onLoad() {
		this.loadStatistics();
	},
	computed: {
		// 计算最大纸类回收量用于柱状图比例
		maxPaperValue() {
			if (!this.statistics.monthlyData || this.statistics.monthlyData.length === 0) {
				return 200;
			}
			const max = Math.max(...this.statistics.monthlyData.map(item => item.paper));
			return max > 0 ? max : 200;
		}
	},
	methods: {
		// 加载统计数据
		async loadStatistics() {
			uni.showLoading({ title: '加载中...' });
			try {
				const res = await getRecycleStatistics();
				this.statistics = res.data || {
					monthlyData: [],
					personalRatio: [],
					cityRatio: [],
					carbonReduction: 0,
					resourceSaving: 0
				};
			} catch (e) {
				console.error('加载统计数据失败', e);
				uni.showToast({ title: '加载失败', icon: 'none' });
			} finally {
				uni.hideLoading();
			}
		}
	}
};
</script>

<style scoped>
.data-view-page {
	background-color: #f0f9f4;
	min-height: 100vh;
	padding: 20rpx 0 40rpx;
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
}

/* 环保贡献 */
.contribution-grid {
	display: flex;
	justify-content: space-around;
}

.contribution-item {
	display: flex;
	flex-direction: column;
	align-items: center;
}

.contribution-icon {
	font-size: 60rpx;
	margin-bottom: 10rpx;
}

.contribution-value {
	font-size: 48rpx;
	font-weight: bold;
	color: #4CAF50;
	margin-bottom: 8rpx;
}

.contribution-label {
	font-size: 24rpx;
	color: #999999;
}

/* 图表容器 */
.chart-container {
	padding: 20rpx 0;
}

/* 柱状图 */
.bar-chart {
	display: flex;
	justify-content: space-around;
	padding: 0 20rpx;
}

.bar-item {
	display: flex;
	flex-direction: column;
	align-items: center;
}

.bar-group {
	display: flex;
	align-items: flex-end;
	height: 200rpx;
	gap: 4rpx;
}

.bar {
	width: 30rpx;
	min-height: 10rpx;
	border-radius: 4rpx 4rpx 0 0;
}

.bar-label {
	font-size: 22rpx;
	color: #666666;
	margin-top: 10rpx;
}

/* 图例 */
.chart-legend {
	display: flex;
	justify-content: center;
	flex-wrap: wrap;
	margin-top: 30rpx;
	gap: 20rpx;
}

.legend-item {
	display: flex;
	align-items: center;
	font-size: 22rpx;
	color: #666666;
}

.legend-color {
	width: 24rpx;
	height: 24rpx;
	border-radius: 4rpx;
	margin-right: 8rpx;
}

/* 饼图 */
.pie-chart {
	display: flex;
	justify-content: space-around;
	flex-wrap: wrap;
}

.pie-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 25%;
	padding: 10rpx 0;
}

.pie-color {
	width: 60rpx;
	height: 60rpx;
	border-radius: 50%;
	margin-bottom: 10rpx;
}

.pie-name {
	font-size: 24rpx;
	color: #666666;
	margin-bottom: 6rpx;
}

.pie-value {
	font-size: 28rpx;
	font-weight: bold;
	color: #333333;
}

/* 环保小知识 */
.tips-list {
	display: flex;
	flex-direction: column;
	gap: 20rpx;
}

.tip-item {
	display: flex;
	align-items: flex-start;
	padding: 16rpx 20rpx;
	background: #E8F5E9;
	border-radius: 12rpx;
}

.tip-icon {
	font-size: 32rpx;
	margin-right: 16rpx;
}

.tip-text {
	font-size: 26rpx;
	color: #333333;
	line-height: 1.5;
}
</style>
