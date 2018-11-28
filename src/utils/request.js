import axios from 'axios';
import store from '../store';
import vue from 'vue';
import qs from 'qs';
import { getToken } from '@/utils/auth'
import { Message } from 'iview';

// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 15000                  // 请求超时时间
});

// request拦截器
service.interceptors.request.use(config => {

  config.data = qs.stringify(config.data);
  //console.log(config.data);

  if (getToken()) {
    config.headers['Authorization'] = 'Bearer ' + getToken();
  }

  return config;
}, error => {
  // Do something with request error
  console.log(error); // for debug
  Promise.reject(error);
})

// respone拦截器
service.interceptors.response.use(
  response => {
    
    let res = response.data;

    //异常提示
    if (res.error_code > 0) {
      Message.error(res.data);
    }

    return res;
  },
  error => {
    console.log('err' + error);// for debug
    Message.error({
      content: error.message,
      closable: true
    });
    return Promise.reject(error);
  }
)

export default service;
