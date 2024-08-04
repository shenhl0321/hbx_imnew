<template>
	<view class="myPage">
		<!-- 		<view class="topTitle">
			<view class="topFont">
				我的
			</view>
			<view class="top-right-cion">
				<image @click="toScan" src="/static/my/scan.png" mode=""></image>
			</view>
		</view> -->
		<view class="myTop">
			<view class="topBg">
				<view class="centerIcon">
					<view class="headerImg">
						<image :src="myPhoto" @tap="goPath('/pages/my/details')" :lazy-load="true" />
					</view>
					<view class="top-right-cion">
						<!-- #ifdef APP-PLUS -->
						<image @click="toScan" src="/static/my/scan.png" mode=""></image>
						<!-- #endif -->
						<image @click="toHelp" src="/static/my/wen.png" mode=""></image>
					</view>
				</view>
				<view class="userName">
					<view class="userLf">
						<text @tap="goPath('/pages/my/details')"
								style="color: white; display: block; width: 800rpx; margin-left: 150rpx;">{{my_data.nickname}}</text>
						<text @tap="goPath('/pages/my/details')"
							style="color: aliceblue; display: block;margin-left: 150rpx;">{{$t('common.user_account')}}:{{my_data.username}}</text>
						<text @click="signAct"
							style="color: aliceblue; display: block;margin-left: 150rpx;"><text style="max-width: 200rpx;display: block;float: left;">{{$t('my.index.sign_status')}}</text><text style="width:20rpx; display: block;float: left;">:</text><text style="max-width: 200rpx;display: block;float: left;" v-if="my_data.is_signed == 0">{{$t('my.index.sign_now')}}</text><text style="max-width: 200rpx;display: block;float: left;" v-else>{{$t('my.index.sign_ed')}}</text></text>
					</view>
					<view class="userRt">
						<text class="circle"></text>
						<image class="header_erw" src="/static/theme/default/my/qrcode.png"
							@tap.stop="goPath('/pages/my/qrcode')" :lazy-load="true" />
					</view>
				</view>
			</view>

		</view>
		<view class="listOut">
			<uni-list class="list">
				<uni-list-item :title="$t('my.index.my_money')" :showArrow="true" :show-arrow="true" badge-type="error"
					thumb="../../static/theme/default/user/1.png" @click="goPath('./wallet/index')" />
				<uni-list-item :title="$t('my.index.my_collect')" :show-arrow="true" :showArrow="true"
					thumb="/static/theme/default/user/2.png" @click="goPath('store')" />
				<uni-list-item :title="$t('my.index.help')" :showArrow="true" :show-arrow="true" badge-type="error"
					thumb="../../static/theme/default/user/4.png" @click="goPath('../article/article')"
					v-if="showKefu" />
				<uni-list-item :title="$t('my.index.contact')" :showArrow="true" :show-arrow="true" badge-type="error"
					thumb="../../static/theme/default/user/3.png" @click="goKefu" v-if="showKefu" />
				<uni-list-item :title="$t('my.index.setting')" :show-arrow="true" :showArrow="true"
					thumb="../../static/theme/default/user/5.png" @click="goPath('../set/index')" />

			</uni-list>
		</view>
	</view>
</template>

