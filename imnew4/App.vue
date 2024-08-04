<script>
	import permision from "@/js_sdk/wa-permission/permission.js"
	import _action from './common/_action';
	import _get from './common/_get';
	import _data from './common/_data';
	import _page from './common/common';
	// import SDK from "./common/tendenceImSdk";
	// #ifdef APP-PLUS
	// 首先需要通过 uni.requireNativePlugin("ModuleName") 获取 module
	const TUICallKit = uni.requireNativePlugin('TencentCloud-TUICallKit');
	// #endif
	
	import { notifyPermissions ,onPushMessage } from "@/js_sdk/push/unipush.js"
	
	export default {
		globalData: {
			// 阅后即焚
			yhjf: {}, //是否开启阅后即焚
			/** 代理客户id */
			agent_id: 1,
			/** http 服务端地址 */
			http_url: 'https://api.im2021.xyz',
			/** 静态文件存放地址 */
			static_url: 'https://api.im2021.xyz',
			/** socket 服务端地址 */
			socket_url: 'wss://api.im2021.xyz:7272',
			/** socket 连接状态 */
			socket_state: 0,
			/** 好友申请通知 */
			new_friend_tips_num: 0,
			/** 群认证通知 */
			new_group_tips_num: 0,
			/** 朋友圈通知 */
			no_reader_circle: 0,
			/** 朋友圈消息未读数 */
			no_reader_circle_chat_num: 0,
			/** 缓存的数据 */
			cache: {
				/** 个人头像缓存数据 */
				local_photo: '',
			},
			/** 用户信息 */
			user_info: {
				id: 0,
				nickname: '',
				username: '',
				photo: 'default_man/70.jpg',
				doodling: '',
				phone: '',
				circle_img: 'default_circle_img.jpg?_=3.1415926',
			},
			isOnlie: true,
			dragInfo: {
				moveX: 260,
				moveY: 180,
				state: -1
			},

			client: null, //音视频客户端
			localStream: null, //本地视频流
		},

		onLaunch() {
			// #ifdef H5
			this.initOpera()
			// #endif
			// 默认设置英文
			// uni.setLocale('zh-Hans')
			if(!_data.localData('defaultLang')){
				_data.localData('defaultLang','th');
				_data.localData('lang','th');
				this.initLang('th')
			}else{
				this.initLang()
			}
			

			// #ifdef APP-PLUS
			// 将原生插件挂载在 uni 上
			uni.$TUICallKit = TUICallKit;
			// getPushClientId()
			notifyPermissions()
			onPushMessage((data)=>{
				console.log('_____[推送数据]_____',data)
				switch(data.data.payload.action){
					case "text":
						
					break;
					case "image":
						
					break;
					case "audio":
						
					break;
					case "video":
						
					break;
					default:
						console.error("收到推送的其他消息！",data)
				}
			})
			
			// #endif

			this.$store.commit('initRECORD');

			// 其他监听
			//#ifdef APP-PLUS
			// plus.push.addEventListener("click", function(msg) {
			// console.log("监听消息", msg)
			// console.log("msg.payload", JSON.stringify(msg.payload));
			// plus.runtime.restart()
			// setTimeout(() => {
			// 	uni.switchTab({
			// 		url: '/pages/chat/index'
			// 	});
			// }, 1000)
			// plus.push.clear()

			// let content_type = msg.payload.content_type;
			// if (Object.keys(msg.payload).length) {
			// 	switch (parseInt(content_type)) {
			// 		case 7:
			// 			uni.navigateTo({
			// 				url: '/pages/chat/videoCall?' + _page.pageParam(msg.payload)
			// 			});
			// 			break;
			// 		default:
			// 			uni.navigateTo({
			// 				url: '/pages/chat/index'
			// 			});
			// 	}
			// }
			//这里可以写跳转业务代码
			// }, false);
			// 监听在线消息事件
			// plus.push.addEventListener("receive", function(msg) {
			// 	// plus.ui.alert(2);
			// 	//这里可以写跳转业务代码
			// 	console.log("recevice:" + JSON.stringify(msg))
			// }, false);

			//#endif

			// #ifdef APP-PLUS
			/** 锁定屏幕方向 */
			plus.screen.lockOrientation('portrait-primary');
			/** 检测升级 */
			let _this = this;

			// if (_data.data('socket_state') <= 0 && _data.localData('token')) {
			// 	_this.$reset().$reconnect(function() {
			// 		if (_data.localData('message_list_id') && _data.localData('token')) {
			// 			_get.getChatData({
			// 				send_data: {
			// 					list_id: _data.localData('message_list_id'),
			// 					time: 0,
			// 					is_up: 1,
			// 				},
			// 				is_action_data: 1,
			// 			});
			// 		}
			// 	});
			// }

			plus.runtime.getProperty(plus.runtime.appid, function(info) {
				_this.$httpSend({
					path: '/im/app/update',
					data: {
						appid: info.appid,
						version: info.version,
					},
					success(res) {
						if (res.status) {
							_action.checkFail();
							let wgtWaiting = plus.nativeUI.showWaiting("更新开始下载"),
								update_url = (plus.os.name == 'Android' ? res.update_url.android : res
									.update_url.ios),
								downloadTask = uni.downloadFile({
									url: update_url,
									success: (res) => {
										wgtWaiting.close();
										if (res.statusCode === 200) {
											plus.runtime.install(res.tempFilePath, {}, () => {
												plus.runtime.restart();
											}, (e) => {
												uni.showModal({
													content: "update error [" + e
														.code + "]：" + e.message,
													showCancel: false,
												});
											});
										} else {
											uni.showModal({
												content: "api error update fail!",
												showCancel: false,
											});
										}
									}
								});
							downloadTask.onProgressUpdate((res) => {
								wgtWaiting.setTitle('下载中...' + res.progress + '%');
							});
						}
					},
				});
			});
			// #endif
			// #ifdef APP-PLUS
			// 如果已经登录了，则重新连接socket
			if (_data.localData('token')) {
				_this.$reset().$reconnect()
			}
			// #endif

		},
		onShow() {
			//在微信小程序或是app中，通过curPage.options；如果是H5，则需要curPage.$route.query（H5中的curPage.options为undefined）
			let curParam = this.options || this.$route?.query || {};
			if (curParam.channelCode) {
				_data.localData('channelCode', curParam.channelCode)
			} else {
				_data.localData('channelCode', '')
			}

			// #ifdef APP-PLUS
			this.requestAn()
			// #endif
			let _this = this;
			if (!_data.localData('token')) {
				return;
			}
			/**
			 * 每次app启动都加载最新的会话列表数据，只要是最新的会话列表数据，会话界面数据也会是最新的
			 * 这里延时100ms,不然会全局变量没有加载完成，会报错。
			 */
			// if (_data.data('socket_state') <= 0 && _data.localData('token')) {
			// 	_this.$reset().$reconnect(function() {
			// 		if (_data.localData('message_list_id') && _data.localData('token')) {
			// 			_get.getChatData({
			// 				send_data: {
			// 					list_id: _data.localData('message_list_id'),
			// 					time: 0,
			// 					is_up: 1,
			// 				},
			// 				is_action_data: 1,
			// 			});
			// 		}
			// 	});
			// }
			/**
			 * @param {Object} res
			 * 监听网络变化
			 * 如果有网络变化，断开socket，再重新连接
			 * 重新获取会话列表数据
			 * 如果是在会话界面，再重新获取这个的对话数据
			 */
			uni.onNetworkStatusChange(function(res) {
				console.log("App  onNetworkStatusChange...");
				/** 断开重新再连接，再获取最新数据 */
				if (_data.data('socket_state') <= 0 && _data.localData('token')) {
					_this.$reset().$reconnect(function() {
						if (_data.localData('message_list_id') && _data.localData('token')) {
							_get.getChatData({
								send_data: {
									list_id: _data.localData('message_list_id'),
									time: 0,
									is_up: 1,
								},
								is_action_data: 1,
							});
						}
					});
				}
			});

			// this.initData()
		},
		onHide() {
			this.globalData.isOnlie = false;
		},

		methods: {
			initLang(def) {
				let lang = def ? def : _data.localData('lang')
				if (!lang) {
					// 默认中文
					this.$i18n.locale = 'zh';
					uni.setLocale('zh-Hans');
				}
				if (lang == 'zh') {
					this.$i18n.locale = 'zh';
					uni.setLocale('zh-Hans');
				}
				if (lang == 'en') {
					this.$i18n.locale = 'en';
					uni.setLocale('en');
				}
				if (lang == 'th') {
					this.$i18n.locale = 'th';
					uni.setLocale('th');
				}
				if (lang == 'pty') {
					this.$i18n.locale = 'pty';
					uni.setLocale('pty');
				}
			},
			initOpera() {
				let _this = this
				document.addEventListener('plusready', function() {
					var webview = plus.webview.currentWebview()
					plus.key.addEventListener('backbutton', function() {
						var l = plus.webview.all().length
						if (l > 1) {
							//如果webview窗口数大于1则关闭
							webview.close()
						} else {
							webview.canBack(function(e) {
								if (e.canBack) {
									webview.back()
								} else {
									// 首页返回键处理
									// 处理逻辑：1秒内，连续两次按返回键，则退出应用；
									var first = null
									first = new Date().getTime()
									uni.showToast({
										icon: 'none',
										title: _this.$t('newAdd.enter_logout')
									})
									setTimeout(function() {
										first = null
									}, 1000)
									plus.key.addEventListener(
										'backbutton',
										function() {
											if (new Date().getTime() - first < 1500) {
												plus.runtime.quit()
											}
										},
										false
									)
								}
							})
						}

					})
				})
			},
			requestAn() {
				switch (uni.getSystemInfoSync().platform) {
					case 'android':
						permision.requestAndroidPermission("android.permission.RECORD_AUDIO")
						break;
					case 'ios':
						permision.judgeIosPermission("record")
						break;
				}

			}
		}
	}
</script>

<style>
	/* #ifndef APP-PLUS-NVUE */
	/** uni.css - 通用组件、模板样式库，可以当作一套ui库应用 */
	@import "./static/css/font/iconfont.css";
	@import "./static/css/font/iconfont-im.css";
	@import "./static/css/uni.css";

	/** 设置 body 的背景色 */
	page {
		background-color: #f9f9f9;
	}

	/** 导航栏自定义图标样式调整 */
	.uni-page-head .uni-btn-icon {
		min-width: auto !important;
		overflow: inherit !important;
	}

	uni-checkbox .uni-checkbox-input {
		border-radius: 50%;
		width: 18px !important;
		height: 18px !important;
		border: 1px solid #007aff !important;
	}

	uni-checkbox .uni-checkbox-input.uni-checkbox-input-checked {
		background-color: #007aff;
		border: 1px solid #007aff !important;
		color: white !important;
	}

	uni-checkbox .uni-checkbox-wrapper {
		width: 100%;
	}

	/* #endif */
</style>