<template>
	<view class="preview">
		<view class="mask" v-if="maskState" @click="hideMask">
			<view class="back-btn" @click.stop="goBack">
				<uni-icons type="back" size="28" color="#fff"></uni-icons>
			</view>
			<view class="count">
				{{ currentPosition + 1 }} / {{ totalCount }}
			</view>
			<view class="time">
				<uni-dateformat :date="new Date()" format="hh:mm"></uni-dateformat>
			</view>
			<view class="date">
				<uni-dateformat :date="new Date()" format="MM月dd日"></uni-dateformat>
			</view>
			<view class="footer">
				<view class="box" @click.stop="openInfo">
					<uni-icons type="info" size="28"></uni-icons>
					<view class="text">信息</view>
				</view>
				<view class="box" :class="{ 'scored': scoredImages[globalIndex + current] }" @click.stop="clickScore">
					<uni-icons :type="scoredImages[globalIndex + current] ? 'star-filled' : 'star'" size="28"></uni-icons>
					<view class="text">{{ scoredImages[globalIndex + current] ? '已评分' : '评分' }}</view>
				</view>
				<view class="box" :class="{ 'collected': collectedImages[globalIndex + current] }" @click.stop="clickCollect">
					<uni-icons :type="collectedImages[globalIndex + current] ? 'heart-filled' : 'heart'" size="28"></uni-icons>
					<view class="text">{{ collectedImages[globalIndex + current] ? '已收藏' : '收藏' }}</view>
				</view>
				<view class="box" :class="{ 'shared': sharedImages[globalIndex + current] }" @click.stop="clickShare">
					<uni-icons :type="sharedImages[globalIndex + current] ? 'redo-filled' : 'redo'" size="28"></uni-icons>
					<view class="text">{{ sharedImages[globalIndex + current] ? '已分享' : '分享' }}</view>
				</view>
				<view class="box" :class="{ 'downloaded': downloadedImages[globalIndex + current] }" @click.stop="clickDownload">
					<uni-icons :type="downloadedImages[globalIndex + current] ? 'download-filled' : 'download'" size="28"></uni-icons>
					<view class="text">{{ downloadText }}</view>
				</view>
			</view>
		</view>

		<swiper circular :current="current" @change="swiperChange" @click="showMask">
			<swiper-item v-for="(img, index) in images" :key="index">
				<image :src="img" mode="aspectFill"></image>
			</swiper-item>
		</swiper>

		<view class="info-mask" v-if="showPanel" @click="closeInfo">
			<view class="info-panel" @click.stop>
				<view class="popHeader">
					<view class="placeholder"></view>
					<view class="title">壁纸信息</view>
					<view class="close" @click="closeInfo">
						<uni-icons type="closeempty" size="20" color="#666"></uni-icons>
					</view>
				</view>
				<scroll-view scroll-y class="info-scroll">
					<view class="content-item">
						<view class="label">壁纸ID:</view>
						<text selectable class="value">123123123123</text>
					</view>
					
					<view class="content-item">
						<view class="label">分类:</view>
						<text selectable class="class">{{ currentCategory }}</text>
					</view>
					
					<view class="content-item">
						<view class="label">发布者:</view>
						<text selectable class="value">鹤信</text>
					</view>
					
					<view class="content-item">
						<view class="label">评分:</view>
						<view class="value">
							<uni-rate :value="ratingValue" readonly />
							<text class="rating-text">{{ ratingValue }}分</text>
						</view>
					</view>
					
					<view class="content-item">
						<view class="label">收藏:</view>
						<view class="value">
							<uni-icons :type="collectedImages[current] ? 'heart-filled' : 'heart'" size="24" :color="collectedImages[current] ? '#f5222d' : '#999'"></uni-icons>
							<text>{{ collectedImages[current] ? '已收藏' : '未收藏' }}</text>
						</view>
					</view>
					
					<view class="content-item">
						<view class="label">摘要:</view>
						<text selectable class="value">精美壁纸，适合各种设备使用</text>
					</view>
					
					<view class="content-item tags">
						<view class="label">标签:</view>
						<view class="value">
							<text class="tab" v-for="(item, index) in categoryTags" :key="index">{{ item }}</text>
						</view>
					</view>
					
					<view class="copyright">
						声明：本项目图片来自用户投稿，非商业使用，用于免费学习交流，如侵犯了您的权益，您可以拷贝壁纸ID举报至平台，邮箱3253369181@qq.com，管理将删除侵权壁纸，维护您的权益。
					</view>
				</scroll-view>
			</view>
		</view>
		
		<view class="score-mask" v-if="showScorePopup">
			<view class="scorePopup">
				<view class="score-header">
					<view class="placeholder"></view>
					<view class="title">壁纸评分</view>
					<view class="close" @click="clickScoreClose">
						<uni-icons type="closeempty" size="20" color="#666"></uni-icons>
					</view>
				</view>
				
				<view class="score-content">
					<uni-rate v-model="userScore" allow-half/>
					<text class="score-text">{{userScore}}分</text>
				</view>
				
				<view class="score-footer">
					<button @click="submitScore" :disabled="!userScore" type="default" size="mini" plain>确认评分</button>
				</view>
			</view>
		</view>
		
		<view class="share-mask" v-if="showShareModal" @click="closeShareModal">
			<view class="shareContent" @click.stop>
				<view class="shareHeader">
					<view class="title">分享给好友</view>
					<view class="close" @click="closeShareModal">
						<uni-icons type="closeempty" size="20" color="#666"></uni-icons>
					</view>
				</view>
				<view class="shareOptions">
					<view class="shareOption" @click="shareToFriend">
						<view class="iconWrap">
							<uni-icons type="chat" size="40"></uni-icons>
						</view>
						<text class="text">微信好友</text>
					</view>
					<view class="shareOption" @click="shareToGroup">
						<view class="iconWrap">
							<uni-icons type="users" size="40"></uni-icons>
						</view>
						<text class="text">微信群</text>
					</view>
					<view class="shareOption" @click="shareToQQ">
						<view class="iconWrap qq">
							<uni-icons type="qq" size="40"></uni-icons>
						</view>
						<text class="text">QQ好友</text>
					</view>
					<view class="shareOption" @click="shareLink">
						<view class="iconWrap">
							<uni-icons type="link" size="40"></uni-icons>
						</view>
						<text class="text">复制链接</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { homePreviewImages, categories } from '@/common/data/categories.js'

