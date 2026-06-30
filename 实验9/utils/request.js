/**
 * 请求封装模块
 * 统一管理后端数据请求、token存储
 */

// 有道智云API基础地址
const BASE_URL = 'https://openapi.youdao.com/api';

/**
 * 封装请求方法
 * @param {Object} options 请求配置
 */
function request(options) {
	return new Promise((resolve, reject) => {
		// 获取本地存储的token
		const token = uni.getStorageSync('token');

		const header = {
			'Content-Type': 'application/json',
			...options.header
		};

		// 如果有token，添加到header
		if (token) {
			header['Authorization'] = 'Bearer ' + token;
		}

		uni.request({
			url: BASE_URL + options.url,
			method: options.method || 'GET',
			data: options.data || {},
			header: header,
			success: (res) => {
				if (res.statusCode === 200) {
					// 成功回调
					if (res.data.code === 0 || res.data.success) {
						resolve(res.data);
					} else {
						// 业务错误
						uni.showToast({
							title: res.data.msg || '请求失败',
							icon: 'none'
						});
						reject(res.data);
					}
				} else if (res.statusCode === 401) {
					// token过期，跳转登录
					uni.removeStorageSync('token');
					uni.removeStorageSync('userInfo');
					uni.showToast({
						title: '登录已过期，请重新登录',
						icon: 'none'
					});
					setTimeout(() => {
						uni.redirectTo({
							url: '/pages/login/index'
						});
					}, 1500);
					reject(res.data);
				} else {
					uni.showToast({
						title: '网络请求失败',
						icon: 'none'
					});
					reject(res.data);
				}
			},
			fail: (err) => {
				uni.showToast({
					title: '网络连接失败',
					icon: 'none'
				});
				reject(err);
			}
		});
	});
}

/**
 * GET请求
 */
function get(url, data) {
	return request({
		url,
		method: 'GET',
		data
	});
}

/**
 * POST请求
 */
function post(url, data) {
	return request({
		url,
		method: 'POST',
		data
	});
}

// 接口方法封装

/**
 * 获取首页轮播图数据
 */
export function getBannerList() {
	// 模拟数据，实际项目替换为真实接口
	return Promise.resolve({
		data: [
			{ id: 1, image: 'https://img.freepik.com/free-vector/eco-friendly-banner-with-recycling-symbol_23-2148487602.jpg' },
			{ id: 2, image: 'https://img.freepik.com/free-vector/green-recycling-concept_23-2148487615.jpg' },
			{ id: 3, image: 'https://img.freepik.com/free-vector/world-environment-day-poster_23-2148491892.jpg' }
		]
	});
}

/**
 * 获取活动列表
 */
export function getActivityList() {
	return Promise.resolve({
		data: [
			{
				id: 1,
				title: '地球日环保公益活动',
				desc: '参与回收，领取环保积分，兑换精美礼品',
				image: 'https://img.freepik.com/free-vector/earth-day-illustration_23-2148757933.jpg',
				time: '2024-04-22'
			},
			{
				id: 2,
				title: '废旧家电回收季',
				desc: '旧家电上门回收，最高可得500积分',
				image: 'https://img.freepik.com/free-vector/electronic-waste-recycling-concept_23-2148487621.jpg',
				time: '2024-05-01'
			}
		]
	});
}

/**
 * 获取订单列表
 * @param {String} type 订单状态: pending/accepted/completed/cancelled
 */
export function getOrderList(type) {
	// 模拟数据
	const mockOrders = {
		pending: [
			{ id: '1001', category: '废纸回收', time: '2024-04-20 10:00', address: '北京市朝阳区XX小区', weight: '5kg', amount: '25元', status: '待接单' }
		],
		accepted: [
			{ id: '1002', category: '塑料回收', time: '2024-04-19 14:00', address: '北京市海淀区XX街道', weight: '3kg', amount: '15元', status: '已接单', recycler: '张师傅' }
		],
		completed: [
			{ id: '1003', category: '金属回收', time: '2024-04-18 09:00', address: '北京市东城区XX小区', weight: '10kg', amount: '80元', status: '已完成' }
		],
		cancelled: [
			{ id: '1004', category: '家电回收', time: '2024-04-17 15:00', address: '北京市西城区XX公寓', weight: '25kg', amount: '200元', status: '已取消' }
		]
	};
	return Promise.resolve({
		data: mockOrders[type] || []
	});
}

/**
 * 获取订单详情
 * @param {String} orderId 订单ID
 */
export function getOrderDetail(orderId) {
	return Promise.resolve({
		data: {
			id: orderId,
			category: '废纸回收',
			time: '2024-04-20 10:00',
			address: '北京市朝阳区XX小区1号楼101',
			weight: '5kg',
			amount: '25元',
			status: '待接单',
			recycler: '',
			recyclerPhone: '',
			createTime: '2024-04-20 08:30'
		}
	});
}

/**
 * 获取回收公司列表
 */
