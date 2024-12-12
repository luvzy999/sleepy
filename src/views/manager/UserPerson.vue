<template>
  <div>
    <el-dialog title="请使用支付宝扫码支付"
  :visible.sync="dialogVisible"
  width="23%">
  <iframe :srcdoc="alipayQR"
        border="0"
        frameborder="0"
        marginwidth="0"
        marginheight="0"
        scrolling="no"
        width="300"
        height="350"
        style="overflow:hidden;"></iframe>
        <span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="dialogVisible = false">关 闭</el-button> 
  </span>
</el-dialog>
    <el-card style="width: 50%">
      <el-form :model="user" label-width="100px" style="padding-right: 50px">
        <div style="margin: 15px; text-align: center">
          <el-upload
              class="avatar-uploader"
              :action="$baseUrl + '/files/upload'"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
          >
            <img v-if="user.avatar" :src="user.avatar" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </div>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="user.username" placeholder="用户名" disabled></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="user.name" placeholder="姓名"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="user.phone" placeholder="电话"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="user.email" placeholder="邮箱"></el-input>
        </el-form-item>
        <el-form-item label="余额" prop="money">
          <el-input v-model="user.money" disabled></el-input>
        </el-form-item>
        <div style="text-align: center; margin-bottom: 20px">
          <el-button type="primary" @click="update">保 存</el-button>
          <el-button type="warning" @click="recharge">充 值</el-button>
        </div>
      </el-form>
    </el-card>
    <el-dialog   title="充值金额" :visible.sync="fromVisible" width="40%" destroy-on-close>
      <el-form label-width="100px" style="padding-right: 50px" ref="formRef">
        <el-form-item>
          <div class="grid-container">
            <div class="grid-item"  v-for="item in manei" ><input type="button" :value="item.title" v-on:click="takeMoney(item.value)"></div>  
          </div>
        </el-form-item>
        <el-form-item prop="money" label="输入金额">
          <el-input v-model="money" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="fromVisible = false">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import router from '@/router';

export default {
  name: "UserPerson",
  data() {
    return {
      user: JSON.parse(localStorage.getItem('xm-user') || '{}'),
      fromVisible: false,
      money: null,
      // dialogVisible : false, 
      // alipayQR:'',
      manei:[
        {
          title:'20¥',
          value:'20'
        },
        {
          title:'50¥',
          value:'50'
        },
        {
          title:'100¥',
          value:'100'
        },
        {
          title:'200¥',
          value:'200'
        },
        {
          title:'200¥',
          value:'200'
        },
        {
          title:'200¥',
          value:'200'
        },
      ]
    }
  },
  created() {
    this.getPerson()
  },
  methods: {
    getPerson() {
      this.$request.get('/user/selectById/' + this.user.id).then(res => {
        if (res.code === '200') {
          this.user = res.data
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    recharge() {
      this.money = 100
      this.fromVisible = true
    },
    save() {
      let _this = this;
      if (!this.money) {
        this.$message.warning('请输入充值金额')
        return
      }
      router.push({
        name:'tmp',
        params:{para:this.money}
      })
    },
    
    update() {
      // 保存当前的用户信息到数据库
      this.$request.put('/user/update', this.user).then(res => {
        if (res.code === '200') {
          this.fromVisible = false
          // 成功更新
          this.$message.success('保存成功')

          // 更新浏览器缓存里的用户信息
          localStorage.setItem('xm-user', JSON.stringify(this.user))

          // 触发父级的数据更新
          this.$emit('update:user')
        } else {
          this.$message.error(res.msg)
        }
      })
    }, 
    takeMoney(p){
      this.money = p;
    },
    getNowDate(){
      const dt = new Date() // 当前中国标准时间
      const Year = dt.getFullYear() // 获取当前年份 支持IE和火狐浏览器.
      let Month = dt.getMonth() + 1 // 获取中国区月份
      let Day = dt.getDate() // 获取几号 
      Month = Month <= 9?'0'+Month:Month;
      Day = Day <= 9?'0'+Day:Day;
      var CurrentDate = Year+''+Month+''+Day; 
      return CurrentDate 
    },
    handleAvatarSuccess(response, file, fileList) {
      // 把user的头像属性换成上传的图片的链接
      this.$set(this.user, 'avatar', response.data)
    },
  }
}
</script>

<style scoped>
 .el-form-item__label {
  font-weight: bold;
}
 .el-upload {
  border-radius: 50%;
}
 .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  border-radius: 50%;
}
 .avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
  border-radius: 50%;
}
.avatar {
  width: 120px;
  height: 120px;
  display: block;
  border-radius: 50%;
}
.grid-container{
  display: grid;
  grid-template-columns: auto auto auto; 
}
.grid-item{ 
  background-color: rgba(255, 255, 255, 0.8); 
  padding: 20px;
  font-size: 30px;
  text-align: center;
}
input[type="button"]{ 
  width: 100%;
  outline: none !important;
  border: none;
  background: none;
  cursor: pointer;  
  color: #409EFF;
  font-family:'Times New Roman', Times, serif;
  font-size: 12pt;
  font-weight: bold;
}
</style>