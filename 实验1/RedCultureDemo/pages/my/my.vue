<template>
  <view class="my">
    <view class="avatar">
      <image src="https://via.placeholder.com/150/8B0000/ffffff?text=杨志亮" mode="aspectFill"></image>
    </view>
    <view class="info">
      <text class="name">杨志亮</text>
      <text class="student-id">学号：424240216</text>
      <text class="class">班级：24级计算机科学与技术2班</text>
    </view>
    <view class="quote">
      <text>“传承红色基因，争做时代新人”</text>
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
.my {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60rpx 40rpx;
}
.avatar image {
  width: 200rpx;
  height: 200rpx;
  border-radius: 50%;
  border: 4rpx solid #C00000;
}
.info {
  margin-top: 40rpx;
  text-align: center;
}
.name {
  font-size: 48rpx;
  font-weight: bold;
  display: block;
}
.student-id, .class {
  font-size: 32rpx;
  color: #666;
  display: block;
  margin-top: 12rpx;
}
.quote {
  margin-top: 60rpx;
  font-size: 36rpx;
  font-style: italic;
  color: #C00000;
  padding: 30rpx;
  background-color: #f9f9f9;
  border-radius: 16rpx;
}
</style>