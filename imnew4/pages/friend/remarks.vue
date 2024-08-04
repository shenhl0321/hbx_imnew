<template>
	<view>
		<view class="uni-title uni-common-pl">{{$t('friend.remarks.set_remark')}}</view>
		<view class="uni-textarea">
			<textarea auto-height v-model="content" :maxlength="20" />
		</view>
	</view>
</template>

<script>
	import _get from '../../common/_get';
	import _hook from '../../common/_hook';

	export default {
		components: {

		},
		data() {
			return {
				user_id: '',
				is_type: 0,
				content: '',
			}
		},
		onShow() {
			uni.setNavigationBarTitle({
				title: this.$t("friend.remarks.t_title")
			})
			_hook.routeSonHook();
		},
		onLoad(option) {
			let _this = this;
			_this.user_id = option.user_id;
			_this.$httpSend({
				path: '/im/friend/getRemarks',
				data: {
					user_id: _this.user_id,
				},
				success(data) {
					_this.content = data.remarks;
				}
			});
		},
		computed: {

		},
		methods: {
			send() {
				let _this = this;
				if (_this.content == '') {
					uni.showToast({
						title: _this.$t('friend.remarks.p_input_remark'),
						icon: 'none',
					});
					return;
				}
				_this.$httpSend({
					path: '/im/friend/setRemarks',
					data: {
						content: _this.content,
						user_id: _this.user_id,
					},
					success_action: true,
					success(res) {
						if(res.err == 0){
							uni.showToast({
								title: _this.$t('err.s'),
								duration: 2000,
								icon:'none'
							});
							_get.getFriendList();
							_get.getChatList();
							setTimeout(() => {
								uni.reLaunch({
									url: './index'
								});
							}, 2000);
						}else{
							uni.showToast({
								title: _this.$t('err.2'),
								duration: 2000,
								icon:'none'
							});
						}
					}
				});
			}
		},
		onNavigationBarButtonTap(e) {
			if (e.index == 0) {
				this.send();
			}
		},
		watch: {

		},
	}
</script>

<style>

</style>