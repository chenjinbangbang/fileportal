import { asyncRouterMap, constantRouterMap } from 'src/router';
function hasPermission(roles, route) {
    if (route.meta && route.meta.role) {
        return roles.some(role => route.meta.role.indexOf(role) >= 0)
    } else {
        return true
    }
}
function filterAsyncRouter(asyncRouterMap, roles) {
    //console.log(asyncRouterMap);
    const accessedRouters = asyncRouterMap.filter(route => {
        if (hasPermission(roles, route)) {
            if (route.children && route.children.length) {
                route.children = filterAsyncRouter(route.children, roles)
            }
            return true
        }
        return false
    })
    return accessedRouters
}
function getNowRouter(asyncRouterMap, to) {
    return asyncRouterMap.some(route => {
        if (to.path.indexOf(route.path) !== -1) {
            return true;
        } else if (route.children && route.children.length) { //如果有孩子就遍历孩子
            return getNowRouter(route.children, to)
        }
    })
}
const permission = {
    state: {
        routers: constantRouterMap,
        addRouters: [],
        siderbar_routers: [],
    },
    mutations: {
        SET_ROUTERS: (state, routers) => {
            //console.log(routers);
            state.addRouters = routers;
            state.routers = constantRouterMap.concat(routers);
        },
        SET_NOW_ROUTERS: (state, to) => {

            state.addRouters.forEach(e => {
                if (e.children && e.children.length) {
                    if (getNowRouter(e.children, to) === true)
                        state.siderbar_routers = e;
                }
            })
        }
    },
    actions: {

        //访问生成的路由表
        GenerateRoutes({ commit }, data) {
            return new Promise(resolve => {
                const { roles } = data
                let accessedRouters;
                accessedRouters = filterAsyncRouter(asyncRouterMap, roles);
                //console.log(roles);

                //首页重定向根据用户权限更改，防止出现无路由跳转到404页面问题
                accessedRouters[0].redirect = roles.indexOf('super') >= 0 ? '/introduction' : (roles.indexOf('filemanager') >= 0 ? '/region' : '/filelist-u');
                //                  if (roles.indexOf('super') >= 0) {            
                //                      accessedRouters = asyncRouterMap;
                //                  } else {
                //                      accessedRouters = filterAsyncRouter(asyncRouterMap, roles);
                //                  }

                commit('SET_ROUTERS', accessedRouters);
                resolve();
            })
        },
        getNowRoutes({ commit }, data) {
            return new Promise(resolve => {
                //data => to
                commit('SET_NOW_ROUTERS', data);
                resolve();
            })
        },
    },
};

export default permission;