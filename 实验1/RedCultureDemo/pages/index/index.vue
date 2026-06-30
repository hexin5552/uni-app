<template>
  <view class="content">
    <image class="banner" src="https://via.placeholder.com/600x300?text=Red+Culture+Hero" mode="widthFix"></image>
    <view class="title">红色文化 · 永放光芒</view>
    <view class="intro">
      <text>广州起义烈士陵园、农讲所、中共三大会址……红色印记遍布羊城。让我们一起追寻红色足迹，传承革命精神。</text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {}
  }
}
</script>

<style>
.content {
  padding: 20rpx;
  text-align: center;
}
.banner {
  width: 100%;
  border-radius: 16rpx;
}
.title {
  font-size: 48rpx;
  font-weight: bold;
  color: #C00000;
  margin: 30rpx 0 20rpx;
}
.intro {
  font-size: 32rpx;
  line-height: 1.6;
  text-align: left;
  background-color: #f9f9f9;
  padding: 30rpx;
  border-radius: 16rpx;
}
</style>