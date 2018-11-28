import request from '@/utils/request'; //axios默认配置
import { encrypt } from '@/utils/encrypt';

//获取用户列表，查询
export function getUserList(data) {

  //处理searchkeys
  let searchkeys = JSON.stringify(data.searchkeys);
  data = {
    page: data.page,
    limit: data.limit,
    searchkeys
  };

  return request({
    url: '/user/list',
    method: 'post',
    data
  })
}

//添加用户
export function createUser(data) {

  data = JSON.parse(JSON.stringify(data)); //解耦

  data.password = encrypt(data.password);
  let roles = JSON.stringify(data.roles);
  data.roles = roles;
  //console.log(data);

  return request({
    url: '/user/create',
    method: 'post',
    data
  });
}

//获取某个用户信息
export function getUserInfo(data) {
  return request({
    url: '/user/getinfo',
    method: 'get',
    params: data
  });
}

//更新用户
export function updateUser(data) {

  data = JSON.parse(JSON.stringify(data)); //解耦

  let roles = JSON.stringify(data.roles);
  data.roles = roles;
  //console.log(data);

  return request({
    url: '/user/update',
    method: 'post',
    data
  });
}

//重置用户密码
export function resetUserPwd(data) {
  //data.password = encrypt(data.password);
  //console.log(data);
  return request({
    url: '/user/resetpwd',
    method: 'post',
    data
  });
}

//删除用户
export function deleteUser(data) {
  return request({
    url: '/user/delete',
    method: 'post',
    data
  });
}

//发送短信验证码
export function sendEmail(data) {
  return request({
    url: '/user/forgotpasswordstep1',
    method: 'post',
    data
  });
}

//设置新的密码
export function newUserPwd(data) {
  data.password = encrypt(data.password);
  return request({
    url: '/user/forgotpasswordstep2',
    method: 'post',
    data
  });
}

//验证当前用户密码
export function validPwd(data) {

  data = {
    password: encrypt(data.password)
  };

  return request({
    url: '/user/validPwd',
    method: 'post',
    data
  });
}

//修改密码
export function changePwd(data) {

  data = {
    password: encrypt(data.password),
    newpwd: encrypt(data.newpwd),
  };

  return request({
    url: '/user/changepwd',
    method: 'post',
    data
  });
}

//获取用户已授权列表
export function accredit_list(data) {
  return request({
    url: '/user/accredit_list',
    method: 'get',
    params: data
  });
}

