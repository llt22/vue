import axios from 'axios'
import router from '../router/index'
import {
  Message,
  Loading
} from 'element-ui'
// const ConfigBaseURL = 'http://192.168.1.105:9092'
const ConfigBaseURL = 'http://api-dev.portzj.com' //默认路径，这里也可以使用env来判断环境
let loadingInstance = null //这里是loading
//使用create方法创建axios实例

export const Service = axios.create({
  timeout: 5000, // 请求超时时间
  baseURL: ConfigBaseURL, //根路径
  withCredentials: false
})

// 添加请求拦截器
Service.interceptors.request.use(config => {
  //创建loading.....
  loadingInstance = Loading.service({
    lock: true,
    text: 'loading...'
  })

  // 设置请求头token
  const TOKEN = window.sessionStorage.getItem('token')
  if (TOKEN) {
    config.headers['token'] = TOKEN;
  }
  return config
}, error => {
  Promise.reject(error);
})

Service.interceptors.response.use(response => {

  loadingInstance.close()

  let token = response.headers.token;
  if (token) {
    window.sessionStorage.setItem('token', token)
  }
  const {
    code
  } = response.data;

  switch (code) {
    case "0001":
      setTimeout(() => {
        router.replace({
          path: "/login"
        })
      }, 2000)
      break;
  }
  return Promise.resolve(response)
}, error => {

  loadingInstance.close()
  return Promise.reject(error)
})