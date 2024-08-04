<template>
	<view>
		<view class="uni-common-mt">
			<view class="uni-form-item uni-column">
				<view class="title">{{$t('newAdd.old_pass')}}</view>
				<view class="with-fun">
					<input class="uni-input" :placeholder="{{$t('newAdd.input_pass')}}" :password="showPassword[0]" v-model="formData.pass1" />
					<view class="uni-icon uni-icon-eye" :class="[!showPassword[0] ? 'uni-active' : '']" @click="changePassword(0)"></view>
				</view>
			</view>
			<view class="uni-form-item uni-column">
				<view class="title">{{$t('newAdd.new_pass')}}</view>
				<view class="with-fun">
					<input class="uni-input" :placeholder="{{$t('newAdd.input_pass')}}" :password="showPassword[1]" v-model="formData.pass2" />
					<view class="uni-icon uni-icon-eye" :class="[!showPassword[1] ? 'uni-active' : '']" @click="changePassword(1)"></view>
				</view>
			</view>
			<view class="uni-form-item uni-column">
				<view class="title">{{$t('newAdd.confirm_new_pass')}}</view>
				<view class="with-fun">
					<input class="uni-input" :placeholder="{{$t('newAdd.input_pass')}}" :password="showPassword[2]" v-model="formData.pass3" />
					<view class="uni-icon uni-icon-eye" :class="[!showPassword[2] ? 'uni-active' : '']" @click="changePassword(2)"></view>
				</view>
			</view>
		</view>
		
		<view class="send">
			<button class="mini-btn send_button" type="primary" size="mini" @tap="send">{{$t('newAdd.save')}}</button>
		</view>
		
	</view>
</template>
<script>
	
	import _action from '../../common/_action';
	
	export default {
		data() {
			return {
				showPassword: [ true,true,true ],
				formData: {
					pass1: '',
					pass2: '',
					pass3: '',
				}
			}
		},
		computed: {
			
		},
		methods: {
			changePassword(num) {
				this.$set(this.showPassword,num,!this.showPassword[num]);
			},
			send(){
				let _this = this;
				if(!_this.formData.pass1 || _this.formData.pass1.length < 6){
					uni.showModal({
						content: this.$t('newAdd.old_pass_length'),
					});
					return;
				}
				if(!_this.formData.pass2 || _this.formData.pass2.length < 6){
					uni.showModal({
						content: this.$t('newAdd.new_pass_length'),
					});
					return;
				}
				if(!_this.formData.pass3 || _this.formData.pass3.length < 6){
					uni.showModal({
						content: this.$t('newAdd.confirm_new_pass_length'),
					});
					return;
				}
				if(_this.formData.pass2 !== _this.formData.pass3){
					uni.showModal({
						content: this.$t('newAdd.two_new_pass_incorrect'),
					});
					return;
				}
				_this.$httpSend({
					path: '/im/set/password',
					data: _this.formData,
					success() {
						uni.showToast({
							title: this.$t('newAdd.update_success'),
						});
						setTimeout(() => {
							_action.checkFail();
						},2000);
					}
				});
			},
		},
		onLoad() {
			this.platform = uni.getSystemInfoSync().platform
		}
	}
</script>

<style scoped>
	
	.title {
		padding: 10upx 25upx;
	}
	
	.uni-icon-clear,
	.uni-icon-eye {
		color: #999;
	}
	
	.send {
		width: 100%;
		text-align: center;
	}
	.send_button {
		background-color: #1AAD19 !important;
		margin-top: 30upx;
	}
	
</style>
