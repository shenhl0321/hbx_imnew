<template>
	<view class="page">
		<!-- <view class="flex align-center " style="background-color: white;">
			<image @tap="backGo" src="../../static/share/zuojiantou.png" style="width: 35rpx;
			height: 35rpx; margin-top: 35rpx; margin-left: 20rpx; " mode=""></image>
			<text style="color: black; font-size: 40rpx;margin-left: 180rpx;" class="fonts">{{$t('top.scsj')}}</text>
		</view> -->
		<view class="page-header">
			<view class="" :style="type==2?'color: darkgrey':''" style="font-size: 30rpx;width: 300rpx;" @tap="getItem(1)" >{{$t('collect.sckj')}}</view>

			<view class="" :style="type==1?'color: darkgrey':''" style="font-size: 30rpx; width: 300rpx;" @tap="getItem(2)">{{$t('collect.scgs')}}</view>

		</view>
		<view class="page-header">
			<cmd-circle cid="circle10" width="100" class="page-header-circle" type="circle" :percent="percent"
				stroke-color="#ff5722" stroke-background="#d6d6d6"></cmd-circle>
		</view>
		<view class="page-header" style="padding-bottom: 100px;">
			<view class="page-header-info" v-if="type==1">
				<view>{{$t('collect.info.has')}}
					<b style="margin-left: 10px;"> {{info.user_storge}}</b>
				</view>
				<view>{{$t('collect.info.rest')}}：<b> {{info.splus_storge}}</b></view>
			</view>
			<view class="page-header-info" v-else>
				<view>{{$t('collect.info.has_g')}}：{{info.user_storge_count}}</view>
				<view>{{$t('collect.info.reset_g')}}：{{info.splus_count}}</view>
			</view>
		</view>
		<view class="page-content">
			<view class="page-list" v-if="type == 1">
				<view class="page-item">
					<view>{{$t('collect.video')}}</view>
					<view>{{list.s4}}</view>
				</view>
				<view class="footer-hr"></view>
				<view class="page-item">
					<view>{{$t('collect.voice')}}</view>
					<view>{{list.s3}}</view>
				</view>
				<view class="footer-hr"></view>
				<view class="page-item">
					<view>{{$t('collect.image')}}</view>
					<view>{{list.s2}}</view>
				</view>
				<view class="footer-hr"></view>
				<view class="page-item">
					<view>{{$t('collect.word')}}</view>
					<view>{{list.s1}}</view>
				</view>
				<view class="footer-hr"></view>
				<view class="page-item">
					<view>{{$t('collect.file')}}</view>
					<view>{{list.s11}}</view>
				</view>
				<view class="footer-hr"></view>
			</view>
			<view class="page-list" v-if="type == 2">
				<view class="page-item">
					<view>{{$t('collect.video')}}</view>
					<view>{{list.c4}}</view>
				</view>
				<view class="footer-hr"></view>
				<view class="page-item">
					<view>{{$t('collect.voice')}}</view>
					<view>{{list.c3}}</view>
				</view>
				<view class="footer-hr"></view>
				<view class="page-item">
					<view>{{$t('collect.image')}}</view>
					<view>{{list.c2}}</view>
				</view>
				<view class="footer-hr"></view>
				<view class="page-item">
					<view>{{$t('collect.word')}}</view>
					<view>{{list.c1}}</view>
				</view>
				<view class="footer-hr"></view>
				<view class="page-item">
					<view>{{$t('collect.file')}}</view>
					<view>{{list.c11}}</view>
				</view>
				<view class="footer-hr"></view>
			</view>
		</view>
		<!-- <view class="page-footer">
			<view class="page-footer-item" :class="type == 1 ? 'active' : ''" @tap="getItem(1)">
				<view class="item">
					<image src="/static/theme/default/liuyan.png"></image>
					<view>收藏空间</view>
				</view>

			</view>
			<view class="page-footer-item" :class="type == 2 ? 'active' : ''" @tap="getItem(2)">
				<view class="item">
					<image src="/static/theme/default/tongxunlu.png"></image>
					<view>收藏个数</view>
				</view>
			</view>
		</view> -->
	</view>
</template>

<script>
	import cmdCircle from "@/components/cmd-circle/cmd-circle.vue";
	import _get from "../../common/_get";
	export default {
		data() {
			return {
				type: 1,
				info: {
					splus_count: 0,
					splus_storge: 0,
					rate_1: 0,
					rate_2: 0,
					user_storge: 0,
					user_storge_count: 8,
				},
				list: {
					c1: 0,
					c2: 0,
					c3: 0,
					c4: 0,
					s1: 0,
					s2: 0,
					s3: 0,
					s4: 0,
				}
			}
		},
		components: {
			cmdCircle
		},
		onShow() {
			uni.setNavigationBarTitle({
				title:this.$t('top.bzzx')
			})
			let _this = this;
			_get.getStoreStatics({}, function(ret) {
				_this.info = ret.info;
				_this.list = ret.list
			});
		},
		onLoad() {

		},
		computed: {
			percent() {
				return this.type == 1 ? this.info.rate_1 : this.info.rate_2;
			}
		},
		methods: {
			backGo() {
				uni.switchTab({
					url: '/pages/chat/index'
				})
			},
			getItem(type) {
				return this.type = type
			}
		}
	}
</script>

<style>
	page {
		background-color: #efefef;
	}

	.flex {
		width: 100%;
		height: 100rpx;
	}

	.page-header {
		display: flex;
		justify-content: center;
		padding: 10px 10px 0px;
		background-color: white;
	}

	.page-header-circle {
		/* margin-top: 80rpx;
		margin-left: -270rpx; */
	}

	.page-header-info {
		display: flex;
		flex-direction: column;
		justify-content: center;
		text-align: left;
		margin-left: 5px;
		color: #a2a2a2;
		position: absolute;
		top: 320rpx;
	}

	.page-list {
		display: flex;
		flex-direction: column;
		margin-top: 20rpx;
	}

	.page-item {
		display: flex;
		justify-content: space-between;
		padding: 20px 40px;
		background-color: white;
	}

	.footer-hr {
		height: 1upx;
		width: 90%;
		background-color: #e1e1e1;
		margin: 0 auto;
	}

	.page-footer {
		height: 150upx;
		border-top: 1px solid #d3cdcd;
		position: fixed;
		display: flex;
		justify-content: space-between;
		bottom: 0;
		left: 0;
		right: 0;
		background: #ffffff;
	}

	.page-footer-item {
		width: 50%;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
	}

	.page-footer-item image {
		height: 30px;
		width: 30px;
	}

	.page-footer .active .item {
		border-top: 2px solid red;
	}

	.item {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: 100%;
	}
</style>