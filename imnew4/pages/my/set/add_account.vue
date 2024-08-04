<template>
	<view class="page">
		<!-- 自定义导航 -->
		<view @tap="backGo"
			style="position: relative;display: flex;align-items: center;height:40px;background-color: white;">
			<image src="../../../static/share/zuojiantou.png" style="width: 35rpx; height: 35rpx; margin-left: 20rpx;"
				mode=""></image>
			<text
				style="width:100%;text-align: center;;font-size: 34rpx;color: black;position: absolute;left: 50%;top:50%;transform: translate(-50%,-50%);">{{$t('top.zfbzh')}}</text>
		</view>
		<view class="content">
			<form @submit="addBank" @reset="">
				<view class="uni-form-item">
					<text class="title"><text style="margin-right: 10px;">*</text>{{$t('alipay.name')}}</text>
					<input class="uni-input" @input="fullname" type="text" :placeholder="$t('alipay.input_name')" />
				</view>
				<view class="uni-form-item">
					<text class="title"><text style="margin-right: 10px;">*</text>{{$t('alipay.id_card')}}</text>
					<input class="uni-input" @input="idCard" type="idcard" :placeholder="$t('alipay.input_id_card')" />
				</view>
				<view class="uni-form-item">
					<text class="title"><text style="margin-right: 10px;">*</text>{{$t('alipay.alipay_account')}}</text>
					<input class="uni-input" @input="account" type="text"
						:placeholder="$t('alipay.input_alipay_account')" />
				</view>
				<button class="withdraw" form-type="submit" type="submit">{{$t('alipay.bind')}}</button>
			</form>
		</view>
	</view>
</template>


<script>
	import _get from '../../../common/_get';
	import _hook from '../../../common/_hook';
	export default {
		data() {
			return {
				requestParams: {
					'fullname': '',
					'id_card': '',
					'account': '',
					'bank_type': 1
				}
			}
		},
		onShow() {
			_hook.routeSonHook();
		},
		methods: {
			backGo() {
				uni.navigateBack()
			},
			fullname(e) {
				return this.requestParams.fullname = e.detail.value.trim();
			},
			idCard(e) {
				return this.requestParams.id_card = e.detail.value.trim();
			},
			account(e) {
				return this.requestParams.account = e.detail.value.trim();
			},
			bank_type(e) {
				return this.requestParams.bank_type = e.detail.value.trim();
			},
			addBank(e) {
				if (this.requestParams.account == '') {
					return this.showToast('请输入账号!');
				}
				if (this.requestParams.id_card == '') {
					return this.showToast('请输入身份证号!');
				}
				if (this.requestParams.fullname == '') {
					return this.showToast('请输入姓名!');
				}
				_get.addUserBank(this.requestParams, function(res) {
					uni.navigateBack();
				});
			},
			showToast(msg) {
				return uni.showToast({
					title: msg,
					icon: 'none'
				});

			}
		}
	}
</script>

<style>
	page {
		background-color: white;
	}

	.flex {
		width: 100%;
		height: 100rpx;
	}

	.page {
		border-top: 1px solid #e3e3e3;
	}

	.uni-input {
		border: none;
		text-align: right;
	}

	.uni-form-item {
		border-bottom: 1px solid #e3e3e3;
	}

	.content .withdraw {
		margin-top: 70upx;
		width: 90%;
		background: linear-gradient(315deg, #685BED 0%, #2F63FF 100%);
		color: white;
		height: 70upx;
		line-height: 70upx !important;
		border-radius: 40upx;
		font-size: 36upx;
		cursor: pointer;
	}
</style>