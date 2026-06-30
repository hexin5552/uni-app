<template>
  <view class="container">
    <!-- 骰子布局模块 -->
    <view class="module">
      <view class="module-title">骰子布局</view>
      
      <view class="dice-container">
        <!-- 骰子布局-单点居中（圆形版） -->
        <view class="dice dice-1">
          <view class="dot"></view>
          <view class="dice-label">单点居中-圆形版</view>
        </view>
        
        <!-- 骰子布局-单点居中（正方形版） -->
        <view class="dice dice-1">
          <view class="dot square"></view>
          <view class="dice-label">单点居中-正方形版</view>
        </view>
        
        <!-- 骰子布局-两点上下分布（圆形版） -->
        <view class="dice dice-2">
          <view class="dot"></view>
          <view class="dot"></view>
          <view class="dice-label">两点上下-圆形版</view>
        </view>
        
        <!-- 骰子布局-两点上下分布（正方形版） -->
        <view class="dice dice-2">
          <view class="dot square"></view>
          <view class="dot square"></view>
          <view class="dice-label">两点上下-正方形版</view>
        </view>
        
        <!-- 骰子布局-三点斜向（圆形版） -->
        <view class="dice dice-3">
          <view class="dot"></view>
          <view class="dot"></view>
          <view class="dot"></view>
          <view class="dice-label">三点斜向-圆形版</view>
        </view>
        
        <!-- 骰子布局-三点斜向（正方形版） -->
        <view class="dice dice-3">
          <view class="dot square"></view>
          <view class="dot square"></view>
          <view class="dot square"></view>
          <view class="dice-label">三点斜向-正方形版</view>
        </view>
        
        <!-- 骰子布局-四点四角（圆形版，修正后） -->
        <view class="dice dice-4">
          <view class="dice-row">
            <view class="dot"></view>
            <view class="dot"></view>
          </view>
          <view class="dice-row">
            <view class="dot"></view>
            <view class="dot"></view>
          </view>
          <view class="dice-label">四点四角-圆形版</view>
        </view>
        
        <!-- 骰子布局-四点四角（正方形版，修正后） -->
        <view class="dice dice-4">
          <view class="dice-row">
            <view class="dot square"></view>
            <view class="dot square"></view>
          </view>
          <view class="dice-row">
            <view class="dot square"></view>
            <view class="dot square"></view>
          </view>
          <view class="dice-label">四点四角-正方形版</view>
        </view>
      </view>
    </view>
    
    <!-- 固定大小布局模块（修正+新增滑动功能） -->
    <view class="module">
      <view class="module-title">固定大小布局（item1靠左，item2和item3靠右）</view>
      <view class="fixed-container">
        <view class="fixed-item">item1</view>
        <view class="flex-spacer"></view>
        <view class="fixed-right">
          <view class="fixed-item">item2</view>
          <view class="fixed-item">item3</view>
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
  background-color: #e5e5e5;
  border-radius: 8px;
  display: flex;
  position: relative;
  margin-bottom: 10px;
  box-sizing: border-box;
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
  margin: 0;
}

.dot.square {
  border-radius: 0;
}

/* 单点居中 */
.dice-1 {
  justify-content: center;
  align-items: center;
  padding: 10px;
}

/* 两点上下分布 */
.dice-2 {
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
}

/* 三点斜向分布 */
.dice-3 {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  padding: 10px;
}

.dice-3 .dot:nth-child(1) {
  /* 左上区域：默认左对齐、靠上 */
}

.dice-3 .dot:nth-child(2) {
  /* 容器正中间：水平居中 */
  align-self: center;
}

.dice-3 .dot:nth-child(3) {
  /* 右下区域：右对齐、靠下 */
  align-self: flex-end;
}

/* 四点四角分布（修正版） */
.dice-4 {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 10px;
  box-sizing: border-box;
  height: 200px;
}

.dice-row {
  display: flex;
  justify-content: space-between;
}

.dice-4 .dot {
  /* 四个圆点分布在四个角 */
  margin: 0;
  width: 40px;
  height: 40px;
}

/* 固定大小布局样式（修正+滑动功能） */
.fixed-container {
  width: 100%;
  height: 120px;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  padding: 10px;
  box-sizing: border-box;
}

.fixed-item {
  width: 100px;
  height: 80px;
  background-color: #4a90e2;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
}

.fixed-right {
  display: flex;
  gap: 10px;
}

.flex-spacer {
  flex: 1;
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