<template>
  <div class="container">
    <div class="box"> 
      <div style="text-align: center; font-size: 21pt; margin-bottom: 30px; color: #fff;font-weight: bold;">欢迎登录医院预约挂号系统</div>
      <el-form :model="form" :rules="rules" ref="formRef">
        <el-form-item prop="username">
          <el-input prefix-icon="el-icon-user" placeholder="请输入账号" v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input prefix-icon="el-icon-lock" placeholder="请输入密码" show-password  v-model="form.password"></el-input>
        </el-form-item>

        <el-form-item prop="verifyCode">
          <el-row :gutter="20">
            <el-col :span="10">
              <el-input  placeholder="请输入验证码"  v-model="form.verifyCode"></el-input>
            </el-col>
            <el-col :span="10"><el-image :src="captchaUrl"  
          style="margin:0px 10px 0 5px; cursor: pointer;height: 32px;border: gray 1px solid"
          @click="refreshCaptcha" alt=""/></el-col> 
          </el-row>
        </el-form-item> 
        <el-form-item>
          <el-select v-model="form.role" placeholder="请选择角色" style="width: 100%;">
            <el-option label="管理员" value="ADMIN"></el-option>
            <el-option label="医生" value="DOCTOR"></el-option>
            <el-option label="患者" value="USER"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width: 100%; color: white" @click="login">登 录</el-button>
        </el-form-item> 
        <div style="display: flex; align-items: center;color: #fff;">
          <div style="flex: 1"></div>
          <div style="flex: 1; text-align: right">
            还没有账号？请 <a href="/register">注册</a>
          </div>
        </div>
        
      </el-form>
    </div>

  </div>
</template>

<script>
import request from '@/utils/request';

export default {
  name: "Login",
  data() {
    return {
      form: {},
      captchaUrl:'',
      dialogVisible: false,
      rules: {
        username: [
          { required: true, message: '请输入账号', trigger: 'blur' },
        ],
        verifyCode:[
          { required: true, message: '请输入验证码', trigger: 'blur'}
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
        ],
        
      }
    
    }
  },
  created() { const info = localStorage.getItem('xm-user');
    if((info ==='null')){
     location.replace('/l')
    }
    this.refreshCaptcha();
  },
  methods: {
    /**
     * 登录
     */
    login() {
      this.$refs['formRef'].validate((valid) => {
        if (valid) {
          // 验证通过
          this.$request.post('/login', this.form).then(res => {
            if (res.code === '200') {
              localStorage.setItem("xm-user", JSON.stringify(res.data))  // 存储用户数据
              this.$router.push('/')  // 跳转主页
              this.$message.success('登录成功')
            } else {
                 this.form.verifyCode = "";//清空输入框
              this.$message.error(res.msg)
             this.refreshCaptcha(); //刷新验证码
            }
          })   
        }
      })
    },

    /**
     * 获取后端验证码
     */
    refreshCaptcha(){
      this.$request.get('/auth/code').then(resp=>{ 
        this.captchaUrl = "data:image/png;base64,"+ resp.data;
      })
    }
   
  }



  
}




</script>

<style scoped>



.container {
  height: 100vh;
  overflow: hidden; 
  background-image: url("@/assets/imgs/1234.jpg");
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #198aee;
  filter: blur(30);
}
a {
  color: #198aee;
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

