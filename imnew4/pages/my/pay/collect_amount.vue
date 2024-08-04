<template>
	<view class="page">
		<view class="page-content">
			<view class="page-title">
				<text>{{$t('newAdd.shoukuan_money')}}</text>
			</view>
			<view class="page-content-input">
				<text class="page-money-fuhao"></text>
				<input class="uni-input-collect" @input="getAmount" type="text" placeholder=""/>
			</view>
			<view class="footer-button">
				<button class="withdraw" type="submit" @tap="collectAmount">{{$t('newAdd.certain')}}</button>
			</view>
		</view>
	</view>
</template>

<script>
	import _hook from '../../../common/_hook';
	import _data from '../../../common/_data';
	import _get from '../../../common/_get';
	export default {
		data() {
			return {
				pageParams:{
					amount:''
				},
				user_info:{
					id:0
				},
				user_id:0
			}
		},
		onShow() {
			let _this = this;
			_hook.routeSonHook();
			_get.getUserInfo({user_id:_this.user_id},function(ret){
				_this.user_info = ret;
				uni.setNavigationBarTitle({
					title:_this.$t('newAdd.to')+ret.username+_this.$t('newAdd.shoukuan')
				})
			});
			uni.$on('pay_amount_after',function(ret){
				 uni.$emit('data_user_info',ret);
				_data.data('user_info',ret);
				uni.hideLoading();
				uni.showToast({
					title:_this.$t('newAdd.trade_success'),
					icon:'none'
				})
				setTimeout(function(){
					uni.redirectTo({
						url:'/pages/my/wallet/capital'
					})
				},1000)
			})
		},
		onLoad(options){
			this.user_id = options.user_id;
		},
		methods: {
			getAmount(e){
				return this.pageParams.amount = e.detail.value;
			},
			collectAmount(){
				uni.showLoading({
					title:this.$t('newAdd.requesting')
				});
				_get.collectAmount({amount:this.pageParams.amount,to_user_id:this.user_id},function(){
					 uni.showLoading({
					 	title:this.$t('newAdd.input_trade_pass')
					 });
				})
			}
		}
	}
</script>

<style>
	 .withdraw{
		width: 90%;
		background-color: #51a938;
		color: white;
		height: 90upx;
		line-height:  90upx !important;
		border-radius: 15upx;
		font-size: 36upx;
		cursor: pointer;
	}
	.footer-button{
		padding: 50upx;
	}
	.page-title{
		padding: 40upx 0;
	}
	.page-money-fuhao{
		font-size: 22px;
		font-weight: 800;
	}
	.page-content-input{
		display: flex;
	}
page{
	background-color: #f1f0f5;
}
.page{
	margin-top: 30rpx;
	padding: 0 30rpx;
}
.page-money-fuhao{
 margin-bottom: 50upx;
}
.page-content{
	background-color: white;
	border-radius: 5rpx;
	padding-left: 40rpx;
}
.uni-input-collect{
	border-bottom: 1px solid #bcbcbc;
	padding: 10px;
	font-size: 30px;
	font-weight: 800;
	width: 80%	;
}
</style>
