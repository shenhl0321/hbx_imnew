<template>
	<view class="page">
		<view class="uni-list">
			<view class="uni-list-cell" @tap="goSet('3')">
				<view class="uni-media-list uni-list-cell-navigate uni-navigate-right">
					<text>{{$t('my_.grxx')}}</text>
					<view class="uni-media-list-logo photo">
						<image :src="myPhoto" :lazy-load="true" style="border-radius: 10upx;" />
					</view>
				</view>
			</view>
			<view class="uni-list-cell" @tap="goSet('0')">
				<view class="uni-list-cell-navigate uni-navigate-right">
					<view>
						<text>{{$t('my_.nc')}}</text>
						<view class="show_text">{{info.nickname}}</view>
					</view>
				</view>
			</view>

			<view class="uni-list-cell">
				<view class="uni-list-cell-navigate">
					<view>
						<text>{{$t('my_.zh')}}</text>
						<view class="show_text">{{info.username}}</view>
					</view>
				</view>
			</view>

			<view class="uni-list-cell" @tap="goSet('1')">
				<view class="uni-list-cell-navigate uni-navigate-right">
					<view>
						<text>{{$t('my_.gxqm')}}</text>
						<view class="show_text" v-if="info.doodling == $t('newAdd.no_sign')">{{$t('my_.no')}}</view>
						<view class="show_text" v-else>{{info.doodling}}</view>
					</view>
				</view>
			</view>

			<view class="uni-list-cell" @tap="goSet('4')">
				<view class="uni-media-list uni-list-cell-navigate uni-navigate-right">
					<text>{{$t('my_.ewm')}}</text>
					<view class="uni-media-list-logo photo_qrcode">
						<image src="/static/theme/default/my/qrcode.png" :lazy-load="true" />
					</view>
				</view>
			</view>
			<view class="uni-list-cell" @tap="goSet('5')">
				<view class="uni-media-list uni-list-cell-navigate uni-navigate-right">
					<text>{{$t('my.invite.invite_code')}}</text>
					<view class="uni-media-list-logo photo_qrcode">
						<image src="/static/theme/default/my/qrcode.png" :lazy-load="true" />
					</view>
				</view>
			</view>
			<view class="uni-list-cell" @tap="goSet('2')">
				<view class="uni-list-cell-navigate uni-navigate-right">
					<view>
						<text>{{$t('my_.xb')}}</text>
						<view class="show_text">{{xb[info.sex]}}</view>
					</view>
				</view>
			</view>

			<view class="uni-list-cell" v-if="0">
				<view class="uni-list-cell-navigate uni-navigate-right">
					<view>
						<text>{{$t('newAdd.more')}}</text>
					</view>
				</view>
			</view>

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
				xb: [],
			}
		},
		onShow() {
			uni.setNavigationBarTitle({
				title: this.$t('my_.grxx')
			})
			this.xb = [this.$t('my_.n'), this.$t('my_.v')]
			_hook.routeSonHook();
			let _this = this;
			_this.info = _data.data('user_info');
			/** 监听新的个人数据 */
			uni.$on('data_user_info', function(data) {
				_this.info = data;
			});
		},
		onLoad(option) {

		},
		onUnload() {
			uni.$off('data_user_info');
		},
		computed: {
			myPhoto() {
				return _data.staticPhoto() + this.info.photo;
			},
		},
		onBackPress(options) {
			if (options.from === 'navigateBack') {
				return false;
			}
			this.back();
			return true;
		},
		methods: {
			back() {
				uni.reLaunch({
					url: '/pages/chat/index',
				});
			},
			goSet(type) {
				let url;
				switch (type) {
					case '0':
					case '1':
					case '2':
						url = '../set/user?type=' + type;
						break;
					case '3':
						url = '../set/photo';
						break;
					case '4':
						url = './qrcode';
						break;
					case '5':
						url = './invite_code';
						break;
					default:
						return;
						break;
				}
				uni.navigateTo({
					url: url,
					animationType: 'slide-in-bottom',
				});
			}
		},
		watch: {

		},
	}
</script>

<style>
	.uni-media-list-logo {
		width: 30upx;
		height: 30upx;
		display: inline-block;
		vertical-align: middle;
	}

	.photo_qrcode {
		width: 52upx;
		height: 52upx;
		margin-left: 30upx;
		margin-right: 50upx;
	}

	.photo {
		width: 106upx;
		height: 106upx;
		margin-left: 30upx;
		margin-right: 50upx;
	}

	.uni-card {
		box-shadow: none;
	}

	.show_text {
		position: absolute;
		right: 60upx;
		color: #8f8f94;
		display: inline-block;
		max-width: calc(100% - 300rpx);
	}

	.uni-navigate-right.uni-media-list {
		padding-right: 23upx;
	}
</style>