<template>
	<view class="layout">
		<view class="narbar" :style="{paddingTop: statusBarHeight + 'px'}">
			<view class="titleBar">
				<view class="title">
					鹤信壁纸
				</view>
				<view class="search" @click="clickSearch">
					<uni-icons class="icon" type="search" color="#888" size="18"></uni-icons>
					<input 
						class="input" 
						type="text" 
						placeholder="搜索壁纸" 
						v-model="searchText"
						confirm-type="search"
						@confirm="handleSearch"
					/>
				</view>
			</view>
		</view>
		
		<view class="fill" :style="{height:(statusBarHeight + titleBarHeight) + 'px'}"></view>
		
		<view class="searchModal" v-if="showSearchModal" @click="closeSearchModal">
			<view class="searchContent" @click.stop>
				<view class="searchHeader">
					<view class="searchInputWrap">
						<uni-icons type="search" color="#888" size="20"></uni-icons>
						<input 
							class="searchInput" 
							type="text" 
							placeholder="搜索壁纸" 
							v-model="searchText"
							:focus="inputFocus"
							confirm-type="search"
							@confirm="handleSearch"
						/>
						<view class="clear" v-if="searchText" @click="clearSearch">
							<uni-icons type="clear" size="18"></uni-icons>
						</view>
					</view>
					<view class="cancel" @click="closeSearchModal">取消</view>
				</view>
				<view class="searchHistory" v-if="searchHistory.length > 0">
					<view class="historyTitle">搜索历史</view>
					<view class="historyList">
						<view class="historyItem" v-for="(item, index) in searchHistory" :key="index" @click="searchKeyword(item)">
							{{ item }}
						</view>
					</view>
				</view>
				<view class="hotSearch">
					<view class="hotTitle">热门搜索</view>
					<view class="hotList">
						<view class="hotItem" v-for="(item, index) in hotKeywords" :key="index" @click="searchKeyword(item)">
							{{ item }}
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, onMounted } from 'vue';

let SYSTEM_INFO = uni.getSystemInfoSync();
let statusBarHeight = ref(SYSTEM_INFO.statusBarHeight || 20);
let titleBarHeight = ref(44);

try {
	let MENU_BUTTON = uni.getMenuButtonBoundingClientRect();
	if (MENU_BUTTON && MENU_BUTTON.height) {
		titleBarHeight.value = MENU_BUTTON.height;
	}
} catch (e) {
	console.log('H5环境，使用默认高度');
}

const searchText = ref('');
const showSearchModal = ref(false);
const inputFocus = ref(false);
const searchHistory = ref([]);
const hotKeywords = ['风景壁纸', '动漫壁纸', '美女壁纸', '游戏壁纸', '手机壁纸'];

onMounted(() => {
	try {
		const history = uni.getStorageSync('searchHistory');
		if (history && Array.isArray(history)) {
			searchHistory.value = history.slice(0, 10);
		}
	} catch (e) {
		console.log('读取搜索历史失败:', e);
	}
});

const clickSearch = () => {
	showSearchModal.value = true;
	setTimeout(() => {
		inputFocus.value = true;
	}, 100);
};

const closeSearchModal = () => {
	showSearchModal.value = false;
	inputFocus.value = false;
};

const clearSearch = () => {
	searchText.value = '';
};

const saveHistory = (keyword) => {
	try {
		if (!keyword.trim()) return;
		let history = searchHistory.value.filter(item => item !== keyword);
		history.unshift(keyword);
		history = history.slice(0, 10);
		searchHistory.value = history;
		uni.setStorageSync('searchHistory', history);
	} catch (e) {
		console.log('保存搜索历史失败:', e);
	}
};

const searchKeyword = (keyword) => {
	searchText.value = keyword;
	handleSearch();
};

const handleSearch = () => {
	const keyword = searchText.value.trim();
	if (!keyword) {
		uni.showToast({
			title: '请输入搜索内容',
			icon: 'none'
		});
		return;
	}
	
	saveHistory(keyword);
	closeSearchModal();
	
	uni.showToast({
		title: `搜索: ${keyword}`,
		icon: 'none'
	});
};
</script>

<style lang="scss" scoped>
	.layout{
		.narbar{
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			z-index: 10;
			background: 
			linear-gradient(to bottom,transparent,#fff 400rpx),
			linear-gradient(to right,#beecd8 20%,#54E2d8);
			.titleBar{
				display: flex;
				align-items: center;
				padding: 0 30rpx;
				height: 88rpx;
				.title{
					font-size: 22px;
					font-weight: 700;
					color: $text-font-color-1;
					flex-shrink: 0;
				}
				.search{
					flex: 1;
					height: 50rpx;
					border-radius: 60rpx;
					background: rgba(255, 255, 255, 0.4);
					border: 1px solid #fff;
					margin-left: 30rpx;
					display: flex;
					align-items: center;
					padding: 0 20rpx;
					.icon{
						flex-shrink: 0;
					}
					.input{
						flex: 1;
						height: 100%;
						background: transparent;
						border: none;
						outline: none;
						font-size: 28rpx;
						color: #333;
						padding-left: 10rpx;
					}
				}
			}
		}
		.fill{
			height: calc(var(--status-bar-height) + 88rpx);
		}
		
		.searchModal{
			position: fixed;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			background: rgba(0,0,0,0.5);
			z-index: 1000;
			display: flex;
			flex-direction: column;
			.searchContent{
				background: #fff;
				border-radius: 0 0 20rpx 20rpx;
				padding-bottom: 30rpx;
				.searchHeader{
					display: flex;
					align-items: center;
					padding: 20rpx 30rpx;
					border-bottom: 1px solid #eee;
					.searchInputWrap{
						flex: 1;
						display: flex;
						align-items: center;
						background: #f5f5f5;
						border-radius: 60rpx;
						padding: 0 20rpx;
						height: 70rpx;
						:deep(.uni-icons){
							color: #999;
						}
						.searchInput{
							flex: 1;
							height: 100%;
							background: transparent;
							border: none;
							outline: none;
							font-size: 30rpx;
							padding: 0 10rpx;
						}
						.clear{
							width: 40rpx;
							height: 40rpx;
							display: flex;
							align-items: center;
							justify-content: center;
							color: #999;
						}
					}
					.cancel{
						margin-left: 20rpx;
						font-size: 32rpx;
						color: #666;
					}
				}
				.searchHistory{
					padding: 20rpx 30rpx;
					.historyTitle{
						font-size: 26rpx;
						color: #999;
						margin-bottom: 15rpx;
					}
					.historyList{
						display: flex;
						flex-wrap: wrap;
						gap: 15rpx;
						.historyItem{
							padding: 15rpx 25rpx;
							background: #f5f5f5;
							border-radius: 40rpx;
							font-size: 28rpx;
							color: #666;
						}
					}
				}
				.hotSearch{
					padding: 20rpx 30rpx;
					border-top: 10rpx solid #f5f5f5;
					.hotTitle{
						font-size: 26rpx;
						color: #999;
						margin-bottom: 15rpx;
					}
					.hotList{
						display: flex;
						flex-wrap: wrap;
						gap: 15rpx;
						.hotItem{
							padding: 15rpx 25rpx;
							background: linear-gradient(135deg, #beecd8, #54E2d8);
							border-radius: 40rpx;
							font-size: 28rpx;
							color: #fff;
						}
					}
				}
			}
		}
	}
</style>
