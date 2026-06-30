"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      detail: { title: "加载中...", content: "" }
    };
  },
  onShow() {
    const globalData = getApp().globalData.detailData || {};
    this.detail = {
      title: globalData.title || "广州起义纪念馆",
      content: globalData.content || "广州起义纪念馆位于广州市起义路，是为纪念1927年中国共产党领导的广州起义而建立的。馆内陈列大量历史文物和照片，再现了当年的壮烈场景。"
    };
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.t($data.detail.title),
    b: common_vendor.t($data.detail.content)
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/detail/detail.js.map
