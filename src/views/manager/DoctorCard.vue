<template>
  <div>
   
    <div class="search">
      <el-select v-model="departmentId" placeholder="请选择科室" style="width: 200px">
        <el-option v-for="item in departmentData" :key="item.id" :label="item.name" :value="item.id">
        </el-option>
      </el-select>
      <el-button type="info" plain style="margin-left: 10px" @click="load(1)">查询</el-button>
      <el-button type="warning" plain style="margin-left: 10px" @click="reset">重置</el-button>
    </div>



    <div class="table" style="padding: 15px 20px">
      <el-row :gutter="20">
        <el-col :span="6" v-for="(item,key) in tableData" :key="key" style="margin-bottom: 20px">
          <div style="text-align: center; background-color: #ecf8fd" class="card">
            <img :src="item.avatar" alt="" style="width: 100px; height: 100px; border-radius: 50%">
            <div style="font-weight: 550; margin-top: 10px">
              {{item.name}} <span style="color: #383535; margin-left: 5px; font-weight: 500">{{item.departmentName}}</span>
            </div>
            <div style="margin-top: 20px; color: #353523; padding: 0 10px; text-align: left; overflow: hidden;text-overflow: ellipsis;display: -webkit-box;-webkit-box-orient: vertical;-webkit-line-clamp: 4;">
              简介：{{item.description}}
            </div>
            <div style="margin-top: 15px">
              挂号费：<span style="color: red; font-weight: 550; margin-right: 20px">￥{{item.price}}</span> 剩余：{{item.num}}
            </div>
            <div style="margin-top: 15px">
              <el-button type="primary" size="mini" @click="reserve(item)" :disabled="item.num === 0">挂号</el-button>
            </div>
          </div>
        </el-col>
      </el-row>

      <div class="pagination">
        <el-pagination
            background
            @current-change="handleCurrentChange"
            :current-page="pageNum"
            :page-sizes="[5, 10, 20]"
            :page-size="pageSize"
            layout="total, prev, pager, next"
            :total="total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: "Doctor",
  data() {
    return {
      tableData: [],  // 所有的数据
      pageNum: 1,   // 当前的页码
      pageSize: 10,  // 每页显示的个数
      total: 0,
      departmentId: null,
      fromVisible: false,
      form: {},
      user: JSON.parse(localStorage.getItem('xm-user') || '{}'),
      rules: {},
      ids: [],
      price:0,
      departmentData: [],
 
    }
  },
  created() {
    this.load(1)
    this.loadDepartment() 
    
  },
  methods: {
    reserve(item) {
      this.tableData.forEach(e=>{
       console.log(e);
       
      });
      if (this.user.role !== 'USER') {
        this.$message.warning('您的角色不支持挂号操作')
        return
      }
      let data = {
        userId: this.user.id,
        doctorId: item.id,
      }; 
      let order = { 
        out_trade_no:this.getNowDate()+Math.floor(Math.random()*10000)+this.user.id,
        subject:item.name+item.position+"挂号服务",
        total_amount:item.price, 
        product_code:"FAST_INSTANT_TRADE_PAY"//电脑支付
      };

      console.log(this.tableData);
       this.$request.get('/pay/qrcode',{
        params:order
      }
      ).then(res=>{
   
      const div = document.createElement('div')
        div.innerHTML = res.data;
        document.body.appendChild(div);
        document.forms[0].submit();
      }) ;
      
       //轮询订单状态 
    const url = window.location.href;
    loopOrderStatus:()=>{
      setTimeout(()=>{
        $request.post('/order/status/no',
          {
           alipay_no:this.getParameterByName('')
          }
        ).then(resp=>{
          /**
           * 拿到返回的订单信息：判断挂号是否成功
           */
          console.log(resp);
          
            // this.$request.post('/reserve/add', data).then(res => {
      //   if (res.code === '200') {
      //     this.$message.success('挂号成功')
          
      //     this.load(1)
      //   } else {
      //     this.$message.error(res.msg)
      //   } 
      // })
        })
      },1000)
    }
    },
    /**
     * 从支付宝同步回调中截取订单号
     * @param name 参数名
     */

    
    loadDepartment() {
      
      this.$request.get('/department/selectAll').then(res => {
        if (res.code === '200') {
          this.departmentData = res.data
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    load(pageNum) {  // 分页查询
      if (pageNum) this.pageNum = pageNum
      this.$request.get('/doctor/selectPage2', {
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          departmentId: this.departmentId,
        }
      }).then(res => {
        this.tableData = res.data?.list
        this.total = res.data?.total
      })
    },
    reset() {
      this.departmentId = null
      this.load(1)
    },
    handleCurrentChange(pageNum) {
      this.load(pageNum)
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
    }
  }
}
</script>

<style scoped>

</style>