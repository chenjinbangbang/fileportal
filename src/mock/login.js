import { param2Obj } from 'utils';

const userMap = {
  super: {
    role: ['super'],
    token: 'super',
    introduction: '超级管理员',
    name: '管理员',
    uid: '001'
  },
  filemanager: {
    role: ['filemanager'],
    token: 'filemanager',
    introduction: '文件管理用户',
    name: '文件管理',
    uid: '002'
  },
  filebrowser : {
    role: ['filebrowser'],
    token: 'filebrowser',
    introduction: '查看用户',
    name: '普通用户',
    uid: '003'
  }
}

export default {
  loginByEmail: config => {
    const { email } = JSON.parse(config.body);
      return userMap[email.split('@')[0]];
  },
  getInfo: config => {
    const { token } = param2Obj(config.url);
    if (userMap[token]) {
      return userMap[token];
    } else {
      return Promise.reject('a');
    }
  },
  logout: () => 'success'
};
