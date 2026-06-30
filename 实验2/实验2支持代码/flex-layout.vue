<template>
  <view class="container">
    <!-- 骰子布局模块 -->
    <view class="module">
      <view class="module-title">骰子布局</view>
      
      <!-- 骰子布局-单点居中 -->
      <view class="dice-container">
        <view class="dice dice-1">
          <view class="dot"></view>
          <view class="dice-label">单点居中</view>
        </view>
        
        <!-- 骰子布局-两点上下分布 -->
        <view class="dice dice-2">
          <view class="dot"></view>
          <view class="dot"></view>
          <view class="dice-label">两点上下</view>
        </view>
        
        <!-- 骰子布局-三点斜向分布 -->
        <view class="dice dice-3">
          <view class="dot"></view>
          <view class="dot"></view>
          <view class="dot"></view>
          <view class="dice-label">三点斜向</view>
        </view>
        
        <!-- 骰子布局-四点四角分布 -->
        <view class="dice dice-4">
          <view class="dot"></view>
          <view class="dot"></view>
          <view class="dot"></view>
          <view class="dot"></view>
          <view class="dice-label">四点四角</view>
        </view>
      </view>
    </view>
    
    <!-- 固定大小布局模块 -->
    <view class="module">
      <view class="module-title">固定大小布局</view>
      <view class="fixed-container">
        <view class="fixed-item item1">item1</view>
        <view class="fixed-right">
          <view class="fixed-item item2">item2</view>
          <view class="fixed-item item3">item3</view>
        </view>
      </view>
    </view>
    
    <!-- 网格比例布局模块 -->
    <view class="module">
      <view class="module-title">网格比例布局</view>
      
      <!-- 第一行：2个item，1:1比例 -->
      <view class="grid-row">
        <view class="grid-item ratio-1">1:1</view>
        <view class="grid-item ratio-1">1:1</view>
      </view>
      
      <!-- 第二行：3个item，1:2:1比例 -->
      <view class="grid-row">
        <view class="grid-item ratio-1">1:2:1</view>
        <view class="grid-item ratio-2">1:2:1</view>
        <view class="grid-item ratio-1">1:2:1</view>
      </view>
      
      <!-- 第三行：4个item，1:1:1:1比例 -->
      <view class="grid-row">
        <view class="grid-item ratio-1">1:1:1:1</view>
        <view class="grid-item ratio-1">1:1:1:1</view>
        <view class="grid-item ratio-1">1:1:1:1</view>
        <view class="grid-item ratio-1">1:1:1:1</view>
      </view>
      
      <!-- 第四行：2个item，第一个固定宽度100px，第二个auto -->
      <view class="grid-row">
        <view class="grid-item fixed-width">固定100px</view>
        <view class="grid-item auto-width">auto占满</view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'FlexLayout'
}
</script>

<style scoped>
.container {
  padding: 20px;
  background-color: #f5f5f5;
}

.module {
  margin-bottom: 20px;
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.module-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 15px;
  color: #333;
}

/* 骰子布局样式 */
.dice-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.dice {
  width: 200px;
  height: 200px;
  background-color: #e0e0e0;
  border-radius: 8px;
  display: flex;
  position: relative;
  margin-bottom: 10px;
}

.dice-label {
  position: absolute;
  bottom: -25px;
  left: 0;
  right: 0;
  text-align: center;
  font-size: 14px;
  color: #666;
}

.dot {
  width: 40px;
  height: 40px;
  background-color: #ff4444;
  border-radius: 50%;
  margin: 10px;
}

/* 单点居中 */
.dice-1 {
  justify-content: center;
  align-items: center;
}

/* 两点上下分布 */
.dice-2 {
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
}

/* 三点斜向分布 */
.dice-3 {
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 20px;
}

.dice-3 .dot:nth-child(1) {
  align-self: flex-start;
}

.dice-3 .dot:nth-child(2) {
  align-self: center;
  margin-top: -50px;
}

.dice-3 .dot:nth-child(3) {
  align-self: flex-end;
  margin-top: -50px;
}

/* 四点四角分布 */
.dice-4 {
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 20px;
}

.dice-4 .dot:nth-child(1) {
  align-self: flex-start;
}

.dice-4 .dot:nth-child(2) {
  align-self: flex-start;
}

.dice-4 .dot:nth-child(3) {
  align-self: flex-end;
  margin-top: 80px;
}

.dice-4 .dot:nth-child(4) {
  align-self: flex-end;
  margin-top: 80px;
}

/* 固定大小布局样式 */
.fixed-container {
  width: 100%;
  height: 120px;
  background-color: #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}

.fixed-item {
  width: 100px;
  height: 80px;
  background-color: #4a90e2;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
}

.fixed-right {
  display: flex;
  gap: 10px;
}

/* 网格比例布局样式 */
.grid-row {
  width: 100%;
  height: 80px;
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.grid-item {
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  border-radius: 4px;
  font-size: 14px;
}

.ratio-1 {
  flex: 1;
  background-color: #4a90e2;
}

.ratio-2 {
  flex: 2;
  background-color: #50e3c2;
}

.fixed-width {
  width: 100px;
  background-color: #f5a623;
}

.auto-width {
  flex: auto;
  background-color: #d0021b;
}
</style>