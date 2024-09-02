import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    settings,
    user
  },
  getters,
  // state:{
  //     //存放的键值对就是所要管理的状态
  //     name:false,
  // },

  // mutations : {
  //   SET_NUM(state, payload) {
  //     state.name = payload;
  //     console.log(state.name,store)
  //   },
  // }

})

export default store
