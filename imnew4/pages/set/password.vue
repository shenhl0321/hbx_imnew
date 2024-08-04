<template>
	<view>
		<view class="uni-common-mt">
			<view class="uni-form-item uni-column">
				<view class="title">{{$t('change_password.yuan')}}</view>
				<view class="with-fun">
					<input class="uni-input" :placeholder="$t('change_password.tip')" :password="showPassword[0]"
						v-model="formData.pass1" />
					<view class="uni-icon uni-icon-eye" :class="[!showPassword[0] ? 'uni-active' : '']"
						@click="changePassword(0)"></view>
				</view>
			</view>
			<view class="uni-form-item uni-column">
				<view class="title">{{$t('change_password.xin')}}</view>
				<view class="with-fun">
					<input class="uni-input" :placeholder="$t('change_password.tip')" :password="showPassword[1]"
						v-model="formData.pass2" />
					<view class="uni-icon uni-icon-eye" :class="[!showPassword[1] ? 'uni-active' : '']"
						@click="changePassword(1)"></view>
				</view>
			</view>
			<view class="uni-form-item uni-column">
				<view class="title">{{$t('change_password.c_xin')}}</view>
				<view class="with-fun">
					<input class="uni-input" :placeholder="$t('change_password.tip')" :password="showPassword[2]"
						v-model="formData.pass3" />
					<view class="uni-icon uni-icon-eye" :class="[!showPassword[2] ? 'uni-active' : '']"
						@click="changePassword(2)"></view>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
	import _action from '../../common/_action';
	import _hook from '../../common/_hook';

	export default {
		data() {
			return {
				showPassword: [true, true, true],
				formData: {
					pass1: '',
					pass2: '',
					pass3: '',
				}
			}
		},
		computed: {

		},
		onShow() {
			uni.setNavigationBarTitle({
				title: this.$t('change_password.title')
			})
			_hook.routeSonHook();
		},
		onLoad() {
			this.platform = uni.getSystemInfoSync().platform
		},
		methods: {
			changePassword(num) {
				this.$set(this.showPassword, num, !this.showPassword[num]);
			},
			send() {
				let _this = this;
				if (!_this.formData.pass1 || _this.formData.pass1.length < 6) {
					uni.showModal({
						content: _this.$t('set.pass.old_pass_length')
					});
					return;
				}
				if (!_this.formData.pass2 || _this.formData.pass2.length < 6) {
					uni.showModal({
						content: _this.$t('set.pass.new_pass_length')
					});
					return;
				}
				if (!_this.formData.pass3 || _this.formData.pass3.length < 6) {
					uni.showModal({
						content: _this.$t('set.pass.confirm_new_pass_length')
					});
					return;
				}
				if (_this.formData.pass2 !== _this.formData.pass3) {
					uni.showModal({
						content:  _this.$t('set.pass.two_new_pass_incorrect')
					});
					return;
				}
				_this.$httpSend({
					path: '/im/set/password',
					data: _this.formData,
					success() {
						uni.showToast({
							icon:'none',
							title: _this.$t('set.pass.update_success')
						});
						setTimeout(() => {
							_this.loginOut()
						}, 1500);
					}
				});
			},
			loginOut() {
				/** 跳转到登陆界面 */
				_action.checkFail();
				// _data.data("socket_state",0)
				// #ifdef APP-PLUS
				// 登出 原生插件
				uni.$TUICallKit.logout();
			
				plus.runtime.restart();
				// #endif
				// #ifdef H5
				window.location.reload()
				// uni.reLaunch({
				// 	url: '/pages/in/login'
				// });
				// #endif
			
			},
		},
		onNavigationBarButtonTap(e) {
			this.send();
		},
	}
</script>

<style scoped>
	.title {
		padding: 10upx 25upx;
		font-weight: 600;
	}

	.uni-icon-clear,
	.uni-icon-eye {
		color: #999;
	}
</style>