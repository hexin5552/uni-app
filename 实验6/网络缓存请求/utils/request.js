export const request = (options) => {
  return new Promise((resolve, reject) => {
    uni.showLoading({ title: '加载中...', mask: true });
    uni.request({
      url: options.url,
      method: options.method || 'GET',
      data: options.data || {},
      timeout: 10000,
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          uni.showToast({ title: `请求失败: ${res.statusCode}`, icon: 'none' });
          reject(res);
        }
      },
      fail: (err) => {
        uni.showToast({ title: '网络异常，请检查网络', icon: 'none' });
        reject(err);
      },
      complete: () => {
        uni.hideLoading();
      }
    });
  });
};
