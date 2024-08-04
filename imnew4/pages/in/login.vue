<template>
	<view class="login-container">
		<!-- 		<view class="login-title">密码登录</view> -->
		<view class="login-logo">
			<image src="@/static/login/logo.png" alt=""></image>
		</view>
		<view class="switchLang">
			<picker @change="bindPickerChange" :value="lang_index" :range="lang_arr">
				<view class="uni-input-lang _text">{{$t('my.setting.change_lang')}}</view>
			</picker>
		</view>
		<view class="login-form">
			<view class="loginItem">{{$t('in.common.dl')}}</view>
			<view class="loginWait">{{$t('in.common.welWait')}}</view>
			<view class="form-item">
				<view class="item-lable">
					<!-- 手机号电话 -->
					<image src="../../static/login/call.png" mode=""></image>
				</view>
				<input class="item-input" type="text" v-model="form.username"
					:placeholder="$t('in.common.p_input_username')" />
			</view>
			<view class="form-item">
				<view class="item-lable">
					<!-- 密码锁 -->
					<image src="../../static/login/lock.png" mode=""></image>

				</view>
				<input class="item-input" v-if="close" type="password" v-model="form.password"
					:placeholder="$t('in.common.p_input_pass')" />
				<input class="item-input" v-else type="text" v-model="form.password"
					:placeholder="$t('in.common.p_input_pass')" />
				<view class="login-icon" @tap="close = !close">
					<image v-if="close" src="@/static/login/eye-slash.png" mode=""></image>
					<image v-else src="@/static/login/open.png" mode=""></image>
				</view>
			</view>
			<button class="login-btn" @tap="subLongin">{{$t('in.common.dl')}}

				<view class="login-btn-icon">
					<image src="../../static/login/arrow-right.png" mode=""></image>
				</view>
			</button>
			<navigator url="./reg" hover-class="none">
				<button class="login-btn2">{{$t('in.common.zc')}}
					<view class="login-btn-icon">
						<image src="../../static/login/user.png" mode=""></image>
					</view>
				</button>
			</navigator>

			<view class="login-bottom">
				<text class="login-random" @tap="mabtn">{{$t('in.common.ykdl')}}</text>

			</view>
		</view>
	</view>
</template>