export function getRecycleCompanyList() {
	return Promise.resolve({
		data: [
			{
				id: 'c001',
				name: '绿色环保回收站',
				category: '废纸、塑料、金属',
				rating: '4.8',
				area: '朝阳区',
				minWeight: '1kg',
				image: 'https://img.freepik.com/free-vector/industrial-building-concept_23-2148497244.jpg'
			},
			{
				id: 'c002',
				name: '资源再生处理中心',
				category: '家电、电子垃圾',
				rating: '4.6',
				area: '海淀区',
				minWeight: '5kg',
				image: 'https://img.freepik.com/free-vector/factory-concept_23-2148497250.jpg'
			},
			{
				id: 'c003',
				name: '城市矿产回收公司',
				category: '金属、塑料',
				rating: '4.9',
				area: '东城区',
				minWeight: '2kg',
				image: 'https://img.freepik.com/free-vector/warehouse-concept_23-2148497261.jpg'
			}
		]
	});
}

/**
 * 获取回收公司详情
 * @param {String} companyId 公司ID
 */
export function getCompanyDetail(companyId) {
	return Promise.resolve({
		data: {
			id: companyId,
			name: '绿色环保回收站',
			category: '废纸、塑料、金属',
			rating: '4.8',
			area: '朝阳区',
			minWeight: '1kg',
			image: 'https://img.freepik.com/free-vector/industrial-building-concept_23-2148497244.jpg',
			scope: '废纸、塑料瓶、金属制品回收',
			serviceArea: '北京市朝阳区全区域',
			standard: '废纸: 0.5元/kg, 塑料: 0.3元/kg, 金属: 3元/kg',
			phone: '400-123-4567',
			reviews: [
				{ user: '用户A', content: '服务很好，准时上门', rating: 5 },
				{ user: '用户B', content: '价格合理，推荐', rating: 4 }
			]
		}
	});
}

/**
 * 用户登录
 * @param {String} phone 手机号
 * @param {String} password 密码
 */
export function login(phone, password) {
	// 模拟登录，实际项目替换为真实接口
	if (phone && password) {
		return Promise.resolve({
			data: {
				token: 'mock_token_' + Date.now(),
				userInfo: {
					id: 'u001',
					nickname: '环保达人',
					avatar: '',
					points: 520
				}
			}
		});
	}
	return Promise.reject({ msg: '账号或密码错误' });
}

/**
 * 用户注册
 * @param {String} phone 手机号
 * @param {String} password 密码
 */
export function register(phone, password) {
	if (phone && password) {
		return Promise.resolve({
			data: {
				token: 'mock_token_' + Date.now(),
				userInfo: {
					id: 'u001',
					nickname: '新用户',
					avatar: '',
					points: 100
				}
			}
		});
	}
	return Promise.reject({ msg: '注册失败' });
}

/**
 * 获取用户信息
 */
export function getUserInfo() {
	return Promise.resolve({
		data: {
			id: 'u001',
			nickname: '环保达人',
			avatar: '',
			points: 520
		}
	});
}

/**
 * 签到
 */
export function signIn() {
	const today = formatDate(new Date());
	const lastSign = uni.getStorageSync('signDate');

	if (lastSign === today) {
		return Promise.reject({ msg: '今日已签到' });
	}

	uni.setStorageSync('signDate', today);
	return Promise.resolve({
		data: {
			points: 10,
			continuous: 1
		}
	});
}

/**
 * 获取环保统计数据
 */
export function getRecycleStatistics() {
	return Promise.resolve({
		data: {
			// 柱状图数据 - 每月各类垃圾回收总量
			monthlyData: [
				{ month: '1月', paper: 120, plastic: 80, metal: 45, harmful: 12 },
				{ month: '2月', paper: 150, plastic: 95, metal: 52, harmful: 15 },
				{ month: '3月', paper: 180, plastic: 110, metal: 60, harmful: 18 },
				{ month: '4月', paper: 200, plastic: 130, metal: 70, harmful: 22 }
			],
			// 饼图数据 - 个人回收占比
			personalRatio: [
				{ name: '废纸', value: 45 },
				{ name: '塑料', value: 30 },
				{ name: '金属', value: 20 },
				{ name: '有害垃圾', value: 5 }
			],
			// 城市整体回收占比
			cityRatio: [
				{ name: '废纸', value: 40 },
				{ name: '塑料', value: 25 },
				{ name: '金属', value: 25 },
				{ name: '有害垃圾', value: 10 }
			],
			// 环保贡献数据
			carbonReduction: 1250,
			resourceSaving: 850
		}
	});
}

/**
 * 搜索回收公司/品类
 * @param {String} keyword 关键词
 */
export function search(keyword) {
	return getRecycleCompanyList().then(res => {
		const list = res.data || [];
		const filtered = list.filter(item =>
			item.name.includes(keyword) || item.category.includes(keyword)
		);
		return { data: filtered };
	});
}

/**
 * 格式化日期
 */
function formatDate(date) {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	return `${year}-${month}-${day}`;
}

export default {
	request,
	get,
	post,
	getBannerList,
	getActivityList,
	getOrderList,
	getOrderDetail,
	getRecycleCompanyList,
	getCompanyDetail,
	login,
	register,
	getUserInfo,
	signIn,
	getRecycleStatistics,
	search
};
