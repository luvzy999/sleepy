<template> 
       
        <!-- <el-container style="background-color: black;">
            <div> 
                <el-row :gutter="20">
                    <el-col span="50">
                        <el-row :gutter="20">
                    <el-col :span="6"> 
                        <el-card class="box-card">
                            <el-statistic title="用户">
                                <template slot="formatter">
                                    <countTo :startVal="0" :endVal="userCount" :decimals="0" :duration="1000"/>
                                </template>
                            </el-statistic></el-card></el-col>
                            <el-col :span="6"> 
                        <el-card class="box-card">
                            <el-statistic title="医师">
                                <template slot="formatter">
                                    <countTo :startVal="0" :endVal="doctorCount" :decimals="0" :duration="3000"/>
                                </template>
                            </el-statistic></el-card></el-col>
                            <el-col :span="6"> 
                        <el-card class="box-card">
                            <el-statistic title="预约">
                                <template slot="formatter">
                                    <countTo :startVal="0" :endVal="reserveCount" :decimals="0" :duration="3000"/>
                                </template>
                            </el-statistic></el-card></el-col>
                            <el-col :span="6"> 
                        <el-card class="box-card">
                            <el-statistic title="公告">
                                <template slot="formatter">
                                    <countTo :startVal="0" :endVal="money" :decimals="0" :duration="3000"/>
                                </template>
                            </el-statistic></el-card></el-col> 
                </el-row>  
                    </el-col> 
                </el-row>
        </div>
        </el-container>
       <el-row :gutter="20">
        <el-col :span="10">
            <div id="main" style="width: 600px;height:520px;"></div>
        </el-col>
        <el-col :span="10">
            <div id="main2" style="width: 600px;height:480px;"></div>
        </el-col>
       </el-row> -->
       <div class="container">
  <div class="column1 column">
    <div> 
<div id="main2" style="width: 320px;height:240px;"></div>
</div>
  </div>
  <div class="column2 column">

    <el-row :gutter="20">  
                    <el-col :span="6">  
                            <el-statistic  title="用户" :value-style="{color:'#000',fontSize:'28pt'}">
                                <template slot="formatter">
                                    <countTo :startVal="0" :endVal="userCount" :decimals="0" :duration="1000"/>
                                </template>
                            </el-statistic></el-col>
                            <el-col :span="6">  
                            <el-statistic title="医师" :value-style="{color:'#000',fontSize:'28pt'}">
                                <template slot="formatter">
                                    <countTo :startVal="0" :endVal="doctorCount" :decimals="0" :duration="3000"/>
                                </template>
                            </el-statistic></el-col>
                            <el-col :span="6">  
                            <el-statistic title="预约" :value-style="{color:'#000',fontSize:'28pt'}">
                                <template slot="formatter">
                                    <countTo :startVal="0" :endVal="reserveCount" :decimals="0" :duration="3000"/>
                                </template>
                            </el-statistic></el-col>
                            <el-col :span="6">  
                            <el-statistic title="公告" :value-style="{color:'#000',fontSize:'28pt'}">
                                <template slot="formatter">
                                    <countTo :startVal="0" :endVal="money" :decimals="0" :duration="3000"/>
                                </template>
                            </el-statistic></el-col> 
                
                </el-row>

  </div>
  <div class="column3 column">
  
<div id="main" style="width: 480px;height:280px;top: 0;"></div>
  </div>
  <div class="column1-1 column"></div>
</div>
  </template>
  
  <script> 
import request from '@/utils/request';  
import countTo from 'vue-count-to'; 

  export default {
    name:'dashboard',
    components:{countTo},
    data(){
        return{
            doctorCount:0,
            userCount:0,
            reserveCount:0,
            money:0,
            unreserve:0,
            reserved:0,
            user: JSON.parse(localStorage.getItem('xm-user') || '{}'),
            notices: [],
            onLineCount:0
        }
    }, 
    mounted() { 
        this.reqUsers(); 
        this.reqDoctors();
        this.reqNotice();
        this.reqReserve();
  },
    methods:{
        reqUsers(){
       return request.get('/user/selectPage').then(resp=>{
            console.log(resp); 
            this.userCount = parseInt(resp.data?.total); 
        });},
        reqDoctors(){
      return  request.get('/doctor/selectPage').then(resp=>{
            console.log(resp); 
            this.doctorCount = parseInt(resp.data?.total); 
        });},

        reqReserve(){
       return request.get('/reserve/selectAll').then(resp=>{
            this.reserveCount = parseInt(resp.data.length || 0); 
            let arr = resp.data;
           arr.forEach(i => {
            if(i.status ==='已叫号'){
               this.reserved+=1;
            }else{
                this.unreserve +=1;
            }
           }); 
          
        var option = {  
            color: [ 
            '#00adb5', 
            '#f9a1bc'
            ],
            series: [ {
                // stillShowZeroSum: true,
                label: {
                    normal:{
                        formatter:'{b}:{c}:({d}%)'
                    }
                    
                },
                 
                type: 'pie',data: [
                {
                value: this.unreserve,name: '未叫号'
                },
                {
                value: this.reserved,name: '已叫号'
                }]
            }]
        }; 
         this.$echarts.init(document.getElementById('main')).setOption(option,true); 
        });},

        reqNotice(){
       return request.get('/notice/selectAll').then(resp=>{ 
            this.money = parseInt(resp.data.length); 
        });},
        reqOnlineCount(){
            return request.post('/data/onlinecount').then(resp=>{
                this.onLineCount = resp.data;
            })
        }
 
       },
    
    myBarCharts( ){//传入的参数是 m（月份) 和 n（人数）：即create_date和create_date->num
        var myBarChart = this.$echarts.init(document.getElementById('main2'));
        var option = {
            xAxis: {
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            }, 
        yAxis: {},
        series: [
            {
                itemStyle:{ 
					 normal:{ 
					 label:{ 
					  show: true, 
				 formatter: '{b} : {c} ({d}%)' 
			  }, 
			 labelLine :{show:true} 
			 } 
			 } ,
            type: 'line',
            data: [23, 24, 18, 25, 27, 28, 25]
                },
               
            ]}
                myBarChart.setOption(option)
            } 
  }
  </script>

  <style scoped lang="less"> 
.container {  
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: .3fr .3fr .3fr;
  gap: 5px 5px; 
  grid-auto-flow: row;
}
 
.column{
    background-color: #999;
    border: solid 2px #eee;
    border-radius:10px;
    // box-shadow: #000 0 0 15px 0px;
    margin: 3px;
    padding: 10px;
    min-height:300px;
}
.column1 { grid-area: 1 / 1 / 4 / 2;
}

.column2 { grid-area: 1 / 2 / 4 / 3; 
}
.column3 { grid-area: 1 / 3 / 4 / 4;   
}
.box-card{
    border: none; 
    
}

/deep/ .title {
  color: #999 !important;
  font-size: 8pt !important;
  font-weight: bold ;
}

  </style>