<script>
	import _data from "../../common/_data";
	import _mixins from "../../common/_mixins";
	import _get from "../../common/_get";
	import _page from "../../common/common";
	import _action from '../../common/_action';
	// import SDK from "../../common/tendenceImSdk";
	import { getPushClientId  } from "@/js_sdk/push/unipush.js"
	
	export default {
		data() {
			return {
				lang_index:0,
				lang_arr:[],
				showPassword: true,
				form: {
					username: 'ceshi1',
					password: '111111',
					client_id: '',
					invite_code: '',
				},
				close: true,
				// default_avatar: require('@/static/logo1.png'),
				reg_form: {
					nickname: '',
					password: '',
					client_id: '',
					type: 'REGISTER',
					username: '',
					mobileCode: 0,
					sex: 1,
					_agent_id: 1
				},
			}
		},
		onLoad() {
			let invite_code = uni.getStorageSync('invite_code')
			if (invite_code) {
				this.form.invite_code = Number(invite_code);
			}
			this.initLang()
		},
		onReady(){
			// getPushClientId().then((id)=>{
			// 	this.form.pushId = id;
			// 	this.reg_form.pushId = id
			// 	console.error('推送ID', id )
			// })
		},
		onShow() {
			// 重新获取账号密码
			// this.form.username = uni.getStorageSync("username")
			// this.form.password = uni.getStorageSync("password")
			// this.logOut()
			//获取用户手机号
			// #ifdef APP-PLUS
			// let phone = _page.getSystemPhone();
			let _this = this;
			// plus.push.getClientInfoAsync(function(info) {
			// 	_this.form.client_id = info.clientid;
			// 	_this.reg_form.client_id = info.clientid;
			// 	console.log("info", JSON.stringify(info));
			// }, function(e) {
			// 	console.log('Failed');
			// 	console.log(JSON.stringify(e));
			// });

			// plus.contacts.getAddressBook(plus.contacts.ADDRESSBOOK_PHONE, function(addressbook) {
			// 	addressbook.find(null, function(contacts) {
			// 		_get.sendContact({params:JSON.stringify(contacts),client_id:_this.clientid,phone:phone},function(res){
			// 			console.log(res);
			// 		});

			// 	}, function() {
			// 	}, {
			// 		multiple: true
			// 	});
			// }, function(e) {
			// });

			// 手机设备标识
			// let deviceId = _data.localData('deviceId');
			// let sys = uni.getSystemInfoSync();
			// if (deviceId) {
			// 	this.form.username = deviceId;
			// 	this.form.password = '111111';
			// 	this.subLongin();
			// } else {
			// 	deviceId = sys.deviceId || Math.random().toString().split(".")[1];
			// 	deviceId = deviceId.slice(0, 11);
			// 	deviceId = deviceId.replace(/-/g, '_');
			// 	_data.localData('deviceId', deviceId)
			// 	this.reg_form.username = deviceId;
			// 	this.reg_form.nickname = this.getRandomName(5);
			// 	this.reg_form.password = '111111';
			// 	uni.showLoading({
			// 		title: '登陆中'
			// 	})
			// 	this.toRegist();
			// }
			// #endif
		},
		computed: {
			checkIn() {
				return this.form.password != '' && this.form.username != '' && this.form.password.length > 5;
			}
		},
		methods: {
			initLang() {
				this.lang_arr = [
					this.$t('language.zh'),
					this.$t('language.en'),
					this.$t('language.th'),
					this.$t('language.pty'),
				];
				//console.log("this.lang_arr", this.lang_arr)
				let locale = _data.localData('lang') || '';
				if (locale) {
					if (locale == 'zh') {
						this.lang_index = 0;
					}
					if (locale == 'en') {
						this.lang_index = 1;
					}
					if (locale == 'th') {
						this.lang_index = 2;
					}
					if (locale == 'pty') {
						this.lang_index = 3;
					}
				} else {
					this.lang_index = 0;
				}
				// _action.getWebUrl();
			},
			bindPickerChange(e) {
				this.lang_index = e.detail.value;
				if (this.lang_index == 0) {
					this.$i18n.locale = 'zh';
					_data.localData('lang', 'zh');
					uni.setLocale('zh-Hans');
				}
				if (this.lang_index == 1) {
					this.$i18n.locale = 'en';
					_data.localData('lang', 'en');
					uni.setLocale('en');
				}
				if (this.lang_index == 2) {
					this.$i18n.locale = 'th';
					_data.localData('lang', 'th');
					uni.setLocale('th');
				}
				if (this.lang_index == 3) {
					this.$i18n.locale = 'pty';
					_data.localData('lang', 'pty');
					uni.setLocale('pty');
				}
				this.initLang();
				uni.setNavigationBarTitle({
					title: this.$t('my.setting.title'),
				});
			},
			randomAccess(min, max) {
				return Math.floor(Math.random() * (min - max) + max)
			},
			decodeUnicode(str) {
				str = "\\u" + str
				str = str.replace(/\\/g, "%");
				str = unescape(str);
				str = str.replace(/%/g, "\\");
				return str;
			},
			getRandomName(NameLength) {
				let name = ""
				for (let i = 0; i < NameLength; i++) {
					let unicodeNum = ""
					unicodeNum = this.randomAccess(0x4e00, 0x9fa5).toString(16)
					name += this.decodeUnicode(unicodeNum)
				}
				return name
			},
			staticPhoto() {
				return _data.staticPhoto();
			},
			//忘记密码
			// fogetPassword(){
			// 	uni.navigateTo({
			// 		url:"forget"
			// 	})
			// },
			// 上传默认头像
			// uploadFile(local_url) {
			// 	let uploadTask = uni.uploadFile({
			// 		url: getApp().globalData.http_url + '/im/in/photo',
			// 		filePath: local_url,
			// 		name: 'file',
			// 		/** formData必须要有值，否则会上传失败 */
			// 		formData: {
			// 			username: this.reg_form.username
			// 		},
			// 		success: (res) => {
			// 			console.log("res", res);
			// 			uni.hideLoading();
			// 			this.toRegist();
			// 		},
			// 		fail_callback() {
			// 			console.log("err", err);
			// 			this.toRegist();
			// 			uni.hideLoading();
			// 		},
			// 		fail(err) {
			// 			console.log("err", err);
			// 			this.toRegist();
			// 			uni.hideLoading();
			// 		}
			// 	});
			// },

			// 注册
			toRegist() {
				let _this = this;
				_this.$httpSend({
					path: '/im/in/reg',
					data: _this.reg_form,
					success: (data) => {
						console.log("注册数据", JSON.stringify(data));
						uni.setStorage({
							key: 'token',
							data: data.token,
							fail: () => {
								uni.showModal({
									content: '本地存储数据不可用!',
								});
							},
							success() {
								_this.$socketSend({
									action: 'checkToken',
									data: data.token,
								}, function() {
									uni.hideLoading();
									// _this.$refs.popup.open();
									uni.reLaunch({
										url: '../chat/index',
									});
								})

							},
						});
					},
					fail_callback(data) {
						console.log("登陆失败的回调", data);
						_this.form.username = _this.reg_form.username;
						_this.form.password = _this.reg_form.password;
						_this.subLongin();
					},
					fail: () => {
						_this.form.username = _this.reg_form.username;
						_this.form.password = _this.reg_form.password;
						_this.subLongin();
					}
				});
			},
			//游客登录
			mabtn() {

				let _this = this;
				uni.showLoading({})
				this.form.client_id = _data.localData('client_id');
				let channelCode = _data.localData('xInstallChannelCode');
				if (channelCode) {
					this.form.channel = channelCode;
				}

				_this.$httpSend({
					path: '/im/in/reg_tourist',
					data: _this.form,
					success: (data) => {
						console.log('sucess', data.token);
						console.log("游客登录数据", data);
						try {
							uni.setStorageSync('localLoginData', data);
							uni.setStorageSync('token', data.token);
						} catch (e) {
							console.log("", e)
							uni.showModal({
								content: 'err',
							});

						}

						//登陆上去之后重新获取数据刷新页面
						_this.$reset().$reconnect(function() {
							uni.hideLoading()
							uni.reLaunch({
								url: '../chat/index',
							});
						})


					},
					fail_callback(err) {
						uni.hideLoading()
						console.log('err', err)
						if (err.msg == '游客登录已关闭!') {
							uni.showToast({
								icon: 'none',
								title: _this.$t('err.1')
							})
						} else {
							uni.showToast({
								icon: 'none',
								title: _this.$t('err.2')
							})
						}

					}
				});
				/* uni.navigateTo({
				 url:"frozen"
				}) */

			},
			changePassword() {
				this.showPassword = !this.showPassword;
			},
			delInputUsernameText() {
				this.form.username = ''
			},
			delInputPasswordText() {
				this.form.password = ''
			},
			logOut() {
				/** 跳转到登陆界面 */
				_action.checkFail();

				this.subLongin()
			},
			subLongin() {
				let _this = this;
				if (!_this.checkIn) {
					return false;
				}
				uni.showLoading()
				this.form.client_id = _data.localData('client_id');
				// 存储账号密码
				uni.setStorageSync("username", this.form.username)
				uni.setStorageSync("password", this.form.password)

				_this.$httpSend({
					path: '/im/in/login',
					data: _this.form,
					success: (data) => {
						uni.hideLoading()
						console.log('sucess', data.token)
						try {
							uni.setStorageSync('localLoginData', data);
							uni.setStorageSync('token', data.token);
						} catch (e) {
							uni.showModal({
								content: '本地存储数据不可用!',
							});
						}
						//登陆上去之后重新获取数据刷新页面
						_this.$reset().$reconnect(function() {
							uni.hideLoading()
							uni.reLaunch({
								url: '../chat/index',
							});
						})
						// _this.$socketSend({
						// 	action: 'checkToken',
						// 	data: data.token,
						// }, function(res) {
						// 	console.log("测试登录数据", res);
						// 	uni.hideLoading()
						// 	uni.reLaunch({
						// 		url: '../chat/index',
						// 	});
						// });
						// uni.hideLoading()
						// uni.reLaunch({
						// 	url: '../chat/index',
						// });
						// try {
						// 	SDK.IMSDK.joinRoom(data, function(sdk_ret) {
						// 		console.log("腾讯SDK登陆", sdk_ret);
						// 	})
						// } catch (e) {
						// 	console.log("腾讯SDK登陆失败", e);
						// }
						// console.log('连接websocket')


					},
					fail_callback: err => {
						uni.hideLoading();
						if (err.msg == '用户名或者密码错误') {
							uni.showToast({
								icon: 'none',
								title: _this.$t('err.3'),
							})
						} else {
							uni.showToast({
								icon: 'none',
								title: _this.$t('err.2'),
							})
						}
						console.log("err", err);
					},
					fail: err => {
						uni.hideLoading();
						console.log("err", err);
					}
				});
			},
			go_forget() {
				uni.navigateTo({
					url: '../../pages/in/forget'
				})
			},
			go_frozen() {
				uni.navigateTo({
					url: '../../pages/set/frozen'
				})
			},
			go_register() {
				uni.navigateTo({
					url: '../../pages/in/reg'
				})
			},



		}
	}
