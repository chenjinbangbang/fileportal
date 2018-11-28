import Mock from 'mockjs';
import { param2Obj } from '@/utils';

export default {
  //获取登录设置
  getSetting: config => {
    return {
      error_code: 0,
      data: {
        sia: 1
      }
    }
  },
  //系统登录设置
  systemSetting: config => {
    let { sia } = JSON.parse(config.body);
    return {
      error_code: 0,
      data: {
        sia
      }
    }
  }
};



