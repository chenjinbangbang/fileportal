import request from '@/utils/request'; //axios默认配置
import qs from 'qs';

//获取登录设置
export function getSetting() {
  return request({
    url: '/system/getSetting',
    method: 'get'
  })
}

//系统登录设置
export function systemSetting(data) {
  return request({
    url: '/system/login',
    method: 'post',
    data
  })
}

