import Mock from 'mockjs';
import loginAPI from './login';
import logsAPI from './logs';
import systemAPI from './system';


// 登录相关
Mock.mock(/\/api\/user\/login/, 'post', loginAPI.loginByEmail);
Mock.mock(/\/api\/user\/info/, 'get', loginAPI.getInfo);
Mock.mock(/\/api\/user\/logout/, 'post', loginAPI.logout);

//操作日志
Mock.mock(/\/api\/logs\/list/,'post',logsAPI.getLogsList);

Mock.mock(/\/user\/file\.*/, 'get', loginAPI.getFile)

//系统设置
Mock.mock(/\/api\/system\/getSetting/,'get',systemAPI.getSetting);
Mock.mock(/\/api\/system\/login/,'post',systemAPI.systemSetting);

export default Mock;
