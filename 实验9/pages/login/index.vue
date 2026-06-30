<template>
	<view class="login-page">
		<!-- Logo区域 -->
		<view class="logo-section">
			<view class="logo">🌿</view>
			<text class="app-name">智慧环保回收平台</text>
		</view>

		<!-- 登录/注册切换 -->
		<view class="tab-switch">
			<view
				class="tab-item"
				:class="{ active: currentTab === 'login' }"
				@click="switchTab('login')"
			>
				<text>登录</text>
			</view>
			<view
				class="tab-item"
				:class="{ active: currentTab === 'register' }"
				@click="switchTab('register')"
			>
				<text>注册</text>
			</view>
		</view>

		<!-- 登录表单 -->
		<view class="form-section" v-show="currentTab === 'login'">
			<view class="form-item">
				<text class="form-label">手机号</text>
				<input
					class="form-input"
					v-model="loginForm.phone"
					placeholder="请输入手机号"
					type="number"
					maxlength="11"
				/>
			</view>
			<view class="form-item">
				<text class="form-label">密码</text>
				<input
					class="form-input"
					v-model="loginForm.password"
					placeholder="请输入密码"
					password
				/>
			</view>
			<view class="form-btn" @click="handleLogin">登录</view>
		</view>

		<!-- 注册表单 -->
		<view class="form-section" v-show="currentTab === 'register'">
			<view class="form-item">
				<text class="form-label">手机号</text>
				<input
					class="form-input"
					v-model="registerForm.phone"
					placeholder="请输入手机号"
					type="number"
					maxlength="11"
				/>
			</view>
			<view class="form-item">
				<text class="form-label">密码</text>
				<input
					class="form-input"
					v-model="registerForm.password"
					placeholder="请输入密码 (6位以上)"
					password
				/>
			</view>
			<view class="form-item">
				<text class="form-label">确认密码</text>
				<input
					class="form-input"
					v-model="registerForm.confirmPassword"
					placeholder="请再次输入密码"
					password
				/>
			</view>
			<view class="form-btn" @click="handleRegister">注册</view>
		</view>

		<!-- 协议勾选 -->
		<view class="agreement" v-show="currentTab === 'register'">
			<checkbox-group @change="onAgreementChange">
				<label class="agreement-label">
					<checkbox value="agree" :checked="agreed" color="#4CAF50" />
					<text class="agreement-text">我已阅读并同意</text>
					<text class="link" @click.stop="showAgreement">《用户协议》</text>
				</label>
			</checkbox-group>
		</view>
	</view>
</template>

<script>
import { login, register } from '@/utils/request.js';
import { validatePhone, validatePassword } from '@/utils/common.js';

export default {
	data() {
		return {
			currentTab: 'login',
			agreed: false,
			loginForm: {
				phone: '',
				password: ''
			},
			registerForm: {
				phone: '',
				password: '',
				confirmPassword: ''
			}
		};
	},
	methods: {
		// 切换Tab
		switchTab(tab) {
			this.currentTab = tab;
		},
		// 协议勾选
		onAgreementChange(e) {
			this.agreed = e.detail.value.includes('agree');
		},
		// 显示协议
		showAgreement() {
			uni.showModal({
				title: '用户协议',
				content: '这里是用户协议的内容...',
				showCancel: false
			});
		},
		// 登录
		handleLogin() {
			const { phone, password } = this.loginForm;

			if (!phone) {
				uni.showToast({ title: '请输入手机号', icon: 'none' });
				return;
			}

			if (!validatePhone(phone)) {
				uni.showToast({ title: '手机号格式不正确', icon: 'none' });
				return;
			}

			if (!password) {
				uni.showToast({ title: '请输入密码', icon: 'none' });
				return;
			}

			uni.showLoading({ title: '登录中...' });

			login(phone, password)
				.then(res => {
					const { token, userInfo } = res.data;
					uni.setStorageSync('token', token);
					uni.setStorageSync('userInfo', userInfo);
					uni.showToast({ title: '登录成功', icon: 'success' });
					setTimeout(() => {
						uni.navigateBack();
					}, 1500);
				})
				.catch(e => {
					uni.showToast({ title: e.msg || '登录失败', icon: 'none' });
				})
				.finally(() => {
					uni.hideLoading();
				});
		},
		// 注册
		handleRegister() {
			const { phone, password, confirmPassword } = this.registerForm;

			if (!phone) {
				uni.showToast({ title: '请输入手机号', icon: 'none' });
				return;
			}

			if (!validatePhone(phone)) {
				uni.showToast({ title: '手机号格式不正确', icon: 'none' });
				return;
			}

			if (!validatePassword(password)) {
				uni.showToast({ title: '密码至少6位', icon: 'none' });
				return;
			}

			if (password !== confirmPassword) {
				uni.showToast({ title: '两次密码不一致', icon: 'none' });
				return;
			}

			if (!this.agreed) {
				uni.showToast({ title: '请同意用户协议', icon: 'none' });
				return;
			}

			uni.showLoading({ title: '注册中...' });

			register(phone, password)
				.then(res => {
					const { token, userInfo } = res.data;
					uni.setStorageSync('token', token);
					uni.setStorageSync('userInfo', userInfo);
					uni.showToast({ title: '注册成功', icon: 'success' });
					setTimeout(() => {
						uni.navigateBack();
					}, 1500);
				})
				.catch(e => {
					uni.showToast({ title: e.msg || '注册失败', icon: 'none' });
				})
				.finally(() => {
					uni.hideLoading();
				});
		}
	}
};
</script>

<style scoped>
.login-page {
	background-color: #f0f9f4;
	min-height: 100vh;
	padding: 60rpx 60rpx;
}

/* Logo */
.logo-section {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 60rpx 0;
}

.logo {
	font-size: 120rpx;
	margin-bottom: 20rpx;
}

.app-name {
	font-size: 36rpx;
	font-weight: bold;
	color: #4CAF50;
}

/* Tab切换 */
.tab-switch {
	display: flex;
	background: #ffffff;
	border-radius: 40rpx;
	padding: 8rpx;
	margin-bottom: 60rpx;
}

.tab-item {
	flex: 1;
	height: 72rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 32rpx;
}

.tab-item text {
	font-size: 28rpx;
	color: #999999;
}

.tab-item.active {
	background: #4CAF50;
}

.tab-item.active text {
	color: #ffffff;
	font-weight: bold;
}

/* 表单 */
.form-section {
	background: #ffffff;
	border-radius: 24rpx;
	padding: 40rpx 30rpx;
	margin-bottom: 30rpx;
}

.form-item {
	margin-bottom: 30rpx;
}

.form-item:last-child {
	margin-bottom: 0;
}

.form-label {
	display: block;
	font-size: 26rpx;
	color: #666666;
	margin-bottom: 16rpx;
}

.form-input {
	width: 100%;
	height: 88rpx;
	background: #f5f5f5;
	border-radius: 16rpx;
	padding: 0 24rpx;
	font-size: 28rpx;
	box-sizing: border-box;
}

.form-btn {
	background: linear-gradient(135deg, #4CAF50, #388E3C);
	color: #ffffff;
	text-align: center;
	padding: 28rpx;
	border-radius: 50rpx;
	font-size: 32rpx;
	font-weight: bold;
	margin-top: 40rpx;
}

/* 协议 */
.agreement {
	padding: 0 10rpx;
}

.agreement-label {
	display: flex;
	align-items: center;
}

.agreement-text {
	font-size: 24rpx;
	color: #666666;
	margin-left: 10rpx;
}

.link {
	font-size: 24rpx;
	color: #4CAF50;
}
</style>