const images = ref([])
const totalCount = ref(9)
const currentPosition = ref(0)
const globalIndex = ref(0)

const maskState = ref(false);
const current = ref(0);
const showPanel = ref(false);
const ratingValue = ref(5);
const showScorePopup = ref(false);
const userScore = ref(0);
const scoredImages = ref({});
const collectedImages = ref({});
const downloadedImages = ref({});
const sharedImages = ref({});
const showShareModal = ref(false);
const downloadText = ref('下载');
const currentCategory = ref('精选壁纸');
const categoryTags = ref(['精选', '高清', '热门']);
const fromCategory = ref(false);

onMounted(() => {
	try {
		const collected = uni.getStorageSync('collectedImages');
		if (collected && typeof collected === 'object') {
			collectedImages.value = collected;
		}
		const scored = uni.getStorageSync('scoredImages');
		if (scored && typeof scored === 'object') {
			scoredImages.value = scored;
		}
		const downloaded = uni.getStorageSync('downloadedImages');
		if (downloaded && typeof downloaded === 'object') {
			downloadedImages.value = downloaded;
		}
		const shared = uni.getStorageSync('sharedImages');
		if (shared && typeof shared === 'object') {
			sharedImages.value = shared;
		}
	} catch (e) {
		console.log('读取本地存储失败:', e);
	}

	try {
		const pages = getCurrentPages()
		const currentPage = pages[pages.length - 1]
		const options = currentPage.$page?.options || currentPage.options || {}

		const position = parseInt(options.position) || 0
		const total = parseInt(options.total) || 6
		const category = options.category ? parseInt(options.category) : 0
		const index = options.index !== undefined ? parseInt(options.index) : 0
		const source = options.source || ''

		currentPosition.value = position
		totalCount.value = total

		if (category) {
			fromCategory.value = true
			const cat = categories.find(c => c.id === category)
			if (cat) {
				currentCategory.value = cat.name
				categoryTags.value = [cat.name, '高清', '精选']
			}
		}

		let targetCurrent = position
		let targetGlobalIndex = position

		if (category) {
			const startIndex = (category - 1) * 5
			const endIndex = Math.min(startIndex + 9, homePreviewImages.length)
			images.value = homePreviewImages.slice(startIndex, endIndex)
			targetCurrent = position
			targetGlobalIndex = options.index !== undefined ? index : startIndex + position
		} else if (source && options.index !== undefined) {
			images.value = homePreviewImages.slice(0, homePreviewImages.length)
			targetCurrent = Math.min(index, images.value.length - 1)
			targetGlobalIndex = 0
		} else {
			images.value = homePreviewImages.slice(0, total)
			targetCurrent = position
			targetGlobalIndex = position
		}

		current.value = targetCurrent
		globalIndex.value = targetGlobalIndex
	} catch (e) {
		console.log('获取预览参数失败:', e)
		images.value = homePreviewImages.slice(0, 6)
	}
});

