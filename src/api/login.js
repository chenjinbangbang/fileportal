import request from 'utils/request';

//用户登录
export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  });
}

//强认证-人脸核身
export function facecompareidcard(data) {
  return request({
    url: '/user/facecompareidcard',
    method: 'post',
    data
  });
}

//获取用户信息
export function getInfo() {
  return request({
    url: '/user/info',
    method: 'get'
  });
}

//用户登出
export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  });
}

// export function getFile(fileid) {
//   return fetch({
//     url: '/user/file',
//     method: 'get',
//     data: fileid
//   });
// }



