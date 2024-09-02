import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import baseUrl from '@/utils/utils'
// create an axios instance
const service = axios.create({
  // 本地
  // http://xing-z.net
  // 线上
  // https://api.euronextex.com

  // baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url

  baseURL: baseUrl.baseUrl, // url = base url + request url
  // baseURL: 'https://api.euronextex.com', // url = base url + request url



  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['X-Token'] = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    //console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data
    //console.log(res, 'response.data')
    // if the custom code is not 20000, it is judged as an error.
    if (res.status != 'SUCCEED') {
      //console.log(response, '/////')
      Message({
        message: res.errorMessage || 'Error',
        type: 'error',
        duration: 5 * 1000
      })

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.errorCode === 'SYS.0015' || res.code === '50012' || res.code === 50014) {

        window.localStorage.removeItem('userId')
        window.localStorage.removeItem('token')
        // alert('1')
        // Vue.prototype.$message({
        //   type: 'warning',
        //   message: res.errorMessage,
        //   duration: 2500
        // })
        // to re-login
        store.dispatch('user/resetToken').then(() => {
          window.location.reload()
        })
      }
      return Promise.reject(new Error(res.errorMessage || 'Error'))
    } else {
      return res
    }
  },
  error => {
    //console.log('err' + error) // for debug
    Message({
      message: error.errorMessage || '系统错误',
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
