import Vue from 'vue'
import VueRouter from 'vue-router' 

Vue.use(VueRouter)

// 解决导航栏或者底部导航tabBar中的vue-router在3.0版本以上频繁点击菜单报错的问题。
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

const routes = [
  {
    path: '/',
    name: 'Manager',
    component: () => import('../views/Manager.vue'),
    redirect: '/home',  // 重定向到主页
    children: [
      { path: '403', name: 'NoAuth', meta: { name: '无权限' }, component: () => import('../views/manager/403') },
      { path: 'home', name: 'Home', meta: { name: '系统首页' }, component: () => import('../views/manager/Home') },
      { path: 'dash', name: 'dashboard', meta: { name: '仪表盘',security:true }, component: () => import('../views/manager/Dashboard') },
      { path: 'admin', name: 'Admin', meta: { name: '管理员信息',security:true }, component: () => import('../views/manager/Admin') },
      { path: 'doctor', name: 'Doctor', meta: { name: '医生信息' }, component: () => import('../views/manager/Doctor') },
      { path: 'user', name: 'User', meta: { name: '患者信息' }, component: () => import('../views/manager/User') },
      { path: 'adminPerson', name: 'AdminPerson', meta: { name: '个人信息' }, component: () => import('../views/manager/AdminPerson') },
      { path: 'doctorPerson', name: 'DoctorPerson', meta: { name: '个人信息' }, component: () => import('../views/manager/DoctorPerson') },
      { path: 'userPerson', name: 'UserPerson', meta: { name: '个人信息' }, component: () => import('../views/manager/UserPerson') },
      { path: 'password', name: 'Password', meta: { name: '修改密码' }, component: () => import('../views/manager/Password') },
      { path: 'notice', name: 'Notice', meta: { name: '公告信息' }, component: () => import('../views/manager/Notice') },
      { path: 'department', name: 'Department', meta: { name: '科室信息' }, component: () => import('../views/manager/Department') },
      { path: 'plan', name: 'Plan', meta: { name: '医生排班' }, component: () => import('../views/manager/Plan') },
      { path: 'doctorCard', name: 'DoctorCard', meta: { name: '预约挂号' }, component: () => import('../views/manager/DoctorCard') },
      { path: 'reserve', name: 'Reserve', meta: { name: '患者挂号' }, component: () => import('../views/manager/Reserve') },
      { path: 'record', name: 'Record', meta: { name: '我的就诊' }, component: () => import('../views/manager/Record') },
      { path: 'registration', name: 'Registration', meta: { name: '住院登记' }, component: () => import('../views/manager/Registration') },
      {path:'tmp',name:'tmp',meta:{name:'充值中心'}, component:() => import('../views/manager/temple.vue')}
    ]
  },
  {
    path: '/front',
    name: 'Front',
    component: () => import('../views/Front.vue'),
    children: [
      { path: 'home', name: 'Home', meta: { name: '系统首页' }, component: () => import('../views/front/Home') },
      { path: 'person', name: 'Person', meta: { name: '个人信息' }, component: () => import('../views/front/Person') },
    ]
  },
  { path: '/login', name: 'Login', meta: { name: '登录' }, component: () => import('../views/Login.vue') },
  { path: '/register', name: 'Register', meta: { name: '注册' }, component: () => import('../views/Register.vue') },
  { path: '*', name: 'NotFound', meta: { name: '无法访问' }, component: () => import('../views/404.vue') },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
 
 
// 路由守卫
router.beforeEach((to ,from, next) => {
  if (to.matched.some(record => record.meta.security)) {//路由中是否security==true
      let user = JSON.parse(localStorage.getItem("xm-user") || '{}');//从本地存储中读取登录信息 
      if(user.role === 'ADMIN'){//从信息中判断是否是管理员
        next()//直接进入
      }else{
        next({
          path : '/403'//定向至403页面
          })
      } 
    }else{
        next()//直接进入
      }

      if(to.fullPath === '/login'){
        if(localStorage.getItem('xm-user')){
          next({
            path:from.fullPath
          })
        }else{
          next()
        }
      }
})


export default router