const saveCollected = () => {
	try {
		uni.setStorageSync('collectedImages', collectedImages.value);
	} catch (e) {
		console.log('保存收藏失败:', e);
	}
};

const saveScored = () => {
	try {
		uni.setStorageSync('scoredImages', scoredImages.value);
	} catch (e) {
		console.log('保存评分失败:', e);
	}
};

const saveDownloaded = () => {
	try {
		uni.setStorageSync('downloadedImages', downloadedImages.value);
	} catch (e) {
		console.log('保存下载状态失败:', e);
	}
};

const saveShared = () => {
	try {
		uni.setStorageSync('sharedImages', sharedImages.value);
	} catch (e) {
		console.log('保存分享状态失败:', e);
	}
};

const showMask = () => {
	maskState.value = true;
};
const hideMask = () => {
	maskState.value = false;
	showPanel.value = false;
};

const goBack = () => {
	if (fromCategory.value) {
		const pages = getCurrentPages()
		if (pages.length > 1) {
			uni.navigateBack()
		} else {
			uni.switchTab({
				url: '/pages/index/index'
			})
		}
	} else {
		uni.navigateBack({
			fail: () => {
				uni.switchTab({
					url: '/pages/index/index'
				})
			}
		})
	}
}

const clickScore=()=>{
	const actualIndex = globalIndex.value + current.value
	if(scoredImages.value[actualIndex]){
		uni.showToast({
			title: '您已评分过该壁纸',
			icon: 'none'
		});
		return;
	}
	showScorePopup.value = true;
}

const clickScoreClose=()=>{
	showScorePopup.value = false;
	userScore.value = 0;
}

const submitScore=()=>{
	const actualIndex = globalIndex.value + current.value
	scoredImages.value[actualIndex] = userScore.value;
	saveScored();
	showScorePopup.value = false;
	userScore.value = 0;
	uni.showToast({
		title: '评分成功',
		icon: 'success'
	});
}

const clickCollect=()=>{
	const actualIndex = globalIndex.value + current.value
	if(collectedImages.value[actualIndex]){
		delete collectedImages.value[actualIndex];
		uni.showToast({
			title: '已取消收藏',
			icon: 'none'
		});
	} else {
		collectedImages.value[actualIndex] = images.value[current.value];
		uni.showToast({
			title: '收藏成功',
			icon: 'success'
		});
	}
	saveCollected();
}

const clickShare=()=>{
	showShareModal.value = true;
}

const closeShareModal=()=>{
	showShareModal.value = false;
}

const shareToFriend=()=>{
	share('friend');
}

const shareToGroup=()=>{
	share('group');
}

const shareToQQ=()=>{
	share('qq');
}

const shareLink=()=>{
	share('link');
}

const share=(type)=>{
	closeShareModal();
	const imageUrl = images.value[current.value];
	const shareText = '分享一张好看的壁纸给你！';
	const actualIndex = globalIndex.value + current.value
	
	try {
		if(type === 'link'){
			uni.setClipboardData({
				data: imageUrl,
				success: () => {
					sharedImages.value[actualIndex] = true;
					saveShared();
					uni.showToast({
						title: '链接已复制',
						icon: 'success'
					});
				},
				fail: () => {
					uni.showToast({
						title: '复制失败',
						icon: 'none'
					});
				}
			});
			return;
		}
		
		uni.share({
			provider: type === 'qq' ? 'qq' : 'weixin',
			type: 5,
			title: shareText,
			imageUrl: imageUrl,
			success: () => {
				const actualIndex = globalIndex.value + current.value
				sharedImages.value[actualIndex] = true;
				saveShared();
				uni.showToast({
					title: '分享成功',
					icon: 'success'
				});
			},
			fail: (err) => {
				console.log('分享失败:', err);
				uni.showToast({
					title: '分享失败',
					icon: 'none'
				});
			}
		});
	} catch (e) {
		console.log('分享API不可用:', e);
		uni.showToast({
			title: '当前环境不支持分享',
			icon: 'none'
		});
	}
}

