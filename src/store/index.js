import request from "@/utils/request";
import Vue from "vue";
import Vuex from 'vuex'

Vue.use(Vuex);
export default new Vuex.Store({
 state:{
   userCount:0,
   doctorCount:0
 },
 getters:{
   getUserCount(state){
      return state.userCount;
   },
   getDoctorCount(state){
      return state.doctorCount;
   }
 },
 mutations:{
    setUserCount(state,v){
      state.userCount = v;
    },
 },
 actions:{
   requestUserCount(){
      request.get('/user/selectPage')
         .then(resp=>{
            console.log(resp);
            
         })
   }
 }
})