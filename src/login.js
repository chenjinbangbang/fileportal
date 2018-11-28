import router from './router'
import store from './store'
import vue from 'vue'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css' // Progress 进度条样式
import { getToken } from '@/utils/auth';

//权限判断
function hasPermission(roles, permissionRoles) {
	if (roles.indexOf('super') >= 0) return true // admin权限 直接通过
	if (!permissionRoles) return true
	return roles.some(role => permissionRoles.indexOf(role) >= 0)
}

// register global progress.
const whiteList = ['/login', '/authredirect'] // 不重定向白名单
router.beforeEach((to, from, next) => {
	//console.log(from);
	//console.log(to);

	NProgress.start() // 开启Progress
	if (getToken()) { // 判断是否有access_token
		//已登录
		if (to.path === '/login') {
			next({
				path: '/'
			})
		} else {

			if (store.getters.roles.length === 0) { // 判断当前用户是否已拉取完user_info信息
				store.dispatch('GetInfo').then(res => { // 拉取user_info
					const roles = res.data.roles;
					console.log(`获取用户角色成功：${roles}`);
					store.dispatch('GenerateRoutes', {
						roles
					}).then(() => { // 生成可访问的路由表	
						console.log('正在访问生成的路由表');
						console.log(store.getters.addRouters);

						router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
						next({ 
							...to
						}) // hack方法 确保addRoutes已完成
					})
				}).catch(() => {
					console.log('获取用户失败！！！');
					setTimeout(() => {
						store.dispatch('FedLogOut').then(() => {
							console.log('跳转到/login');
							next({
								path: '/login'
							})
						})
					}, 1000);


				})
			} else {
				store.dispatch('getNowRoutes', to);
				if (hasPermission(store.getters.roles, to.meta.role)) {

					//console.log(to.path);
					let roles = store.getters.roles;
					//console.log(store.getters.roles);

					//根据根目录设置重定向
					// if (to.path === '/') {
					// 	switch (roles) {
					// 		case roles.indexOf('super') >= 0:
					// 			next({ path: '/introduction' });
					// 			break;
					// 		case roles.indexOf('filemanager') >= 0:
					// 			next({ path: '/filemanager' });
					// 			break;
					// 		case roles.indexOf('filelist-u') >= 0:
					// 			next({ path: '/introduction' });
					// 			break;
					// 		default:
					// 			break;
					// 	}
					// }

					next();
					console.log("获取用户完成");
				} else {
					//console.log('1111');
					next({
						path: '/',
						query: {
							noGoBack: true
						}
					})
				}
			}



		}
	} else {
		//未登录
		if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
			console.log(`${to.path}：白名单进入`);
			next()
		} else {
			console.log(`重定向到/login`);
			next('/login') // 否则全部重定向到登录页
			NProgress.done() // 在hash模式下 改变手动改变hash 重定向回来 不会触发afterEach 暂时hack方案 ps：history模式下无问题，可删除该行！
		}
	}
})

router.afterEach(() => {
	NProgress.done() // 结束Progress
})