import { login,facecompareidcard, logout, getInfo } from 'api/login';
import { getToken, setToken, removeToken } from '@/utils/auth';

import md5 from 'js-md5';
//import Cookies from 'js-cookie';

const user = {
  state: {
    access_token: getToken(),
    refresh_token: '',
    expires_in: 0,
    sia: 0,

    username: '',
    id_number: '',
    roles: [],

    file: '',

    // user: '',
    // status: '',
    // email: '',
    // code: '',
    // uid: undefined,
    // auth_type: '',
    // token: Cookies.get('Admin-Token'),
    // name: '',
    // avatar: '',
    // introduction: '',
    // roles: [],
    // setting: {
    //   articlePlatform: []
    // }
  },

  mutations: {
    SET_ACCESS_TOKEN: (state, access_token) => {
      state.access_token = access_token;
    },
    SET_REFRESH_TOKEN: (state, refresh_token) => {
      state.refresh_token = refresh_token;
    },
    SET_EXPIRES_IN: (state, expires_in) => {
      state.expires_in = expires_in;
    },
    SET_SIA: (state, sia) => {
      state.sia = sia;
    },
    SET_USERNAME: (state, username) => {
      state.username = username;
    },
    SET_ID_NUMBER: (state, id_number) => {
      state.id_number = id_number;
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles;
    },
    SET_FILE: (state,file) => {
      state.file = file;
    }
  },

  actions: {
    // 用户登录
    login({ commit }, userInfo) {
      const id_number = userInfo.id_number.trim();
      const password = md5(userInfo.password.trim());

      return new Promise((resolve, reject) => {
        login({ id_number, password }).then(res => {

          if (res.error_code === 0) {
            commit('SET_ACCESS_TOKEN', res.data.access_token);
            commit('SET_REFRESH_TOKEN', res.data.refresh_token);
            commit('SET_EXPIRES_IN', Date.now() + res.data.expires_in * 1000);
            commit('SET_SIA', res.data.sia);
            commit('SET_USERNAME', res.data.username);
            setToken(res.data.access_token, res.data.refresh_token, Date.now() + res.data.expires_in * 1000, res.data.sia);
          }
          resolve(res);
        }).catch(error => {
          reject(error);
        });
      });
    },

    //强认证-人脸核身
    facecompareidcard({ commit }, userInfo) {
      const id_number = userInfo.id_number.trim();
      const username = userInfo.username.trim();
      const faceimage = userInfo.faceimage.trim();

      return new Promise((resolve, reject) => {
        facecompareidcard({ id_number, username,faceimage }).then(res => {

          if (res.error_code === 0) {
            commit('SET_ACCESS_TOKEN', res.data.access_token);
            commit('SET_REFRESH_TOKEN', res.data.refresh_token);
            commit('SET_EXPIRES_IN', Date.now() + res.data.expires_in * 1000);
            commit('SET_SIA', res.data.sia);
            setToken(res.data.access_token, res.data.refresh_token, Date.now() + res.data.expires_in * 1000, res.data.sia);
          }
          resolve(res);
        }).catch(error => {
          reject(error);
        });
      });
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo(state.token).then(res => {
          //console.log(res);
          if (res.error_code === 0) {
            commit('SET_USERNAME', res.data.username);
            commit('SET_ID_NUMBER', res.data.id_number);
            commit('SET_ROLES', res.data.roles);
          }
          resolve(res);
        }).catch(error => {
          reject(error);
        });
      });
    },

    // 登出
    LogOut({ commit, state }) {
      console.log(state)
      return new Promise((resolve, reject) => {
        logout(state.access_token).then(res => {
          if (res.error_code === 0) {
            commit('SET_USERNAME', '');
            commit('SET_ID_NUMBER', '');
            commit('SET_ROLES', []);
            removeToken();
          }
          resolve();
        }).catch(error => {
          reject(error);
        });
      });
    },

    // // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_USERNAME', '');
        commit('SET_ID_NUMBER', '');
        commit('SET_ROLES', []);
        removeToken();
        resolve();
      });
    },

  }
};

export default user;
