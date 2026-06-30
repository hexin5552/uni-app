"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
if (!Math) {
  "./pages/index/index.js";
  "./pages/list/list.js";
  "./pages/detail/detail.js";
  "./pages/my/my.js";
}
const _sfc_main = {
  globalData: {
    detailData: {
      title: "广州起义纪念馆",
      content: "广州起义纪念馆位于广州市起义路，是为纪念1927年中国共产党领导的广州起义而建立的。馆内陈列大量历史文物和照片，再现了当年的壮烈场景。"
    }
  },
  onLaunch: function() {
    common_vendor.index.__f__("log", "at App.vue:10", "App Launch");
  }
};
function createApp() {
  const app = common_vendor.createSSRApp(_sfc_main);
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
//# sourceMappingURL=../.sourcemap/mp-weixin/app.js.map
