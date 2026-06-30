import config from '../config.js'
import { CET4Words } from './demoData.js';

function generateSalt() {
  const s = [];
  const hexDigits = "0123456789abcdef";
  for (let i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = "4";
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
  s[8] = s[13] = s[18] = s[23] = "-";
  return s.join("");
}

function generateCurtime() {
  return Math.round(Date.now() / 1000).toString();
}

function truncate(q) {
  const len = q.length;
  if (len <= 20) return q;
  return q.substring(0, 10) + len + q.substring(len - 10, len);
}

function sha256(str) {
  const chars = '0123456789abcdef';
  const K = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
  ];
  
  const input = [];
  for (let i = 0; i < str.length; i++) {
    input.push(str.charCodeAt(i));
  }
  input.push(0x80);
  
  const blockCount = Math.ceil((input.length + 8) / 64);
  while (input.length % 64 !== 56) {
    input.push(0);
  }
  
  const length = (str.length * 8) >>> 0;
  input.push((length >> 24) & 0xFF);
  input.push((length >> 16) & 0xFF);
  input.push((length >> 8) & 0xFF);
  input.push(length & 0xFF);
  input.push(0, 0, 0, 0);
  
  let h0 = 0x6a09e667, h1 = 0xbb67ae85, h2 = 0x3c6ef372, h3 = 0xa54ff53a;
  let h4 = 0x510e527f, h5 = 0x9b05688c, h6 = 0x1f83d9ab, h7 = 0x5be0cd19;
  
  for (let block = 0; block < blockCount; block++) {
    const w = [];
    for (let i = 0; i < 16; i++) {
      w[i] = (input[block * 64 + i * 4] << 24) | (input[block * 64 + i * 4 + 1] << 16) |
             (input[block * 64 + i * 4 + 2] << 8) | input[block * 64 + i * 4 + 3];
    }
    
    for (let i = 16; i < 64; i++) {
      const s0 = (w[i-15] >>> 7 | w[i-15] << 25) ^ (w[i-15] >>> 18 | w[i-15] << 14) ^ (w[i-15] >>> 3);
      const s1 = (w[i-2] >>> 17 | w[i-2] << 15) ^ (w[i-2] >>> 19 | w[i-2] << 13) ^ (w[i-2] >>> 10);
      w[i] = (w[i-16] + s0 + w[i-7] + s1) >>> 0;
    }
    
    let a = h0, b = h1, c = h2, d = h3, e = h4, f = h5, g = h6, h = h7;
    
    for (let i = 0; i < 64; i++) {
      const S1 = (e >>> 6 | e << 26) ^ (e >>> 11 | e << 21) ^ (e >>> 25 | e << 7);
      const ch = (e & f) ^ (~e & g);
      const temp1 = (h + S1 + ch + K[i] + w[i]) >>> 0;
      const S0 = (a >>> 2 | a << 30) ^ (a >>> 13 | a << 19) ^ (a >>> 22 | a << 10);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const temp2 = (S0 + maj) >>> 0;
      
      h = g; g = f; f = e; e = (d + temp1) >>> 0;
      d = c; c = b; b = a; a = (temp1 + temp2) >>> 0;
    }
    
    h0 = (h0 + a) >>> 0; h1 = (h1 + b) >>> 0; h2 = (h2 + c) >>> 0; h3 = (h3 + d) >>> 0;
    h4 = (h4 + e) >>> 0; h5 = (h5 + f) >>> 0; h6 = (h6 + g) >>> 0; h7 = (h7 + h) >>> 0;
  }
  
  const result = [h0, h1, h2, h3, h4, h5, h6, h7];
  let hash = '';
  for (let i = 0; i < result.length; i++) {
    hash += chars[(result[i] >> 28) & 0xF] + chars[(result[i] >> 24) & 0xF] +
            chars[(result[i] >> 20) & 0xF] + chars[(result[i] >> 16) & 0xF] +
            chars[(result[i] >> 12) & 0xF] + chars[(result[i] >> 8) & 0xF] +
            chars[(result[i] >> 4) & 0xF] + chars[result[i] & 0xF];
  }
  return hash;
}

