<template>
	<view class="login-container">
		<!-- 	<view class="login-nav-bar">
			<image class="arrow-back" @tap="backLogin" src="@/static/theme/default/nav_icon_back_black.png" mode="">
			</image>
		</view> -->
		<!-- 		<view class="login-title">注册用户</view> -->
		<view class="login-logo">
			<image src="@/static/login/logo.png" alt=""></image>
		</view>
		<view class="login-form">
			<view class="request">{{$t('in.reg.do_reg')}}</view>
			<view class="request-none">{{$t('in.reg.sub_title')}}</view>
			<view class="form-item">
				<text class="item-lable">
					<!-- 电话 -->
					<image src="../../static/login/call.png" mode=""></image>
				</text>
				<input class="item-input" v-model="form.username" :placeholder="$t('in.common.p_input_phone')" />
			</view>
			<view class="form-item">
				<text class="item-lable">
					<image src="../../static/login/lock.png" mode=""></image>
				</text>
				<input class="item-input" v-model="form.sms_code" :placeholder="$t('in.common.p_input_code')" />
				<button class="code" @tap="getCode" v-if="showText">{{$t('in.common.l_get_code')}}</button>
				<button class="code" v-else>{{second}} {{$t('in.common.l_resend')}}</button>
			</view>
			<view class="form-item">
				<text class="item-lable">
					<!-- 锁 -->
					<image src="../../static/login/lock.png" mode=""></image>
				</text>
				<input class="item-input" v-if="close_icon" type="password" v-model="form.password"
					:placeholder="$t('in.common.p_input_pass')" />
				<input class="item-input" v-else type="text" v-model="form.password"
					:placeholder="$t('in.common.p_input_pass')" />
				<view class="login-icon" @tap="close_icon = !close_icon">
					<image v-if="close_icon" src="@/static/login/close.png" mode=""></image>
					<image v-else src="@/static/login/open.png" mode=""></image>
				</view>
			</view>

			<button :class="['landing',checkIn ? 'landing_true' : 'landing_false']" :disabled="checkIn ? false : true"
				class="zai-btn" @tap="subReg">{{$t('in.reg.do_reg')}}
			</button>
			<view class="zai-login-item" @click="backLogin">{{$t('in.reg.back_login')}}</view>
		</view>
		<view class="login-bottom">
			<text class="tips" @tap="goPath">{{$t('in.reg.detail')}}</text>
		</view>
		<uni-popup ref="popup" type="confirm">
			<uni-popup-confirm :title="$t('newAdd.warm_notice')" :beforeClose="true" @close="close" :content="popuMsg" @confirm="confirm">
			</uni-popup-confirm>
		</uni-popup>
	</view>
</template>

