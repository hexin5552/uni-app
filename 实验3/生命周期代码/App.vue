<script>
// 应用生命周期函数，仅在 App.vue 中生效
export default {
  // 应用启动时触发，全局只触发一次
  onLaunch: function() {
    console.log('✅ 应用生命周期：onLaunch —— 应用启动完成')
  },
  // 应用从后台进入前台时触发
  onShow: function() {
    console.log('✅ 应用生命周期：onShow —— 应用显示/从后台返回')
  },
  // 应用从前台进入后台时触发
  onHide: function() {
    console.log('✅ 应用生命周期：onHide —— 应用隐藏/进入后台')
  }
}
</script>

<style>
/* 全局样式 */
page {
  background-color: #f5f5f5;
}
</style>
