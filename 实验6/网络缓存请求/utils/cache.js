const CACHE_PREFIX = 'news_';

export const setCache = (key, data, expireHours = 1) => {
  const cacheData = {
    data: data,
    timestamp: Date.now(),
    expireTime: expireHours * 60 * 60 * 1000
  };
  const fullKey = CACHE_PREFIX + key;
  console.log('setCache - 键:', fullKey, '有效期:', expireHours, '小时');
  uni.setStorageSync(fullKey, cacheData);
};

export const getCache = (key) => {
  const fullKey = CACHE_PREFIX + key;
  const cache = uni.getStorageSync(fullKey);
  console.log('getCache - 键:', fullKey, '找到:', cache ? '是' : '否');
  
  if (!cache) return null;
  
  const { data, timestamp, expireTime } = cache;
  const now = Date.now();
  const elapsed = now - timestamp;
  
  console.log('缓存时间:', new Date(timestamp).toLocaleString());
  console.log('已过去:', (elapsed / 1000 / 60).toFixed(1), '分钟');
  console.log('有效期:', (expireTime / 1000 / 60).toFixed(1), '分钟');
  
  if (elapsed > expireTime) {
    console.log('缓存已过期，删除');
    uni.removeStorageSync(fullKey);
    return null;
  }
  
  return data;
};

export const clearAllNewsCache = () => {
  const info = uni.getStorageInfoSync();
  info.keys.forEach(key => {
    if (key.startsWith(CACHE_PREFIX)) {
      uni.removeStorageSync(key);
    }
  });
};
