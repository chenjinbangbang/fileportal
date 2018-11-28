import Vue from 'vue';
import Router from 'vue-router';
const _import = require('./_import_' + process.env.NODE_ENV);
import Full from '@/containers/Full'

// Views - Pages
import Page404 from '@/views/errorPages/Page404'

/* login */
const Login = _import('login/index');
Vue.use(Router);

export const constantRouterMap = [{
		path: '/login',
		component: Login,
		hidden: true
	},
	{
		path: '/pages',
		redirect: '/pages/p404',
		name: 'Pages',
		component: {
			render(c) {
				return c('router-view')
			}
			// Full,
		},
		children: [{
			path: '404',
			name: 'Page404',
			component: _import('errorPages/Page404')
		}]
	}

]

export default new Router({
	mode: 'history',
	linkActiveClass: 'open active',
	scrollBehavior: () => ({
		y: 0
	}),
	routes: constantRouterMap
});

export const asyncRouterMap = [

	{
		path: '/',
		//redirect: '/region',
		name: '首页',
		component: Full,
		hidden: false,
		children: [{
				path: 'region',
				name: '站点文件列表',
				icon: 'android-list',
				component: _import('region'),
				meta: {
					role: ['filemanager']
				}
			}, {
				path: 'client',
				name: '客户端文件列表',
				icon: 'android-list',
				hidden: true,
				component: _import('client')
			}, {
				path: 'filelist',
				name: '文件列表',
				icon: 'android-list',
				hidden: true,
				component: _import('filelist')
			},
			{
				path: 'filelist-u',
				name: '用户文件列表',
				icon: 'android-list',
				component: _import('filelist2'),
				meta: {
					role: ['filebrowser']
				}
			},
			{
				path: 'introduction',
				name: '日志管理',
				icon: 'android-calendar',
				component: _import('Introduction'),
				meta: {
					role: ['super']
				}
			},
			{
				path: 'systemsetup',
				name: '系统设置',
				component: _import('systemsetup'),
				icon: 'android-settings',
				hidden: false,
				meta: {
					role: ['super']
				}
			},
			{
				path: 'managing',
				name: '用户管理',
				component: _import('managing'),
				icon: 'person-stalker',
				meta: {
					role: ['super']
				}
			},
			{
				path: 'video',
				name: '视频管理',
				component: _import('video'),
				icon: 'person-stalker',
				hidden: true,
				meta: {
					role: ['super']
				}
			}
			
		]
	},
	// {
	// 	path: '*',
	// 	redirect: '/pages/404',
	// 	hidden: true
	// }

];