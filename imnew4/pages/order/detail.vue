<template>
	<view class="page">
		<view class="order-info-detail" v-if="orderDetail.is_buyer == 0">
			<uni-list class="list" style="margin-top: 14px;">
				<uni-list-item class="rder-info-detail-item" :title="$t('newAdd.good_name')" :rightText="orderDetail.goods_name" :showArrow="showArrow"/>
				<uni-list-item class="rder-info-detail-item" :title="$t('newAdd.good_pic')" :rightImage="orderDetail.small_pic" :showArrow="showArrow"/>
				<uni-list-item class="rder-info-detail-item" :title="$t('newAdd.good_price')" :rightText="orderDetail.amount" :showArrow="showArrow"/>
				<uni-list-item class="rder-info-detail-item" :title="$t('newAdd.buyer_nick_name')" :rightText="orderDetail.buyer_username" :showArrow="showArrow"/>
				<uni-list-item class="rder-info-detail-item" :title="$t('newAdd.buyer_header')" :rightImage="staticPhoto + orderDetail.buyer_face" :showArrow="showArrow"/>
				<uni-list-item class="rder-info-detail-item" :title="$t('newAdd.receiver')" :rightText="orderDetail.username" :showArrow="showArrow"/>
				<uni-list-item class="rder-info-detail-item" :title="$t('newAdd.mobile_number')" :rightText="orderDetail.mobile" :showArrow="showArrow"/>
				<uni-list-item class="rder-info-detail-item" :title="$t('newAdd.deliver_number')" :rightText="orderDetail.logistics_code?orderDetail.logistics_code:''" :showArrow="showArrow"/>
				<uni-list-item class="rder-info-detail-item" :title="$t('newAdd.address')" :rightText="orderDetail.address" :showArrow="showArrow"/>
				<uni-list-item class="rder-info-detail-item" :title="$t('newAdd.menu_status')" :rightText="orderDetail.status_msg" :showArrow="showArrow"/>
				<uni-list-item class="rder-info-detail-item" :title="$t('newAdd.make_time')" :rightText="orderDetail.create_time" :showArrow="showArrow"/>
			</uni-list>
			  <view v-if="orderDetail.logistics_status == 1">
				  <button type="primary" class="list-fahuo" @tap="open">{{$t('newAdd.deliber')}}</button>
			  </view>
		</view>
		<view class="order-info-detail" v-if="orderDetail.is_buyer == 1">
			<uni-list class="list" style="margin-top: 14px;">
				<uni-list-item class="rder-info-detail-item" :title="$t('newAdd.good_name')" :rightText="orderDetail.goods_name" :showArrow="showArrow"/>
				<uni-list-item class="rder-info-detail-item" :title="$t('newAdd.good_pic')" :rightImage="orderDetail.small_pic" :showArrow="showArrow"/>
				<uni-list-item class="rder-info-detail-item" :title="$t('newAdd.good_price')" :rightText="orderDetail.amount" :showArrow="showArrow"/>
				<uni-list-item class="rder-info-detail-item" :title="$t('newAdd.seller_nick_name')" :rightText="orderDetail.seller_username" :showArrow="showArrow"/>
				<uni-list-item class="rder-info-detail-item" :title="$t('newAdd.seller_header')" :rightImage="staticPhoto + orderDetail.seller_face" :showArrow="showArrow"/>
				<uni-list-item class="rder-info-detail-item" :title="$t('newAdd.receiver')" :rightText="orderDetail.username" :showArrow="showArrow"/>
				<uni-list-item class="rder-info-detail-item" :title="$t('newAdd.mobile_number')" :rightText="orderDetail.mobile" :showArrow="showArrow"/>
				<uni-list-item class="rder-info-detail-item" :title="$t('newAdd.deliver_number')" :rightText="orderDetail.logistics_code?orderDetail.logistics_code:''" :showArrow="showArrow"/>
				<uni-list-item class="rder-info-detail-item" :title="$t('newAdd.address')" :rightText="orderDetail.address" :showArrow="showArrow"/>
				<uni-list-item class="rder-info-detail-item" :title="$t('newAdd.menu_status')" :rightText="orderDetail.status_msg" :showArrow="showArrow"/>
				<uni-list-item class="rder-info-detail-item" :title="$t('newAdd.make_time')" :rightText="orderDetail.create_time" :showArrow="showArrow"/>
			</uni-list>
		</view>
		<uni-popup ref="popup" type="dialog">
			<uni-popup-confirm
					mode="input"
					type="input"
					value=""
					:placeholder="$t('newAdd.input_deliver_nubmer')"
					:title="$t('newAdd.deliber')"
					:duration="2000"
					:before-close="true"
					@close="close"
					@confirm="confirm">
			</uni-popup-confirm>
		</uni-popup>
	</view>
</template>
<style>

 .order-info-detail{
	 display: flex;
	 flex-direction: column;
	 justify-content: center;
	 margin-bottom: 80px
 }
.rder-info-detail-item{
	word-break: break-all;
}
.list-fahuo{
	border-radius: 30px;
	margin-top: 20px;
	width: 80%;
	height: 40px;
	line-height: unset;
	line-height: 40px;

}
</style>

<script>
	import _hook from '../../common/_hook';
	import _data from '../../common/_data';
	import _get from '../../common/_get';
	import UniPopupConfirm from '../../components/uni-popup/uni-popup-confirm';
	export default {
		data() {
			return {
				showArrow:false,
				orderDetail:{}
			}
		},
		components:{
			UniPopupConfirm
		},
		computed:{
			staticPhoto(){
				return _data.staticPhoto();
			}
		},
		onShow(){
			_hook.routeSonHook()
		},
		onLoad(option){
			console.log(option)
			this.orderDetail = option
		},
		methods: {
			open(){
				this.$refs.popup.open()
			},
			confirm(sure,value){
				sure();
				_get.updateOrderStatus({logistics_code:value,'id':this.orderDetail.id},function (ret) {
					uni.showToast({title:'发货成功'});
					setTimeout(function () {
						uni.navigateBack()
					},1000)
				},function (ret) {
					uni.showToast({title:ret.msg,icon:"none"})
				});
			},
			close(){
				this.$refs.popup.close()
			},
		}
	}
</script>

