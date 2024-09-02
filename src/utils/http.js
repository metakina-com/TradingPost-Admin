import axios from 'axios'
import store from '@/store/index'
import Vue from 'vue'
import router from '../router/index'
import baseUrl from '@/utils/utils'//路径引入
import { getToken, getUserId } from '@/utils/auth'
import qs from 'qs'
axios.interceptors.request.use(
    config => {
        return config
    },
    error => {
        return Promise.reject(error)
    }
)

axios.interceptors.response.use(
    response => {
        return response
    },
    error => {
        return Promise.resolve(error.response)
    }
)

function checkStatus(response) {
    if (response === undefined) {
        // Vue.prototype.$message({
        //   type: 'warning',
        //   message: '网络异常'
        // })
    } else {
        // loading
        // 如果http状态码正常，则直接返回数据
        if (
            response &&
            (response.status === 200 ||
                response.status === 304 ||
                response.status === 400)
        ) {
            return response
            // 如果不需要除了data之外的数据，可以直接 return response.data
        }
        // 异常状态下，把错误信息返回去
        return {
            status: -404,
            message: '服务器繁忙，请稍后再试或联系管理员'
        }
    }
}

function checkCode(res) {
    // 如果code异常(这里已经包括网络错误，服务器错误，后端抛出的错误)，可以弹出一个错误提示，告诉用户
    // console.log(res, 'checkCode')
    if (res.status === -404) {
        // Vue.prototype.$message({
        //   type: 'warning',
        //   message: '页面找不到了……'
        // })
        // alert(res.data.msg)
    }
    if (res.data) {
        if (res.data.code === -44444 || res.data.code === -44445) {
            // alert(res.data.message)
            // this.$message({
            //     type: 'warning',
            //     message: res.data.message,
            //     duration: 2500
            // })
            setInterval(() => {
                // 强制退出登录清空数据
                store.dispatch('LogOut').then(() => {
                    // 刷新页面
                    window.location.reload()// In order to re-instantiate the vue-router object to avoid bugs
                })
            }, 1000)
        }
    }
    return res
}

// 下载导出excel 文件
export function exportMethod(data) {
    axios({
        method: data.method,
        // url: `${data.url}${data.params ? '?' + data.params : ''}`,
        url: `${data.url}?orderAttribute=${data.param.orderAttribute}`,
        // headers:data.token,
        headers: {
            'token': data.token
        },
        form: data.param,
        responseType: 'blob'
    }).then((res) => {
        const link = document.createElement('a')
        let blob = new Blob([res.data], { type: 'application/vnd.ms-excel' })
        link.style.display = 'none'
        link.href = URL.createObjectURL(blob)

        // link.download = res.headers['content-disposition'] //下载后文件名
        link.download = data.fileName //下载的文件名
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }).catch(error => {
        this.$Notice.error({
            title: '错误',
            desc: '网络连接错误'
        })
        // console.log(error)
    })
}

export default {
    // get 请求
    get(url, data) {
        return axios({
            method: 'get',
            url: baseUrl.baseUrl + url,
            params: data,
            headers: {
                token: getToken(),
                userId: getUserId(),
            }
        }).then(response => {
            // console.log(response.data.errorCode)
            if (response.data.errorCode == 'SYS.0015') {
                // this.$message({
                //     message: '登录失效',
                //     type: 'warning'
                // })
                // 强制退出登录清空数据
                window.localStorage.removeItem("userId");
                window.localStorage.removeItem("token");
                // this.$store.dispatch("user/logout");
                // this.$router.push(`/login?redirect=${this.$route.fullPath}`);
                setTimeout(() => {
                    window.location.reload()// In order to re-instantiate the vue-router object to avoid bugs
                }, 1000);
            } else {
                return response.data;
            }
        }).catch(err => {
            console.log(err)
            return checkCode(res)
        })
    },


    // post 请求
    post(url, data) {
        return axios({
            method: 'post',
            url: baseUrl.baseUrl + url,
            data: qs.stringify(data),
            dataType: 'json',
            headers: {
                token: getToken(),
                userId: getUserId()
            }
        })
            .then(response => {
                // return checkStatus(response)
                if (response.data.status == '500' || response.data.errorCode == 'SYS.0015') {
                    // 强制退出登录清空数据
                    window.localStorage.removeItem("userId");
                    window.localStorage.removeItem("token");
                    // this.$store.dispatch("user/logout");
                    // this.$router.push(`/login?redirect=${this.$route.fullPath}`);
                    setTimeout(() => {
                        window.location.reload()// In order to re-instantiate the vue-router object to avoid bugs
                    }, 1000);
                } else {
                    return response.data;
                }
            })
            .then(res => {
                return checkCode(res)
            })
    },
    // post 请求
    post1(url, data) {
        return axios({
            method: 'post',
            url: baseUrl.baseUrl + url,
            data: data,
            dataType: 'json',
            headers: {
                token: getToken(),
                userId: getUserId()
            }
        })
            .then(response => {
                // return checkStatus(response)
                if (response.data.errorCode == 'SYS.0015') {
                    // 强制退出登录清空数据
                    // this.$message({
                    //     message: response.data.errorCode || '系统错误',
                    //     type: 'warning'
                    // })
                    window.localStorage.removeItem("userId");
                    window.localStorage.removeItem("token");
                    // this.$store.dispatch("user/logout");
                    // this.$router.push(`/login?redirect=${this.$route.fullPath}`);
                    setTimeout(() => {
                        window.location.reload()// In order to re-instantiate the vue-router object to avoid bugs
                    }, 1000);
                } else {
                    return response.data;
                }
            })
            .catch(err => {
                return checkCode(err)
            })
    },




    // 导出使用的方法
    postReport({ url, data }) {
        return axios({
            method: 'post',
            baseURL: baseUrl.baseUrl + url,
            url: url,
            data: data,
            dataType: 'json',
            timeout: 120000
        })
            .then(response => {
                return checkStatus(response)
            })
            .then(res => {
                return checkCode(res)
            })
    },



    postFile({ url, data }) {
        return axios({
            method: 'post',
            baseURL: baseUrl.baseUrl + url,
            url: url,
            data: data,
            dataType: 'json',
            timeout: 120000
        })
            .then(response => {
                return checkStatus(response)
            })
            .then(res => {
                return checkCode(res)
            })
    },



    getFile({ url, data }) {
        return axios({
            method: 'get',
            baseURL: baseUrl.baseUrl + url,
            url: url,
            data: data,
            dataType: 'jsonp',
            timeout: 120000
        })
            .then(response => {
                return checkStatus(response)
            })
            .then(res => {
                return checkCode(res)
            })
    },

}
