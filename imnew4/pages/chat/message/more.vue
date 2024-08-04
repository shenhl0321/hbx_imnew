<template>
	<view class="all">

		<view class="page">
			<view class="title" v-if="data.type == 0">
				<view class="title-msg">
					<view class="title_val">{{$t('chat.message.more.members')}}</view>
					<view class="title_num">
						{{$t('chat.message.more.total')}} {{data.member.length}} {{$t('chat.message.more.user')}}
					</view>
				</view>
				<view class="title-img">
					<uni-icons :size="22" class="uni-icon-wrapper" color="#c9c9cb" type="arrowright" />
				</view>
			</view>

			<view class="photos" v-if="data.type == 0">
				<view class="photo_main" v-for="(val,index) of data.member" :key="index" @tap="goDetails(val.user_id)">
					<image class="photo" :src="photo(val.photo+'')" :lazy-load="true" style="border-radius: 50%;"
						:data-index="index" @erro="imageError" />
					<view class="name_class">{{val.show_name}}</view>
				</view>
				<view class="photo_main" @tap="add" v-if="data.type">
					<image class="photo" :src="'../../../static/theme/default/chat/add.png'" :lazy-load="true" />
					<view class="name_class  msg-size">{{$t('chat.message.more.invite')}}</view>
				</view>
				<view class="photo_main" @tap="reduce" v-if="data.is_action && data.type">
					<image class="photo" :src="'../../../static/theme/default/chat/reduce.png'" :lazy-load="true" />
					<view class="name_class  msg-size">{{$t('chat.message.more.remove')}}</view>
				</view>
			</view>

			<view class="uni-card" v-if="data.type == 1">


				<view class="list-member-count"></view>
				<view class="uni-list">
					<view class="uni-list-cell" @click="toMember">
						<view class="uni-list-cell-navigate uni-navigate-right">
							<view>
								<text class="msg-size">{{$t('chat.message.more.member')}}</text>
								<view class="show_text msg-size">
									{{$t('chat.message.more.total')}} {{data.member.length}} {{$t('chat.message.more.user')}}
								</view>
							</view>
						</view>
					</view>
					<view class="group-member-list">
						<image class="group-member-item" v-if="val.is_admin ==1 || val.is_admin ==2" :src="photo(val.photo+'')" v-for="(val,index) of data.member"
							:key="index" :data-index="index" @erro="imageError"></image>
						<view class="group-member-btn" @tap="add">
							+
						</view>
						<view class="group-member-btn" @tap="reduce">
							-
						</view>
					</view>
					<view class="chatgroup">
						<view class="chatgroup-list">
							<view class="chatgroup-item" @tap="goSet('notice')">
								<image src="/static//group/Frame 427319904@2x.png" mode=""></image>
								<text>{{$t('chat.message.more.group_gonggao')}}</text>
							</view>
							<view class="chatgroup-item" @tap="goSetGroupPhoto">
								<image src="/static/group//Frame 427319904@2x(1).png" mode=""></image>
								<text>{{$t('chat.group_photo_title')}}</text>
							</view>
							<!-- <view class="chatgroup-item">
								<image src="/static/group//Frame 427319904@2x(2).png" mode=""></image>
								<text>{{$t('chat.message.more.search')}}</text>
							</view> -->
							<view class="chatgroup-item" v-if="is_admin" @tap="manarger('notice')">
								<image src="/static/group//Frame 427319904@2x(3).png" mode=""></image>
								<text>{{$t('chat.message.more.group_manage')}}</text>
							</view>
						</view>
					</view>
					<view class="uni-list-cell" style="height: 80px!important;" @tap="goGroupQrcode">
						<view class="uni-media-list uni-list-cell-navigate uni-navigate-right">
							<view class="group-tips">
								<text class="msg-size">{{$t('chat.message.more.share')}}</text>
								<text class="" style="color: #8f8f94;">{{$t('chat.message.more.qrcode')}}</text>
							</view>
						</view>
					</view>
					<view class="list-member-count"></view>
					<view class="uni-list-cell" @tap="groupNickname(data.my_nickname)">
						<view class="uni-media-list uni-list-cell-navigate uni-navigate-right">
							<text class="msg-size">{{$t('chat.message.more.member_nickname')}}</text>
							<view class="uni-media-list-logo qun-id">
								<view class="show_text msg-size">{{data.my_nickname}}</view>
							</view>
						</view>
					</view>
					<view class="uni-list-cell" @tap="goSet('name')">
						<view class="uni-list-cell-navigate uni-navigate-right">
							<view>
								<text class="msg-size">{{$t('chat.message.more.group_nickname')}}</text>
								<view class="msg-size show_text">{{data.group.name}}</view>
							</view>
						</view>
					</view>
					<!-- <view class="uni-list-cell" @tap="groupCopy" style="height:auto!important;">
						<view class="uni-media-list uni-navigate-right uni-navigate-right">
							<view style="display: flex;">
								<text class="msg-size" style="width:300rpx;">{{$t('chat.message.more.group_id')}}</text>
								<view class="msg-size show_text">{{replaceStr(data.group.id + '')}}</view>
							</view>
						</view>
					</view> -->

					<view class="list-member-count">
					</view>

					<!-- <view class="uni-list-cell" @tap="goBigRedList">
						<view class="uni-media-list uni-list-cell-navigate uni-navigate-right">
							<text class="msg-size">{{$t('chat.message.more.long_time_no_get_bonus')}}</text>
							<view class="uni-media-list-logo photo_qrcode">
							</view>
						</view>
					</view> -->
				</view>
			</view>
			<view class="switch_class">
				<view class="uni-list">
					<view class="uni-list-cell uni-list-cell-pd">
						<view class="uni-list-cell-db msg-size">{{$t('chat.message.more.top_chat')}}</view>
						<switch :checked="!!data.top" @change="msgTop" />
					</view>
					<view class="uni-list-cell uni-list-cell-pd">
						<view class="uni-list-cell-db  msg-size">{{$t('chat.message.more.msg_free')}}</view>
						<switch :checked="!!data.is_disturb" @change="disturb" />
					</view>
					<view class="uni-list-cell uni-list-cell-pd" v-if="disappear_after_read == 1">
						<view class="uni-list-cell-db  msg-size">{{$t('chat.message.more.yhjf')}}</view>
						<switch :checked="!!yhjf" @change="changeYHJF" />
					</view>
					<view v-if="data.type == 1" class="uni-list-cell"
						@click="clearLog(3,$t('dialog.content1'))">
						<view class="uni-list-cell-navigate uni-navigate-right">
							<view class="qun-gonggao">
								<text class="msg-size">{{$t('chat.message.more.clear_my')}}</text>
								<view class="show_text_ msg-size"></view>
							</view>
						</view>
					</view>
					<view v-if="data.type == 1" class="uni-list-cell" @click="clearLog(2,$t('dialog.content1'))">
						<view class="uni-list-cell-navigate uni-navigate-right">
							<view class="qun-gonggao">
								<text class="msg-size">{{$t('chat.message.more.clear')}}</text>
								<view class="show_text_ msg-size"></view>
							</view>
						</view>
					</view>
					<view v-if="data.type == 0" class="uni-list-cell" @click="clearLog(1,$t('dialog.content1'))">
						<view class="uni-list-cell-navigate uni-navigate-right">
							<view class="qun-gonggao">
								<text class="msg-size">{{$t('chat.message.more.clear')}}</text>
								<view class="show_text_ msg-size"></view>
							</view>
						</view>
					</view>

					<view v-if="data.type == 0" class="uni-list-cell" @click="clearLog(2,$t('dialog.content3'))">
						<view class="uni-list-cell-navigate uni-navigate-right">
							<view class="qun-gonggao">
								<text class="msg-size">{{$t('chat.message.more.clear_all')}}</text>
								<view class="show_text_ msg-size"></view>
							</view>
						</view>
					</view>

					<!--<view class="uni-list-cell"  v-if="data.type == 0"  @tap="xiaoHui">-->
					<!--<view class="uni-list-cell-navigate uni-navigate-right">-->
					<!--<view class="qun-gonggao">-->
					<!--<text  class="msg-size">一键销毁双方记录</text>-->
					<!--<view class="show_text_ msg-size"></view>-->
					<!--</view>-->
					<!--</view>-->
					<!--</view>-->
					<view class="uni-list-cell" v-if="user_id != 5800" @tap="goKefu">
						<view class="uni-list-cell-navigate uni-navigate-right">
							<view class="qun-gonggao">
								<text class="msg-size">{{$t('chat.message.more.jubao')}}</text>
								<view class="show_text_ msg-size"></view>
							</view>
						</view>
					</view>
					<view class="uni-list-cell">
						<view class="uni-list-cell-navigate my-padding">
							<view class="qun-gonggao">
								<text class="msg-size">IP</text>
								<view class="show_text_ msg-size">
									{{data.ip}}
								</view>
							</view>
						</view>
					</view>
					<view class="uni-list-cell uni-list-cell-pd" v-if="0">
						<view class="uni-list-cell-db  msg-size">{{$t('chat.message.more.qiang')}}</view>
						<switch />
					</view>
				</view>

			</view>
			<view class="list-member-count">
			</view>


			<view class="del-btn" v-if="data.type == 1" @tap="leaveGroup">{{$t('chat.message.more.del_tui')}}</view>


		</view>
	</view>
