<template>
	<view class="page">
		<uni-list>
			<uni-list-item title="" :show-arrow="true" :show-badge="true">
				<view class="fix_lang">
					<text>{{$t('my.setting.change_lang')}}</text>
					<picker @change="bindPickerChange" :value="lang_index" :range="lang_arr">
						<view class="uni-input-lang">{{lang_arr[lang_index]}}</view>
					</picker>
				</view>
			</uni-list-item>
			<uni-list-item :title="$t('my.setting.change_login_pwd')" :show-arrow="true" :show-badge="true"
				@click="goPath('../set/password')" />


			<uni-list-item :title="$t('my.setting.clear_cache')+'  '+currentSize" :show-arrow="true" :show-badge="true"
				@click="clearTmp" />

			<uni-list-item :title="$t('my.setting.clear_message')" :show-arrow="true" :show-badge="true"
				@click="clearAll" />

			<!-- <uni-list-item title="切换语言" :show-arrow="true" :show-badge="true" @click="goPath('../set/password')" /> -->


			<uni-list-item :title="$t('my.setting.trans')" :show-arrow="true" :show-badge="true"
				@click="goPath('/pages/push/create_group')" />

			<uni-list-item :title="$t('my.setting.font_size')" :show-arrow="true" :show-badge="true"
				@click="goPath('../set/font_size')" />

			<!--	<uni-list-item title="更新介绍" :show-arrow="true" :show-badge="true" @click="goPath('../set/password')" />-->
		</uni-list>
		<uni-list>
			<uni-list-item :title="$t('my.setting.about')" :show-arrow="true" :show-badge="true"
				@click="goPath('/pages/user_info/system')" />
		</uni-list>


		</uni-list>

		<view class="uni-padding-wrap uni-common-mt login_out">
			<button type="primary" class="but-view" @tap="loginOut">{{$t('my.setting.logout')}}</button>
		</view>
	</view>
</template>

<script>
	import uniList from '../../components/uni-ui/uni-list/uni-list.vue';
	import uniListItem from '../../components/uni-ui/uni-list-item/uni-list-item.vue';
	import _action from '../../common/_action';
	import _mixins from '@/common/_mixins';
	import _hook from '../../common/_hook';
	import _data from '../../common/_data';

	export default {
		components: {
			uniList,
			uniListItem
		},
		data() {
			return {
				my_data: {},
				currentSize: '',
				lang_arr: [],
				lang_index: 0,
			}
		},
		onReady() {
			uni.setNavigationBarTitle({
				title: this.$t('my.setting.title'),
			});
		},
		onShow() {
			_hook.routeTabBarHook();
			let _this = this;
			/** 监听新的个人数据 */
			uni.$on('data_user_info', function(data) {
				_this.my_data = data;
			});
			this.getStorage();
			this.initLang();
		},
		onLoad() {
			let _this = this;
			_this.my_data = _data.data('user_info');
		},
		onUnload() {
			uni.$off('data_user_info');
		},
		computed: {

		},
		methods: {
			initLang() {
				this.lang_arr = [
					this.$t('language.zh'),
					this.$t('language.en'),
					this.$t('language.th'),
					this.$t('language.pty'),
				];
				console.log("this.lang_arr", this.lang_arr)
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
			// 切换语言
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
			// 查看缓存
			getStorage() {
				try {
					const res = uni.getStorageInfoSync();
					console.log(res.keys);
					console.log(res.currentSize);
					console.log(res.limitSize);
					// this.currentSize = res.currentSize + 'kb';
				} catch (e) {
					// error
				}
			},
			// 清除缓存
			clearTmp() {
				let _this = this;
				uni.showModal({
					title: this.$t('my.setting.tip'),
					content: this.$t('my.setting.c_clear'),
					confirmColor: 'red',
					cancelColor: '#353535',
					success: function(res) {
						if (res.confirm) {
							uni.showLoading({
								title: _this.$t('my.setting.c_l'),
								mask: true
							});
							try {
								// todo保留token,client_id
								let token = _data.localData('token');
								let client_id = _data.localData('client_id');
								let deviceId = _data.localData('deviceId');
								uni.clearStorageSync();
								uni.hideLoading();
								_data.localData('token', token);
								_data.localData('client_id', client_id);
								_data.localData('deviceId', deviceId);
								uni.showToast({
									title: _this.$t('my.setting.c_d'),
									icon: 'none'
								});

							} catch (e) {
								// error
								uni.hideLoading()
								uni.showToast({
									title: '清除失败',
									icon: 'none'
								});
							}
						}
					},
				})



			},
			// 清空所有聊天记录
			clearAll() {
				let _this = this;
				uni.showModal({
					title: _this.$t('my.setting.tip'),
					content: _this.$t('my.setting.c_l_c'),
					confirmColor: 'red',
					cancelColor: '#353535',
					success: function(res) {
						if (res.confirm) {
							_this.$httpSend({
								path: '/im/remove/del_all',
								success: function(data) {
									uni.showToast({
										icon: 'none',
										title: _this.$t('my.setting.c_d')
									})
									_data.localData('chat_list', []);
									uni.$on('data_chat_list', []);
								}
							})
						}
					}
				})

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
			goPath(path) {
				if (path) {
					uni.navigateTo({
						url: path
					});
				}
			},
		},
		watch: {

		},
	}
</script>

<style>
	.uni-input-lang {
		font-size: 32rpx;
		margin-right: 40rpx;
		flex: 1;
		width: 100rpx;
		text-align: right;
	}

	.fix_lang {
		display: flex;
		align-items: center;
		font-size: 32rpx;
		justify-content: space-between;
	}

	.login_out {
		margin-top: 100upx;
	}

	.phto {
		width: 130upx;
		height: 130upx;
		margin-left: 30upx;
		margin-right: 30upx;
	}

	.my_padding {
		padding-bottom: 25px;
	}

	.but-view {
		border-radius: 40upx;
		height: 80upx;
		text-align: center;
		line-height: 80upx;
		font-size: 16px;
		;
	}

	.my_padding:before {
		background-color: white;
	}

	.uni-list {
		margin-bottom: 30upx;
	}
</style>