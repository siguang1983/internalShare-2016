<style>
	html,body,.content_box { width: 100%; height: 100% }
	.content_box{ overflow: hidden; }
	.login_bg {  width: 100%; height: 100%; background: url(../assets/images/main_bg.jpg) no-repeat; background-size: cover;
		animation: sss 50s;
		-webkit-animation: sss 50s;
	}
	.logo { width: 124px; height: 35px; background: url(../assets/images/logo.png) no-repeat; position: absolute; top: 30px; left: 30px; }
	.login_box { width: 650px; height: 400px; position: absolute; top: 50%; left: 50%; background-color: rgba(0,0,0,0.2); margin: -200px 0 0 -325px; z-index: 10; border-radius: 4px; }
	.head_photo { width: 100px; height: 100px; background-color: rgba(255,255,255, .9); border-radius: 60px; position: absolute; top: -60px; left: 50%; margin-left: -60px; }
	.login_content { padding-top: 80px; }
	.w80 { width: 80%; margin: 0 auto; }
	.inp_txt, .login_btn { width: 100%; height: 50px; border-radius: 10px;  border-style: none; margin-top: 20px; }
	.inp_txt {background-color: rgba(255, 255,255, .9); padding: 0 10px; font-size: 16px; color: #000; }
	.inp_txt_reg { width: 100%; height: 45px; border-radius: 10px;  border-style: none; margin-top: 10px; background-color: rgba(255, 255,255, .9); border:1px #ccc solid; padding: 0 10px; font-size: 16px; color: #000; }
	.login_btn{ width: 100%; height: 50px; color: #fff; margin-top: 40px; background-color: #2196f3; font-size: 20px; cursor: pointer;  }
	.register_ref { width: 80%; padding: 15px 20px 0 0; text-align: right; color: #fff; margin: 0 auto; font-size: 14px; }
	.register_ref a, .register_ref a:hover { color: #fff; }
	.up_title { color: #777474; font-size: 16px; font-style: normal; } 
	input[type=file]{ padding: 10px 0; }
</style>

<template>
	<div class="content_box">
	
		<div class="login_bg"></div>
		<div class="logo"></div>
		<div class="login_box">
			<div class="head_photo">
				<img src="../assets/images/head.png" alt="">
			</div>

			<div class="login_content">
				<p class="w80"><input type="text" name="username" id="username" class="inp_txt" value="" v-model="username" placeholder="请输入用户名"></p>
				<p class="w80"><input type="password" name="password" id="password" class="inp_txt" value="" v-model="password"  placeholder="请输入密码"></p>
				<p class="w80"><input type="button" class="login_btn" id="sendLogin" @click="sendLogin()" value="登  录"></p>
			</div>

			<div class="register_ref">
				<a href="javascript:void(0)" @click="showRegister()">立即注册</a>
			</div>
		</div>
	
		<asides :show.sync="showRight" placement="right" header="立即注册" :width='asideWidth'>
			<form id="regForm" enctype="multipart/form-data" method="post" action="" >
				<p>
					<input type="text" name="rUsernames" class="inp_txt_reg" placeholder="输入用户名" value="" v-model="rUsername" />
				</p>
				<p>
					<input type="password" name="rPasswords" class="inp_txt_reg" placeholder="输入密码" value="" v-model="rPassword" />
				</p>
				<p>
					<input type="password" name="resetPasswords" class="inp_txt_reg" placeholder="再次输入密码" value="" v-model="resetPassword" />
				</p>
				<p>
					<input type="text" name="phones" maxlength="13" class="inp_txt_reg" placeholder="输入手机号码" value="" v-model="rPhone" />
				</p>
				<p>
					<h3 class='up_title'>上传头像: </h3>
					<input type="file" name="upfile" id="upfile" value="" />
					<button class="btn btn-info btn-xs" @click="uploadPhoto()" type="button">上 传</button>
					<input type="hidden" name="hadeFilePath" id="hadeFilePath" v-model="headPicture" value="" >
				</p>
				<p>
					<input type="button" class="login_btn" id="sendRegister" @click="sendRegister()" value="注 册">
				</p>
			</form>
		</asides>
	</div>
</template>

<script>

	import { aside } from 'vue-strap'
	
	export default {
		data(){
			return {
				// 登录
				username: '',
				password: '',
				showRight: false,
				asideWidth: 400,

				// 注册
				rUsername: '',
				rPassword: '',
				resetPassword: '',
				rPhone: '',
				upfile: '',
				headPicture: ''
			}
		},
		components: {
			asides: aside
		},
		methods: {
			showRegister(){
				this.showRight = true;
			},
			sendLogin(){
				var that = this;

				if(this.username == '' || this.password == ''){
					alert('用户名密码不能为空');
					return false;
				}

				if(this.username.length < 6){
					alert('用户名不能小于6个字符');
					return false;
				}

				if(this.password.length < 6){
					alert('密码不能小于6个字符');
					return false;
				}

				$.ajax({
					url: '/operate/login',
					type: 'GET',
					data: {'username': that.username, 'password': that.password},
					dataType: 'json',
					success: (response) =>{
						console.log(response);
						debugger;

						if(response.status){	// 登录成功
							
							// 存储登录信息
							localStorage.setItem('auth', JSON.stringify(response.data));
							location.href = '/#/dish';
						}
						else{
							alert(response.message);
						}
					},
					error: (err) => {
						console.log(err)
					}
				})

			},

			// 上传头像
			uploadPhoto(){
				let that = this;
				let oData = new FormData($('#regForm')[0]);

		        $.ajax({
		            url: "/operate/upHeadFile",
		            type: "post",
		            data: oData,
		            dataType: 'json',
		            contentType: false,
		            processData: false,  // 告诉jQuery不要去处理发送的数据
		            success: function(response){
		                console.log(response);

		                var hiddenFilePath = $("#hadeFilePath");
		                if(response.statue){
		                	that.headPicture = response.photoUrl;
		                    alert('上传成功')
		                }
		                else{
		                    alert(response.message);
		                    that.headPicture = '';
		                }
		            },
		            error: function(err){
		                console.log(err);
		            }
		        });
			},

			// 提交注册
			sendRegister(){
				let that = this;

				if(that.rUsername == ''){
					alert('用户名不能为空');
					return false;
				}

				if(that.rPassword == ''){
					alert('密码不能为空');
					return false;
				}

				 if(that.rPassword != that.resetPassword){
		            alert('两次密码输入不一致');
		            return false;
		        }

		        if(that.rPhone == ''){
		            alert('手机不能为空');
		            return false;
		        }

		        if(that.headPicture == ''){
		            alert('请先上传头像');
		            return false;
		        }

		        $.ajax({
		        	url: '/operate/userRegister',
		        	type: 'post',
		        	data: {
		        		username: that.rUsername,
		                password: that.rPassword,
		                phone: that.rPhone,
		                headPicture: that.headPicture
		        	},
		        	dataType: 'json',
		        	success: (response) => {
		        		console.log('注册', response);
		        		if(response.statue){
		        			alert('注册成功');
		        			that.clearRister();
		        		}
		        		else{
		        			alert(response.message);
		        		}
		        	},
		        	error: (err)=>{
		        		alert(err)
		        	}
		        })
			},

			clearRister(){
				this.rUsername = '';
				this.rPassword = '';
				this.resetPassword = '';
				this.rPhone = '';
				this.headPicture = '';
				this.showRight = false;
			}
		}		
	}

</script>