</template>

<script>
	import _hook from '../../../common/_hook';
	import _data from '../../../common/_data';
	import _get from '../../../common/_get';
	import _mixins from '../../../common/_mixins';
	import _page from '../../../common/common';

	export default {
		data() {
			return {
				data: {
					member: [],
					group: {
						is_photo: 'default_group_photo/90.jpg',
					},
					is_action: 0,
					type: 1,
				},
				list_id: 0,
				user_id: 0,
				yhjf: false,
				disappear_after_read: 0, //是否开启阅后即焚
				is_admin: false
			};
		},
		computed: {
			staticPhoto() {
				return _data.staticPhoto();
			},
			isAction() {
				if (this.data.group.main_id == _data.data('user_info').id) {
					return true;
				}
				return false;
			},
			showKefu() {
				return this.my_data.id != 5880
			}
		},
		onShow() {
			this.getYHJFstatus();
			this.initData();
		},
		methods: {
			// 获取是否开启阅后即焚
			getYHJFstatus() {
				const _this = this
				_mixins.methods.$httpSend({
					path: '/im/get/base',
					success(data) {
						console.log("阅后即焚状态", data)
						_this.disappear_after_read = data.disappear_after_read; //后台是否开启阅后即焚
					},
					fail(err) {
						console.log("err", err);
					}
				});
			},
			// 是否开启阅后即焚
			changeYHJF(data) {
				console.log("value", data.detail.value)
				_data.localData(this.list_id + '_yhjf', data.detail.value)
			},
			initData() {
				uni.setNavigationBarTitle({
					title: this.$t('more.t_title')
				})
				_hook.routeSonHook();
				let _this = this;
				_this.$httpSend({
					path: '/im/message/getChatDetails',
					data: {
						list_id: _this.list_id,
					},
					success(data) {
						_this.data = data;
						if (data.type == 1) {
							uni.setNavigationBarTitle({
								title: data.group.name,
							});
						}
						let cache_data = _data.data('cache');
						if (data.type == 1 && !('group_photo_' + _this.list_id in cache_data)) {
							uni.downloadFile({
								url: _data.staticPhoto() + data.group.is_photo,
								success: (res) => {
									if (res.statusCode === 200) {
										cache_data['group_photo_' + _this.list_id] = res.tempFilePath;
										_data.data('cache', cache_data);
									}
								}
							});
						}
						data.member.forEach(item => {
							if(data.user_id == item.user_id && item.is_admin != 0) {
								_this.is_admin = true;
							}
						})
					}
				});
			},
			// 删除退出群聊
			leaveGroup() {
				let _this = this;
				uni.showModal({
					title: this.$t('dialog.title1'),
					content: this.$t('dialog.content2'),
					confirmText: this.$t('dialog.confirm1'),
					cancelText: this.$t('dialog.cancel1'),
					confirmColor: 'red',
					cancelColor: '#353535',
					success: function(res) {
						if (res.confirm) {
							_this.$httpSend({
								path: '/im/remove/sign_out',
								data: {
									list_id: _this.list_id,
								},
								success: function(data) {
									if (data.code == 0) {
										uni.showToast()
										_data.localData('chat_list', []);
										_data.localData(_this.list_id, null);
										uni.switchTab({
											url: '/pages/chat/index'
										})
									} else {
										uni.showToast({
											icon: 'none',
											title: data.msg
										})
									}

								}
							})
						}
					},
				})
			},
			// 清除聊天我的
			clearLog(type, msg) {
				let _this = this;
				uni.showModal({
					title: this.$t('dialog.title1'),
					content: msg,
					confirmText: this.$t('dialog.confirm1'),
					cancelText: this.$t('dialog.cancel1'),
					confirmColor: 'red',
					cancelColor: '#353535',
					success: function(res) {
						if (res.confirm) {
							_this.$httpSend({
								path: '/im/remove/del_log',
								data: {
									list_id: _this.list_id,
									type: type
								},
								success: function(data) {
									uni.showToast()
									_data.localData(_this.list_id, null);
									_this.initData();
								}
							})
						}
					},
				})
			},
			toMember() {
				uni.navigateTo({
					url: './group_member?list_id=' + this.list_id
				})
			},
			reduce() {
				uni.navigateTo({
					url: ('./reduce?list_id=' + this.list_id),
					animationType: 'slide-in-bottom',
				});
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
			groupNickname(val) {
				console.log(val)
				uni.navigateTo({
					url: 'group_nickname?' + _page.pageParam({
						list_id: this.list_id,
						nickname: val
					})
				})
			},
			disturb(e) {
				//消息免打扰
				let value = e.detail.value ? 1 : 0;
				let _this = this;
				this.$httpSend({
					path: '/im/message/msgDisturb',
					data: {
						list_id: this.list_id,
						value: value
					},
					success(data) {
						_data.localData('DISTURB:' + _this.list_id, value)
					}
				});
			},
			imageError(e) {
				console.log("图片加载失败!", e.detail);
				let index = e.currentTarget.dataset.index
				console.log(e.currentTarget.dataset.index)
				//替换index对应的图片
				console.log(this.data.member[index].photo)
				this.data.member[index].photo = '/default_photo_path.png';
			},
			removeGroup() {
				let _this = this;
				uni.showModal({
					title: '重要提示',
					content: '此操作数据不可恢复,确定要解散该群吗?',
					confirmText: '不解散',
					cancelText: '解散',
					confirmColor: '#353535',
					cancelColor: 'red',
					success: function(res) {
						if (!res.confirm) {
							_this.$httpSend({
								path: '/im/message/removeGroup',
								data: {
									list_id: _this.list_id,
								},
								success(data) {
									uni.switchTab({
										url: '../index'
									});
								}
							});
						}
					}
				});
			},
			photo(path) {
				return this.staticPhoto + path + '?_=' + Math.random();
			},
			msgChange(e) {
				let value = e.detail.value ? 1 : 0;
				if (this.data.is_action != 2) {
					uni.showModal({
						content: this.$t('chat.message.more.quan_xian'),
						showCancel: false,
					});
					return;
				}
				this.$httpSend({
					path: '/im/message/groupIsMsg',
					data: {
						list_id: this.list_id,
						value,
					},
					success(data) {
						return;
						uni.showToast();
					}
				});
			},
			nimingChange(e) {
				let value = e.detail.value ? 1 : 0;
				if (!this.data.is_action && this.data.is_action != 2) {
					uni.showModal({
						content: this.$t('chat.message.more.quan_xian'),
						showCancel: false,
					});
					return;
				}
				this.$httpSend({
					path: '/im/message/nimingChange',
					data: {
						list_id: this.list_id,
						value,
					},
					success(data) {
						return;
						uni.showToast();
					}
				});
			},
			msgTop(e) {
				let _this = this,
					value = e.detail.value ? 1 : 0;
				this.$httpSend({
					path: '/im/message/chatTop',
					data: {
						list_id: this.list_id,
						value,
					},
					success(data) {
						/** 更新对话列表数据 */
						for (let i = 0, local_chat_list = _data.localData('chat_list'), j = local_chat_list
								.length; i < j; i++) {
							if (local_chat_list[i].list_id == _this.list_id) {
								let action_list_data = local_chat_list[i];
								local_chat_list.splice(i, 1);
								local_chat_list.unshift(action_list_data);
								_data.localData('chat_list', local_chat_list);
								uni.$emit('data_chat_list', local_chat_list);
								break;
							}
						}

						return;
						uni.showToast();
					}
				});
			},
			switch1Change(e) {
				let _this = this,
					value = e.detail.value ? 1 : 0;
				this.$httpSend({
					path: '/im/message/speekChecked',
					data: {
						list_id: this.list_id,
						value: value,
					},
					success(data) {
						/** 更新对话列表数据 */
						for (let i = 0, local_chat_list = _data.localData('chat_list'), j = local_chat_list
								.length; i < j; i++) {
							if (local_chat_list[i].list_id == _this.list_id) {
								let action_list_data = local_chat_list[i];
								local_chat_list.splice(i, 1);
								local_chat_list.unshift(action_list_data);
								_data.localData('chat_list', local_chat_list);
								uni.$emit('data_chat_list', local_chat_list);
								break;
							}
						}
					}
				});
			},
			editChange(e) {
				let _this = this,
					value = e.detail.value ? 1 : 0;
				this.$httpSend({
					path: '/im/vendor/editChange',
					data: {
						list_id: this.list_id,
						value: value,
					},
					success(data) {

					}
				});
			},
			goGroupQrcode() {
				uni.navigateTo({
					url: ('./group_qrcode?list_id=' + this.list_id),
					animationType: 'slide-in-bottom',
				});
			},
			goSetGroupPhoto() {
				if (this.data.is_action != 2 && !this.data.group.edit_photo) {
					uni.showToast({
						title: this.$t('chat.message.more.quan_xian'),
						icon: 'none',
						duration: 1000
					});
					return;
				}
				uni.navigateTo({
					url: ('../../set/group_photo?list_id=' + this.list_id),
					animationType: 'slide-in-bottom',
				});
			},
			goSetAdmin(type) {
				switch (type) {
					case 1:
						if (this.data.is_action != 2) {
							console.log("this.data.is_action", this.data.is_action)
							uni.showToast({
								title: '群主才能设置',
								icon: 'none',
								duration: 1000
							});
							return;
						}
						break;
					case 2:
						if (this.data.is_action != 2) {
							uni.showModal({
								content: this.$t('chat.message.more.quan_xian'),
								showCancel: false,
							});
							return;
						}
						break;
					case 3:
						if (this.data.is_action != 2) {
							uni.showModal({
								content: this.$t('chat.message.more.quan_xian'),
								showCancel: false,
							});
							return;
						}
						break;
					case 4:
						if (this.data.is_action != 2) {
							uni.showModal({
								content: this.$t('chat.message.more.quan_xian'),
								showCancel: false,
							});
							return;
						}
						break;
					default:
						return;
						break;
				}
				let url = '../../set/group_admin?list_id=' + this.list_id + '&type=' + type;
				if (type == 3) url = '../../set/group_trans?list_id=' + this.list_id + '&type=' + type;
				if (type == 4) url = '../../set/copy_group?list_id=' + this.list_id + '&type=' + type;
				uni.navigateTo({
					url: url,
					animationType: 'slide-in-bottom',
				});
			},
			goSet(type) {
				if (this.data.is_action != 2 && !this.data.group.edit_photo) {
					uni.showToast({
						title: this.$t('chat.message.more.quan_xian'),
						icon: 'none',
						duration: 1000
					});
					return;
				}
				uni.navigateTo({
					url: ('../../set/message_more?list_id=' + this.list_id + '&type=' + type),
					animationType: 'slide-in-bottom',
				});
			},
			goDetails(user_id) {
				if (this.data.type && this.data.is_action != 2) {
					uni.showToast({
						title: this.$t('chat.message.more.quan_xian'),
						icon: 'none',
						duration: 1000
					});
					return;
				}
				uni.navigateTo({
					url: ('../../details/index?user_id=' + user_id + '&type=' + this.data.type + '&list_id=' + this
						.list_id + "&is_action=" + this.data.is_action),
				});
			},
			add() {
				// 取消只有群主能添加人
				// if (this.data.is_action != 2) {
				// 	uni.showModal({
				// 		content: this.$t('chat.message.more.quan_xian'),
				// 		showCancel: false,
				// 	});
				// 	return;
				// }
				uni.navigateTo({
					url: ('../../friend/index_list?list_id=' + this.list_id),
					animationType: 'slide-in-bottom',
				});
			},
			reduce() {
				// 取消只有群主能踢人
				// if (this.data.is_action != 2) {
				// 	uni.showModal({
				// 		content:this.$t('chat.message.more.quan_xian'),
				// 		showCancel: false,
				// 	});
				// 	return;
				// }
				uni.navigateTo({
					url: ('./reduce?list_id=' + this.list_id),
					animationType: 'slide-in-bottom',
				});
			},
			groupCopy(value) {
				const _this = this;
				uni.setClipboardData({
					data: this.data.group.id,
					success: function() {
						uni.showToast({
							'title': _this.$t('other_.fz'),
							duration: 2000,
							icon: 'none',
						})
					},
					fail(err) {
						uni.showToast({
							icon: 'none',
							'title': err.msg,
							duration: 2000
						})
					},
				})
			},
			replaceStr(str) {
				console.log(str)
				return str.substr(10)
			},
			getRedChange(e) {
				let _this = this,
					value = e.detail.value ? 1 : 0;
				this.$httpSend({
					path: '/im/vendor/getRedChange',
					data: {
						list_id: this.list_id,
						value: value,
					},
					success(data) {

					}
				});
			},
			goBigRedList() { //todo 长时间未领取红包列表
				uni.navigateTo({
					url: "../message/red_list?list_id=" + this.list_id
				})
			},
			manarger() {
				uni.navigateTo({
					url: '../message/qun_manage?list_id=' + this.list_id
				})
			},
			xiaoHui() { //销毁聊天记录
				_get.xiaoHui({
					type: this.data.type,
					list_id: this.list_id
				}, function() {

				})
			}
		},
		onLoad(option) {
			this.list_id = option.list_id;
			this.data.type = option.type;
			this.yhjf = _data.localData(this.list_id + "_yhjf") || false
		},
	}
</script>

<style lang="scss">
	.noarrow::after {
		content: "";
		display: none !important;
	}

	.uni-card {
		margin: 0;
	}

	.del-btn {
		background: #fff;
		height: 100rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		color: #c5474d;
		font-size: 30rpx;
	}

	.group-tips {
		display: flex;
		flex-direction: column;
		height: 100rpx;
	}

	.group-member-list::after {
		position: absolute;
		z-index: 3;
		right: 0;
		bottom: 0;
		left: 10px;
		height: 1px;
		content: '';
		-webkit-transform: scaleY(.5);
		transform: scaleY(.5);
		background-color: #e7e6ef;
	}

	.group-member-list {
		display: flex;
		flex-wrap: wrap;
		position: relative;

		.group-member-item {
			width: 80rpx;
			height: 80rpx;
			border-radius: 50%;
			margin: 32rpx;
		}

		.group-member-btn {
			width: 80rpx;
			height: 80rpx;
			border-radius: 50%;
			background: #efefef;
			margin: 32rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 40rpx;
			color: #b6b6b8;
			font-weight: bold;
		}
	}

	.chatgroup {
		width: 100%;
		height: 180rpx;
		// margin-top: 20rpx;
		// margin-bottom: 20rpx;

		.chatgroup-list {
			display: flex;
			// justify-content: space-around;

			.chatgroup-item {
				min-width: 146rpx;
				flex-shrink: 0;
				height: 146rpx;
				display: flex;
				margin: 0 20rpx;
				justify-content: space-around;
				margin-top: 38rpx;

			}

			.chatgroup-item image {
				width: 88rpx;
				height: 88rpx;
				position: absolute;
			}

			.chatgroup-item text {
				position: absolute;
				font-size: 25rpx;
				margin-top: 90rpx;
				color: dimgrey;
			}
		}
	}

	.chatgroup-box {
		display: flex;
		flex-direction: column;

		.chatgroup-center {
			display: flex;
			justify-content: center;
			align-items: center;

			.chatgroup-tag {
				display: flex;
				justify-content: center;
				align-items: center;
				height: 40rpx;
				background-color: #f7f7f7;
				border-radius: 20rpx;
				box-sizing: border-box;
				padding: 0 10rpx;

				image {
					width: 30rpx;
					height: 30rpx;
				}

				text {
					font-size: 24rpx;
					color: #ccc;
				}
			}


		}

		.chatgroup-top {
			display: flex;
			align-items: center;
			justify-content: center;
			box-sizing: border-box;
			padding: 10rpx 40rpx;
			position: relative;

			.chatgroup-avatar-group {
				display: flex;
				flex-wrap: wrap;
				width: 200rpx;
				height: 200rpx;
				border-radius: 50%;
				overflow: hidden;
				margin-right: 20rpx;
				box-sizing: border-box;
				padding: 20rpx 10rpx;
				justify-content: center;
				align-items: center;

				.chatgroup-avatar-item-0 {
					width: 100rpx;
					height: 100rpx;
					border-radius: 50%;
				}

				.chatgroup-avatar-item-1 {
					width: 100rpx;
					height: 100rpx;
					border-radius: 50%;
				}

				.chatgroup-avatar-item-2 {
					width: 90rpx;
					height: 90rpx;
					border-radius: 50%;
				}

				.chatgroup-avatar-item-3 {
					width: 90rpx;
					height: 90rpx;
					border-radius: 50%;
				}

				.chatgroup-avatar-item-4 {
					width: 80rpx;
					height: 80rpx;
					border-radius: 50%;
				}

				.chatgroup-avatar-item-5 {
					width: 60rpx;
					height: 60rpx;
					border-radius: 50%;
				}

				.chatgroup-avatar-item-6 {
					width: 60rpx;
					height: 60rpx;
					border-radius: 50%;
				}
			}

			.chatgroup-avatar {
				width: 150rpx;
				height: 150rpx;
				border-radius: 10rpx;
				margin-right: 20rpx;
			}

			.chatgroup-title {
				flex: 1;
				font-size: 40rpx;
				font-weight: bold;
				width: 400rpx; //固定宽度
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 2;
				overflow: hidden;
			}
		}

		.chatgroup-top:after {
			font-family: uniicons;
			content: '\e583';
			position: absolute;
			right: 12px;
			top: 50%;
			transform: translateY(-50%);
			color: #bbb;
			font-size: 40rpx;
		}

		.chatgroup-list {
			display: flex;
			justify-content: space-around;
			align-items: center;
			height: 300rpx;


			.chatgroup-item {
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;

				image {
					width: 60rpx;
					height: 60rpx;
				}

				text {
					margin-top: 10rpx;
					font-size: 24rpx;
					color: #ccc;
				}
			}
		}

	}


	.my-padding {
		padding-right: 0 !important;
	}

	.page {
		max-width: 100%;
	}

	.photos {
		background-color: #FFFFFF;

	}

	.group-button {
		width: 92%;
		background-color: #5693ee;
		color: white;
		height: 70upx;
		line-height: 70upx !important;
		border-radius: 40upx;
		font-size: 36upx;
		cursor: pointer;
		margin-top: 20upx;
	}

	.photo_main {
		margin: 7upx 0 0 40upx;
		display: inline-block;
		text-align: center;
	}

	.qun-gonggao {
		display: flex;
		justify-content: space-between;
		width: 95%;
	}

	.photo {
		width: 106upx;
		height: 106upx;
		border-radius: 7upx;
	}

	.name_class {
		font-size: 12px;
		color: black;
		max-width: 106upx;
		overflow: hidden;
		white-space: nowrap;
	}

	.msg-size {
		font-size: 16px !important;
		font-weight: 600;
		// display: flex;
		// flex-wrap: wrap;
	}

	.title {
		background: #FFFFFF;
		padding: 10px 20px 10px 23px;
		border-top: 1px solid #e5e5e5;
		display: flex;
		justify-content: space-between;
	}

	.title-msg {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 90%;
		color: black !important;
		font-size: 16px !important;
	}

	.title-img {
		display: flex;
		align-items: center;
	}

	.title_val {
		display: inline-block;
	}

	.switch_class {
		margin-top: 20upx;
	}


	.show_text {

		position: absolute;
		text-align: right;
		right: 30px;
		color: #8f8f94;
		display: inline-block;
		height: 30px;
		width: 200rpx; //固定宽度
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.photo_qrcode {
		width: 52upx;
		height: 52upx;
		margin-right: 0upx;
	}

	.uni-list-cell-navigate.uni-navigate-right:after {
		font-size: 20px !important;
	}

	.uni-list-cell {
		height: 60px !important
	}

	.uni-list-cell-pd {
		padding: 0px 10px 0 12px !important;
	}

	.uni-media-list-logo {
		margin-right: 0px !important;
	}

	.qun-id {
		display: flex;
		justify-content: center;
		align-items: center;
		word-break: break-all;
	}

	.item-left-img {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 0 10px 0 25px;
	}

	.item-right-img {
		display: flex;
		justify-content: center;
		align-items: center;
		margin-right: 30px;
	}

	.item-right-img image {
		width: 20px;
		height: 20px;
	}

	.item-left-img image {
		width: 45px;
		height: 45px;
		border-radius: 10px;
	}

	.member-list {
		display: flex;
		flex-direction: column;
		background-color: #ffffff;

	}

	.member-item {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		padding: 20rpx;
		border-top: 1px solid #ebebeb;
	}

	.item-left {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}

	.item-right {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		padding: 0 30px 0 20px;
		color: #435d90;
	}

	.yaoqing-menber {
		display: flex;
		align-items: center;
		padding: 10px 0 10px 30px;
		background-color: #ffffff;
	}

	.yaoqing {
		margin-left: 5px;
	}

	.list-member-count {
		padding: 5px 0 5px 30px;
		background-color: #f9f9f9;
	}

	.doButton {
		padding: 10px;
	}

	.info {
		width: 686rpx;
		height: 45rpx;
		margin-left: 32rpx;
		background-color: rgba(0, 0, 0, 0.05);
		margin-top: 20rpx;
		border-radius: 30rpx;
	}

	.info image {
		width: 24rpx;
		height: 24rpx;
		margin-left: 200rpx;
	}

	.info text {
		font-size: 10rpx;
		color: #AEB1B8;
	}
</style>