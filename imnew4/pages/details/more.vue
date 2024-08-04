<template>
	<view class="page">
		<view class="uni-list my_padding">
			<view class="uni-list-cell">
				<view class="uni-media-list uni-list-cell-navigate uni-navigate-right">
					<view class="uni-media-list-logo phto">
						<image :src="my.img" :lazy-load="true" />
					</view>
					<view class="uni-media-list-body">
						<view class="uni-media-list-text-top">{{my.title}}</view>
						<view class="uni-media-list-text-bottom uni-ellipsis">{{my.content}}</view>
					</view>
				</view>
			</view>
		</view>
		<view class="uni-card" v-for="(v,k) in list" :key="k">
			<view class="uni-list">
				<view class="uni-list-cell" hover-class="none" v-for="(value,key) in v" :key="key">
					<view class="uni-list-cell-navigate uni-navigate-right">
						<view style="width:100%">
							{{value.title}}
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<view class="uni-card">
			<view class="uni-list">
				<view class="uni-list-cell" hover-class="none" v-for="(v,k) in chat_tool" :key="k">
					<view class="uni-list-cell-navigate">
						<view style="width:100%;text-align: center;">
							<view class="uni-media-list-logo">
								<image :src="v.logo" :lazy-load="true"></image>
							</view>
							{{v.title}}
						</view>
					</view>
				</view>
			</view>
		</view>
		
	</view>
	
</template>

<script>
	
	import uniBadge from '../../components/uni-badge/uni-badge.vue';
	import _get from '../../common/_get';
	import _hook from '../../common/_hook';
	
	export default {
		components: {
			uniBadge
		},
		data() {
			return {
				my: {
						title: this.$t('newAdd.xf'),
						content: this.$t('newAdd.dialog_content'),
						img: "https://img-cdn-qiniu.dcloud.net.cn/uniapp/images/shuijiao.jpg?imageView2/3/w/200/h/100/q/90"
				},
				list: [
					[
						{
							title: this.$t('newAdd.setRemark'),
						},
					],
					[
						{
							title: this.$t('newAdd.chat_friend'),
							img: "../../static/theme/default/my/images.png"
						},
						{
							title: this.$t('newAdd.telNumber'),
						},
					],
					[
						{
							title: this.$t('newAdd.more_message'),
						}
					]
				],
				chat_tool: [
					{
						logo: '../../static/theme/default/my/images.png',
						title: this.$t('newAdd.send_message')
					},
					{
						logo: '../../static/theme/default/my/images.png',
						title: this.$t('newAdd.voiceVideoTalk')
					},
				]
			}
		},
		onShow(){
			_hook.routeSonHook();
		},
		methods: {
			
		},
		onNavigationBarButtonTap(e) {
			return;
			uni.showToast({
				title: 'action',
				icon: "none"
			})
		},
	}
</script>

<style>
	
	.uni-media-list-logo {
		width: 45upx;
		height: 45upx;
		margin-right: 10upx;
		display: inline-block;
		vertical-align:middle;
	}
	
	.phto {
		width: 130upx;
		height: 130upx;
		margin-left: 30upx;
		margin-right: 30upx;
	}
	
	.my_padding {
		padding-bottom: 25px;
	}
	
	.uni-card {
		box-shadow: none;
	}
	
	.my_padding:before {
		background-color:white;
	}
	
</style>
