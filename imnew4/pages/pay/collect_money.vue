<template>
    <view class="page">
        <pay-keyboard  :set_info = "set_info" :show_key="show_key" ref="payKeyboard" :set_msg="set_msg" @hideFun="hideFun" @getPassword="getPassword" :password="password"></pay-keyboard>
    </view>
</template>

<script>
    import payKeyboard from '../../components/uni-keyword/uni-keyword';
    import _get from '../../common/_get';
    import _data from '../../common/_data';
    import _hook from '../../common/_hook';
    export default {
        components: {
            payKeyboard
        },
        data() {
            return {
                title: '',
                show_key: true,
                password:'',
                set_msg:'',
                set_info:'',
                page_params:{},
                click:true
            }
        },
        onLoad(options) {
			this.title = this.$t('newAdd.p_input_trade_pass')
			this.set_info = this.$t('newAdd.p_input_trade_pass_to_confirm')
            _hook.routeSonHook();
            this.page_params = options;
        },
        onShow(){
			this.set_msg = this.$t('newAdd.user')+this.page_params.username+this.$t('newAdd.to_pay')+this.page_params.amount+this.$t('newAdd.yuan')
        },
        methods: {
            showFun() {
                this.show_key = true
            },
            hideFun() {
                this.show_key = false
            },
            getPassword(n) {
                console.log("用户输入的密码", n);
                this.page_params.trade_password = n;
                let _this = this;
                if(!_this.click) return false;
                _this.click = false;
                uni.showLoading({title:this.$t('newAdd.paying')});
				_get.payAmount({amount:_this.page_params.amount,to_user_id:_this.page_params.id},function(ret){
					 uni.$emit('data_user_info',ret);
					_data.data('user_info',ret);
					 _this.$refs.payKeyboard.cleanNum();
					uni.hideLoading();
					uni.showToast({
						title:this.$t('newAdd.pay_success'),
						icon:'none'
					});
					setTimeout(function(){
						uni.redirectTo({
							url:'/pages/my/wallet/capital'
						})
					},1000);
				})
            },
            cleanNum(){
                this.$refs.payKeyboard.cleanNum();
            }
        }
    }
</script>