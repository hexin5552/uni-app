<template>
  <view class="container">
    <form @submit="formSubmit">
      <view class="item">
        <text>用户名：</text>
        <input name="username" placeholder="请输入用户名" v-model="form.username" />
      </view>

      <view class="item">
        <text>密码：</text>
        <input name="password" password placeholder="请输入密码" v-model="form.password" />
      </view>

      <view class="item">
        <text>性别：</text>
        <radio-group name="gender" @change="genderChange">
          <label><radio value="男" :checked="form.gender === '男'" />男</label>
          <label><radio value="女" :checked="form.gender === '女'" />女</label>
          <label><radio value="其他" :checked="form.gender === '其他'" />其他</label>
        </radio-group>
      </view>
      <view class="item" v-if="form.gender === '其他'">
        <text>请输入：</text>
        <input name="customGender" placeholder="请输入您的性别" v-model="form.customGender" />
      </view>

      <view class="item">
        <text>出生日期：</text>
        <picker
          mode="date"
          :value="form.birthday"
          :start="startDate"
          :end="endDate"
          @change="birthdayChange"
        >
          <view>{{ form.birthday || '请选择出生日期' }}</view>
        </picker>
      </view>
      
      <view class="item">
        <text>年龄：{{ form.age }}岁</text>
      </view>

      <view class="item">
        <text>居住城市：</text>
        <picker
          name="city"
          :value="cityIndex"
          :range="cityList"
          @change="cityChange"
        >
          <view>{{ form.city || '请选择城市' }}</view>
        </picker>
      </view>

      <view class="item">
        <text>兴趣爱好：</text>
        <input name="hobby" placeholder="请输入您的兴趣爱好" v-model="form.hobby" />
      </view>

      <view class="item">
        <text>接收推广信息：</text>
        <switch name="msg" v-model="form.msg" />
      </view>

      <button form-type="submit" type="primary">提交</button>
    </form>
  </view>
</template>

<script>
export default {
  data() {
    const now = new Date()
    const endDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
    const startDate = `${now.getFullYear() - 120}-01-01`
    
    return {
      form: {
        username: '',
        password: '',
        gender: '',
        customGender: '',
        age: 0,
        birthday: '',
        city: '',
        hobby: '',
        msg: false
      },
      cityList: ['北京', '上海', '广州', '深圳', '杭州'],
      cityIndex: 0,
      startDate: startDate,
      endDate: endDate
    }
  },
  methods: {
    cityChange(e) {
      this.cityIndex = e.detail.value
      this.form.city = this.cityList[this.cityIndex]
    },
    birthdayChange(e) {
      this.form.birthday = e.detail.value
      this.calculateAge(this.form.birthday)
    },
    genderChange(e) {
      const selectedGender = e.detail.value
      this.form.gender = selectedGender
      if (selectedGender !== '其他') {
        this.form.customGender = ''
      }
    },
    calculateAge(birthday) {
      const birthDate = new Date(birthday)
      const today = new Date()
      let age = today.getFullYear() - birthDate.getFullYear()
      const monthDiff = today.getMonth() - birthDate.getMonth()
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--
      }
      
      this.form.age = age
    },
    formSubmit() {
      const { username, password, gender, customGender, age, birthday } = this.form
      
      if (!username || username.length < 3 || username.length > 15) {
        uni.showToast({ title: '用户名3-15位', icon: 'none' })
        return
      }
      if (!password || password.length < 6) {
        uni.showToast({ title: '密码至少6位', icon: 'none' })
        return
      }
      if (!gender && !customGender) {
        uni.showToast({ title: '请选择性别', icon: 'none' })
        return
      }
      if (gender === '其他' && !customGender) {
        uni.showToast({ title: '请输入您的性别', icon: 'none' })
        return
      }
      if (!birthday) {
        uni.showToast({ title: '请选择出生日期', icon: 'none' })
        return
      }
      if (age < 0 || age > 100) {
        uni.showToast({ title: '年龄0-100', icon: 'none' })
        return
      }

      uni.showToast({ title: '注册成功', icon: 'success' })
      console.log('表单数据：', this.form)
    }
  }
}
</script>

<style scoped>
.container { padding: 20rpx; }
.item { margin: 30rpx 0; display: flex; align-items: center; }
input { border: 1px solid #eee; padding: 10rpx; flex: 1; }
label { margin-right: 20rpx; }
picker { padding: 10rpx; border: 1px solid #eee; flex: 1; }
</style>