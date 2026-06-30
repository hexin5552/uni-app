import { request } from '@/utils/request.js';
import { getCache, setCache } from '@/utils/cache.js';

const BASE_URL = 'https://jsonplaceholder.typicode.com';

export const getNewsList = () => {
  return request({ url: `${BASE_URL}/posts` }).then(data => {
    return data.map(item => ({
      ...item,
      publishTime: new Date(Date.now() - item.id * 86400000).toLocaleDateString(),
      summary: `这是新闻 ${item.id} 的摘要内容，点击查看详情。`
    }));
  });
};

export const getNewsDetail = async (id, hasNetwork = null) => {
  const cacheKey = `detail_${id}`;
  console.log('getNewsDetail - id:', id, 'hasNetwork:', hasNetwork);
  
  const cached = getCache(cacheKey);
  console.log('缓存数据:', cached ? '找到' : '未找到');
  
  if (cached) {
    console.log('使用缓存数据，id:', id);
    return { data: cached, fromCache: true };
  }
  
  if (hasNetwork === false) {
    console.log('无网络且无缓存，id:', id);
    throw new Error('无网络连接且未找到缓存数据');
  }
  
  if (hasNetwork === null) {
    console.log('网络状态未知，继续请求');
  }
  
  console.log('发起网络请求，id:', id);
  const detail = await request({ url: `${BASE_URL}/posts/${id}` });
  const fullDetail = {
    ...detail,
    publishTime: new Date(Date.now() - id * 86400000).toLocaleDateString(),
    content: `这是新闻 ${id} 的完整正文内容。这里可以包含多段文字，用于演示离线阅读功能。`
  };
  setCache(cacheKey, fullDetail, 1);
  console.log('数据已缓存，键:', 'news_' + cacheKey);
  return { data: fullDetail, fromCache: false };
};