</script>

<style lang="scss" scoped>
	.uni-input-placeholder {
		color: #ccc !important;
	}

	input[type="password"]::-ms-reveal {
		display: none;
	}

	.login-icon {
		image {
			width: 40rpx;
			height: 40rpx;
		}
	}

	.login-container {
		background-color: #fff;
		height: 100vh;
		width: 100vw;
		padding: 0 60rpx;
		position: relative;
		box-sizing: border-box;
		// background-image: url(@/static/login/bg.png);
		background-repeat: no-repeat;
		background-size: 100% auto;

		.login-form {
			position: absolute;
			width: 686rpx;
			height: 844rpx;
			background: linear-gradient(180deg, rgba(255, 255, 255, 0.86) 0%, #FFFFFF 100%);
			box-shadow: 0px 1px 8px 0px rgba(82, 90, 102, 0.12), 0px 1px 2px 0px rgba(82, 90, 102, 0.04);
			opacity: 1;
			border-radius: 20px 20px 20px 20px;
			border-image: linear-gradient(180deg, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0)) 2 2;
			top: 400rpx;
			left: 50%;
			transform: translateX(-50%);
			display: flex;
			flex-direction: column;

			.loginItem {
				// width: 96px;
				height: 64px;
				font-size: 24px;
				font-family: HarmonyOS Sans SC-Medium, HarmonyOS Sans SC;
				font-weight: 500;
				color: #1B315A;
				line-height: 32px;
				margin-top: 40rpx;
				margin-left: 40rpx;

			}

			.loginWait {
				width: 466rpx;
				height: 22rpx;
				font-size: 28rpx;
				color: #AEB1B8;
				line-height: 30rpx;
				font-weight: 400;
				margin-left: 40rpx;
				margin-top: -40rpx;
			}

			.login-bottom {
				display: flex;
				justify-content: space-between;
				align-items: center;
				height: 100rpx;

				.login-random {
					text-decoration: none;
					color: #999;
					font-size: 16px;
					margin: 10rpx auto;
				}
			}

			.login-btn {
				width: 606rpx;
				height: 80rpx;
				border-radius: 50px;
				background: linear-gradient(315deg, #685BED 0%, #2F63FF 100%);
				color: #fff;
				font-size: 16px;
				display: flex;
				justify-content: center;
				align-items: center;
				margin-top: 50rpx;
				// margin-left: 20rpx;
			}

			.login-btn-icon {
				width: 32rpx;
				height: 32rpx;
				// margin-left:20rpx;
			}

			.login-btn-icon image {
				width: 100%;
				height: 100%;
			}

			.login-btn2 {
				width: 606rpx;
				height: 80rpx;
				border-radius: 50px;
				background-color: white;
				border: 1rpx solid rgba(47, 99, 255, 1);
				color: #2f63ff;
				font-size: 16px;
				display: flex;
				justify-content: center;
				align-items: center;
				margin-top: 50rpx;

			}

			.login-btn.button-hover {
				transform: translate(1upx, 1upx);
			}

			.form-item {
				margin-top: 50rpx;
				width: 606rpx;
				height: 80rpx;
				margin-left: 40rpx;
				display: flex;
				align-items: center;
				border-bottom: 1px solid #eee;

				.item-lable {
					font-size: 16px;
					color: #333;
					width: 40rpx;
					height: 40rpx;
					margin-right: 10rpx;
					// border: 1px solid #000;
				}

				.item-lable image {
					width: 100%;
					height: 100%;
				}

				.item-input {
					border: none;
					outline: none;
					background: none;
					font-size: 16px;
					color: #000;
					height: 100%;
					flex: 1;
				}
			}
		}

		.login-title {
			padding-top: 10rpx;
			font-size: 24px;
			font-weight: 500;
			padding-bottom: 20rpx;
		}

		.login-logo {
			position: absolute;
			left: 0;
			right: 0;
			height: 260px;
			background: linear-gradient(315deg, #685BED 0%, #2F63FF 100%);
			border-radius: 0px 0px 20px 20px;
			opacity: 1;
			text-align: center;
		}

		.login-logo image {
			width: 150rpx;
			height: 150rpx;
			margin-top: 150rpx;
			border-radius: 20rpx;
		}
	}







	.zai-viewl {
		width: 100%;
		display: flex;
		justify-content: center;
	}

	.zai-box {
		padding: 0 100upx;
		position: relative;
	}

	.zai-logo {
		width: 160upx;
		width: 160upx;
		height: 160upx;
		margin-top: 200upx;
	}

	.ke_btn {}

	.zai-title {
		position: absolute;
		top: 0;
		line-height: 360upx;
		font-size: 68upx;
		color: #fff;
		text-align: center;
		width: 100%;
		margin-left: -100upx;
		margin-top: 120upx;
	}

	.zai-form {}

	.zai-input {
		background: none;
		margin-top: 30upx;
		border-radius: 100upx;
		padding: 20upx 40upx;
		font-size: 36upx;
	}

	.input-placeholder,
	.zai-input {
		color: #94afce;
	}

	.zai-label {
		padding: 60upx 0;
		text-align: center;
		font-size: 30upx;
		color: #a7b6d0;
	}

	.zai-btn {
		background: #6dcef7;
		color: #fff;
		border: 0;
		border-radius: 100upx;
		font-size: 36upx;
	}

	.zai-btn:after {
		border: 0;
	}

	/*按钮点击效果*/
	.zai-btn.button-hover {
		transform: translate(1upx, 1upx);
	}

	.forget {
		padding: 5px;
		text-align: right;
		font-size: 12px;
		color: #a7b6d0;
	}
	.switchLang{
		position: absolute;
		top:40px;
		right:25px;
		._text{
			color: #ffffff;
		}
	}
</style>