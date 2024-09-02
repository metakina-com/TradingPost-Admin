import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: ''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  }
}

const actions = {
  // user login
  async login({ commit }, userInfo) {
    // console.log(commit,'zoulezheli')
    // console.log(userInfo);
    let name = userInfo.name,
      password = userInfo.password
    await login({ name: name.trim(), password }).then(response => {
      // console.log(response, 'response');
      setToken(response.result.token)
      window.localStorage.setItem('userId', response.result.id);
      window.localStorage.setItem('token', response.result.token);
    })

    // console.log(data, 'data');
    // return new Promise((resolve, reject) => {
    //   //onsole.log(data.token, 'response.result')
    //   window.localStorage.setItem('userId', data.id);
    //   window.localStorage.setItem('token', data.token);
    //   commit('SET_TOKEN', data.token)
    //   setToken(data.token);
    //   resolve()
    // })
  },

  // get user info
  getInfo({ commit, state }) {
    //console.log('wocaimeizou');
    return new Promise((resolve, reject) => {
      if (window.localStorage.getItem('userId') && window.localStorage.getItem('token')) {
        var data = {
          roles: ['admin'],
          introduction: 'I am a super administrator',
          avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
          name: 'Super Admin'
        };

        commit('SET_NAME', data.name);
        commit('SET_AVATAR', data.avatar);
        resolve(data)
      } else {
        let error = '登录失效'
        reject(error)
      }


      // 如果小伙伴们没有获取用户信息的需求那么直接注释掉方法

      // getInfo(state.token).then(response => {
      //   const { data } = response
      //   if (!data) {
      //     return reject('Verification failed, please Login again.')
      //   }

      //   const { name, avatar } = data

      //   commit('SET_NAME', name)
      //   commit('SET_AVATAR', avatar)
      //   resolve(data)
      // }).catch(error => {
      //   reject(error)
      // })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      removeToken() // must remove  token  first
      resetRouter()
      commit('RESET_STATE')
      let message = '退出成功!'
      resolve()
      if (!message) {
        reject(error)
      }
      // // 如果没有登出接口直接屏蔽
      // logout(state.token).then(() => {

      // }).catch(error => {

      // })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