<script>
	import uniList from '../../components/uni-ui/uni-list/uni-list.vue';
	import uniListItem from '../../components/uni-ui/uni-list-item/uni-list-item.vue';
	import _get from '../../common/_get';
	import _hook from '../../common/_hook';
	import _data from '../../common/_data';


	export default {
		components: {
			uniList,
			uniListItem
		},
		data() {
			return {
				my_data: {
					id: 0
				},
				show_tips: '',
				show_pay_tips: '',
				status_height: ''
			}
		},
		onShow() {
			_hook.routeTabBarHook();
			let num = _data.data('no_reader_circle_chat_num'),
				_this = this;
			_this.my_data = _data.data('user_info');

			/** 监听新的个人数据 */
			uni.$on('data_user_info', function(data) {
				_this.my_data = data;
				console.log(_this.my_data)
			});
			/** 监听朋友圈动态提示 */
			// uni.$on('data_circle_tips', function (data) {
			//     _this.show_tips = data;
			// });
			// uni.$on('data_pay_tips',function (data) {
			//     _this.show_pay_tips = data;
			// })
			// if (num) {
			//     this.show_tips = num;
			// } else if (_data.data('no_reader_circle')) {
			//     this.show_tips = '好友动态';
			// } else {
			//     this.show_tips = '';
			// }
		},
		onLoad() {
			let sys = uni.getSystemInfoSync();
			this.status_height = sys.statusBarHeight;
		},
		onHide() {
			//uni.$off('data_user_info');
			uni.$off('data_circle_tips');
		},
		computed: {
			myPhoto() {
				return _data.staticPhoto() + this.my_data.photo;
			},
			showKefu() {
				return this.my_data.id != 5880
			}
		},
		methods: {
			signAct(){
				let _this = this;
				console.log(_this);
				if(this.my_data.is_signed == 1){
					uni.showToast({
						icon: 'none',
						title: this.$t('my.index.sign_ed')
					})
				}
				this.$httpSend({
					path: '/im/get/sign',
					success(data) {
						if(data.msg == 1){
							_this.my_data.is_signed = 1;
							uni.showToast({
								icon: 'none',
								title: _this.$t('my.index.sign_sucess')
							})
						}else if(data.msg == 2){
							_this.my_data.is_signed = 1;
							uni.showToast({
								icon: 'none',
								title: _this.$t('my.index.sign_ed')
							})
						}else if(data.msg == 3){
							uni.showToast({
								icon: 'none',
								title: _this.$t('my.index.sign_fail')
							})
						}
					}
				});
			},
			toScan() {
				// #ifdef H5
				uni.showToast({
					icon: 'none',
					title: '请使用APP打开'
				})
				// #endif
				// #ifdef APP-PLUS
				// uni.scanCode({

				// })
				this.goScanCode()
				// #endif
			},
			toHelp() {
				uni.navigateTo({
					url: '/pages/article/article'
				})
			},
			goPath(path) {
				console.log(1111)
				if (path) {
					uni.navigateTo({
						url: path,
					});
				}
			},
			goKefu() {
				this.$httpSend({
					path: '/im/get/kefu',
					success(data) {
						console.log('客服数据', data)
						uni.navigateTo({
							'url': '/pages/chat/message?list_id=' + data
						})
					}
				});
			},
			goScanCode() {
				// uni.navigateTo({
				//   url: '../chat/videoCall'
				// });
				let _this = this;
				uni.scanCode({
					success: function(res) {
						/** 验证必须是一个地址 */
						if (/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\*\+,;=.]+$/.test(
								res.result)) {
							/** 本应用页面 */
							console.log(res.result);
							if (new RegExp(_data.data('http_url')).test(res.result)) {
								if (res.result.match(/\/([a-z]+_[a-z]+)\/(.+)$/) && RegExp.$1 && RegExp.$2) {
									switch (RegExp.$1) {
										case 'chat_add':
											uni.navigateTo({
												url: '/pages/details/index?user_id=' + RegExp.$2 +
													'&is_type=3',
											});
											break;
										case 'group_add':
											let option = (RegExp.$2 + '').split('&');
											_this.$httpSend({
												path: '/im/message/addChat',
												data: {
													users: option[1],
													list_id: option[0],
													type: 1,
												},
												success_action: true,
												success(res) {
													let tips = res.err ? res.msg :
														_this.$t('my.index.check_group_notice');
													uni.showModal({
														content: tips,
														showCancel: false,
													});
												}
											});
											break;
										default:
											uni.showModal({
												content: _this.$t('my.index.qrcode_content') + '：' + res.result,
												showCancel: false,
											});
											break;
									}
								} else {
									uni.showModal({
										content: _this.$t('my.index.qrcode_content') + '：' + res.result,
										showCancel: false,
									});
								}
							} /** 打开新地址 */
							else {
								uni.navigateTo({
									url: '../push/web?url=' + encodeURIComponent(res.result),
								});
							}
						} else {
							uni.showModal({
								content: _this.$t('my.index.qrcode_content')  + '：' + res.result,
								showCancel: false,
							});
						}
					},
					fail(e) {
						console.log(e);
						// return false;
						// return;
						uni.showToast({
							title: _this.$t('my.index.scan_error') + '：' + JSON.stringify(e),
							duration: 2000,
						});
						return false;
					},
				});
			},
		},
		watch: {},
	}
</script>
<style>
	.uni-list-item .uni-list-item__container:after {
		position: absolute;
		z-index: 10;
		right: 0;
		bottom: 0;
		left: 16px;
		height: 1px;
		content: '';
		-webkit-transform: scaleY(.5);
		transform: scaleY(.5);
		background-color: rgb(215, 215, 215) !important;
	}