const clickDownload=()=>{
	const actualIndex = globalIndex.value + current.value
	if(downloadedImages.value[actualIndex]){
		uni.showToast({
			title: '您已下载过该壁纸',
			icon: 'none'
		});
		return;
	}
	downloadText.value = '下载中';
	uni.showLoading({
		title: '下载中...'
	});
	
	setTimeout(() => {
		uni.hideLoading();
		downloadText.value = '已下载';
		downloadedImages.value[actualIndex] = true;
		saveDownloaded();
		uni.showToast({
			title: '下载成功',
			icon: 'success'
		});
	}, 1500);
}

const openInfo = () => {
	showPanel.value = true;
};
const closeInfo = () => {
	showPanel.value = false;
};

const swiperChange = (e) => {
	current.value = e.detail.current;
	currentPosition.value = e.detail.current;
	const actualIndex = globalIndex.value + e.detail.current
	if(downloadedImages.value[actualIndex]){
		downloadText.value = '已下载';
	} else {
		downloadText.value = '下载';
	}
};
</script>

<style lang="scss" scoped>
$text-font-color-2: #333;
$text-font-color-3: #999;

.preview{
	width: 100%;
	height: 100vh;
	position: relative;
	overflow: hidden;
	
	swiper{
		width: 100%;
		height: 100%;
		image{
			width: 100%;
			height: 100%;
		}
	}
	.mask{
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 998;
	}
	.back-btn{
		position: absolute;
		top: 60rpx;
		left: 30rpx;
		width: 70rpx;
		height: 70rpx;
		background: rgba(0,0,0,0.3);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		backdrop-filter: blur(10rpx);
	}
	.count{
		position: absolute;
		top: 10vh;
		left: 0;
		right: 0;
		margin: auto;
		width: fit-content;
		background: rgba(0,0,0,0.3);
		font-size: 28rpx;
		border-radius: 40rpx;
		padding: 8rpx 28rpx;
		color: #fff;
		backdrop-filter: blur(10rpx);
	}
	.time{
		position: absolute;
		top: calc(10vh + 80rpx);
		left: 0;
		right: 0;
		margin: auto;
		width: fit-content;
		font-size: 140rpx;
		color: #fff;
		font-weight: 100;
		line-height: 1em;
		text-shadow: 0 4rpx rgba(0,0,0,0.3);
	}
	.date{
		position: absolute;
		top: calc(10vh + 230rpx);
		left: 0;
		right: 0;
		margin: auto;
		width: fit-content;
		font-size: 34rpx;
		color: #fff;
		text-shadow: 0 4rpx rgba(0,0,0,0.3);
	}
	.footer{
		position: absolute;
		bottom: 10vh;
		left: 0;
		right: 0;
		margin: auto;
		width: 80vw;
		height: 120rpx;
		background: rgba(255, 255, 255, 0.8);
		border-radius: 120rpx;
		display: flex;
		justify-content: space-around;
		align-items: center;
		backdrop-filter: blur(20rpx);
		.box{
			display: flex;
			flex-direction: column;
			align-items: center;
			text{
				font-size: 26rpx;
				color: $text-font-color-2;
				margin-top: 8rpx;
			}
			&.scored{
				opacity: 0.5;
				text{
					color: $text-font-color-3;
				}
			}
			&.collected{
				:deep(.uni-icons){
					color: #f5222d !important;
				}
				text{
					color: #f5222d;
				}
			}
			&.downloaded{
				opacity: 0.5;
				:deep(.uni-icons){
					color: $text-font-color-3 !important;
				}
				text{
					color: $text-font-color-3;
				}
			}
			&.shared{
				:deep(.uni-icons){
					color: $brand-theme-color !important;
				}
				text{
					color: $brand-theme-color;
				}
			}
		}
	}

	.info-mask {
		position: fixed;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		background: rgba(0,0,0,0.5);
		z-index: 1000;
		display: flex;
		align-items: flex-end;
	}
	.info-panel {
		width: 100%;
		background: #fff;
		border-radius: 30rpx 30rpx 0 0;
		padding: 30rpx;
		animation: slideUp 0.3s ease;

		max-height: 60vh;
		display: flex;
		flex-direction: column;
	}
	@keyframes slideUp {
		from { transform: translateY(100%); }
		to { transform: translateY(0); }
	}
	.popHeader{
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20rpx;
		flex-shrink: 0;
		.placeholder{
			width: 44rpx;
			height: 44rpx;
		}
		.title{ 
			font-size: 26rpx;  
			color: $text-font-color-2;
		}
		.close{
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}
	.info-scroll {
		flex: 1;
		overflow-y: auto;
	}
	.content-item {
		display: flex;
		align-items: flex-start;
		padding: 16rpx 0;
		font-size: 26rpx;
		line-height: 1.7em;
		.label {
			color: $text-font-color-3;
			width: 160rpx;
			text-align: right;
			flex-shrink: 0;
			padding-right: 20rpx;
		}
		.value {
			flex: 1; 
			color: $text-font-color-2;
			word-break: break-all;
			display: flex;
			align-items: center;
		}
		.rating-text {
			margin-left: 10rpx;
			color: $text-font-color-2;
			font-size: 26rpx;
		}
	}
	.class {
		color: $brand-theme-color;
	}
	.copyright{
		font-size: 26rpx;
		padding: 20rpx;
		background: #F6F6F6;
		color: #666;
		border-radius: 10rpx;
		margin: 20rpx 0;
		line-height: 1.6em;
	}
	.tags {
		display: flex;
		flex-wrap: wrap;
		.value {
			display: flex;
			flex-wrap: wrap;
			flex: 1;
		}
		.tab {
			border: 1px solid $brand-theme-color;
			color: $brand-theme-color;
			font-size: 26rpx;
			padding: 10rpx 30rpx;
			border-radius: 40rpx;
			line-height: 1em;
			margin: 0 10rpx 10rpx 0;
		}
	}
	
	.score-mask{
		position: fixed;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		background: rgba(0,0,0,0.5);
		z-index: 1001;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.scorePopup{
		width: 500rpx;
		background: #fff;
		border-radius: 30rpx;
		overflow: hidden;
	}
	.score-header{
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 30rpx;
		border-bottom: 1px solid #eee;
		.placeholder{
			width: 44rpx;
			height: 44rpx;
		}
		.title{
			font-size: 28rpx;
			color: $text-font-color-2;
		}
		.close{
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}
	.score-content{
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 40rpx 30rpx;
		.score-text{
			font-size: 28rpx;
			color: $text-font-color-2;
			margin-top: 20rpx;
		}
	}
	.score-footer{
		padding: 20rpx 30rpx;
		border-top: 1px solid #eee;
		display: flex;
		justify-content: center;
		align-items: center;
		button{
			width: auto;
			height: 60rpx;
			border-radius: 30rpx;
			font-size: 28rpx;
			color: $brand-theme-color;
			border-color: $brand-theme-color;
			padding: 0 30rpx;
			line-height: 60rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			&[disabled]{
				color: #ccc;
				border-color: #ccc;
			}
		}
	}
	
	.share-mask{
		position: fixed;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		background: rgba(0,0,0,0.5);
		z-index: 1002;
		display: flex;
		align-items: flex-end;
	}
	.shareContent{
		width: 100%;
		background: #fff;
		border-radius: 30rpx 30rpx 0 0;
		overflow: hidden;
		animation: slideUp 0.3s ease;
	}
	.shareHeader{
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 30rpx;
		border-bottom: 10rpx solid #f5f5f5;
		.title{
			font-size: 32rpx;
			color: $text-font-color-2;
			font-weight: 600;
		}
		.close{
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}
	.shareOptions{
		display: flex;
		padding: 30rpx;
		justify-content: space-around;
		.shareOption{
			display: flex;
			flex-direction: column;
			align-items: center;
			.iconWrap{
				width: 100rpx;
				height: 100rpx;
				border-radius: 50%;
				background: linear-gradient(135deg, #beecd8, #54E2d8);
				display: flex;
				align-items: center;
				justify-content: center;
				margin-bottom: 15rpx;
				:deep(.uni-icons){
					color: #fff !important;
				}
				&.qq{
					background: linear-gradient(135deg, #12B7F5, #0084FF);
				}
			}
			.text{
				font-size: 26rpx;
				color: $text-font-color-2;
			}
		}
	}
}

</style>
