<style>
	.nav { height: 60px; background-color: #242b3c; }
	.logo_txt { padding: 0 15px; line-height: 60px; font-size: 16px; color: #fff; float: left; }
	.nav_list { padding-left: 20px; float: left; }
	.nav_list li { line-height: 60px; color: #fff; cursor: pointer; padding: 0 20px; float: left; }
	.nav_list li.active { background-color: #000; }
	.nav_user_box { float: right; color: #fff; margin-right: 25px; }
	.nav_user_box span { display: inline-block; vertical-align: middle; line-height: 60px; }
	.nav_userhead { padding-right: 10px; }
	.nav_userhead img { width: 40px; height: 40px; border-radius: 20px; border: 1px #000 solid; }
	.user_info_split { padding: 0 13px; }
	a.signout { color: #fff; font-size: 12px;}
	a:hover.signout { color: #fff; }
</style>

<template>
	<div class="nav">
		<div class="logo_txt">黑卡服务平台</div>
		
		<div class="nav_list">
			<ul>
				<li :class="{'active': menuList.active}" v-for="menuList in menuName" @click="jumpRouter(menuList.link)">{{ menuList.title}}</li>
			</ul>
		</div>

		<div class="nav_user_box">
			<span class="nav_userhead">
				<img :src="userInfo.userPhoto" alt="" />
			</span>
			<span>
				{{ userInfo.username }} <i class="user_info_split">|</i> <a href="javascript:void(0)" class="signout" @click="logout()" >退出</a>
			</span>
		</div>
	</div>
</template>

<script>
	
	export default{

		data(){
			return {
				currentActive: '/dish',
				userInfo: {
					username: '',
					userPhoto: ''
				},
				menuName: [
					{
						title: '菜品列表',
						link: 'dish',
						active: true
					},
					{
						title: '通知提醒',
						link: 'menu',
						active: false
					},
					{
						title: '订单管理',
						link: 'order',
						active: false
					},
					{
						title: '客服管理',
						link: 'service',
						active: false
					},
					{
						title: '话术配置',
						link: 'speechcraft',
						active: false
					}
				]
			}
		},

		methods: {
			getUserInfo(){
				var info = JSON.parse(localStorage.getItem('auth'));

				if(!info){
					location.href = "/#/login";
				}
				else{
					this.userInfo.username = info.username;
					this.userInfo.userPhoto = info.headPicture;
				}
			},

			logout(){

				localStorage.removeItem('auth');
				alert('已退出登录');
				this.$router.push({ path: 'login' })

				// $.ajax({
				// 	url: '/logout',
				// 	type: 'get',
				// 	data: {},
				// 	dataType: 'json',
				// 	success: (response) => {
				// 		if(response.status){
				// 			debugger
				// 			alert('已退出登录');
				// 			localStorage.removeItem('auth');
				// 		}
				// 		else{
				// 			alert(response.message);
				// 		}
				// 	},
				// 	error: (err) => {
				// 		alert(err);
				// 	}
				// })
			},

			jumpRouter(link){
				debugger;

				console.log(link);
				this.$router.push({ path: link })
			}
		},

		mounted(){
			this.getUserInfo();
		}
	}

</script>