function generateSign(q, salt, curtime) {
  const appKey = config.youdao.appKey;
  const appSecret = config.youdao.appSecret;
  
  let truncatedQ = q;
  if (q.length > 20) {
    truncatedQ = q.substring(0, 10) + q.length + q.substring(q.length - 10);
  }
  
  const signStr = appKey + truncatedQ + salt + curtime + appSecret;
  
  console.log('[签名生成] appKey:', appKey);
  console.log('[签名生成] truncatedQ:', truncatedQ);
  console.log('[签名生成] salt:', salt);
  console.log('[签名生成] curtime:', curtime);
  console.log('[签名生成] appSecret:', appSecret ? '已配置' : '未配置');
  console.log('[签名生成] signStr:', signStr);
  console.log('[签名生成] signStr长度:', signStr.length);
  
  const sign = sha256(signStr);
  console.log('[签名生成] sign:', sign);
  
  return sign;
}

export function translate(q, from, to) {
  return new Promise((resolve, reject) => {
    if (!q || !q.trim()) {
      reject({ code: 'EMPTY_TEXT', message: '请输入要翻译的文本' });
      return;
    }

    const result = demoTranslate(q.trim(), from, to);
    if (result) {
      resolve(result);
    } else {
      reject({ code: 'NOT_FOUND', message: '词库中未找到该单词' });
    }
  });
}

function demoTranslate(q, from, to) {
  const input = q.trim();
  
  // 检测源语言，如果是自动检测，判断输入是中文还是英文
  let sourceLang = from;
  if (sourceLang === 'auto') {
    const isChinese = /[\u4e00-\u9fa5]/.test(input);
    sourceLang = isChinese ? 'zh-CHS' : 'en';
  }
  
  // 英文翻译成中文
  if ((sourceLang === 'en') && (to === 'zh-CHS' || to === 'auto')) {
    const word = CET4Words.find(item => item.word.toLowerCase() === input.toLowerCase());
    
    if (word) {
      return {
        translation: [word.translation],
        phonetic: word.phonetic,
        query: q
      };
    }
    
    // 尝试部分匹配
    const partialMatch = CET4Words.find(item => 
      item.word.toLowerCase().includes(input.toLowerCase()) || 
      input.toLowerCase().includes(item.word.toLowerCase())
    );
    
    if (partialMatch) {
      return {
        translation: [partialMatch.translation],
        phonetic: partialMatch.phonetic,
        query: q,
        isPartial: true
      };
    }
  }
  
  // 中文翻译成英文
  if ((sourceLang === 'zh-CHS') && (to === 'en' || to === 'auto')) {
    const word = CET4Words.find(item => item.translation === input);
    
    if (word) {
      return {
        translation: [word.word],
        phonetic: word.phonetic,
        query: q
      };
    }
    
    // 尝试部分匹配中文翻译
    const partialMatch = CET4Words.find(item => 
      item.translation.includes(input) || input.includes(item.translation)
    );
    
    if (partialMatch) {
      return {
        translation: [partialMatch.word],
        phonetic: partialMatch.phonetic,
        query: q,
        isPartial: true
      };
    }
  }
  
  return null;
}



function getErrorMessage(errorCode) {
  const errorMap = {
    '101': '缺少必填参数',
    '102': '不支持的语言类型',
    '103': '翻译文本过长',
    '104': '不支持的API类型',
    '105': '不支持的签名类型',
    '106': '不支持的响应类型',
    '107': '不支持的传输加密类型',
    '108': '应用ID无效（请检查Client ID是否正确）',
    '109': 'batchLog格式错误',
    '110': '无有效订阅（请确认已开通文本翻译服务）',
    '111': '账户余额不足',
    '112': '长文本翻译次数超限',
    '201': '签名校验失败',
    '202': '签名校验失败（请检查编码、时间戳或API密钥）',
    '203': '访问IP不在白名单',
    '301': '辞典查询失败',
    '302': '翻译查询失败',
    '303': '服务端异常',
    '401': '账户已经欠费',
    '411': '访问频率受限',
    '412': '长文本访问频率受限',
    '901': '系统异常'
  };
  return errorMap[errorCode] || '未知错误，错误码: ' + errorCode;
}
