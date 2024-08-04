<template>

	<view class="page" :style="{height:winHeight +'px',overflow:'hidden'}">

		<!--  #ifdef  APP-PLUS -->
		<view class="topTitle">
			<view class="topFont">
				{{$t('message.message')}}{{unread_msg?'('+unread_msg+')':''}}
			</view>

			<view class="titleLf" @tap="actionMain">
				<image src="../../static/theme/default/chat/icon_more_add.png" mode=""></image>
			</view>
		</view>
		<!-- #endif -->
		<!-- #ifdef H5 || MP-WEIXIN-->

		<view class="topTitle">
			<view class="topFont">
				{{$t('message.message')}}{{unread_msg?'('+unread_msg+')':''}}
			</view>
			<view class="titleLf" @tap="actionMain">
				<image src="../../static/theme/default/chat/icon_more_add.png" mode=""></image>
			</view>
		</view>
		<!-- #endif -->
		<scroll-diy :height="scrolHeight+'px'" ref="mescrollRef" @init="mescrollInit" @down="downCallback"
			:up="{use:false,auto:false}" :down="{auto:false}">
			<view class="searchOut">
				<!-- <uni-search-bar ref="searchBar" placeholder="搜索" bgColor="#F7F7F7" :show="false" @confirm="search"
					@search="search">
				</uni-search-bar> -->
			</view>
			<view class="uni-list" v-if="list.length">
				<uni-swipe-action>
					<uni-swipe-action-item class="uni-list-cell" v-for="(value,key) of list" :key="key"
						:right-options="swipeData(value,key)" :auto-close="false" @click="swipeAction">
						<view class="uni-media-list"
							@tap="goMessage(value.list_id,key,value.no_reader_num,value.chat_id,value.photo_path,value.show_name)">
							<view class="uni-media-list-logo">
								<image :src="staticPhoto + value.photo_path" :lazy-load="true"
									style="border-radius: 50%;" :data-index="key" @error="imageError" />
							</view>

							<view class="red_num">
								<uni-badge :text="value.no_reader_num" type="error"
									style="width: 20rpx; border-radius: 60rpx;" />
							</view>

							<view class="uni-media-list-body">
								<view class="uni-media-list-text-top">
									<text>{{msgHandle(value.show_name+'',12)}}</text>
									<text style="float: right;color: #8f8f94;font-size: 23upx;">
										{{timestampFormat(value.time)}}
									</text>
								</view>
								<view class="uni-media-list-text-bottom uni-ellipsis"
									v-if="obj_notice[value.list_id] == 1">
									<text style="color: red;">{{$t('newAdd.oneCallMe')}}</text>{{value.last_msg+''}}
								</view>
								<view class="uni-media-list-text-bottom uni-ellipsis" v-else>
									{{value.last_msg+''}}
								</view>
							</view>

						</view>
					</uni-swipe-action-item>
				</uni-swipe-action>
				<!-- <view class="uni-list-cell"
            v-for="(value,key) of list"
            :key="key">
        <uni-swipe-action :options="swipeData(value.no_reader_num)"
                          @click="swipeAction"
                          @opened="openedAction(key)">
          <uni-swipe-action>
            <view class="uni-media-list"
                  @tap="goMessage(value.list_id,key,value.no_reader_num,value.chat_id)">
              <view class="uni-media-list-logo">
                <image :src="staticPhoto + value.photo_path + '?_=' + imgRan"
                       :lazy-load="true"
                       style="border-radius: 10px;"
                       :data-index="key"
                       @error="imageError" />
              </view>

              <view class="red_num">
                <uni-badge :text="value.no_reader_num"
                           type="error" />
              </view>

              <view class="uni-media-list-body">
                <view class="uni-media-list-text-top">

                  <text>{{msgHandle(value.show_name+'',12)}}</text>
                  <view style="float: right;color: #8f8f94;font-size: 23upx;">
                    {{timestampFormat(value.time)}}
                  </view>
                </view>
                <view class="uni-media-list-text-bottom uni-ellipsis">{{value.last_msg}}</view>
              </view>

            </view>
          </uni-swipe-action>
        </uni-swipe-action>
      </view> -->
			</view>
			<view class="noData" v-if="!list.length" style="
    height: 500px;
