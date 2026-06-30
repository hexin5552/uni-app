export const checkNetwork = () => {
  return new Promise((resolve) => {
    uni.getNetworkType({
      success: (res) => {
        resolve(res.networkType !== 'none');
      },
      fail: () => resolve(false)
    });
  });
};

export const onNetworkChange = (callback) => {
  uni.onNetworkStatusChange((res) => {
    callback(res.isConnected);
  });
};
