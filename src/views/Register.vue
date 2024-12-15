<template>
  <div class="container">
    <div class="box"> 
    <div>
      <div style="text-align: center; font-size: 30px; margin-bottom: 30px; color: #FFf">欢迎注册</div>
      <el-form :model="form" :rules="rules" ref="formRef">
        <el-form-item prop="username">
          <el-input prefix-icon="el-icon-user" placeholder="请输入账号" v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input prefix-icon="el-icon-lock" placeholder="请输入密码" show-password  v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item prop="confirmPass">
          <el-input prefix-icon="el-icon-lock" placeholder="请确认密码" show-password  v-model="form.confirmPass"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width: 100%;color: white" @click="register">注 册</el-button>
        </el-form-item>
        <div style="display: flex; align-items: center">
          <div style="flex: 1"></div>
          <div style="flex: 1;color: #FFf; text-align: right">
            已有账号？请 <a href="/login">登录</a>
          </div>
        </div>
      </el-form>
    </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Register",
  data() {
    // 验证码校验
    const validatePassword = (rule, confirmPass, callback) => {
      if (confirmPass === '') {
        callback(new Error('请确认密码'))
      } else if (confirmPass !== this.form.password) {
        callback(new Error('两次输入的密码不一致'))
      } else {
        callback()
      }
    }
    return {
      form: { role: 'USER' },
      rules: {
        username: [
          { required: true, message: '请输入账号', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
        ],
        confirmPass: [
          { validator: validatePassword, trigger: 'blur' }
        ]
      }
    }
  },
  created() {

  },
  methods: {
    register() {
      this.$refs['formRef'].validate((valid) => {
        if (valid) {
          // 验证通过
          this.$request.post('/register', this.form).then(res => {
            if (res.code === '200') {
              this.$router.push('/login')  // 跳转登录页面
              this.$message.success('注册成功')
            } else {
              this.$message.error(res.msg)
            }
          })
        }
      })
    }
  }
}
</script>

<style scoped>
.container {
  height: 100vh;
  overflow: hidden;
  background-image: url("@/assets/imgs/c6723350fa75584b17fa69730208053e239ebb48f9c2905e19f11a0c0e37fb4d.jpeg");
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
}
a {
  color: #2a60c9;
}
.box{
width: 500px; padding: 40px;  
background-color:transparent; 
border-radius: 1px;background-color: rgba(89, 89, 89, 0.1);
backdrop-filter: blur(5px);
-webkit-backdrop-filter: blur(19.5px);
border: 1px solid rgba(255, 255, 255, 0.18);
box-shadow: rgba(14, 14, 14, 0.19) 0px 6px 15px 0px;
-webkit-box-shadow: rgba(14, 14, 14, 0.19) 0px 6px 15px 0px;
border-radius: 8px;
-webkit-border-radius: 8px;
color: rgba(128, 128, 128, 0.4);
}
</style>