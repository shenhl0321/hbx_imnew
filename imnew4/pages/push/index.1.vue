<template>
	<view class="page">
		
		<uni-list>
			<uni-list-item :title="$t('newAdd.chat_friend')" 
						   :show-arrow="true"
						   :show-badge="true"
						   badge-type="error"
						   :badge-text="showTips"
						   thumb="../../static/theme/default/push/circle.png"
						   @click="goPath('circle')"
						   />
						   
		</uni-list>
		
		<uni-list>
			<uni-list-item :title="$t('newAdd.scan')" 
						   :show-arrow="true"
						   thumb="../../static/theme/default/push/scan.png"
						   />						   
		
			<uni-list-item :title="$t('newAdd.shake')" 
						   :show-arrow="true"
						   :show-badge="true"
						   badge-type="error"
						   :badge-text="showTips"
						   thumb="../../static/theme/default/push/icon_shake.png"
						   @click="goPath('circle')"
						   />			   
		</uni-list>
		
		
		
		<uni-list>
			<uni-list-item :title="$t('newAdd.look')" 
						   :show-arrow="true"
						   thumb="../../static/theme/default/push/see.png"
						   />
			<uni-list-item :title="$t('newAdd.search')" 
						   :show-arrow="true"
						   thumb="../../static/theme/default/push/search.png"
						   />		
		</uni-list>
		<uni-list>
			<uni-list-item :title="$t('newAdd.nearbyMember')" 
						   :show-arrow="true"
						   :show-badge="true"
						   badge-type="error"
						   :badge-text="showTips"
						   thumb="../../static/theme/default/push/icon_nearby.png"
						   @click="goPath('game_site')"
						   />
		</uni-list>
		<uni-list>
			<uni-list-item :title="$t('newAdd.game')" 
						   :show-arrow="true"
						   thumb="../../static/theme/default/push/game.png"
						   @click="goPath('game_list')"
						   />
						   
		</uni-list>
		
		<uni-list>
			<uni-list-item :title="$t('newAdd.mini')" 
						   :show-arrow="true"
						   thumb="../../static/theme/default/push/program.png"
						   
						   />
		</uni-list>
		
	</view>
</template>

<script>
	
	import uniList from '../../components/uni-ui/uni-list/uni-list.vue';
	import uniListItem from '../../components/uni-ui/uni-list-item/uni-list-item.vue';
	import _get from '../../common/_get';
	import _hook from '../../common/_hook';
	
	export default {
		components: {
			uniList,
			uniListItem,
		},
		data() {
			return {
			}
		},
		onShow(){
			_hook.routeTabBarHook();
		},
		onLoad() {
			
		},
		computed: {
			showTips(){
				if(this.$store.state.no_reader_circle_chat_num){
					return this.$store.state.no_reader_circle_chat_num;
				}
				if(this.$store.state.no_reader_circle){
					return ' ';
				}
				return '';
			},
		},
		methods: {
			goPath(path){
				if(path){
					uni.navigateTo({
						url: path
					});
				}
			},
		},
	}
</script>

<style>
	
	.uni-list {
		margin-bottom: 30upx;
	}
	
</style>
