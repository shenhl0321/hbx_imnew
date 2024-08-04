<template>
	<view class="page">
		<view class="flex align-center " style="background-color: white;">
			<image @tap="backGo" src="../../../static/share/zuojiantou.png" style="width: 35rpx;
			height: 35rpx; margin-top: 35rpx; margin-left: 20rpx; " mode=""></image>
			<text style="color: black; font-size: 40rpx;margin-left: 150rpx;" class="fonts">{{$t('top.jymm')}}</text>
		</view>

		<view class="content">
			<uni-list class="list">
				<uni-list-item ref="uitem" :title="$t('trade_password.set_pay_pwd')" :show-arrow="true"
					:showArrow="true" @tap="goPath(path)" />
				<!-- <uni-list-item :title="$t('my.wallet.trade_password.forgotPas')" :show-arrow="true" :showArrow="true"
					@tap="goPath('/pages/my/foget_trade_password')" /> -->
			</uni-list>
		</view>
	</view>
</template>

<script>
	import _hook from '../../../common/_hook';
	import _data from '../../../common/_data';
	import _get from '../../../common/_get';
	import ulist from '../../../components/uni-list/uni-list'
	import uitem from '../../../components/uni-list-item/uni-list-item'

	export default {
		data() {
			return {
				set_msg: this.$t('newAdd.p_input_trade_pass'),
				set_info:this.$t('newAdd.p_input_trade_pass_to_confirm'),
				password: '',
				show_key: false,
				showCose: true,
				user_info: {}
			}
		},
		components: {
			ulist,
			uitem
		},
		computed: {
			title() {
				return this.user_info.trade_password ? this.$t('newAdd.update_pass') : this.$t('newAdd.set_pass');
			},
			path() {
				return this.user_info.trade_password ? '../set/edit_trade_password' : '../set/set_trade_password';
			}
		},
		onShow() {
			_hook.routeSonHook();
			let _this = this;

			_get.getUserInfo({}, function(data) {
				_this.user_info = data;
			});

			if (!_this.user_info.length) {
				_this.user_info = _data.data('user_info');
			}

		},
		methods: {
			backGo() {
				uni.switchTab({
					url: '/pages/chat/index'
				})
			},
			goPath(path) {
				if (path) {
					uni.navigateTo({
						url: path
					});
				}
			}
		}
	}
</script>

<style>
	.content .list {
		/* margin-top: 20upx; */
	}

	.flex {
		width: 100%;
		height: 100rpx;
	}
</style>