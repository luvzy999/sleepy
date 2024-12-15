<template>
<div id="pay-tips">正在跳转支付宝...</div>
</template>
<script>
import router from '@/router'; 

export default{
    name: 'tmp',
    data(){
        return{
          
          user: JSON.parse(localStorage.getItem('xm-user') || '{}'),
          dialogVisible:true, 
            alipayQR:'',
            v:this.$route.params.para
        }
    },
    created(){
      if(this.v!=null){
        // const timer = window.setInterval(()=>{
        //   setTimeout(()=>{
        //    this.queryBill()
        //   },0)
        // },3000)
        let order = { 
        out_trade_no:this.getNowDate()+Math.floor(Math.random()*10000)+this.user.id,
        user_id:this.user.id,
        subject:`平台线上充值`,
        total_amount:this.v, 
        product_code:"FAST_INSTANT_TRADE_PAY",//电脑支付
        qr_pay_mode:'1',
        create_date: this.dateTime()+"",
        trade_state:'0',
        body:`${this.user.username}的支付订单`
      }; 
      
       this.$request.get('/pay/qrcode',{
        params:order
      }
      ).then(res=>{   
      const div = document.createElement('div');
        div.innerHTML = res.data;
        document.body.appendChild(div);
        document.forms[0].submit(); 
      }) ; 
      }else{
        router.go(-1)
      }
    }, 
   methods:{
    dateTime(){
    const date = new Date();
    let d = date.getDate();
    let M = date.getMonth()+1;
    let y = date.getFullYear();
    let s = date.getSeconds();
    let m = date.getMinutes();
    let h = date.getHours();
    return `${y}/${M}/${d} ${h}:${m}:${s}`;
   },
    getNowDate(){
      const dt = new Date() // 当前中国标准时间
      const Year = dt.getFullYear() // 获取当前年份 支持IE和火狐浏览器.
      let Month = dt.getMonth() + 1 // 获取中国区月份
      let Day = dt.getDate() // 获取几号 
      Month = Month <= 9?`0 ${Month}`:Month;
      Day = Day <= 9?`0${Day}`:Day;
      var CurrentDate = `${Year}${Month}${Day}`;
      return CurrentDate 
    },
    // queryBill(){
    //   this.$request.post('/pay/notify').then(res=>{
    //     console.log(res);
    //   })
    // }
   },
  
}
</script>
<style scoped>
#pay-tips{
  width: 100%;
  height: 100%;
  text-align: center;
  font-size: 18pt;
}
</style>