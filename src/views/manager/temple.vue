<template>
    <!-- <el-dialog title="v我"
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
</el-dialog> -->
<div>正在支付...</div>
</template>
<script>
import router from '@/router';

export default{
    name: 'tmp',
    data(){
        return{
          
          user: JSON.parse(localStorage.getItem('xm-user') || '{}'),
            dialogVisible :false, 
            alipayQR:'',
            v:this.$route.params.para
        }
    },
    created(){
      if(this.v!=null){
        let order = { 
        out_trade_no:this.getNowDate()+Math.floor(Math.random()*10000)+this.user.id,
        subject:`${this.user.username}线上充值`,
        total_amount:this.v, 
        product_code:"FAST_INSTANT_TRADE_PAY"//电脑支付
      }; 
      
       this.$request.get('/pay/qrcode',{
        params:order
      }
      ).then(res=>{   

      const div =  window.parent.document.createElement('div')
        div.innerHTML = res.data;
        window.parent.document.body.appendChild(div);
        window.parent.document.forms[0].submit(); 
      }) ; 
      }else{
        router.go(-1)
      }
    },
    // watch:{
    //     v:{
            
    //     }
    // },
   methods:{
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
   }
}
</script>