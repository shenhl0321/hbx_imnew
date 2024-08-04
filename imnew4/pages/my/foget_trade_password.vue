<template>
	<view class="page">
		<view class="page-title">
			<view class="page-title-info">
				{{$t('newAdd.foget_notice_1')}}
			</view>
			<view class="page-title-info">
				{{$t('newAdd.foget_notice_2')}}
			</view>
			<view class="mobile">{{hideMobile(my_data.phone)}}</view>
		</view>
		<view class="page-content">
			<view class="page-content-msg">{{$t('newAdd.vali_code')}}</view>
			<view class="page-form">
				<input class="uni-input form-yzm" maxlength="6" v-model="yzm" :placeholder="$t('newAdd.p_input_code')" type="number"/>
				<button class="send-yzm" @tap="getCode" v-if="showText"> {{$t('newAdd.getCode')}}</button>
				<button class="send-yzm" style="background-color: #c4c4c4" v-else>{{second + $t('newAdd.re_send')}}</button>
			</view>
		</view>
		 <view class="page-botoom">
			 <button class="submit-but" :style="{backgroundColor:color}" @tap="getNext">{{$t('newAdd.next')}}</button>
		 </view>
		<pay-keyboard  :showCose="showCose" :set_info = "set_info" :show_key="show_key" ref="payKeyboard" :set_msg="set_msg" @hideFun="hideFun" @getPassword="getPassword" :password="password"></pay-keyboard>
	</view>
</template>

<script>
	import _get from '../../common/_get';
	import _page from '../../common/common';
	import payKeyboard from '../../components/uni-keyword/uni-keyword';
	export default {
		data() {
			return {
				yzm:'',
				second:60,
				showText:true,
				my_data:{},
				set_msg:this.$t('newAdd.p_input_trade_pass'),
				set_info:this.$t('newAdd.p_input_trade_pass_to_confirm'),
				password:'',
				show_key:false,
				showCose:false,
				type:'TRADEPASSWORD'
			}
		},
		components:{
			payKeyboard
		},
		computed:{
			color(){
				return this.yzm.length== 6 ?'#0A98D5':'#c4c4c4'
			}
		},
		onShow(){
			let _this = this;
			_get.getUserInfo({},function (data) {
				_this.my_data = data;
			});
			uni.$on('clean_password_data',this.cleanNum);
		},
		onLoad(options){
			if("show_key" in options){
				this.show_key = true;
			}
		},
		methods: {
			cleanNum(){
				this.$refs.payKeyboard.cleanNum();
				this.show_key = true
			},
			hideMobile(cellValue){
				if (Number(cellValue) && String(cellValue).length === 11) {

					var mobile = String(cellValue)

					var reg = /^(\d{3})\d{4}(\d{4})$/

					return mobile.replace(reg, '$1****$2')

				} else {

					return cellValue

				}
			},
			getPassword(n){
				//校验交易密码
				uni.navigateTo({url:'input_trade_password?'+_page.pageParam({type:this.type,code:this.yzm,password:n.password})})
			},
			getCode(){
				let _this = this;
				_get.getSms({mobile:this.my_data.phone,type:_this.type},function (res) {
					_this.cutDown();
				},function (res) {
					uni.showToast({
						title: res.msg,
						duration:2000,
						icon:'none'
					});
				})
				this.cutDown();
			},
			cutDown(){//倒计时
				//获取验证码
				this.showText = false;
				var interval = setInterval(() => {
					let times = --this.second;
					times = times < 0 ? 0 : times;
					this.second = times<10?'0'+times:times //小于10秒补 0
				}, 1000)
				setTimeout(() => {
					clearInterval(interval)
					this.second=60
					this.showText = true
				}, 60000)
			},
			getNext(){
				let _this = this
				_get.checkSmsCode({code:this.yzm,type:this.type,mobile:this.my_data.phone},function () {
					_this.show_key = true
				},function (ret) {
					uni.showToast({
						title: ret.msg,
						duration:2000,
						icon:'none'
					});
				})
			}
		}
	}
</script>

<style>
page{
	height: 100%;
	background: #ffffff;
}
.page-title{
	padding: 100rpx 0 50rpx 60rpx;
	display: flex;
	justify-content: flex-start;
	flex-direction: column;
}
.page-title-info{
	font-size: 16px;
	font-weight: 500;
}
.mobile{
	font-size: 16px;
	font-weight: 500;
}
.page-form{
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: row;
	border-radius: 40rpx;
	background-color: #f1f1f1;
}
.page-content{
	padding: 0 60rpx;
	
}
.form-yzm{
	background-color: #f1f1f1;
	border-radius: 40rpx;
	height: 40px;
	line-height: unset;
	line-height: 40px;
	padding: 0;
	padding-left: 50px;
}
.page-content-msg{
	margin-bottom: 10px;
	font-size: 16px;
}
.send-yzm{
	margin-left: 4px;
	background: linear-gradient(315deg, #685BED 0%, #2F63FF 100%);
	color: white;
	height: 40px;
	line-height: unset;
	line-height: 40px;
	border-radius: 40rpx;
}
.submit-but{
	margin-top: 80rpx;
	width: 80%;
	border-radius: 80rpx;
	color: white;
	/* background-color: #c4c4c4; */
	background-color: #0A98D5;
}
</style>
