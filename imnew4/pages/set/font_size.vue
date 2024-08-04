<template>
	<view class="">
		<view class="show_font right">
			<view class="show_text">
				<view class="text" :style="{'font-size': value+'px'}">
					{{$t('font.tip1')}}
				</view>
			</view>
			<view class="avatar">
				<image mode="aspectFill" src="../../static/theme/default/push/default_photo_path.png" alt="">
			</view>
		</view>
		<view class="show_font left">
			<view class="avatar">
				<image mode="aspectFill" src="../../static/img/logo.png" alt="">
			</view>
			<view class="show_text">
				<view class="text" :style="{'font-size': value+'px'}">
					{{$t('font.tip2')}}
				</view>
			</view>
		</view>
		<view class="slider-block">
			<view class="slider-item">
				<text style="font-size:12px">A</text>
				<text style="font-size:24px">A</text>
			</view>
			<slider min="12" block-size="20" block-color="#fff" max="24" :value="value" @change="sliderChange"
				step="1" />
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapGetters,
		mapMutations
	} from 'vuex'
	export default {
		data() {
			return {
				value: 14
			}
		},
		onShow() {
			uni.setNavigationBarTitle({
				title: this.$t('font.title')
			})
		},
		computed: {
			...mapState({
				custom_font_size: state => state.common.custom_font_size,
			}),
		},
		mounted() {
			this.value = this.custom_font_size;
		},
		methods: {
			...mapMutations(['setFontSize']),
			sliderChange(e) {
				this.value = e.detail.value;
			},
		},
		onNavigationBarButtonTap(e) {
			this.setFontSize(this.value);
			uni.switchTab({
				url: '/pages/my/index'
			})
		},
	}
</script>

<style lang="scss" scoped>
	.show_font {
		display: flex;
		align-items: flex-start;
		box-sizing: border-box;
		padding: 10rpx 20rpx;
		width: 100vw;

		.show_text {
			padding-top: 20rpx;
		}

		.text {
			color: #333;
			border-radius: 4px;
			box-sizing: border-box;
			padding: 10rpx 20rpx;
			position: relative;
			max-width: 500rpx;
		}

		.avatar {
			width: 80rpx;
			height: 80rpx;

			image {
				width: 100%;
				height: 100%;
				border-radius: 50%;
			}
		}
	}

	.left {
		justify-content: flex-start;

		.text {
			background: #fff;
			margin-left: 30rpx;
		}

		.text::before {
			content: " ";
			position: absolute;
			top: 0;
			left: -6px;
			border: 6px solid transparent;
			border-top-color: #fff;
		}
	}

	.right {
		justify-content: flex-end;

		.text {
			background: linear-gradient(315deg, #685BED 0%, #2F63FF 100%);
			margin-right: 30rpx;
			color: gainsboro;
		}

		.text::before {
			content: " ";
			position: absolute;
			left: calc(100% - 6px);
			top: 0;
			border: 6px solid transparent;
			border-right-color: transparent;

		}
	}

	.slider-block {
		background: #fff;
		height: 200rpx;
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		padding: 20rpx 0;
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100vw;

		.slider-item {
			display: flex;
			justify-content: space-between;
			align-items: center;
			box-sizing: border-box;
			padding: 0 40rpx;
		}
	}
</style>