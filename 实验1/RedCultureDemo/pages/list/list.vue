<template>
  <view class="list">
    <view class="card" v-for="(item, index) in sites" :key="index" @click="goToDetail(item)">
      <image class="card-img" :src="item.img" mode="aspectFill"></image>
      <view class="card-info">
        <text class="card-title">{{ item.name }}</text>
        <text class="card-desc">{{ item.short }}</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      sites: [
        { 
          name: '广州起义烈士陵园', 
          short: '为纪念广州起义牺牲的烈士而建，庄严肃穆。',
          img: 'https://via.placeholder.com/150/8B0000/ffffff?text=烈+士',
          detail: '广州起义烈士陵园建于1954年，占地面积18万平方米。正门门楼上有周恩来同志题写的“广州起义烈士陵园”。陵园内有烈士纪念碑、广州公社烈士墓、叶剑英同志纪念碑等。'
        },
        { 
          name: '毛泽东同志主办农民运动讲习所', 
          short: '培养农民运动干部的摇篮，红色种子在此萌芽。',
          img: 'https://via.placeholder.com/150/8B0000/ffffff?text=农+讲+所',
          detail: '农讲所旧址原为番禺学宫，1926年毛泽东在此主办第六届农民运动讲习所，为中国革命培养了大批骨干。现为全国重点文物保护单位。'
        },
        { 
          name: '中共三大会址纪念馆', 
          short: '1923年中共三大在此召开，推动国共合作。',
          img: 'https://via.placeholder.com/150/8B0000/ffffff?text=三+大',
          detail: '中共三大会址纪念馆位于广州市越秀区恤孤院路，会址原建筑在抗战时期被炸毁，2006年建立纪念馆。展览展示了中共三大的历史背景和重要成果。'
        }
      ]
    }
  },
  methods: {
    goToDetail(item) {
      // 将点击的景点详情存入全局
      getApp().globalData.detailData = {
        title: item.name,
        content: item.detail
      }
      // 跳转到详情页（tab页必须用 switchTab）
      uni.switchTab({
        url: '/pages/detail/detail'
      })
    }
  }
}
</script>

<style>
.list {
  padding: 20rpx;
}
.card {
  display: flex;
  background-color: #fff;
  border-radius: 16rpx;
  margin-bottom: 20rpx;
  padding: 20rpx;
  box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.05);
}
.card-img {
  width: 150rpx;
  height: 150rpx;
  border-radius: 12rpx;
  margin-right: 20rpx;
}
.card-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.card-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 8rpx;
}
.card-desc {
  font-size: 28rpx;
  color: #666;
  line-height: 1.4;
}
</style>