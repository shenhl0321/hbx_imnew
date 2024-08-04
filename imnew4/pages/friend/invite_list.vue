<template>
	<page-meta page-style="overflow:hidden"></page-meta>
	<view class="page">
		<scroll-view id="scrollcontent" class="scrollList" scroll-y>

			<view class="listBox">

				<view class="listlf">
					<view class="uni-list-cell" hover-class="none"
						:class="list_data.length -1 == index ? 'uni-list-cell-last' : ''"
						v-for="(item,index) in list_data" :key="item.id">
						<view>
							<view class="uni-media-list">
								<view class="uni-media-list-logo">
									<image :src="photo(item.photo+'')" :lazy-load="true" style="border-radius: 10px;" />
								</view>
								<view class="uni-media-list-body">
									<view class="uni-list-cell-navigate">{{item.nickname}}</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>

	</view>
</template>

<script>
	import uniIcon from '../../components/uni-ui/uni-icon/uni-icon.vue';
	import uniList from '../../components/uni-ui/uni-list/uni-list.vue';
	import uniListItem from '../../components/uni-ui/uni-list-item/uni-list-item.vue';
	import uniSwipeAction from '../../components/uni-ui/uni-swipe-action/uni-swipe-action.vue'
	import _get from '../../common/_get';
	import _hook from '../../common/_hook';
	import _data from '../../common/_data';
	import _action from '../../common/_action';
	import uniSearchBar from '@/components/mehaotian-search/mehaotian-search.vue'
	export default {
		components: {
			uniIcon,
			uniList,
			uniListItem,
			uniSwipeAction,
			uniSearchBar,
		},
		data() {
			return {
				list_data: [],
				new_friend_tips: 0,
				new_group_tips: 0,
				title: 'grid',
				touchmove: false,
				touchmoveIndex: -1,
				itemHeight: 0,
				winHeight: 0,
				scrollViewId: "A",
				titleHeight: 120,
				search_list: [],
				keyword: '',
				key_data: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S',
					'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
				],
				unread_msg: 0,
				status_height: 0,
				windowBottom: 0,
				tipHeight: 180, //jianxi
				jianrong: 0,
			}
		},
		onShow() {
			uni.setNavigationBarTitle({
				title: this.$t('group_tip.1')
			})
			this.getList()
		},

		onHide() {},
		computed: {
			staticPhoto() {
				return _data.staticPhoto();
			},
		},
		methods: {
			getList() {
				let _this = this;
				_this.$httpSend({
					path: '/im/get/inviteList',
					// data: _this.reg_form,
					success: (data) => {
						console.log("获取数据", JSON.stringify(data));
						_this.list_data = data
					},
					fail_callback(data) {
						console.log("失败的回调", data);

					},
					fail: (e) => {
						console.log("失败的回调", e);
					}
				});
			},
			goAdd() {
				let _path = './add';
				uni.navigateTo({
					url: _path,
				});
			},
			search(keyword) {
				this.keyword = keyword.trim();
				let _this = this;
				if (!keyword) {
					// console.log(1111)
					// console.log(_this.search_list)
					_this.list_data = _this.search_list;
					return true;
				}
				_get.searchFriends({
					'keyword': keyword
				}, function(data) {
					_this.list_data = data.data;
				})
			},
			photo(path) {
				return this.staticPhoto + path;
			},
			swipeAction(user_id) {
				uni.navigateTo({
					url: './remarks?user_id=' + user_id,
					animationType: 'slide-in-bottom',
				});
			},
			goDetails(user_id) {
				if (user_id) {
					uni.navigateTo({
						url: '../details/index?user_id=' + user_id,
					});
				}
			},
			goPath(path, type) {
				switch (type) {
					case 0:
						path += '?action=' + (this.new_friend_tips ? 1 : 0)
						this.new_friend_tips = 0;
						_data.data('new_friend_tips_num', 0);
						_action.setStatusTips();
						break;
					case 1:
						path += '?action=' + (this.new_group_tips ? 1 : 0);
						this.new_group_tips = 0;
						_data.data('new_group_tips_num', 0);
						_action.setStatusTips();
						break;
					default:
						break;
				}
				if (path) {
					uni.navigateTo({
						url: path,
					});
				}
			},
			isKey(key, index) {
				return key + '' + index;
			},
			touchStart(e) {
				this.touchmove = true;
				let pageY = e.touches[0].pageY;
				console.log("pageY", pageY);
				let index = Math.floor((pageY - this.titleHeight) / this.itemHeight);
				// #ifdef APP-PLUS
				index = Math.floor((pageY - this.titleHeight - this.status_height) / this.itemHeight);
				// #endif
				// console.log("index", index)
				let item = this.list_data[index];
				// console.log("list_data", this.list_data)
				// console.log("item", item)
				if (item) {
					this.scrollViewId = item.letter;
				}

				this.touchmoveIndex = index;
			},
			touchMove(e) {
				let pageY = e.touches[0].pageY;
				let index = Math.floor((pageY - this.titleHeight) / this.itemHeight);
				// #ifdef APP-PLUS
				index = Math.floor((pageY - this.titleHeight - this.status_height) / this.itemHeight);
				// #endif
				let item = this.list_data[index];
				if (item) {
					this.scrollViewId = item.letter;
					this.touchmoveIndex = index;
				}
			},
			touchEnd() {
				this.touchmove = false;
				//this.touchmoveIndex = -1;
			},
			touchCancel() {
				this.touchmove = false;
				//this.touchmoveIndex = -1;
			},
		},
		watch: {

		},
		onNavigationBarButtonTap(e) {
			let _path = e.index ? './phone-search' : './add';
			uni.navigateTo({
				url: _path,
			});
		}
	}
