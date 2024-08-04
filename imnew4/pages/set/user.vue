<template>
	<view>
		<view class="uni-textarea">
			<view v-if="type == '2'">
				<view class="uni-list">
					<radio-group @change="radioChange">

						<label class="uni-list-cell uni-list-cell-pd">
							<view>
								<radio :checked="info[show_type[type].key] == '0'" value="0" color="#1AAD19" />
							</view>
							<view>{{$t('other_.n')}}</view>
						</label>
						<label class="uni-list-cell uni-list-cell-pd">
							<view>
								<radio :checked="info[show_type[type].key] == '1'" value="1" color="#1AAD19" />
							</view>
							<view>{{$t('other_.v')}}</view>
						</label>

					</radio-group>
				</view>
			</view>
			<textarea auto-height v-model="info[show_type[type].key]" v-else />
		</view>
	</view>
</template>

<script>
	import _get from '../../common/_get';
	import _hook from '../../common/_hook';
	import _data from '../../common/_data';

	export default {
		components: {

		},
		data() {
			return {
				info: {},
				content: '',
				type: '',
				show_type: [{
						'title': '昵称',
						'key': 'nickname'
					},
					{
						'title': '个性签名',
						'key': 'doodling'
					},
					{
						'title': '性别',
						'key': 'sex'
					},
				],
			}
		},
		onShow() {
			uni.setNavigationBarTitle({
				title: this.$t('other_.ss')
			})
			_hook.routeSonHook();
			let _this = this;
			/** 监听新的个人数据 */
			uni.$on('data_user_info', function(data) {
				_this.info = data;
			});
			if (this.info[this.show_type[this.type].key] == '本宝宝暂时还没有想到个性的签名') {
				this.info[this.show_type[this.type].key] = this.$t('my_.no')
			}
		},
		onLoad(option) {
			let _this = this;
			_this.type = option.type;

			// uni.setNavigationBarTitle({
			// 	title: (_this.show_type[_this.type].title + '设置'),
			// });

			_this.info = _data.data('user_info');
		},
		onUnload() {
			uni.$off('data_user_info');
		},
		computed: {

		},
		methods: {
			send() {
				let _this = this;
				_this.$httpSend({
					path: '/im/set/setInfo',
					data: {
						content: _this.info[_this.show_type[_this.type].key],
						type: _this.type,
					},
					success(data) {
						uni.showToast();

						_data.data('user_info', _this.info);

						setTimeout(() => {
							uni.navigateBack();
						}, 2000);
					}
				});
			},
			radioChange(e) {
				this.info[this.show_type[this.type].key] = e.target.value;
			},
		},
		onNavigationBarButtonTap(e) {
			this.send();
		},
		watch: {

		},
	}
</script>

<style>

</style>