">
				<image src="../../static/theme/default/chat/defaultpage_nomessages.png" mode=""></image>
				<text>{{$t('message.nomessage')}}</text>
			</view>
		</scroll-diy>

		<view :class="['action_main animated faster',(action_menu ? 'bounceInDown' : 'bounceOutUp')]"
			v-show="showActionMenu" @tap="actionMain">
			<view class="action_base">
				<view class="action_item" @tap="goAction(1)">
					<text class="action_item_text">{{$t('message.addfriend')}}</text>
				</view>
				<view class="action_item" @tap="goAction(0)">
					<text class="action_item_text">{{$t('message.sendgroupchat')}}</text>
				</view>
				<view class="action_item" @tap="goPath('/pages/push/create_group')">
					<text class="action_item_text">{{$t('message.massAssistant')}}</text>
				</view>
				<!-- #ifdef APP-PLUS -->
				<!-- <view class="action_item" @tap="goScanCode">
					<view class="uni-media-list-logo action_icon">
						<image src="/static/float/saoyisao.png" :lazy-load="true" />
					</view>
					<text class="action_item_text">扫一扫</text>
				</view> -->
				<!-- #endif -->
			</view>
		</view>

	</view>
</template>

<script>
	import uniIcon from '../../components/uni-icons/uni-icons.vue';
	import uniBadge from '../../components/uni-badge/uni-badge.vue';
	import uniSwipeAction from '../../components/uni-swipe-action/uni-swipe-action.vue'
	import uniSwipeActionItem from '../../components/uni-swipe-action-item/uni-swipe-action-item.vue'
	import _get from '../../common/_get';
	import _hook from '../../common/_hook';
	import _action from '../../common/_action';
	import _data from '../../common/_data';
	import _page from '../../common/common';
	import uniSearchBar from '@/components/mehaotian-search/mehaotian-search.vue';
	import scrollDiy from '@/components/mescroll-uni/components/mescroll-diy/xinlang/mescroll-uni.vue';
	import {
		newGenTestUserSig
	} from "@/debug/GenerateTestUserSig.js";
	export default {
		components: {
			uniIcon,
			uniBadge,
			uniSwipeAction,
			uniSwipeActionItem,
			uniSearchBar,
			scrollDiy
		},
		data() {
			return {
				list: [],
				search_list: [],
				list_index: '',
				action_menu: false,
				action_menu_num: 0,
				options: [{
					text: '取消',
					style: {
						backgroundColor: '#007aff'
					}
				}, {
					text: '删除',
					style: {
						backgroundColor: '#dd524d'
					}
				}],
				unread_msg: 0, //未读消息
				scrolHeight: 600,
				windowBottom: 50,
				status_height: 25,
				winHeight: 675,
				my_data: {},
				obj_notice: {}, //todo @提示消息
			}
		},
		onShow() {
			this.initData()

		},
		onLoad() {
			let winHeight = uni.getSystemInfoSync().windowHeight;
			let windowBottom = uni.getSystemInfoSync().windowBottom;
			let status_height = uni.getSystemInfoSync().statusBarHeight;
			this.scrolHeight = winHeight - windowBottom - status_height;
			this.windowBottom = windowBottom;
			this.status_height = windowBottom;
			this.winHeight = winHeight;
			// console.log("uni.getSystemInfoSync()", uni.getSystemInfoSync())

		},
		onUnload() {
			uni.$off('data_chat_list');
		},
		// onPullDownRefresh() {
		// 	_get.getChatList();
		// 	setTimeout(function() {
		// 		uni.stopPullDownRefresh();
		// 	}, 300);
		// },
		onHide() {
			//清空search框
			if (this.keyword) {
				this.$refs.searchBar.clear();
				this.list = this.search_list;
			}
		},

		computed: {
			showActionMenu() {
				return this.action_menu;
			},
			staticPhoto() {
				return _data.staticPhoto();
			},
			imgRan() {
				return Math.random();
			},
		},
		methods: {
			// 切换语言
			bindPickerChange(e) {
				this.lang_index = e.detail.value;
				if (this.lang_index == 0) {
					this.$i18n.locale = 'zh';
					_data.localData('lang', 'zh')
				}
				if (this.lang_index == 1) {
					this.$i18n.locale = 'en';
					_data.localData('lang', 'en')
				}
				if (this.lang_index == 1) {
					this.$i18n.locale = 'th';
					_data.localData('lang', 'th')
				}
				this.initLang();
			},
			initData() {
				uni.setNavigationBarTitle({
					title: this.$t('my_.grxx')
				})
				_hook.routeTabBarHook();
				this.getUser();
				uni.$off('data_chat_list');
				let _this = this;
				// let	chat_list = _data.localData('chat_list');
				let chat_list = [];

				/** 监听最新数据 */
				uni.$on('data_chat_list', function(data) {
					// todo屏蔽 如果是屏蔽了，则未读为0
					// if(data[0].is_disturb == 1){
					// 	// 如果@本人或者全员则提示
					// 	if(data[0].last_msg.indexOf(_this.my_data.nickname) > -1 ||data[0].last_msg.indexOf('@所有人') > -1){

					// 	}else{
					// 		data[0].no_reader_num = 0;
					// 	}
					// }
					// todo @提示只要最新未读有就提示@
					data.forEach(item => {
						console.log("item.last_msg", item.last_msg)
						// 判断是不是表情包图片
						if (item.last_msg.indexOf('http') > -1) {
							item.last_msg = '[图片]'
						}
						item.last_msg = item.last_msg.replace('撤回了一条消息', _this.$t('message.back_message'))
							.replace('我通过了你的朋友验证请求,现在我们可以开始聊天了', _this.$t('message.cert')).replace('加入群聊',
								_this.$t('message.join_group')).replace('邀请了', _this.$t('group_tip.1'))
							.replace('进入会话', _this.$t('group_tip.2')).replace('退出了群聊', _this.$t(
								'group_tip.3')).replace('视频通话', _this.$t('new_message.1')).replace('[图片]',
								_this.$t('photo.8')).replace('[名片]', _this.$t('photo.9')).replace('[戳一戳]',
								_this.$t('photo.10')).replace('[语音]', _this.$t('photo.11')).replace('[视频]',
								_this.$t('photo.12')).replace('[文件]', _this.$t('photo.13')).replace('[位置]',
								_this.$t('photo.14')).replace('[未知]', _this.$t('photo.15')).replace('[红包]',
								_this.$t('photo.16'))
						if ((item.last_msg.indexOf('@' + _this.my_data.nickname) > -1 || item.last_msg
								.indexOf(
									'@所有人') >
								-1) && item.type == 1 && item.no_reader_num != 0) {
							_this.obj_notice[item.list_id] = 1;
						}
						if (item.no_reader_num == 0) {
							_this.obj_notice[item.list_id] = 0;
						}
					})
					data.forEach(item => {
						item.photo_path = item.photo_path + '?_=' + Math.random()
					})
					_this.list = data;

					_this.search_list = _this.list;
					console.log("接收到新数据....", data);
				});
				//有缓存则监听是否有数据更新，有则重新获取
				// uni.$once('update_chat_list', function () {
				//   _get.getChatList();
				// })
				/** 加载本地缓存数据，让页面秒速渲染出来 */
				if (chat_list.length) {
					// todo
					chat_list.forEach(item => {
						item.photo_path = item.photo_path + '?_=' + Math.random()
					})
					_this.list = chat_list;
				} else {
					_get.getChatList();
				}
				_this.action_menu = false;

				// 监听未读消息
				uni.$on('unread_msg', (data) => {
					this.unread_msg = data;
				})

				console.log("初始化数据");
			},
			// 初始化数据
			mescrollInit(obj) {

			},
			getUser() {
				let _this = this;
				_get.getUserInfo({}, function(data) {
					data.photo = data.photo + "?_=" + +Math.random();
					data.photo = data.photo.replace(/(\?_=)[\d\.]+$/, "$1" + Math.random());
					console.log("res个人资料", data);
					_this.my_data = data;
					//登陆IM
					// #ifdef APP-PLUS
					_this.loginHandler(data);
					// #endif
					_data.data("user_info", data);
				});
			},
			// 登录IMid
			loginHandler(data) {
				let userID = data.id.toString();
				let _this = this;
				try {
					const {
						userSig,
						SDKAppID
					} = newGenTestUserSig(userID);
					// 登录 腾讯SDK
					const options = {
						SDKAppID: SDKAppID, // 请替换为步骤一取到的 SDKAppID
						userID: userID, // 请替换为您的 UserID
						userSig: userSig, // 您可以在控制台中计算一个 UserSig 并填在这个位置
					};
					uni.$TUICallKit.login(options, (res) => {
						if (res.code === 0) {
							console.log('login success');
							_this.setUserAvatarHandler(data.nickname, _this.staticPhoto + data.face);
							uni.$TUICallKit.enableFloatWindow(true);
						} else {
							console.log(`login failed, error message = ${res.msg}`);
						}
					});
				} catch (e) {
					console.log("e");
					uni.hideLoading();
				}
			},
			initLang() {
				this.lang_arr = [
					this.$t('language.zh'),
					this.$t('language.en'),
					this.$t('language.th'),
				];
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
				} else {
					this.lang_index = 0;
				}
				this.changeLang();
			},
			// 设置头像
			setUserAvatarHandler(name, avatar) {
				console.log("参数信息", name, avatar);
				uni.$TUICallKit.setSelfInfo({
					nickName: name,
					avatar: avatar,
				}, (res) => {
					if (res.code === 0) {
						console.log('设置信息成功');
					} else {
						console.log(`设置信息失败, error message = ${res.msg}`);
					}
				})
			},
			// 下拉刷新
			downCallback(obj) {
				_get.getChatList();
				setTimeout(() => {
					obj.endSuccess();
				}, 1000)
			},
			search(chat_msg) {
				chat_msg = chat_msg.trim();
				let _this = this;
				_this.keyword = chat_msg;
				console.log(!chat_msg)
				if (!chat_msg) {
					_this.list = _this.search_list;
					return true;
				}
				_get.serchChatMsg({
					'chat_msg': chat_msg
				}, function(data) {
					_this.list = data;
				})
			},
			goPath(path) {
				if (path) {
					uni.navigateTo({
						url: path
					})
				}
			},
			imageError(e) {
				let index = e.currentTarget.dataset.index
				//替换index对应的图片
				this.list[index].photo_path = '/default_photo_path.png';
			},
			msgHandle(msg, num) {
				if (num == undefined) num = 16;
				if (!msg) return '';
				msg = msg.replace(/&lt;/g, '<');
				return msg.length > num ? msg.substr(0, num) + '...' : msg;
			},
			timestampFormat(time) {
				return _action.timestampFormat(time);
			},
			changeLang() {
				let _this = this;
				uni.setTabBarItem({
					index: 0,
					text: _this.$t("tabbar.chat"),
					success: function(res) {
						console.log(res);
					},
				});
				uni.setTabBarItem({
					index: 1,
					text: _this.$t("tabbar.friend"),
					success: function(res) {
						console.log(res);
					},
				});
				uni.setTabBarItem({
					index: 2,
					text: _this.$t("tabbar.video"),
					success: function(res) {
						console.log(res);
					},
				});
				uni.setTabBarItem({
					index: 3,
					text: _this.$t("tabbar.find"),
					success: function(res) {
						console.log(res);
					},
				});
				uni.setTabBarItem({
					index: 4,
					text: _this.$t("tabbar.my"),
					success: function(res) {
						console.log(res);
					},
				});
			},
			goAction(type) {
				let path = '';
				switch (type) {
					case 0:
						path = '../friend/index_list?list_id=0';
						break;
					case 1:
						path = '../friend/add';
						break;
					case 2:
						path = '../my/store';
						break;
					default:
						return;
						break;
				}
				uni.navigateTo({
					url: path,
					animationType: 'slide-in-bottom',
				});
			},
			actionMain() {
				this.action_menu = !this.action_menu;
				this.action_menu_num++;
			},
			openedAction(key) {
				this.list_index = key;
			},
			swipeAction(e) {
				let list_index = e.content.number
				let _this = this,
					list_id = _this.list[list_index].list_id;
				if (!list_id) {
					return;
				}
				let top = _this.list[list_index].top;
				console.log("top", top)
				let value = top == 1 ? 0 : 1;
				console.log("value", value)
				switch (e.index) {
					case 0:
						//置顶 /取消置顶
						_this.$httpSend({
							path: '/im/message/chatTop ',
							data: {
								list_id: list_id,
								value: value
							},
							success: () => {
								_get.getChatList();
							}
						});
						break;
					case 1:
						/** 删除这条对话 */
						_this.$httpSend({
							path: '/im/chat/deleteChat',
							data: {
								list_id,
							},
							success: (data) => {
								_get.getChatList();
							}
						});
						break;
					default:
						break;
				}
			},
			swipeData(value, index) {
				return [{
						text: value.top == 1 ? 'Huỷ ghim' : 'Ghim',
						//置顶和取消置顶
						number: index,
						style: {

						},
					},
					{
						text: 'Xóa',
						number: index,
						style: {
							backgroundColor: 'rgb(255,58,49)',
						}
					}
				];
			},
			goMessage(list_id, key, no_reader_num, chat_id, photo_path, show_name) {
				if (no_reader_num > 0) {
					_get.getChatData({
						send_data: {
							list_id: list_id,
							time: 0,
							is_up: 1,
						},
						is_action_data: 1,
					});
					this.list[key].no_reader_num = 0;
					_data.localData('chat_list', this.list);
					_action.updataNoReader(list_id);
					_action.setStatusTips();
					uni.$on('unread_msg', (data) => {

						this.unread_msg = data;
					})
				}
				console.log("chat_id", chat_id);
				_data.localData('message_list_id', list_id);
				// './message?list_id=' + list_id + "&chat_id="+chat_id,
				uni.navigateTo({
					url: './message?list_id=' + list_id + '&avatar=' + photo_path + '&show_name=' + show_name
				});
			},
			goScanCode() {
				let _this = this;
				_this.action_menu = false;
				_page.scanCode();
			},
		},
		watch: {

		},
		onNavigationBarButtonTap(e) {
			this.action_menu = !this.action_menu;
		},
	}
