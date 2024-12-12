<template> 


   
    <el-row>  
      <div class="card tips" style="padding: 15px">
      您好，{{ user?.name }}！欢迎使用本系统
    </div> 
      <div style="width: 50%;">
        <div style="margin-bottom: 30px; font-size: 20px; font-weight: bold;">公告列表</div>
        <div style=" position: relative;z-index:1;" >
          <el-timeline  reverse slot="reference">
            <el-timeline-item v-for="(item,index) in notices" :key="index" :timestamp="item.time"> 
              {{ item.title }}
            </el-timeline-item>
          </el-timeline>
          </div>
          
       </div>  
  </el-row> 
</template>

<script>

export default {
  name: 'Home',
  data() {
    return {
      user: JSON.parse(localStorage.getItem('xm-user') || '{}'),
      notices: []
    }
  },
  created() {
    this.$request.get('/notice/selectAll').then(res => {
      this.notices = res.data || []
    })
  }
}
</script>
