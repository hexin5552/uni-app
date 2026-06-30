/**
 * 通用工具函数
 */

/**
 * 格式化时间
 * @param {Date|String|Number} date 日期
 * @param {String} format 格式 默认 'YYYY-MM-DD HH:mm:ss'
 */
export function formatTime(date, format = 'YYYY-MM-DD HH:mm:ss') {
	const d = new Date(date);
	const year = d.getFullYear();
	const month = String(d.getMonth() + 1).padStart(2, '0');
	const day = String(d.getDate()).padStart(2, '0');
	const hour = String(d.getHours()).padStart(2, '0');
	const minute = String(d.getMinutes()).padStart(2, '0');
	const second = String(d.getSeconds()).padStart(2, '0');

	return format
		.replace('YYYY', year)
		.replace('MM', month)
		.replace('DD', day)
		.replace('HH', hour)
		.replace('mm', minute)
		.replace('ss', second);
}

/**
 * 格式化日期 (不含时间)
 * @param {Date|String|Number} date 日期
 */
export function formatDate(date) {
	return formatTime(date, 'YYYY-MM-DD');
}

/**
 * 计算积分
 * @param {Number} weight 重量(kg)
 * @param {String} category 回收品类
 */
export function calculatePoints(weight, category) {
	const rates = {
		'废纸': 5,      // 5积分/kg
		'塑料': 3,      // 3积分/kg
		'金属': 8,      // 8积分/kg
		'家电': 10,     // 10积分/kg
		'有害垃圾': 6   // 6积分/kg
	};
	const rate = rates[category] || 5;
	return Math.floor(weight * rate);
}

/**
 * 检查登录状态
 * @returns {Boolean}
 */
export function checkLogin() {
	const token = uni.getStorageSync('token');
	return !!token;
}

/**
 * 获取用户信息
 * @returns {Object|null}
 */
export function getUserInfo() {
	const userInfo = uni.getStorageSync('userInfo');
	return userInfo || null;
}

/**
 * 清除登录信息
 */
export function clearLogin() {
	uni.removeStorageSync('token');
	uni.removeStorageSync('userInfo');
	uni.removeStorageSync('signDate');
}

/**
 * 显示加载中
 * @param {String} title 提示文字
 */
export function showLoading(title = '加载中...') {
	uni.showLoading({
		title,
		mask: true
	});
}

/**
 * 隐藏加载
 */
export function hideLoading() {
	uni.hideLoading();
}

/**
 * 显示成功提示
 * @param {String} title 提示文字
 */
export function showSuccess(title = '操作成功') {
	uni.showToast({
		title,
		icon: 'success'
	});
}

/**
 * 显示失败提示
 * @param {String} title 提示文字
 */
export function showError(title = '操作失败') {
	uni.showToast({
		title,
		icon: 'none'
	});
}

/**
 * 验证手机号
 * @param {String} phone 手机号
 * @returns {Boolean}
 */
export function validatePhone(phone) {
	return /^1[3-9]\d{9}$/.test(phone);
}

/**
 * 验证密码 (6位以上)
 * @param {String} password 密码
 * @returns {Boolean}
 */
export function validatePassword(password) {
	return password && password.length >= 6;
}

/**
 * 阻止重复触发
 * @param {Function} fn 函数
 * @param {Number} delay 延迟(ms)
 */
export function debounce(fn, delay = 500) {
	let timer = null;
	return function(...args) {
		if (timer) clearTimeout(timer);
		timer = setTimeout(() => {
			fn.apply(this, args);
		}, delay);
	};
}

export default {
	formatTime,
	formatDate,
	calculatePoints,
	checkLogin,
	getUserInfo,
	clearLogin,
	showLoading,
	hideLoading,
	showSuccess,
	showError,
	validatePhone,
	validatePassword,
	debounce
};