</script>

<style lang="scss" scoped>
	@import '/static/css/chat/animate.css';

	page {
		background: #fff;
	}

	.icon-search {
		padding: 0 4rpx !important;
	}

	.page {
		width: 100%;
		height: 100%;
		background-color: #fff;
	}

	.uni-list-cell {
		overflow: hidden;
		height: 74px !important;
	}

	.uni-media-list-logo {
		height: 100upx;
		width: 100upx;
	}

	.search .content {
		padding-left: 20upx;
		height: 60upx;
		background-color: #F7F7F7 !important;
	}

	.header {
		display: flex;
		flex-direction: row;
		padding: 10px 15px;
		align-items: center;
	}

	.input-view {
		display: flex;
		align-items: center;
		flex-direction: row;
		background-color: #e7e7e7;
		height: 30px;
		border-radius: 5px;
		padding: 0 10px;
		flex: 1;
	}

	.input {
		flex: 1;
		padding: 0 5px;
		height: 24px;
		line-height: 24px;
		font-size: 16px;
	}

	.red_num {
		position: absolute;
		z-index: 100;
		height: 34upx;
		top: 24rpx;
		left: 120upx;
		font-size: 23upx !important;


	}

	/**
	.uni-media-list-body {
		height: auto;
	}
	*/

	.uni-swipe-action,
	.uni-swipe,
	.uni-view,
	.uni-media-list {
		width: 750upx !important;
	}

	.action_main {
		position: fixed;
		top: 55px;
		/* #ifndef H5 */
		top: 15px;
		/* #endif */
		width: 750upx;
		height: 1080upx;
		z-index: 10000;
	}

	.action_base {
		position: absolute;
		width: auto;
		top: -10rpx;
		right: 0;
		/* #ifdef APP-PLUS */
		top: 140rpx;
		/* #endif */
		background: #ffffff;
		border-radius: 30rpx 0 0 30rpx;
		box-shadow: 0 0 20rpx 10rpx rgba(0, 0, 0, .1);
		background: linear-gradient(315deg, #685BED 0%, #2F63FF 100%);
	}




	.action_item {
		color: whitesmoke;
		// width: 80rpx;
		height: 100upx;
		line-height: 100upx;
		margin-left: 30upx;
		margin-right: 30rpx;
		// border-bottom: 1px solid #f5f5f5;
		display: flex;
		align-items: center;
	}

	.action_icon {
		width: 48rpx;
		height: 48rpx;
		display: flex;
		justify-content: center;
		align-items: center;

		image {
			width: 48rpx;
			height: 48rpx;
		}
	}

	.action_item:last-child {
		border: none;
	}

	.action_item_text {
		font-size: 30upx;
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
		position: relative;
	}

	.searchOut {
		box-sizing: border-box;
		padding: 0 14rpx;
	}

	.topFont {
		font-size: 40rpx;
		color: #080E18;
		font-weight: bold;
		margin-left: 10rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		margin-right: -40rpx;
	}

	.titleLf {
		display: flex;
		justify-content: flex-end;
		align-items: center;
	}

	.titleLf>image {
		width: 40rpx;
		height: 40rpx;
		margin-left: 30rpx;
	}

	.searchOut {
		box-sizing: border-box;
		padding: 0 28rpx;
		margin: 0 auto;
	}

	body {
		background-color: #fff;
	}

	.searchBt {

		display: flex;
		justify-content: flex-start;
		align-items: center;
		box-sizing: border-box;

		padding-left: 28rpx;
		padding-bottom: 10rpx;
		border-bottom: 2rpx solid #F2F2F2;
	}

	.searchBtItem {
		margin-right: 40rpx;
		display: flex;
		justify-content: flex-start;
		align-items: center;
	}

	.searchBtItem>text {
		color: #ABACAE;
		font-size: 28rpx;
	}

	.searchBtItem>text:first-child {
		font-size: 40rpx;
		margin-right: 14rpx;
	}

	.searchBtItem>image {
		width: 40rpx;
		height: 40rpx;
		margin-right: 14rpx;
	}

	.searchOut .search {
		padding: 14rpx 0;
	}

	.noData {
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-wrap: wrap;
		align-content: center;
		height: 700rpx;
	}

	.noData>image {
		width: 487rpx;
		height: 371rpx;
	}

	.noData>text {
		display: block;
		width: 100%;
		color: #9298A3;
		font-size: 32rpx;
		text-align: center;
	}
</style>