</style>
<style>
	body {
		height: 100%;
	}

	.topTitle {
		background-color: #fff;
		box-sizing: border-box;
		padding: 20rpx 30rpx;
		/* #ifdef APP-PLUS */
		padding-top: var(--status-bar-height);
		/* #endif */
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100vw;
		position: fixed;
		top: 0;
		left: 0;
		background: #fff;
		z-index: 10;
	}

	.topFont {
		font-size: 40rpx;
		color: #080E18;
		font-weight: bold;
		margin-left: 10rpx;
	}

	.myPage {
		height: 100%;
		min-height: 100vh;
		background-color: #fff;
	}

	.iconfonts {
		position: absolute;
		right: 160rpx;
		bottom: 0px;
		font-size: 16px;
	}

	.header-msg {
		padding-left: 10px;
	}

	.phto {
		width: 106upx;
		height: 106upx;
		margin-left: 30 upx;
		margin-right: 30 upx;
	}

	.list {
		/* margin-top: 10upx; */
	}

	.qrcode {
		width: 50 upx;
		height: 50 upx;
		margin-right: -20 upx;
	}

	.my_padding {
		padding: 50px 15px 16px 15px;
		display: flex;
		background-color: #fff;
	}

	.uni-media-list-logo {
		padding: 2px;
		border-radius: 10px;
		height: 70px !important;
		width: 70px !important;
		margin-right: 0upx !important;
		margin-left: 0upx !important;
	}

	.my_padding:after {
		font-family: uniicons;
		content: '\e583';
		position: absolute;
		right: 15px;
		top: 15%;
		font-size: 24px;
		color: #bbb;
		-webkit-transform: translateY(-50%);
		transform: translateY(-50%);
	}

	.header-erw {
		position: absolute;
		right: 45px;
		top: 13%;
		font-size: 24px;
		width: 24px;
		height: 24px;
		z-index: 9999;
	}

	.uni-list {
		margin-bottom: 30 upx;
	}


	.uni-list-cell-navigate.uni-navigate-right:after {
		font-size: 20px !important;
	}

	.myTop {
		width: 100%;

		position: relative;
		background-color: #fff;
		padding-bottom: 10rpx;
	}

	.topBg {
		width: 100%;
		height: 420rpx;
		background: linear-gradient(315deg, #685BED 0%, #2F63FF 100%);
		border-radius: 0px 0px 0px 20px;
		/* background: url('../../static/theme/default/my/user_icon_bg.png') no-repeat 0 0; */
		background-size: 100% 100%;
		display: flex;
		align-items: center;
		align-self: center;
		align-content: center;
		box-sizing: border-box;
		padding: 0 30rpx;
		position: relative;
		overflow: hidden;
	}

	.top-right-cion {
		position: absolute;
		height: 80rpx;
		display: flex;
		width: 40vw;
		display: flex;
		justify-content: flex-end;
		align-items: center;
		top: 50%;
		right: 0;
		transform: translateY(-50%);
	}

	.top-right-cion image {
		width: 40rpx;
		height: 40rpx;
		margin-right: 30rpx;
	}

	.centerIcon {
		height: 40rpx;
		width: 100%;
		display: flex;
		justify-content: flex-end;

	}

	.centerIcon>.item {
		width: 40rpx;
		height: 40rpx;
		margin-left: 36rpx;
	}

	.headerImg {
		width: 166rpx;
		height: 166rpx;
		border-radius: 50%;
		box-shadow: 0 15upx 10upx #F2F2F2;
		position: absolute;
		left: 54rpx;
		top: 180rpx;
		overflow: hidden;
		border: 4rpx solid #fff;
		box-shadow: 0 0 20rpx 10rpx rgba(0, 0, 0, .1);
	}

	.headerImg>image {
		width: 100%;
		height: 100%;
	}

	.userName {
		display: flex;
		justify-content: space-between;
		/* flex-wrap: wrap; */
		align-items: center;
		box-sizing: border-box;
		padding: 0 82rpx;
		margin-top: 126rpx;
	}

	.userLf>text:first-child {
		font-size: 40rpx;
		color: #0A0E1A;
		text-align: left;
		font-weight: bold;
		display: block;
	}

	.userLf>text:last-child {
		font-size: 32rpx;
		color: #B0B0B3;
		text-align: left;
		display: block;

	}

	.header_erw {
		width: 42rpx;
		height: 42rpx;
		margin-right: 30upx;
	}

	.userRt {
		display: flex;
		justify-content: flex-end;
		align-items: center;
		position: relative;
	}

	.userRt::after {
		font-family: uniicons;
		content: '\e583';
		position: absolute;
		right: -20rpx;
		top: -20rpx;
		font-size: 24px;
		color: rgb(187, 187, 187);
	}

	.circle {
		display: inline-block;
		height: 14upx;
		width: 14upx;
		padding: 0;
		border-radius: 50%;
		background-color: #F16858;
		margin-right: 10rpx;
	}

	.listOut {
		width: 100%;
		box-sizing: border-box;
		padding: 0 16rpx 0 24rpx;
		background-color: #fff;
		padding-bottom: 100rpx;
	}
</style>