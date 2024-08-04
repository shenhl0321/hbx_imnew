<template>
	<view class="page">


	<!-- 自定义导航 -->
		<view class="flex align-center " style="background-color: white;" >
			<image @tap="backGo" src="../../static/share/zuojiantou.png"  style="width: 35rpx;
			height: 35rpx; margin-top: 35rpx; margin-left: 20rpx; " mode=""></image>
			<text style="color: black; font-size: 40rpx;margin-left: 200rpx;" class="fonts">{{$t('top.zlsz')}}</text>
		</view>
		<navigator hover-class="none" :url="'/pages/friend/remarks?user_id=' + user_id" animation-type="slide-in-bottom">
			<view class="uni-list">
				<view class="uni-list-cell" hover-class="none">
					<view class="uni-list-cell-navigate uni-navigate-right">
							<view style="width:100%">
									{{$t('friend.apply_list.detail_set')}}
							</view>
					</view>
				</view>
			</view>
		</navigator>
		<view class="switch_class" style="margin-top: 20upx;" v-if="0">
			<view class="uni-list">
				<view class="uni-list-cell uni-list-cell-pd">
					<view class="uni-list-cell-db">{{$t('detail.more.top_chat')}}</view>
					<switch color="#02b300" :checked="false" />
				</view>
				<view class="uni-list-cell uni-list-cell-pd" v-if="0">
					<view class="uni-list-cell-db">{{$t('detail.more.msg_free')}}</view>
					<switch color="#02b300" />
				</view>
				<view class="uni-list-cell uni-list-cell-pd" v-if="0">
					<view class="uni-list-cell-db">{{$t('detail.more.strong_reminder')}}</view>
					<switch color="#02b300"/>
				</view>
			</view>
		</view>
		
		<view class="uni-list" style="margin-top: 20upx;" v-if="data.remove">
			<view class="uni-list-cell" hover-class="none">
				<view class="uni-list-cell-navigate" @tap="goDelete">
					<view class="tool">
					{{$t('friend.apply_list.delete')}}
					</view>
				</view>
			</view>
		</view>
		
	</view>
</template>

<script>
	
	import _hook from '../../common/_hook';
	import _get from '../../common/_get';
	import _data from '../../common/_data';
	
	export default {
		data() {
			return {
				user_id: 0,
				data: {
					remove: 0,
				},
			};
		},
		computed: {
			
		},
		onShow(){
			_hook.routeSonHook();
		},
		methods: {
			backGo(){
				uni.switchTab({
					url:'/pages/chat/index'
				})
			},
			goDelete(){
				let _this = this;
				uni.showModal({
					title: _this.$t('dialog.title1'),
					content: _this.$t('detail.more.delete_notice'),
					success: function (res) {
						if (res.confirm) {
							_this.$httpSend({
								path: '/im/remove/friend',
								data: { user_id: _this.user_id },
								success(list_id) {
									uni.showToast({
										title: '',
										duration: 1500,
										// icon:'none',
									});
									
									/** 删除会话列表数据 **/
									for(let i = 0,local_chat_list = _data.localData('chat_list'),j = local_chat_list.length;i < j;i ++){
										if(local_chat_list[i].list_id == list_id){											
											local_chat_list.splice(i,1);											
											_data.localData('chat_list',local_chat_list);
											uni.$emit('data_chat_list',local_chat_list);
											break;
										}
									}
									
									/** 删除对话数据 */
									_data.localData(list_id,null);
									
									/** 从我的好友列表里删除 */
									for(let i = 0,v = _data.localData('friend_list'),j = v.length;i < j;i ++){
										for(let k = 0,o = v[i].data,l = o.length;k < l;k ++){
											if(o[k].user_id == _this.user_id){
												v[i].data.splice(k,1);
												_data.localData('friend_list',v);
												uni.$emit('data_friend_list',v);
												break;
											}
										}
									}
									
									setTimeout(() => {
										uni.switchTab({
											url: '../friend/index',
										});
									},1600);
								}
								
							});
						}
					}
				});
			}
		},
		onLoad(option) {
			this.user_id = option.user_id;
			let _this = this;
			_this.$httpSend({
				path: '/im/friend/details',
				data: { user_id: _this.user_id },
				success(data) {
					_this.data = data;
				}
			});
			
		},
	}
	
</script>

<style>
	.flex{
		width: 100%;
		height: 100rpx;
	}
	.tool {
		width:100%;
		text-align: center;
		color: red;
	}
</style>
