<template>
	<view class="classLayout pageBg">
		<custom-nav-bar title="分类"></custom-nav-bar>
		<view class="classify">
			<theme-item v-for="(item, index) in categories" :key="index" :item="item"></theme-item>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue'
import { categories } from '@/common/data/categories.js'
</script>

<style lang="scss" scoped>
	.classify{
		padding: 30rpx;
		display: grid;
		grid-template-columns: repeat(3,1fr);
		gap:15rpx;
	}
</style>
