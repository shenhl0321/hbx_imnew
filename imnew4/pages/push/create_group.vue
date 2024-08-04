<template>
	<view class="page-container">
		<view class="center-image">
			<image class="pic" src="/static/my//17.png" mode="widthFix"></image>
		</view>
		<view class="tips">
			<text>{{$t('create_group.tip1')}}</text>
			<text>{{$t('create_group.tip2')}}</text>
		</view>
		<view class="new_add">
			<button @click="goPath"
				class="new_add_btn">&nbsp;&nbsp;+&nbsp;&nbsp;{{$t('create_group.new_create')}}</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		onShow() {
			uni.setNavigationBarTitle({
				title: this.$t('top.qfzs')
			})
		},
		methods: {
			goPath() {
				uni.navigateTo({
					url: '/pages/push/sendall'
				})
			},
			backGo() {
				uni.switchTab({
					url: '/pages/chat/index'
				})
			},
		}
	}
</script>

<style scoped>
	.flex {
		width: 100%;
		height: 100rpx;
	}

	.new_add {
		margin: 10rpx auto;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.new_add_btn {
		height: 70rpx;
		padding: 0 200rpx;
		border-radius: 40rpx;
		background: linear-gradient(315deg, #685BED 0%, #2F63FF 100%);
		color: #fff;
		font-size: 12px;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.tips {
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 90vw;
		margin: 0 auto;
		margin-bottom: 60rpx;
	}

	.tips text {
		font-size: 14px;
		font-weight: 500;
		color: #333;
	}

	.page-container {
		background: #fff;
		min-height: 100vh;
	}

	.center-image {
		width: 94vw;
		height: auto;
		margin: 0 auto;
		padding-top: 200rpx;
		padding-bottom: 50rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.center-image image {
		width: 50%;
		height: 232rpx;
		height: auto;
	}
</style>