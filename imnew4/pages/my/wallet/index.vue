<template>

	<view class="page">
		<view class="content">
			<view class="wallet-card">
				<view class="">
					<text class="white f12">{{$t('my.wallet.yue')}}</text>
				</view>
				<view class="">
					<text class="f30 white fw">{{my_data.money?my_data.money.replace(/\d(?=(\d{3})+\.)/g, '$&,'):0.00}}</text><text
						class="white f12">{{$t('my.wallet.cny')}}</text>
				</view>
				<!-- <view class="wallet-btn-group">
					<button @tap="goPath('charge')">
						<text>{{$t('my.wallet.cz')}}</text>
					</button>
					<button @tap="goPath('withdraw')">
						<text>{{$t('my.wallet.tx')}}</text>
					</button>
				</view> -->
			</view>
			<view class="more-card">
				<view class="more-item" @click="goPath('capital2')">
					<image src="/static/theme/default//wallet/clipboard-text.png" mode="heightFix"></image>
					<text>{{$t('my.wallet.zdmx')}}</text>
				</view>
				<view class="more-item" @click="goPath('capital?type=hongbao')">
					<image src="/static/theme/default/wallet//Frame(7).png" mode=""></image>
					<text>{{$t('my.wallet.hbmx')}}</text>
				</view>
				<!-- <view class="more-item" @click="goPath('alipay_set')">
					<image src="/static/theme/default/wallet//empty-wallet.png" mode=""></image>
					<text>{{$t('my.wallet.txsz')}}</text>
				</view> -->
				<view class="more-item" @click="goPath('trade_password')">
					<image src="/static/theme/default/wallet//security-safe.png" mode=""></image>
					<text>{{$t('my.wallet.mmsz')}}</text>
				</view>
				<!-- <view class="more-item" @click="goPath('/pages/my/pay/pay')">
					<image src="/static/theme/default//wallet/Frame 427319784.png" mode=""></image>
					<text>{{$t('my.wallet.sfk.title')}}</text>
				</view> -->
			</view>
		</view>
		<view class="wallet-tips">
			<text style="color: royalblue;" @tap="goPath('/pages/article/article')">{{$t('my.wallet.bzzx')}}</text>
			<view class="" style="color: darkgray;">
				{{$t('my.wallet.tips')}}
			</view>
			<!--<text class="gray f12">本服务由首信易支付提供</text>-->

		</view>
	</view>


</template>
<style lang="scss">
	.page {
		position: relative;
		// margin-top: 10rpx;
	}

	.wallet-tips {
		display: flex;
		flex-direction: column;
		margin-top: 80rpx;
		align-items: center;

		.tips {
			font-size: 30rpx;
		}

		.f12 {
			font-size: 24rpx;
		}

		.gray {
			color: gray;
		}
	}

	.more-card {
		width: 94vw;
		margin: 20rpx auto;
		border-radius: 40rpx;
		box-sizing: border-box;
		// background: #ffff;
		// box-shadow: 0 0 10rpx 2rpx rgba(0, 0, 0, 0.05);
		display: flex;
		flex-wrap: wrap;

		.more-item {
			width: 33.33%;
			height: 160rpx;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;

			image {
				width: 64rpx;
				height: 64rpx;
			}

			text {
				margin-top: 20rpx;
				font-size: 30rpx;
				color: #000;
				text-overflow: ellipsis;
				white-space: nowrap;
				overflow: hidden;
				width: 100%;
				height: 50rpx;
				text-align: center;
			}
		}
	}

	.wallet-card {
		width: 100vw;
		border-radius: 40rpx;
		box-sizing: border-box;
		padding: 0 20rpx 40rpx;
		height: 200rpx;
		background: linear-gradient(315deg, #685BED 0%, #2F63FF 100%);
		background-size: cover;
		border-radius: 0px 0px 20px 20px;

		.white {
			color: #fff;
		}

		.fw {
			font-weight: bold;
		}

		.f30 {
			font-size: 60rpx;
		}

		.f12 {
			font-size: 24rpx;
		}

		.wallet-btn-group {
			display: flex;
			align-items: center;
			height: 100rpx;
			justify-content: center;
			margin-bottom: 20rpx;

			button {
				height: 60rpx;
				border-radius: 80rpx;
				width: 320rpx;
				color: #2F63FF;
				font-size: 30rpx;
				background: #fff;
				margin-left: 0;
				display: flex;
				align-items: center;
				justify-content: center;
			}
		}
	}

	.content {
		display: flex;
		flex-direction: column;
	}

	.img {
		display: flex;
		;
		height: 440upx;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		background-color: #5693ee;
		width: 100%;
	}

	.img image {
		width: 140upx;
		height: 150upx;
	}

	.img text {
		color: white;
		font-size: 20px;
	}

	.content .withdraw {
		width: 95%;
		background-color: #5693ee;
		color: white;
		margin-top: 10upx;
		height: 80upx;
		line-height: 80upx !important;
		font-size: 36upx;
		cursor: pointer;
	}

	.content .charge {
		background-color: white;
		color: #5693ee;
		border: 1px solid #5693ee;
	}

	.content .list {
		margin-top: 20upx;
	}

	.uni-page-head {
		box-sizing: content-box !important;
	}

	.flex {
		width: 100%;
		height: 100rpx;

		// border: 1px solid #000;
		image {
			width: 35rpx;
			height: 35rpx;
			// border: 1px solid #000;
			margin-top: 20rpx;

		}

	}
</style>
<script>
	import uniList from '../../../components/uni-ui/uni-list/uni-list.vue';
	import uniListItem from '../../../components/uni-ui/uni-list-item/uni-list-item.vue';
	import _hook from '../../../common/_hook';
	import _data from '../../../common/_data';
	import _get from '../../../common/_get';

	export default {
		components: {
			uniList,
			uniListItem,
		},
		data() {
			return {
				my_data: {},
			}
		},
		onShow() {
			uni.setNavigationBarTitle({
				title: this.$t('my.wallet.title')
			})
			_hook.routeTabBarHook();
			let _this = this;
			/** 监听新的个人数据 */
			_get.getUserInfo({});
			uni.$on('data_user_info', function(data) {
				_this.my_data = data;
				console.log('更新用户数据....')
				_data.data('user_info', data)
			});
			_this.my_data = _data.data('user_info');
			console.log(_this.my_data)
		},
		onLoad() {

		},
		onUnload() {},
		computed: {},
		methods: {
			goPath(path) {
				if (path) {
					uni.navigateTo({
						url: path,
					});
				}
			},
			// 跳转到上一页
			backGo() {
				uni.switchTab({
					url: '/pages/my/index'
				})
			}
		},
		watch: {

		},

	}
</script>