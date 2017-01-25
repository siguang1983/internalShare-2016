import Vue from 'vue'
import VueRouter from 'vue-router'
import vueResource from 'vue-resource'

// import register from './components/register'
import login from './components/login'
import dish from './components/dish'
import menu from './components/menu'

require('./assets/css/hk_base.css');
require('./assets/css/bootstrap/css/bootstrap.min.css');

// 将路由插件加载到Vue中
Vue.use(VueRouter);
Vue.use(vueResource);

// 路由配置
const routes = [
	{ 
		path: '/login', 
		component: login,
		meta: {
			user: false
		}
	},
	{
		path: '/dish', 
		component: dish,
		meta: {
			user: true
		}
	},
	{
		path: '/menu', 
		component: menu,
		meta: {
			user: true
		}
	},
	{
		path: '/*',
		redirect: '/login',
		meta: {
			user: true
		}
	}
]

// 创建路由实例
const router = new VueRouter({
	routes // （缩写）相当于 routes: routes
})

// 路由钩子
router.beforeEach((to, from, next) => {
	console.log(to);
	console.log(from);

	if(to.meta.user){	// 是否需要检测登录
		if(!localStorage.getItem('auth')){
			router.push('/login');
		}
		else{
			next();
		}
	}
	else{
		next();
	}
})

new Vue({
	el: '#app',
	router
})
