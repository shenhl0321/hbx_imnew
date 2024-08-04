<template>
	<view class="page">
		<view class="content">
			<view @tap="backGo" class="flex align-center " style="background-color: #62aba2;position: relative;">
				<image src="../../../static/share/zuojiantou.png" style="width: 35rpx;
				height: 35rpx; margin-top: 35rpx; margin-left: 20rpx; " mode=""></image>
				<text
					style="color: black; font-size: 40rpx;position: absolute;left: 50%;top:50%;transform: translate(-50%,-50%);width: 100%;text-align: center;"
					class="fonts">{{$t('top.jymm')}}</text>
			</view>

			<view class="title">

				<text style="color: black; font-size: 40rpx;">{{$t('my.wallet.sfk.fk')}}</text>
				<!-- <view class=""style="color: black; margin-left: 50rpx;">{{$t('my.wallet.sfk.fkm')}}</view> -->


			</view>
			<view class="content-main">
				<view class="content-main-info">
					<text>{{$t('my.wallet.sfk.fk_txm')}}</text>
				</view>
				<view class="content-main-barcode">
					<tki-barcode ref="barcode" :show="true" :val="getVal" :loadMake="true" :opations="opations"
						@result="barresult" />
				</view>
				<view class="content-main-qrCode">
					<tki-qrcode ref="qrcode" :val="getVal" :onval="true" :size="300" :iconSize="65" unit="upx"
						background="#ffffff" foreground="#000000" pdground="#000000" :loadMake="true"
						:showLoading="true" :loadingText="$t('chat.message.index.loading')" @result="qrR" />
				</view>
			</view>
			<view class="footer-msg" @tap="goPath('pay_out')">
				<view class="info">
					<image src="/static/theme/default/my/shoukuan.png"></image>
					<text>{{$t('my.wallet.sfk.ewm_sk')}}</text>
				</view>
				<uni-icons :size="20" class="uni-icon-wrapper" color="white" type="arrowright" />
			</view>
		</view>
	</view>
</template>
<script>
	import _hook from '../../../common/_hook';
	import _data from '../../../common/_data';
	import _page from '../../../common/common';
	import tkiQrcode from "../../../components/tki-qrcode/tki-qrcode.vue";

	export default {
		data() {
			return {
				opations: {
					width: 4, //设置条之间的宽度
					height: 120, //高度
					displayValue: false, //是否在条形码下方显示文字
					text: "", //覆盖显示的文本
					background: "#FFFFFF", //设置条形码的背景色
					margin: 0, //设置条形码周围的空白边距
				},
				img_path: '',
				my_data: {
					id: 0
				}
			}
		},
		components: {
			tkiQrcode
		},
		onLoad() {

		},
		onShow() {
			_hook.routeSonHook();
			let _this = this;
			setTimeout(function() {
				_this.$refs.barcode._makeCode();
			}, 2000)
			/** 监听新的个人数据 */
			uni.$on('data_user_info', function(data) {
				_this.my_data = data;
			});
			_this.my_data = _data.data('user_info');
		},
		computed: {
			getVal() {
				//付款码
				let params = {};
				params.user_id = this.my_data.id;
				return _page.qrAction.toPage('/pages/my/pay/collect_amount', params);
			},
			qrPhoto() {
				return _data.data('cache').local_photo;
			},
			myPhoto() {
				return _data.staticPhoto() + this.my_data.photo;
			}

		},
		methods: {
			backGo() {
				uni.switchTab({
					url: '/pages/chat/index'
				})
			},
			qrR(ref) {
				this.img_path = ref;
				return ref;
			},
			barresult(res) {
				return res;
			},
			goPath(path) {
				if (path) {
					uni.navigateTo({
						url: path
					})
				}
			},
			result(res) {
				return res;
			}
		}
	}
</script>

<style>
	.flex {
		width: 100%;
		height: 100rpx;
	}

	.footer-msg .info {
		display: flex;
		justify-content: center;
		align-items: center;
		margin-left: 20upx;
	}

	.footer-msg .info text {
		margin-left: 20upx;
	}

	.footer-msg image {
		width: 40upx;
		height: 40upx;
	}

	.footer-msg {
		background-color: #62aba2;
		color: white;
		border-radius: 20upx;
		width: 95%;
		margin-top: 40upx;
		padding: 25upx 0;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}

	.content-main-info {
		display: flex;
		align-items: center;
		margin-top: 40upx;
		margin-bottom: 15upx;
		color: #afafaf;
	}

	.content-main-qrCode {
		margin-top: 120upx;
		margin-bottom: 120upx;
	}

	.content-main-barcode img {
		width: 750px !important;
	}

	.content .title {
		width: 95%;
		background-color: white;
		font-size: 14px;
		color: #55a298;
		border-bottom: 1px solid #d6d6d6;
		border-top-left-radius: 10upx;
		border-top-right-radius: 10upx;
		padding: 20upx 0;
	}

	.content .title text {
		padding-left: 50upx;
	}

	.content {
		display: flex;
		align-items: center;
		flex-direction: column;
	}

	.content .content-main {
		background-color: white;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		border-bottom-left-radius: 10upx;
		border-bottom-right-radius: 10upx;
		width: 95%;
	}

	page {
		background-color: #4ba198;
	}
</style>