</script>

<style>
	page {
		background: #fff;
		height: 100%;
	}

	.page {
		/* display: flex;
		flex-direction: row; */
		height: 100%;
		background-color: #fff;
	}

	.scrollList {
		overflow-y: auto;
		overflow-x: hidden;
		-webkit-overflow-scrolling: touch;
	}

	.uni-indexed-list-bar {
		width: 40upx;
		background-color: transparent;
		display: flex;
		flex-direction: column;
		padding-right: 10rpx;
		position: fixed;
		right: 0;
		top: 240rpx;
		z-index: 10;
	}

	.uni-indexed-list-bar.active {
		/* background-color: rgb(200, 200, 200); */
	}

	.uni-indexed-list-text {
		font-size: 22upx;
		text-align: center;
	}

	.uni-indexed-list-bar.active .uni-indexed-list-text {
		color: #333;
	}

	.uni-indexed-list-text.active,
	.uni-indexed-list-bar.active .uni-indexed-list-text.active {
		color: #02b300;
	}

	.uni-indexed-list-alert {
		position: absolute;
		z-index: 20;
		width: 160upx;
		height: 160upx;
		left: 50%;
		top: 50%;
		margin-left: -80upx;
		margin-top: -80upx;
		border-radius: 80upx;
		text-align: center;
		line-height: 160upx;
		font-size: 70upx;
		color: #fff;
		background-color: rgba(0, 0, 0, 0.5);
	}

	.header {
		display: flex;
		flex-direction: row;
		padding: 10px 15px;
		align-items: center;
	}

	.input-view {
		display: flex;
		align-items: center;
		flex-direction: row;
		background-color: #e7e7e7;
		height: 30px;
		border-radius: 5px;
		padding: 0 10px;
		flex: 1;
	}

	.input {
		flex: 1;
		padding: 0 5px;
		height: 24px;
		line-height: 24px;
		font-size: 16px;
	}

	.uni-list-cell-navigate {
		padding: 0;
	}

	.uni-media-list-body {
		height: auto;
	}

	.uni-media-list image {
		border-radius: 10px;
	}

	.uni-swipe-action {
		width: 710upx !important;
	}

	.btm_border {
		position: relative;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}

	/* .btm_border::after {
  position: absolute;
  z-index: 3;
  right: 0;
  bottom: 0;
  left: 115upx;
  height: 1px;
  content: "";
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
  background-color: #e7e6ef;
} */
	.img-icon {
		width: 85upx;
		height: 85upx;
		border-radius: 10upx;
	}

	.uni-media-list-logo {
		height: 85upx;
		width: 85upx;
		/* margin-right: 20upx; */
	}

	.red_num {
		background-color: #f43530;
		width: 35upx;
		border-radius: 18upx;
		text-align: center;
		height: 35upx;
		line-height: 35upx;
		color: #ffffff;
		font-size: 23upx !important;
	}

	.topTitle {
		background-color: #fff;
		box-sizing: border-box;
		padding: 20rpx 30rpx;
		/* #ifdef APP-PLUS */
		padding-top: var(--status-bar-height);
		/* #endif */
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100vw;
		position: fixed;
		top: 0;
		left: 0;
		background: #fff;
		z-index: 10;
	}

	.topFont {
		font-size: 40rpx;
		color: #080E18;
		font-weight: bold;
		margin-left: 10rpx;
	}

	.titleLf {
		display: flex;
		justify-content: flex-end;
		align-items: center;
	}

	.titleLf>image {
		width: 40rpx;
		height: 40rpx;

	}

	.listBox {
		display: flex;
		justify-content: space-between;
		align-content: flex-start;
		flex-wrap: nowrap;
		flex-direction: row;
		padding-right: 10rpx;
		padding-left: 14rpx;
		/* #ifdef APP-PLUS */
		padding-bottom: 160rpx;
		/* #endif */
	}

	.listlf {
		/* flex: 1; */
	}

	.searchOut {
		box-sizing: border-box;
		padding: 0 28rpx;
	}

	.searchOut .search {
		padding: 14rpx 0 !important;
	}
</style>
<style>
	.icon-search {
		padding: 0 4rpx !important;
	}

	.search .content {
		padding-left: 20upx;
		height: 60upx;
		background-color: #F7F7F7 !important;
	}

	.uni-list .uni-media-list {
		padding-left: 0;
	}
</style>