<script>
	import uniPopup from '../../components/uni-popup/uni-popup.vue';
	import uniPopupConfirm from '../../components/uni-popup/uni-popup-confirm.vue';
	import _get from "../../common/_get";
	import _data from "../../common/_data";
	export default {
		data() {
			return {
				miaoqiang: 'tests',
				popuMsg: this.$t("in.common.l_register_success"),
				showPassword: true,
				showText: true,
				second: 60,
				form: {
					mobileCode: 1,
					username: '',
					password: '',
					client_id: '',
					sms_code: '',
					type: 'REGISTER',
				},
				close_icon: true,
				is_sended: false
			}
		},
		components: {
			uniPopup,
			uniPopupConfirm
		},
		onLoad(options) {
			// 存储邀请码参数
			console.log("options", options)
			if (options.invite_code) {
				uni.setStorageSync("invite_code", options.invite_code)
			}
		},
		onShow() {
			let _this = this;
			_get.getSysConfig({}, function(res) {
				if (res.user_regiter_sms_status == 1) {
					_this.form.mobileCode = 1
				} else {
					_this.form.mobileCode = 0
				}
				_this.form.mobileCode = 1
			})

			// #ifdef APP-PLUS
			// plus.push.getClientInfoAsync(function(info) {
			// 	_this.form.client_id = info.clientid;
			// }, function(e) {
			// 	console.log('Failed');
			// 	console.log(JSON.stringify(e));
			// });
			// #endif
		},
		computed: {
			checkIn() {
				return this.is_sended && this.form.sms_code != '' && this.form.password != '' && this.form.username != '' && this.form.password.length > 5 && this.form
					.username.length > 5;
			}
		},
		methods: {
			backLogin() {
				uni.navigateBack({

				})
			},
			goPath() {
				uni.navigateTo({
					'url': '/pages/in/web'
				})
			},
			close() {
				let _this = this;
				uni.reLaunch({
					url: '../chat/index',
					success: function() {
						_this.$refs.popup.close();
					}
				});
			},
			confirm(e) {
				let _this = this;
				uni.redirectTo({
					url: '/pages/my/details',
					success: function() {
						_this.$refs.popup.close();
					}
				});
			},
			isPoneAvailable($poneInput) {
				let myreg = /^\d{6,15}$/;
				if (!myreg.test($poneInput)) {
					return false;
				} else {
					return true;
				}
			},
			getCode() {
				let _this = this;
				if (this.form.username.trim() == '') {
					uni.showToast({
						title: _this.$t("in.common.p_input_phone"),
						icon: 'none'
					});
					return false;
				}

				if (!this.isPoneAvailable(this.form.username.trim())) {
					uni.showToast({
						title: _this.$t("in.common.p_input_correct_phone"),
						icon: 'none'
					});
					return false;
				}
				
				_this.$httpSend({
				 	path: '/im/in/isRegist',
				 	data: _this.form,
				 	success: (data) => {
						_get.getSms({
							mobile: _this.form.username,
							type: 'REGISTER'
						}, function(res) {
							console.log(22222)
							_this.is_sended = true;
							_this.cutDown();
						}, function(res) {
							console.log(1111)
							uni.showToast({
								title: res.msg,
								duration: 2000,
								icon: 'none'
							});
						})
					},
					fail_callback: (err) => {
						uni.hideLoading();
						uni.showToast({
							icon: 'none',
							title: err.msg
						})
					},
					fail: (err) => {
						uni.hideLoading();
					}
				})
			},
			cutDown(val) { //倒计时
				//获取验证码
				this.showText = false;
				var interval = setInterval(() => {
					let times = --this.second;
					times = times < 0 ? 0 : times;
					this.second = times < 10 ? '0' + times : times //小于10秒补 0
				}, 1000)
				setTimeout(() => {
					clearInterval(interval)
					this.second = 60
					this.showText = true
				}, 60000)
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
			subReg() {
				let _this = this;
				if (!_this.checkIn) {
					return;
				}
				if (!(/^\w{1,20}$/.test(this.form.username))) {
					uni.showModal({
						// content: '密聊号只能包括下划线、数字、字母,并且不能超过20个',
						content: _this.$t("in.common.p_phone_len")
					});
					return;
				}

				if (!(/^\w{1,20}$/.test(this.form.password))) {
					uni.showModal({
						// content: '密码只能包括下划线、数字、字母,长度6-20位',
						content: _this.$t("in.common.p_pass_len")
					});
					return;
				}
				let channelCode = _data.localData('xInstallChannelCode');
				if (channelCode) {
					_this.form.channel = channelCode;
				}
				/* uni.showModal({
				     content: "xxx2:"+channelCode,
				     showCancel: false,
				 }); */
				_this.$httpSend({
				 	path: '/im/in/isRegist',
				 	data: _this.form,
				 	success: (data) => {
						uni.navigateTo({
							url: './finish?username=' + _this.form.username + "&password=" + _this.form.password + "&sms_code=" + _this.form.sms_code
						})
					},
					fail_callback: (err) => {
						uni.hideLoading();
						uni.showToast({
							icon: 'none',
							title: err.msg
						})
					},
					fail: (err) => {
						uni.hideLoading();
					}
				})

				// uni.navigateTo({
				// 	url: './finish?username=' + _this.form.username + "&password=" + _this.form.password
				// })
				return

				uni.showLoading({
					title: _this.$t("in.reg.do_reg")
				})
				_this.$httpSend({
					path: '/im/in/reg',
					data: _this.form,
					success: (data) => {
						uni.setStorage({
							key: 'token',
							data: data.token,
							fail: () => {
								uni.showModal({
									// content: '本地存储数据不可用!',
									content: _this.$t("set.frozen.local_data_cant_use")
								});
							},
							success() {
								_this.$socketSend({
									action: 'checkToken',
									data: data.token,
								}, function() {
									uni.hideLoading();
									_this.$refs.popup.open();
									// uni.reLaunch({
									// 	url: '../chat/index',
									// });
								})

							},
						});
					}
				});
			},
			go_forget() {
				uni.navigateTo({
					url: '../../pages/in/forget'
				})
			},
			go_register() {
				uni.navigateTo({
					url: '../../pages/in/reg'
				})
			}

		}
	}
</script>

<style scoped lang="scss">
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

	.login-nav-bar {

		height: 44px;
		display: flex;
		align-items: center;
		position: absolute;
		justify-content: flex-start;
		left: 0;
		top: 0;
		/* #ifdef APP-PLUS */
		top: var(--status-bar-height);

		/* #endif */
		.arrow-back {
			width: 44rpx;
			height: 44rpx;
			margin-left: 20rpx;
		}
	}


	.login-container {
		background-color: #ffffff;
		height: 100vh;
		width: 100vw;
		position: relative;
		box-sizing: border-box;
		// background-image: url(@/static/login/bg.png);
		box-sizing: border-box;

		.login-form {
			display: flex;
			position: absolute;

			flex-direction: column;
			border: 1px solid #fff;
			width: 94vw;
			background: linear-gradient(180deg, rgba(255, 255, 255, 0.86) 0%, #FFFFFF 100%);
			z-index: 100;
			box-shadow: 0px 1px 8px 0px rgba(82, 90, 102, 0.12), 0px 1px 2px 0px rgba(82, 90, 102, 0.04);
			border-radius: 20px 20px 20px 20px;
			top: 400rpx;
			left: 50%;
			transform: translateX(-50%);
			padding-bottom: 20rpx;

			.request {
				// width: 96rpx;
				height: 64rpx;
				font-size: 48rpx;
				margin-left: 40rpx;
				margin-top: 40rpx;
				font-weight: 500;
				color: #1b315A;

			}

			.request-none {
				color: gray;
				margin-left: 40rpx;
				margin-top: 20rpx;
			}

			.login-bottom {
				// display: flex;
				// justify-content: space-between;
				// align-items: center;
				// height: 100rpx;
				position: fixed;
				bottom: 0;
				left: 50%;
				transform: translateX(-50%);
				display: flex;
				justify-content: center;
				align-items: center;
				width: 100vw;


				.login-random {
					text-decoration: none;
					color: #999;
					font-size: 14px;
				}

				.tips {
					// font-size: 12px;
					// color: #b5746c;
					// height: 60rpx;
					// line-height: 60rpx;
					// text-align: center;
					// width: 100%;
				}

			}

			.login-btn {
				width: 100%;
				height: 100rpx;
				border-radius: 50px;
				background-color: #2da2fd;
				color: #fff;
				font-size: 16px;
				display: flex;
				justify-content: center;
				align-items: center;
				margin-top: 100rpx;
			}

			.form-item {
				width: 606rpx;
				height: 80rpx;
				margin-left: 40rpx;
				display: flex;
				margin-top: 40rpx;
				align-items: center;
				border-bottom: 1px solid #eee;

				.item-lable {
					font-size: 16px;
					color: #333;
					width: 180rpx;
				}

				.item-lable image {
					width: 40rpx;
					height: 40rpx;
				}

				.item-input {
					border: none;
					outline: none;
					background: none;
					font-size: 16px;
					color: #000;
					height: 100%;
					flex: 1;
					margin-left: -100rpx;
				}
			}
		}

		.login-title {
			padding-top: 250rpx;
			font-size: 24px;
			font-weight: bold;
			padding-bottom: 150rpx;
		}

		.login-logo {
			position: absolute;
			top: 0;
			left: 50%;
			transform: translateX(-50%);
			width: 100vw;
			height: 260px;
			background: linear-gradient(315deg, #685BED 0%, #2F63FF 100%);
			border-radius: 0px 0px 20px 20px;
			display: flex;
			justify-content: center;
			align-items: center;
		}

		.login-logo image {
			width: 150rpx;
			height: 150rpx;
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
		margin-top: 114upx;
	}

	.zai-title {
		position: absolute;
		top: 0;
		line-height: 360upx;
		font-size: 68upx;
		color: #fff;
		text-align: center;
		width: 100%;
		margin-left: -100upx;
	}

	.zai-form {
		margin-top: 150upx;
	}

	.form-code {
		margin-top: 30upx;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100%;
	}

	.form-code .code {
		height: 100%;
		border-radius: 50px;
		text-align: center;
		font-size: 14px;
		line-height: 50px;
		background: #ff65a3;
		color: #ffffff;
	}

	.zai-input {
		background: #e2f5fc;
		margin-top: 30upx;
		border-radius: 100upx;
		padding: 20upx 40upx;
		font-size: 36upx;
	}

	.code-input {
		background: #e2f5fc;
		border-radius: 100upx;
		padding: 20upx 40upx;
		font-size: 36upx;
		width: 40%;
	}

	.input-placeholder,
	.zai-input {
		color: #94afce;
	}

	.zai-label {
		text-align: center;
		font-size: 30upx;
		color: #666;
		height: 120rpx;
		display: flex;
		align-items: center;
		text-align: left;
	}

	.zai-btn {
		// background: #2da2fd;
		background: linear-gradient(315deg, #685BED 0%, #2F63FF 100%);
		border: 0;
		border-radius: 50rpx;
		font-size: 16px;
		color: #fff !important;
		width: 100%;
		height: 100rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 606rpx;
		height: 80rpx;
		margin-top: 60rpx;

	}

	.zai-btn:after {
		border: 0;
	}

	/*按钮点击效果*/
	.zai-btn.button-hover {
		transform: translate(1upx, 1upx);
	}

	.zai-footer {
		display: flex;
		justify-content: center;
		align-items: center;
		color: #a7b6d0;
		padding-top: 10px;
	}

	.zai-login-item {
		font-size: 30rpx;
		color: darkgray;
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 10rpx auto 0;
	}

	.zai-login {
		font-size: 30rpx;
		color: darkgray;
		margin-left: 280rpx;
		margin-top: 30rpx;
	}

	.login-bottom {
		position: fixed;
		bottom: 40rpx;
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100vw;

		.tips {
			font-size: 28rpx;
			color: darkgray;
		}
	}
	.form-item .code{
		height: 100%;
		border-radius: 50px;
		text-align: center;
		font-size: 28rpx;
		line-height: 80rpx;
		background: #6dcef7;
		color: #ffffff;
	}
</style>