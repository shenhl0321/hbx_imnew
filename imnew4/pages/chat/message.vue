<template>
	<view class="page"
		:style="{overflow: 'hidden','--custom-font-size': custom_font_size+'px','--time':disappear_delay_time+1+'s'}">
		<!-- #ifdef APP-PLUS -->
		<serving-view :list_id="list_id" @setState="setSeringState" :show="showServing" :state="servingState"
			@closeServing="showServing = false" ref="serving"></serving-view>
		<!-- #endif -->
		<!-- #ifdef H5 -->

		<!-- #endif -->
		<view class="page-content" @tap="closeAction">
			<view class="gong-gao-content" v-if="msgList.type == 1">
				<view class="gong-gao-content-info">
					<view class="iconfont-im icon-gonggao gong-gao-content-info-icon"></view>
					<text-scroll :text="notice=='没有群公告'?$t('chat.message.nonotice'):notice" ref="scrollNotice"></text-scroll>
				</view>
			</view>
			<view class="content">
				<scroll-view class="msg-list" :style="{height:scrollHeight,'margin-top':ios_content?jp_height+'px':0}"
					scroll-y="true" :scroll-with-animation="scrollAnimation" :scroll-into-view="scrollToView"
					@scrolltoupper="loadHistory" :upper-threshold="30" id="scrollview" 
					@scroll="scrollEven" @touchstart="hideDrawer(3)">
					<!--<view class="loading"-->
					<!--v-if="isHistoryLoading">-->
					<!--<view class="spinner">-->
					<!--<view class="rect1"></view>-->
					<!--<view class="rect2"></view>-->
					<!--<view class="rect3"></view>-->
					<!--<view class="rect4"></view>-->
					<!--<view class="rect5"></view>-->
					<!--</view>-->
					<!--</view>-->

					<uni-load-more status="noMore" v-if="noMore && !(isHistoryLoading)" />

					<view class="row" v-for="(row,index) in msgList.list" :key="index" :id="'msg' + row.msg.id">

						<!-- 系统消息 -->
						<block v-if="row.type==1">
							<view :class="['system',msgList.type == 1 && index == 0 ? 'sys':'']"
								:style="{padding:'10upx 0',marginBottom:'10upx'}">

								<!-- 文字消息-->
								<view v-if="row.msg.type==0 && row.msg.content && row.msg.content.text" class="text">
									{{row.msg.content.text.replace('撤回了一条消息',$t('message.back_message')).replace('加入群聊',$t('message.join_group')).replace('邀请了',$t('group_tip.1')).replace('进入会话',$t('group_tip.2')).replace('退出了群聊',$t('group_tip.3'))}}
								</view>
								<!-- 领取红包消息 -->
								<view v-if="row.msg.type==5" class="red-envelope" style="letter-spacing:4upx;">
									<image src="/static/img/red-envelope-chat.png" :lazy-load="true" />
									<!-- {{row.msg}} -->
									<block
										v-if="row.msg.content.rid_user_id == my_data.id && row.msg.content.user_id == my_data.id">
										{{$t('chat.message.got_myself_issued_red_bag')}}
									</block>
									<block
										v-else-if="row.msg.content.rid_user_id != my_data.id && row.msg.content.user_id == my_data.id">
										{{$t('chat.message.i_got')}}{{row.msg.content.rid_nickname}}{{$t('chat.message.issued')}}
									</block>
									<block
										v-else-if="row.msg.content.rid_user_id == my_data.id && row.msg.content.user_id != my_data.id">
										{{row.msg.content.nickname}}{{$t('chat.message.got_i_issued')}}
									</block>
									<block v-else>
										{{row.msg.content.nickname}}{{$t('chat.message.got')}}{{row.msg.content.rid_nickname}}{{$t('newAdd.issued')}}
									</block>
									<text style="color: red;"
										@tap="toDetails(row.msg.content.rid)">{{$t('chat.message.red_bag')}}</text>
								</view>
							</view>
						</block>

						<block
							v-if="row.type == 0 && (index == 0 || (row.msg.time - msgList.list[index - 1].msg.time > 300))">
							<view class="system" style="margin-bottom: 10upx">
								<!-- 文字消息 -->
								<view class="text" style="color: #ffffff;border-radius:12px;font-weight:600">
									{{ timestampFormat(row.msg.time + '') }}
								</view>
							</view>
						</block>

						<!-- 用户消息 -->
						<block v-if="row.type==0">
							<!-- 自己发出的消息 -->
							<view class="my" v-if="row.msg.user_info.uid == my_data.id ">
								<!-- 左-消息 -->
								<view class="left"
									@longpress="msgAction(row.msg.id +'',row.msg.user_info.uid + '',row.msg.content,row.msg.type,row.msg.user_info.name,row.msg)"
									:id="row.msg.id">
									<view class="custom-name">
										<!-- <view class="custom-username">{{row.msg.user_info.name}}</view> -->
										<view class="custom-content">
											<image v-if="row.msg.time<=nowReadTime" src="/static/img/read.png"
												mode="widthFix" class="read-icon"></image>
											<image v-else src="/static/img/unread.png" mode="widthFix"
												class="read-icon">
											</image>
											<!-- 文字消息 非图片-->
											<view v-if="row.msg.type==0 && !isImage(row.msg.content.text)" class=""
												style="color: #fff;">
												<view class="bubble"
													style="max-width: 100%!important;width:fit-content;">
													<block v-if="row.msg.content.text == '我通过了你的朋友验证请求,现在我们可以开始聊天了'">
														<text>{{$t('message.cert')}}</text>
													</block>
													<rich-text v-else style='white-space: pre-line;color:#fff;'
														:nodes="row.msg.content.text ? getHtml(row.msg.content.text): ' '"
														space="true" selectable="true" />
													 <!-- <image :src="row.msg.content." style="width: 20px;height: 20px;" mode=""></image> -->
												</view>
												<!-- 引用消息兼容-->
												<view v-if="typeof row.msg.content.yy =='string'" 
													class="yinyong_content"> 
													<rich-text
														:nodes="row.msg.content.yy ? getHtml(row.msg.content.yy): ' '"
														space="true" selectable="true" />
												</view>
												<!-- 引用文字 -->
												<view
													v-else-if="typeof row.msg.content.yy =='object' && row.msg.content.yy.type == 0"
													class="yinyong_content">
													<text>{{row.msg.content.yy.yy_username+":"}}</text>
													<image style="width:100px;height:100px" mode="aspectFit"
														:src="row.msg.content.yy.text"
														v-if="isImage(row.msg.content.yy.text)">
													</image>
													<rich-text v-else
														:nodes="row.msg.content.yy.text ? getHtml(row.msg.content.yy.text) : ' '"
														space="true" selectable="true" />
												</view>
												<!-- 引用图片 -->
												<view
													v-else-if="typeof row.msg.content.yy =='object' && row.msg.content.yy.type == 2"
													class="yinyong_content yinyongtupian">
													<text>{{ row.msg.content.yy.text}}</text>
													<image :src="(staticPath + list_id + '/' + row.msg.content.yy.url)"
														:style="{'width': row.msg.content.yy.w+'px','height': row.msg.content.yy.h+'px'}"
														mode="widthFix" :lazy-load="true" />
												</view> 
												<!-- 引用其他 -->
												<view
													v-else-if="typeof row.msg.content.yy =='object' && row.msg.content.yy.type != 2"
													class="yinyong_content">
													{{row.msg.content.yy.text}}
												</view>
											</view>
											<!-- 文字消息 图片链接 -->
											<view v-if="row.msg.type==0 && isImage(row.msg.content.text)" class="bubble"
												@tap="showPic2(row.msg.content.text)">
												<image :src="row.msg.content.text"
													:style="{'width':'100px','height':'100px' }" mode="widthFix"
													:lazy-load="true" />
											</view>
											<!-- 语言消息 -->
											<view v-if="row.msg.type==1" class="bubble voice" @tap="playVoice(row.msg)"
												:class="playMsgid == row.msg.id?'play':''">
												<view class="length">{{row.msg.content.length}}</view>
												<view class="icon my-voice"></view>
											</view>

											<!-- 图片消息 -->
											<view v-if="row.msg.type==2" class="bubble img" @tap="showPic1(row.msg)">
												<image :src="(staticPath + list_id + '/' + row.msg.content.url)"
													:style="{'width': row.msg.content.w+'px','height': row.msg.content.h+'px'}"
													mode="widthFix" :lazy-load="true" />
											</view>
											<!-- 视频消息 -->
											<view v-if="row.msg.type==3" class="bubble img">
												<image :src="staticPath + row.msg.content.full_movie"
													style="width: 320px;height: 240px">
												</image>
												<image class="bubble-bofang" src="/static/theme/default/my/bofang.png"
													style="width: 50px;height: 50px;" @tap="autoVideo(row.msg)"></image>
											</view>
											<!-- 红包 -->
											<view v-if="row.msg.type==5" class="bubble red-envelope"
												@tap="openRedEnvelope(row.msg,index)">
												<image src="/static/img/red-envelope.png" :lazy-load="true"
													:style="{'opacity':(receive_list.indexOf(row.msg.content.rid))< 0 ? 1 : 0.6}">
												</image>
												<view class="tis">
													{{(receive_list.indexOf(row.msg.content.rid)) <0?$t('chat.message.congratulations_on_making_a_fortune'):$t('chat.message.received')}}
												</view>
												<view class="blessing">
													<view class="info">
														{{row.msg.content.blessing}}
													</view>
													<view class="has-get-red">
														{{$t('chat.message.click_open_red_bag')}}
													</view>
													<!--{{row.msg.content.blessing}}-->
												</view>
											</view>
											<!-- 在线视频 -->
											<view v-if="row.msg.type==6" class="bubble">

												<view> {{row.msg.content.text}}
												</view>
												<text style="margin-left:2px" class="iconfont-im">&#xe619;
												</text>
											</view>
											<!-- 在线音频-->
											<view v-if="row.msg.type==7" class="bubble">
												<view> {{row.msg.content.text}}
												</view>
												<text style="margin-left:2px" class="iconfonts">&#xe60b;
												</text>
											</view>
											<!--卡片-->
											<view v-if="row.msg.type==8" class="send-card" @tap="getCard(row.msg)">
												<view class="send-card-content">
													<image :src="staticPhoto+row.msg.content.face" :lazy-load="true"
														style="width: 85upx;height: 85upx;"></image>
													<text>{{row.msg.content.nickname}}</text>
												</view>
												<view class="send-card-content-text">
													<text>{{$t('chat.message.business_card')}}</text>
												</view>
											</view>
											<!--戳一戳-->
											<view v-if="row.msg.type==9" class="bubble img">
												<image src="/static/theme/default/chuoyichuo.gif" :lazy-load="true"
													style="height: 70px;width: 130px;" mode="heightFix" />
											</view>
											<!-- 位置-->
											<view v-if="row.msg.type==10" class="bubble"
												@tap="openMap(row.msg.content)">
												<view class="address-flex">
													<view class="address-name">
														<text>{{row.msg.content && row.msg.content.name}}</text>
														<text
															class="text-gray">{{row.msg.content && row.msg.content.address}}</text>
													</view>

													<image class="fun-icon"
														src="../../static/theme/default/position.png" mode="widthFix">
													</image>
												</view>
											</view>
											<!-- 文件 -->
											<view v-if="row.msg.type==11" class="bubble"
												@tap="downFile(staticPath+ list_id+'/' + row.msg.content.url)">
												<view class="address-flex">
													<view class="address-name">
														<text>{{row.msg.content && row.msg.content.name}}</text>
														<text
															class="text-gray">{{row.msg.content && row.msg.content.length}}kb</text>
													</view>
													<image class="fun-icon" src="../../static/theme/default/file.png"
														mode="widthFix"></image>
												</view>
											</view>
											<!-- 在线音频消息 -->
											<view v-if="row.msg.type==15" class="bubble">
												<view class="flex align-center">
													<text
														v-if="row.msg.content.invite">{{$t('new_message.invite')}}</text>
													<text
														v-if="row.msg.content.refuse">{{$t('new_message.refuse')}}</text>
													<text
														v-if="row.msg.content.confirm">{{$t('new_message.confirm')}}</text>
													<text
														v-if="row.msg.content.leave">{{row.msg.content.longTime}}</text>
													<text style="margin-left:2px" class="iconfont-im">&#xe619;</text>
												</view>
											</view>
										</view>
									</view>
								</view>
								<!-- 右-头像 -->
								<view class="right" @tap="goDetails(row,row.msg.user_info.uid)">

									<image
										:src="(row.msg.is_niming == 1) ? '/static/theme/default/my/niming.png' : myPhoto"
										:lazy-load="true" style="border-radius: 50%;width:42px;height:42px;"
										@error="imageError2" mode="aspectFill" />
								</view>
							</view>

							<!-- 别人发出的消息 -->
							<view class="other" v-if="row.msg.user_info.uid != my_data.id">
								<!-- 左-头像 -->
								<view class="left">
									<image @click.stop="showAction(row,row.msg.user_info.uid)"
										:src="(row.msg.is_niming == 1)? '/static/theme/default/my/niming.png' : (staticPhoto + row.msg.user_info.face)"
										:lazy-load="true" style="border-radius: 50%;width:42px;height:42px;"
										:data-id="index" @error="imageError" mode="aspectFill" />
									<view class="action" v-if="row.showAction && msgList.type == 1">
										<view class="action-item" @click.stop="addFriendChat(row)">
											@TA
										</view>
										<view class="action-line">

										</view>
										<view class="action-item" v-if="isManage(my_data.id)"
											@click.stop="selectMember(row)">
											{{ isJinYan(row.msg.user_info.uid)?$t('chat.message.jiejin'):$t('chat.message.jinyan')}}
										</view>
										<view class="action-line" v-if="isManage(my_data.id)">

										</view>
										<view class="action-item" v-if="isManage(my_data.id)"
											@click.stop="selectRemoveMember(row)">
											{{$t('chat.message.tichu')}}
										</view>
										<view class="action-line" v-if="isManage(my_data.id)">

										</view>
										<view class="action-item"
											v-if="member_is_action>0 || member_info.can_add_friend"
											@click.stop="goDetails(row,row.msg.user_info.uid)">
											{{$t('chat.message.xiangqing')}}
										</view>
									</view>
								</view>
								<!-- 右-用户名称-时间-消息 -->
								<view class="right" :class="{'yhjf':row.msg.content.yhjf}"
									@longpress="msgAction(row.msg.id +'',row.msg.user_info.uid + '',row.msg.content,row.msg.type,row.msg.user_info.name,row.msg)">
									<view class="username">
										<view class="name" v-if="row.msg.is_niming == 1">{{$t('chat.message.anonymous')}}</view>
										<view class="name" v-else>{{getNickname(row.msg.user_info.uid)}}</view>
									</view>
									<!-- 文字消息 -->
									<view v-if="row.msg.type==0 && !isImage(row.msg.content.text)" class="">
										<view class="bubble" style="max-width: 100%!important;">
											<block v-if="row.msg.content.text == '我通过了你的朋友验证请求,现在我们可以开始聊天了'">
												<text>{{$t('message.cert')}}</text>
											</block>
											<rich-text v-else style='white-space: pre-line;'
												:nodes="row.msg.content.text ? getHtml(row.msg.content.text) : ' '"
												space="true" />
										</view>
										<!-- 引用消息-->
										<view v-if="typeof row.msg.content.yy =='string'" class="yinyong_content">
											<rich-text :nodes="row.msg.content.yy ? getHtml(row.msg.content.yy) : ' '"
												space="true" selectable="true" />
										</view>
										<!-- 引用文字 -->
										<view
											v-else-if="typeof row.msg.content.yy =='object' && row.msg.content.yy.type == 0"
											class="yinyong_content">
											<text>{{row.msg.content.yy.yy_username+":"}}</text>
											<image style="width:100px;height:100px" mode="aspectFit"
												:src="row.msg.content.yy.text" v-if="isImage(row.msg.content.yy.text)">
											</image>
											<rich-text v-else
												:nodes="row.msg.content.yy.text ? getHtml(row.msg.content.yy.text) : ' '"
												space="true" selectable="true" />
										</view>
										<!-- 引用图片 -->
										<view
											v-else-if="typeof row.msg.content.yy =='object' && row.msg.content.yy.type == 2"
											class="yinyong_content yinyongtupian">
											<text>{{ row.msg.content.yy.text}}</text>
											<image :src="(staticPath + list_id + '/' + row.msg.content.yy.url)"
												:style="{'width': row.msg.content.yy.w+'px','height': row.msg.content.yy.h+'px'}"
												mode="widthFix" :lazy-load="true" />
										</view>
										<!-- 引用其他 -->
										<view
											v-else-if="typeof row.msg.content.yy =='object' && row.msg.content.yy.type != 2"
											class="yinyong_content">
											{{row.msg.content.yy.text}}
										</view>
									</view>
									<!-- 文字消息 图片链接 -->
									<view v-if="row.msg.type==0 && isImage(row.msg.content.text)" class="bubble"
										@tap="showPic2(row.msg.content.text)">
										<image :src="row.msg.content.text" :style="{'width':'200px','height':'auto'}"
											mode="widthFix" :lazy-load="true" />
									</view>
									<!-- 语音消息 -->
									<view v-if="row.msg.type==1" class="bubble voice" @tap="playVoice(row.msg)"
										:class="playMsgid == row.msg.id?'play':''">
										<view class="icon other-voice"></view>
										<view class="length">{{row.msg.content.length}}</view>
									</view>

									<!-- 图片消息 -->
									<view v-if="row.msg.type==2" class="bubble img" @tap="showPic1(row.msg)">
										<image :src="(staticPath + list_id + '/' + row.msg.content.url)"
											:style="{'width': row.msg.content.w+'px','height': row.msg.content.h+'px'}"
											mode="widthFix" :lazy-load="true" />
									</view>
									<!-- 视频消息 -->
									<view v-if="row.msg.type==3" class="bubble img">
										<image :src="staticPath + row.msg.content.full_movie"
											style="width: 320px;height: 240px">
										</image>
										<image class="bubble-bofang-left" src="/static/theme/default/my/bofang.png"
											style="width: 50px;height: 50px;" @tap="autoVideo(row.msg)"></image>
									</view>
									<!-- 红包 -->
									<view v-if="row.msg.type==5" class="bubble red-envelope"
										@tap="openRedEnvelope(row.msg,index)">
										<image src="/static/img/red-envelope-o.png" :lazy-load="true"
											:style="{'opacity':(receive_list.indexOf(row.msg.content.rid))< 0 ? 1 : 0.6}">
										</image>
										<view class="tis">
											{{(receive_list.indexOf(row.msg.content.rid)) <0? $t('chat.message.congratulations_on_making_a_fortune') : $t('chat.message.received')}}
										</view>
										<view class="blessing">
											<view class="info">
												{{row.msg.content.blessing=='恭喜发财'?$t('chat.message.hand.congratulations'):row.msg.content.blessing}}
											</view>
											<view class="has-get-red">
												{{$t('chat.message.click_open_red_bag')}}
											</view>
											<!--{{row.msg.content.blessing}}-->
										</view>
									</view>
									<view v-if="row.msg.type==6" class="bubble">
										<text style="margin-right:2px" class="iconfont-im">&#xe619;
										</text>
										{{row.msg.content.text}}

									</view>
									<view v-if="row.msg.type==7" class="bubble">
										<text style="margin-right:2px" class="iconfonts">&#xe60b;
										</text>
										{{row.msg.content.text}}
									</view>
									<view v-if="row.msg.type==8" class="send-card" @tap="getCard(row.msg)">
										<view class="send-card-content">
											<image :src="staticPhoto+row.msg.content.face" :lazy-load="true"
												style="width: 85upx;height: 85upx;"></image>
											<text>{{row.msg.content.nickname}}</text>
										</view>
										<view class="send-card-content-text">
											<text>{{$t('chat.message.business_card')}}</text>
										</view>
									</view>
									<!-- 戳一戳 -->
									<view v-if="row.msg.type==9" class="bubble img">
										<image src="/static/theme/default/chuo.png" :lazy-load="true"
											style="width: 70px;height: 70px;" />
									</view>
									<!-- 位置-->
									<view v-if="row.msg.type==10" class="bubble" @tap="openMap(row.msg.content)">
										<view class="address-flex">
											<view class="address-name">
												<text>{{row.msg.content && row.msg.content.name}}</text>
												<text
													class="text-gray">{{row.msg.content && row.msg.content.address}}</text>
											</view>
											<image class="fun-icon" src="../../static/theme/default/position.png"
												mode="widthFix"></image>
										</view>
									</view>
									<!-- 文件 -->
									<view v-if="row.msg.type==11" class="bubble"
										@tap="downFile(staticPath+ list_id+'/' + row.msg.content.url)">
										<view class="address-flex">
											<view class="address-name">
												<text>{{row.msg.content && row.msg.content.name}}</text>
												<text
													class="text-gray">{{row.msg.content && row.msg.content.length}}kb</text>
											</view>
											<image class="fun-icon" src="../../static/theme/default/file.png"
												mode="widthFix"></image>
										</view>
									</view>
									<!-- 在线音频消息 -->
									<view v-if="row.msg.type==15" class="bubble">
										<view class="flex align-center">
											<text v-if="row.msg.content.invite">{{$t('new_message.invite')}}</text>
											<text v-if="row.msg.content.refuse">{{$t('new_message.refuse')}}</text>
											<text v-if="row.msg.content.confirm">{{$t('new_message.confirm')}}</text>
											<text v-if="row.msg.content.leave">{{row.msg.content.longTime}}</text>
											<text style="margin-left:2px" class="iconfont-im">&#xe619;</text>
										</view>
									</view>
								</view>


							</view>
						</block>
					</view>
					<view class="row" v-for="(row,index) in sendMsgList">
						<block>
							<view class="my">
								<view class="left">
									<view class="custom-name">
										<view class="custom-content">
											<!-- 文字消息 非图片-->
											<view style="color: #fff;">
												<view class="bubble"
													style="max-width: 100%!important;width:fit-content;">
													<rich-text style='white-space: pre-line;color:#fff;'
														:nodes="row.text ? getHtml(replaceEmoji(row.text)) : '- '"
														space="true" selectable="true" />
												</view>
											</view>
										</view>
									</view>
								</view>
								<!-- 右-头像 -->
								<view class="right">
									<image
										:src="(is_niming == 1) ? '/static/theme/default/my/niming.png' : myPhoto"
										:lazy-load="true" style="border-radius: 50%;width:42px;height:42px;"
										@error="imageError2" mode="aspectFill" />
								</view>
							</view>
						</block>
					</view>
				</scroll-view>
			</view>
			<!-- 抽屉栏 -->
			<view class="popup-layer" :class="popupLayerClass" @touchmove.stop.prevent="discard">
				<!-- 表情 -->
				<view :class="{hidden:hideEmoji}">
					<view class="" style="display: flex;align-items: center;">
						<image style="width: 26px;height: 26px;margin-right:10px;margin-left: 6px;"
							src="../../static/img/tools/Frame@2x(4).png" mode="aspectFit" @click="show_emj = true">
						</image>
						<image style="width: 26px;height: 26px;" src="../../static/img/tools/add-circle@2x.png"
							mode="aspectFit" @click="show_emj = false"></image>
					</view>
					<swiper v-if="show_emj" class="emoji-swiper" :indicator-dots="true" duration="150">
						<swiper-item v-for="(page,pid) in emojiList" :key="pid">
							<view v-for="(em,eid) in page" :key="eid" @tap="addEmoji(em)">
								<image :src="'/static/img/emoji/' + em.url" :lazy-load="true" />
							</view>
						</swiper-item>
					</swiper>
					<!-- 自定义表情 -->
					<scroll-view v-if="!show_emj" style="height:45vw" :scroll-y="true">
						<view class="grid">
							<view class="grid-item" @click="uploadCustomEmo">
								<image style="width:16vw;height:16vw;border:1px solid #ddd;"
									src="../../static/theme/default/camera.png" mode="aspectFit"></image>
							</view>
							<view class="grid-item" v-for="(item,index) in custom_emo" :key="index"
								@click="toSendEmo(item)">
								<image style="width:16vw;height:16vw" :src="globalData.http_url+item.full_url"
									mode="aspectFit"></image>
								<view class="close-icon" @click.stop="delCustomEmo(item.id)">
									<uni-icons type="clear" color="red" size="20"></uni-icons>
								</view>
							</view>
						</view>
					</scroll-view>
				</view>

				<!-- 更多功能 相册-拍照-红包 -->
				<swiper class="more-layer" style="height:50vw" :indicator-dots="true" indicator-active-color="#51c9c3"
					:class="{hidden:hideMore || !hideEmoji}" duration="150">
					<swiper-item>
						<view class="list">
							<view class="list-box" @tap="chooseCard" v-if="msgList.type == 100">
								<image class="fun-icon" src="../../static/img/tools/Id-card.png" mode="heightFix">
								</image>
								<view class="tool_text">{{$t('chat.message.business_card')}}</view>
							</view>
							<!-- #ifdef H5 -->
							<view class="list-box" @tap="sendMediaInvite(1)" v-if="msgList.type == 0">
								<image class="fun-icon" src="../../static/img/tools/video.png" mode="heightFix">
									<view class="tool_text">{{$t('chat.message.shipin')}}</view>
							</view>
							<view class="list-box" @tap="sendMediaInvite(2)" v-if="msgList.type == 0">
								<image class="fun-icon" src="../../static/img/tools/call-calling.png" mode="heightFix">
									<view class="tool_text">{{$t('chat.message.yuyin')}}</view>
							</view>
							<!-- #endif -->
							<!-- #ifdef APP-PLUS -->
							<view class="list-box" @tap="videoCall(1)" v-if="msgList.type == 0">
								<image class="fun-icon" src="../../static/img/tools/video.png" mode="heightFix">
									<view class="tool_text">{{$t('chat.message.shipin')}}</view>
							</view>
							<view class="list-box" @tap="videoCall(2)" v-if="msgList.type == 0">
								<image class="fun-icon" src="../../static/img/tools/call-calling.png" mode="heightFix">
									<view class="tool_text">{{$t('chat.message.yuyin')}}</view>
							</view>
							<!-- #endif -->
							<view class="list-box" @tap="chooseImage">
								<image class="fun-icon" src="../../static/img/tools/gallery.png" mode="heightFix">
								</image>
								<view class="tool_text">{{$t('chat.message.album')}}</view>
							</view>

							<view class="list-box" @tap="camera">
								<image class="fun-icon" src="../../static/img/tools/camera.png" mode="heightFix">
								</image>
								<view class="tool_text">{{$t('chat.message.shot')}}</view>
							</view>
							<view class="list-box" @tap="sendPos" v-if="msgList.type == 100">
								<image class="fun-icon" src="../../static/img/tools/location.png" mode="heightFix">
								</image>
								<view class="tool_text">{{$t('chat.message.location')}}</view>
							</view>
							<view class="list-box" @tap="video" v-if="msgList.type == 0">
								<image class="fun-icon" src="../../static/img/tools/play-circle.png" mode="heightFix">
								</image>
								<view class="tool_text">{{$t('chat.message.video')}}</view>
							</view>
							
							<view class="list-box" @tap="handRedEnvelopes">
								<image class="fun-icon" src="../../static/img/tools/Frame7.png" mode="heightFix">
								</image>
								<view class="tool_text">{{$t('chat.message.red_bag')}}</view>
							</view>
							
							<!--群地图 <view class="list-box" @tap="chooseChuo" v-if="msgList.type != 0">
								<image class="fun-icon" src="../../static/img/tools/Id-card.png" mode="heightFix">
								</image>
								<view class="tool_text">{{$t('chat.message.mp')}}</view>
							</view> -->
							<view class="list-box" @tap="chooseCard" v-if="msgList.type != 0">
								<image class="fun-icon" src="../../static/img/tools/Id-card.png" mode="heightFix">
								</image>
								<view class="tool_text">{{$t('chat.message.business_card')}}</view>
							</view>
							<view class="list-box" @tap="chooseLike" v-if="msgList.type != 0">
								<image class="fun-icon" src="../../static/img/tools/3dcube.png" mode="heightFix">
								</image>
								<view class="tool_text">{{$t('chat.message.collect')}}</view>
							</view>
							<view class="list-box" @tap="chooseFile" v-if="msgList.type != 0">
								<image class="fun-icon" src="../../static/img/tools/folder-2.png" mode="heightFix">
								</image>
								<view class="tool_text">{{$t('chat.message.wj')}}</view>
							</view>
							
							
							<view class="list-box" @tap="chooseLike" v-if="msgList.type == 0">
								<image class="fun-icon" src="../../static/img/tools/3dcube.png" mode="heightFix">
								</image>
								<view class="tool_text">{{$t('chat.message.collect')}}</view>
							</view>
							<view class="list-box" @tap="chooseFile" v-if="msgList.type == 0">
								<image class="fun-icon" src="../../static/img/tools/folder-2.png" mode="heightFix">
								</image>
								<view class="tool_text">{{$t('chat.message.wj')}}</view>
							</view>
							
						</view>
						<view class="list" style="margin-top: 8upx;">
							<!-- <view class="list-box" @tap="video">
								<image class="fun-icon" src="../../static/img/tools/play-circle.png" mode="heightFix">
								</image>
								<view class="tool_text">{{$t('chat.message.video')}}</view>
							</view> -->

							<!-- <view class="list-box" @tap="handRedEnvelopes">
								<image class="fun-icon" src="../../static/img/tools/Frame7.png" mode="heightFix">
								</image>
								<view class="tool_text">{{$t('chat.message.red_bag')}}</view>
							</view> -->

							<!-- <view class="list-box" @tap="chooseChuo">
								<image class="fun-icon" src="../../static/img/tools/Frame8.png" mode="heightFix">
								</image>
								<view class="tool_text">{{$t('chat.message.business_card')}}</view>
							</view> -->





							<!-- <view class="list-box" @tap="sayCall()" v-if="msgList.type == 1 && 0">
								<text class="iconfont-im icon-niming" style="font-size:50upx;">
								</text>
								<view class="tool_text">{{niming_msg}}</view>
							</view> -->
							<!-- <view class="list-box" @tap="zhendong" v-if="msgList.type == 1  && is_main">
								<view class="iconfont-im icon-zhendong"></view>
								<view class="tool_text2">{{$t('chat.message.vibration')}}</view>
							</view> -->
							<!-- <view class="list-box" @tap="showQiang()"
								v-if="msgList.type == 1 && vendor_status && is_main">
								<text class="iconfont-im icon-qiang" style="font-size:50upx;">
								</text>
								<view class="tool_text">{{$t('chat.message.award_bonus')}}</view>
							</view> -->
						</view>
					</swiper-item>
					<swiper-item v-if="msgList.type == 100">
						<view class="list">
							<view class="list-box" @tap="chooseCard">
								<image class="fun-icon" src="../../static/img/tools/Id-card.png" mode="heightFix">
								</image>
								<view class="tool_text">{{$t('chat.message.mp')}}</view>
							</view>
							<view class="list-box" @tap="chooseLike">
								<image class="fun-icon" src="../../static/img/tools/3dcube.png" mode="heightFix">
								</image>
								<view class="tool_text">{{$t('chat.message.collect')}}</view>
							</view>
							<view class="list-box" @tap="chooseFile">
								<image class="fun-icon" src="../../static/img/tools/folder-2.png" mode="heightFix">
								</image>
								<view class="tool_text">{{$t('chat.message.wj')}}</view>
							</view>
						</view>
					</swiper-item>
				</swiper>
			</view>

			<view class="input-box" v-if="msgList.is_msg">
				<view
					style="text-align: center !important;width:750upx;line-height: 100upx;border-top: #c9c9c9 solid 2upx;">
					{{$t('chat.message.all_members_are_forbidden')}}...
				</view>
			</view>

			<!-- @touchmove.stop.prevent="discard" -->

			<!-- 底部输入栏 -->
			<view class="input-box" :class="popupLayerClass" v-else>

				<!-- H5下不能录音，输入栏布局改动一下 -->
				<!-- #ifndef H5 -->
				<view class="voice">
					<view class="icon" :class="isVoice?'jianpan':'yuyin'" @tap="switchVoice"></view>
				</view>
				<!-- #endif -->

				<!-- #ifdef H5 -->
				<!-- <view class="more" @tap="showMore">
					<view class="icon add"></view>
				</view> -->
				<view class="voice">
					<view class="icon" :class="isVoice?'jianpan':'yuyin'" @tap="switchVoice"></view>
				</view>
				<!-- #endif -->

				<!-- #ifdef H5 -->
				<view class="textbox">
					<view class="voice-mode" :class="[isVoice?'':'hidden',recording?'recording':'']"
						@tap="voiceBeginH5">
						{{is_start_record?$t('chat.message.stopvioce'):$t('chat.message.voiceH5Tis')}}
					</view>
					<view class="text-mode" :class="isVoice?'hidden':''">

						<view class="box">
							<textarea v-if="focus_show" :focus="focusing" auto-height="true" ref="textarea"
								@confirm="huanhang" @input="inputText" :value="textMsg" @blur="blurFocus"
								@focus="textareaFocus" :maxlength="-1" :show-confirm-bar="false"
								style="max-height: 190upx;overflow:auto;border: 1px solid black; border-radius: 17px;padding-top: 4px;padding-bottom: 4px; " />
							<!-- 回复内容 -->
							<view class="yinyong" v-if="yy_content.text || yy_content.yy_username">
								<!-- 引用文字 -->
								<view class="yinyong_text" v-if="yy_type == 0">
									<rich-text style='white-space: pre-line;'
										:nodes="yy_content.text ? getHtml(yy_content.yy_username+':'+yy_content.text) : ' '"
										space="true" selectable="true" />
								</view>
								<!-- 引用图片 -->
								<view class="yinyong_text" v-else-if="yy_type == 2">
									{{yy_content.yy_username+':'+yy_content.text+"[图片]"}}
								</view>
								<!-- 引用其他 -->
								<view class="yinyong_text" v-else>
									{{yy_content.yy_username+':'+yy_content.text}}
								</view>
								<view class="yinyong_close" @click.stop="yy_content = {},yy_type=''">
									<uni-icons type="clear" color="gray" size="20"></uni-icons>
								</view>
							</view>
						</view>

						<view class="em" @tap="chooseEmoji">
							<view class="icon biaoqing"></view>
						</view>
					</view>
				</view>

				<!-- #endif -->
				<!-- #ifdef APP-PLUS -->
				<view class="textbox">
					<view class="voice-mode" :class="[isVoice?'':'hidden',recording?'recording':'']"
						@touchstart="voiceBegin" @touchmove.stop.prevent="voiceIng" @touchend="voiceEnd"
						@touchcancel="voiceCancel">
						{{voiceTis}}
					</view>
					<view class="text-mode" :class="isVoice?'hidden':''">

						<view class="box">
							<textarea auto-height="true" ref="textarea" @confirm="huanhang" @input="inputText"
								:value="textMsg" @blur="blurFocus" @focus="textareaFocus" :maxlength="-1"
								:show-confirm-bar="false"
								style="max-height: 190upx;overflow:auto;border: 1px solid black; border-radius: 17px;padding-top: 4px;padding-bottom: 4px; " />
							<!-- 回复内容 -->
							<view class="yinyong" v-if="yy_content.text">
								<!-- 引用文字 -->
								<view class="yinyong_text" v-if="yy_type == 0">
									<rich-text style='white-space: pre-line;'
										:nodes="yy_content.text ? getHtml(yy_content.yy_username+':'+yy_content.text) : ' '"
										space="true" selectable="true" />
								</view>
								<!-- 引用图片 -->
								<view class="yinyong_text" v-else-if="yy_type == 2">
									{{yy_content.yy_username+':'+yy_content.text+"[图片]"}}
								</view>
								<!-- 引用其他 -->
								<view class="yinyong_text" v-else>
									{{yy_content.yy_username+':'+yy_content.text}}
								</view>
								<view class="yinyong_close" @click.stop="yy_content = {},yy_type=''">
									<uni-icons type="clear" color="gray" size="20"></uni-icons>
								</view>
							</view>
						</view>

						<view class="em" @tap="chooseEmoji">
							<view class="icon biaoqing"></view>
						</view>
					</view>
				</view>

				<!-- #endif -->
				<view :class="iconShow" @tap="showMore">
					<view class="icon add"></view>
				</view>
				<view class="send" :class="sendMsgClass" @tap="sendText">

					<view class="btn">{{$t('chat.message.send')}}</view>
				</view>
			</view>


		</view>

		<view v-if="showVedio" class="showVedio">
			<!-- <video :src="videoPath"
             style="height: 100%;width: 100%"
             id="myVideo"
             object-fit="fill"
             airplay="allow" /> -->
			<video object-fit="contain" page-gesture="true" controls style="height: 100%;width: 100%" id="myVideo"
				:src="videoPath" @error="videoErrorCallback">
				<!-- <cover-view
                    @tap="showVedio = false"> -->
				<cover-image @tap="showVedio = false" src="/static/theme/default/my/close.png" class="cloneBut">
				</cover-image>
				<!-- </cover-view> -->
			</video>
		</view>


		<!-- #ifndef H5 -->
		<!-- 录音UI效果 -->
		<view class="record" :class="recording?'':'hidden'">
			<view class="ing" :class="willStop?'hidden':''">
				<view class="icon luyin2"></view>
			</view>
			<view class="cancel" :class="willStop?'':'hidden'">
				<view class="icon chehui"></view>
			</view>
			<view class="tis" :class="willStop?'change':''">{{recordTis}}</view>
		</view>
		<!-- #endif -->

		<!-- 红包弹窗 --> 
		<view class="windows" :class="windowsState">
			<!-- 遮罩层 -->
			<view class="mask" @touchmove.stop.prevent="discard" @tap="closeRedEnvelope"></view>
			<view class="layer" @touchmove.stop.prevent="discard">
				<view class="open-redenvelope">
					<view class="top">
						<view class="close-btn">
							<view class="icon close" @tap="closeRedEnvelope"></view>
						</view>
						<image :src="redenvelopeData.face_new" :lazy-load="true"></image>
					</view>
					<view class="from">{{$t('chat.message.from')}}{{redenvelopeData.from}}</view>
					<view class="blessing">{{redenvelopeData.blessing}}</view>
					<view class="money" @tap="openRed(redenvelopeData)">

						<image :class="luckbtn" src="/static/theme/default/my/red_3.png"
							style="width: 180upx; height: 180upx;">
						</image>
					</view>
					<view class="showDetails" @tap="toDetails(redenvelopeData.rid)">
						{{$t('chat.message.show_get_detail')}}
						<view class="icon to"></view>
					</view>
				</view>
			</view>
		</view>
		<uni-popup ref="popup2" :show="videPoup" position="bottom" mode="666">
			<view class="video-but-view">
				<button class="video-but" type="primary" @tap="videoBut('video')" :loading="videoLoading">视频聊天</button>
				<button class="video-but" type="primary" @tap="videoBut('voice')" :loading="voiceLoading">语音聊天</button>
				<button type="default" @click="videPoup=false">取消</button>
			</view>
		</uni-popup>
		<uni-popup ref="popup" type="confirm">
			<uni-popup-confirm title="温馨提示" :content="popuMsg" @confirm="confirm"> </uni-popup-confirm>
		</uni-popup>
		<uni-popup ref="qiang" type="qiang">
			<uni-popup-qiang title="开启发包" :status="miaoqiang + ''" :content="popuMsg" @confirm="goQiang">
			</uni-popup-qiang>
		</uni-popup>
		<!-- 上传文件 -->
		<nk-select-file v-model="showUploadFile" @confirm="uploadAFile"></nk-select-file>
		<uni-popup ref="popup_friends" type="bottom">
			<view class="popup_friends" :style="{height:popHeight+'px'}">
				<view class="popup_friends-top">
				</view>
				<select-friend :list_id="list_id" @close="closeFriends">
				</select-friend>
			</view>
		</uni-popup>
		<!-- 音视频界面 -->
		<uni-popup ref="media" :show="showMedia" position="center">
			<view class="media-box">
				<div id="remoteStreamContainer"></div>
				<!-- 图片 -->
				<view class="pic-box" v-if="isShow">
					<img :src="logoPic" alt="" class="pic">
					<view class="username-name">{{username}}</view>
				</view>

				<div id="localStreamContainer"></div>
				<div class="handle-box">
					<div class="startTime">
						<!-- 计时器 -->
						<text>{{sToHms(vide_time)}}</text>
					</div>
					<view style="display: flex;align-items: center;">
						<div style="display: flex;flex-direction: column;align-items: center;" @click="toggleAudio">
							<image v-if="audio_status" style="width: 60px;height:60px;" src="../../static/audio.png"
								mode="widthFix"></image>
							<image v-if="!audio_status" style="width: 60px;height:60px;" src="../../static/audio_.png"
								mode="widthFix"></image>
						</div>
						<div style="display: flex;flex-direction: column;align-items: center;margin:10rpx 40rpx;"
							@click="closeMedia(1)">
							<image style="width: 60px;height:60px;" src="../../static/gd.png" mode="widthFix"></image>
						</div>
						<div style="display: flex;flex-direction: column;align-items: center;" @click="toggleVideo">
							<image v-if="video_status" style="width: 60px;height:60px;" src="../../static/video.png"
								mode="widthFix"></image>
							<image v-if="!video_status" style="width: 60px;height:60px;" src="../../static/video_.png"
								mode="widthFix"></image>
						</div>
					</view>
				</div>

			</view>
		</uni-popup>
	</view>
</template>
<script>
	import uniLoadMore from "../../components/uni-ui/uni-load-more/uni-load-more.vue";
	import emoj_data from "../../static/js/message/emoji_data.js";
	import _get from "../../common/_get";
	import _hook from "../../common/_hook";
	import _action from "../../common/_action";
	import _data from "../../common/_data";
	import htmlParser from "../../common/html-parser";
	import uniPopup from "../../components/uni-popup/uni-popup.vue";
	import uniPopupConfirm from "../../components/uni-popup/uni-popup-confirm.vue";
	import uniPopupQiang from "../../components/uni-popup/uni-popup-qiang.vue";
	import textScroll from "../../components/textScroll/textScroll.vue";
	import nkSelectFile from "@/components/nk-select-file/nk-select-file.vue";

	import _mixins from '@/common/_mixins';

	import {
		mapState,
		mapMutations
	} from "vuex";

	import selectFriend from "./select_friend.vue";

	import {
		genTestUserSig
	} from "@/debug/GenerateTestUserSig.js";
	// #ifdef H5
	import TRTC from 'trtc-js-sdk'
	// #endif
	import RecordRTC from 'recordrtc'
	export default {
		components: {
			uniLoadMore,
			uniPopup,
			uniPopupConfirm,
			uniPopupQiang,
			textScroll,
			nkSelectFile,
			selectFriend,
		},
		data() {
			return {
				servingState: 3,
				onLine: false,
				showServing: false,
				memberPhotos: [],
				is_main: 0,
				nowReadTime: 1635013026,
				redTimer: null,
				notice: "",
				scrollInfo: {
					input_box_height1: 0,
					input_box_height2: 0,
					totall_height: 0,
				},
				scrollHeight: "0px",
				niming_msg: "",
				videoContext: null,
				videoPath: "",
				showVedio: false,
				receive_list: [],
				luckbtn: "",
				scrollTop: 0,
				chat_id: "",
				//文字消息
				videPoup: false,
				videPlay: false,
				voiceLoading: false,
				videoLoading: false,
				textMsg: "",
				//消息列表
				isHistoryLoading: false,
				scrollAnimation: false,
				scrollToView: "",
				msgList: {
					show_name: "",
					list: [],
					type: 0,
					is_msg: 0,
					is_action: 0,
				},
				msgImgList: [],
				noMore: 0,

				isVoice: false,
				// voiceTis: "按住 说话",
				voiceTis: this.$t("chat.message.hold_to_talk"),
				// recordTis: "手指上滑 取消发送",
				recordTis: this.$t("chat.message.slide_your_finger_up_to_cancel_sending"),
				recording: false,
				willStop: false,
				initPoint: {
					identifier: 0,
					Y: 0,
				},
				recordTimer: null,
				recordLength: 0,
				// #ifdef APP-PLUS
				call: uni.requireNativePlugin("TencentCloud-TUICallKit"),
				// #endif
				playMsgid: null,
				VoiceTimer: null,
				// 抽屉参数
				popupLayerClass: "",
				// more参数
				hideMore: true,
				//表情定义
				hideEmoji: true,
				emojiList: emoj_data.emoji_list,

				//表情图片图床名称 ，由于我上传的第三方图床名称会有改变，所以有此数据来做对应，您实际应用中应该不需要
				//onlineEmoji: emoj_data.online_emoji,

				//红包相关参数
				windowsState: "",
				redenvelopeData: {
					rid: null, //红包ID
					from: null,
					face: null,
					blessing: null,
					money: null,
					index: null,
				},
				list_id: 0,
				my_data: {},
				style: {
					pageHeight: 0,
					contentViewHeight: 0,
					footViewHeight: 90,
					mitemHeight: 0,
				},
				call_ret: false,
				my_photo: "",
				callType: 1, //默认视频,
				popuMsg: "",
				payTimer: false,
				type: "",
				Keyboard: 0,
				miaoqiang: 0,
				vendor_status: 0,
				doubleClick: false,
				doubleTime: {
					firstTime: "",
					towTime: "",
					flag: true,
					timer: null,
				},
				group_state: null,
				isOnline: 2, // （0表示离线，1表示在线）
				showUploadFile: false, //上传文件

				send_user_id: "", //@好友的信息

				popHeight: "", //弹出选择好友高度

				members: [], //群成员
				showMedia: true,

				client: null, //音视频客户端
				localStream: null, //本地视频流

				leftDataList: [], //左声道
				rightDataList: [], //右声道

				voiceH5Tis: '',
				is_start_record: false, //是否开始录音
				recorder_h5: null, //录音对象
				recorder_timer: null, //录音定时器
				recorder_time: 0,

				disappear_delay_time: 0, //阅后即焚秒数

				vide_time: 0,
				vide_timer: null, //视频定时器
				other_avatar: '', //好友头像
				logoPic: '',
				show_name: '',
				username: '',

				current_room: '', //当前房间号
				current_type: 2, //默认音频
				audio_status: true, //是否开启语音
				video_status: false, //是否开启视频
				isShow: true,

				audio_src: '', //修复safari上音频播放

				yy_content: {}, //引用内容
				yy_type: "", //引用类型
				ios_content: false, //针对IOS弹起键盘处理
				jp_height: 0, //IOS键盘高度
				innerHeight: 0, //初始化页面高度

				custom_emo: [], //自定义表情

				show_emj: true, //默认显示默认表情

				current_scrollTop: 0, //当前滚动高度

				current_scrollTop_: 0, //当前按住消息时候的滚动条高度
				
				current_scrollHeight: 0, // 当前滚动总高度

				manage_ids: [], //管理员id，群主id
				jinyan_ids: [], //禁言的成员id

				members_: [], //群成员
				member_names: [], //群成员昵称
				member_info: {}, //群信息
				member_is_action: 0, //权限

				focusing: false, //聚焦
				focus_show: true, //闪烁
				is_niming: 0,
				sendMsgList: [],
				previewImageFlag:false,
				
				isGroup : false,
			};
		},
		onBackPress(options) {
			console.log(options);
			uni.navigateTo({
				url: "/pages/chat/index",
			});
			return false;
		},
		beforeDestroy() {
			this.recorder_h5 = null
			clearInterval(this.recorder_timer);
			this.closeAction()
			this.recorder_timer = null
		},
		
		watch :{
			scrollToView(val){
				console.log('shenhl=========' + val)
			}
		},
		onLoad(option) {
			console.log('====2222222222222=======')
			console.log(option)
			this.niming_msg = this.$t('newAdd.anonymous')
			if(option.avatar.includes('group')){
				this.isGroup == true;
			}
			if (option.avatar) {
				this.other_avatar = option.avatar
			}
			if (option.show_name) {
				this.show_name = option.show_name
			}
			// 监听语音视频通话事件
			// #ifdef APP-PLUS
			const TUICallingEvent = uni.requireNativePlugin('globalEvent');
			TUICallingEvent.addEventListener('onError', (res) => {
				console.log('onError', JSON.stringify(res));
			});
			TUICallingEvent.addEventListener('onCallReceived', (res) => {
				console.log('onCallReceived', JSON.stringify(res));
			});
			TUICallingEvent.addEventListener('onCallCancelled', (res) => {
				console.log('onCallCancelled', res);
			});
			TUICallingEvent.addEventListener('onCallBegin', (res) => {
				console.log('onCallBegin', JSON.stringify(res));
			});
			TUICallingEvent.addEventListener('onCallEnd', (res) => {
				console.log('onCallEnd', JSON.stringify(res));
			});
			// #endif

			this.list_id = option.list_id;
			if ("chat_id" in option) {
				this.chat_id = option.chat_id;
			}
			console.log('======')
			console.log(option)
			if ("trans" in option) {
				uni.showToast({
					icon: "success",
					ducation: 2000,
				});
			}
			//注册事件
			// 注册发送音频事件
			this.regOnStartEvent((e) => {
				this.recordBegin(e);
			});
			// 注册发送音频事件
			this.regSendVoiceEvent((e) => {
				this.recordEnd(e);
			});

			// 注册发送音频事件
			this.regVudioEndEvent((e) => {
				this.playMsgid = null;
			});

			//this.initData();
			// //语音自然播放结束
			// this.AUDIO.onEnded((res) => {
			//   this.playMsgid = null;
			// });
			//
			// // #ifndef H5
			// //录音开始事件
			// this.RECORDER.onStart((e) => {
			//   this.recordBegin(e);
			// })
			// //录音结束事件
			// this.RECORDER.onStop((e) => {
			//   this.recordEnd(e);
			// })
			// //#endif
		},
		onUnload() {
			/** 这里只保留最新的15条会话记录，以保证初次加载性能 */
			let _this = this;
			let chat_data = this.msgList;
			chat_data.list = chat_data.list.slice(-15);
			_data.localData(this.list_id, chat_data);
			/** 去除当前会话的list_id */
			_data.localData("message_list_id", "");
			/** 暂停语音播放 */
			// this.AUDIO.pause();
			uni.$off("video_invite");
			uni.$off("video_refuse");
			/** 移除监听事件 */
			uni.$off("data_chat_data_unshift");
			uni.$off("data_chat_data_push");
			uni.$off("data_chat_data");
			uni.$off("data_user_info");
			uni.$off("data_chat_data_delete");
			uni.$off("update_text_msg");
			uni.$off("memberJoinRoom");
			uni.$off("closeVoiceRoom");
			uni.$off("data_online_status");
			clearInterval(_this.timer);
			clearInterval(_this.redTimer);
			clearInterval(_this.vide_timer);
			if (_data.data("voice_room_type")) {
				_this.$refs.serving.xiaMai(_this.list_id);
			} else {
				_this.$refs.serving && _this.$refs.serving.closeVoiceRoom();
			}
		},
		mounted() {
			let _this = this;
			this.innerHeight = window.innerHeight; //初始化页面高度
			// 获取自定义表情包
			this.getCustomEmo()
			console.log('12345')
			console.log(this.chat_id)
			// if (this.chat_id) {
				
			// 	this.$nextTick(() => {
			// 		this.scrollToView = "msg" + this.chat_id;
			// 	});
			// }
			
			setTimeout(function() {
				_this.getScrollContentHeight("hide", 0);
			}, 400);
		},
		created() {
			this.getYHJFstatus()
		},

		onShow() {
			
			if (!this.previewImageFlag) {  
				this.initData()
				this.getSetting()
				this.getMemberNickName()
			} 
			 

			this.previewImageFlag = false; 
			
		},
		computed: {
			...mapState({
				RECORD: (state) => state.audio.RECORD,
				AUDIO: (state) => state.audio.AUDIO,
				RecordTime: (state) => state.audio.RecordTime,
				KeyboardH: (state) => state.common.KeyboardHeight,
				custom_font_size: (state) => state.common.custom_font_size,
			}),
			globalData() {
				return getApp().globalData
			},
			getServingText() {
				return _data.data("dragInfo").state == 1 ? this.$t('newAdd.put_down_the_microphone') : this.$t('newAdd.use_the_microphone');;
			},
			myPhoto() {
				return this.my_photo;
			},
			imgRan() {
				return Math.random();
			},
			staticPath() {
				return _data.staticChat();
			},
			staticVideoImg() {
				return _data.staticVideoImg();
			},
			staticPhoto() {
				return _data.staticPhoto();
			},
			sendMsgClass() {
				return (this.isVoice ? "hidden" : "") || this.textMsg.length ?
					"" :
					"hidden";
			},
			iconShow() {
				return this.textMsg.length ? "hidden" : "more";
			},
			systemClass() {
				return this.msgList.type == 1 ? "sys" : "";
			},

		},
		onReady: function(res) {

		},
		methods: {
			...mapMutations([
				"regSendVoiceEvent",
				"regOnStartEvent",
				"regVudioEndEvent",
			]),
			timestampFormat(time) {
				return _action.timestampFormat(time);
			},
			// 获取群成员昵称
			getMemberNickName() {
				let _this = this;
				_get.getMemberList({
					list_id: this.list_id
				}, function(data) {
					console.log('群成员昵称', data.data)
					let obj = data.data
					let arr = []
					for (let key in obj) {
						arr.push(...obj[key].data);
					}
					console.log('群成员昵称1', arr)
					_this.member_names = arr;
				})
			},
			getNickname_(id) {
				let name = ''
				this.member_names.forEach(item => {
					if (item.user_id == id) {
						name = item.name
					}
				})
				return name
			},
			// 群聊昵称
			getNickname(id) {
				let name = ''
				this.members_.forEach(item => {
					if (item.user_id == id) {
						name = item.show_name
					}
				})
				return name
			},
			getSetting() {
				let _this = this;
				if (_this.msgList.type == 1) {
					setTimeout(function() {
						_this.$refs.scrollNotice.textScroll()
					}, 300);
					this.getQunZhuId()
					this.getJinYanId()
				}
			},
			// 是否已经被禁言
			isJinYan(id) {
				return this.jinyan_ids.indexOf(id.toString()) > -1
			},
			// 已经被禁言的id数组
			getJinYanId() {
				const _this = this
				_this.$httpSend({
					path: '/im/message/getGroupAdmin',
					data: {
						list_id: this.list_id,
						type: 2,
					},
					success(data) {
						_this.jinyan_ids = data ? data.user_ids : [];
					},
				});
			},

			// 是否是管理员
			isManage(id) {
				console.log("manage_ids", this.manage_ids)
				return this.manage_ids.indexOf(Number(id)) > -1
			},
			// 拿到群主的ID，判断是否是群主
			getQunZhuId() {
				const _this = this
				_this.$httpSend({
					path: '/im/message/getChatDetails',
					data: {
						list_id: _this.list_id,
					},
					success(data) {
						console.log("群信息", data)
						_this.member_info = data.group
						_this.member_is_action = data.is_action
						let member = data.member || []
						_this.members_ = member
						member.forEach(item => {
							if (item.is_admin > 0) {
								_this.manage_ids.push(item.user_id)
							}
						})
					}
				});
			},
			// 关闭操作
			closeAction() {
				if (this.msgList.list && this.msgList.list.length) {
					this.msgList.list.map((item) => {
						item.showAction = false;
					});
				}
				this.$forceUpdate()
			},
			// 删除自定义表情
			delCustomEmo(id) {
				const _this = this
				uni.showModal({
					title: this.$t('newAdd.dialog'),
					content: this.$t('newAdd.certainToDelete'),
					success: (res) => {
						if (res.confirm) {
							_this.$httpSend({
								path: "/im/user/delFavor",
								data: {
									id: id
								},
								success_action: true,
								success(res) {
									console.log("删除自定义表情包", res)
									uni.showToast({
										title: res.msg,
										icon: 'none',
										complete: () => {
											_this.getCustomEmo()
										}
									})
								},
							});
						}
					}
				})
			},
			// 添加自定义表情
			addCustomEmo(url) {
				const _this = this
				this.$httpSend({
					path: "/im/user/addFavor",
					data: {
						url: url
					},
					success_action: true,
					success(res) {
						console.log("添加自定义表情包", res)
						uni.showToast({
							title: res.msg,
							icon: 'none',
							complete: () => {
								_this.getCustomEmo()
							}
						})
					},
				});
			},
			// 获取自定义表情包
			getCustomEmo() {
				const _this = this
				this.$httpSend({
					path: "/im/user/myfavor",
					success_action: true,
					success(res) {
						console.log("表情包", res)
						_this.custom_emo = res
					},
				});
			},
			// 上传自定义表情包
			uploadCustomEmo() {
				const _this = this
				uni.chooseImage({
					count: 1,
					sourceType: ['album'],
					sizeType: ["original", "compressed"], //可以指定是原图还是压缩图，默认二者都有
					success: (res) => {
						const local_url = res.tempFilePaths[0];
						console.log("自定义表情", local_url)
						_this.$httpSendFile({
							type: 7,
							local_url: local_url,
							success(data) {
								console.log("表情上传", data);
								_this.getCustomEmo()
							},
						});
					},
				});

			},
			// 开启/关闭音频
			toggleAudio() {
				if (this.audio_status) {
					this.audio_status = false
					// 关闭音频，远端会收到 'mute-audio' 事件
					this.localStream.muteAudio();

				} else {
					this.audio_status = true
					// 打开音频，远端会收到 'unmute-audio' 事件
					this.localStream.unmuteAudio();
				}
			},
			// 开启/关闭视频
			toggleVideo() {
				if (this.video_status) {
					this.video_status = false
					// 关闭视频，远端会收到 'mute-video' 事件
					this.localStream.muteVideo();
				} else {
					this.video_status = true
					// 打开视频，远端会收到 'unmute-video' 事件
					this.localStream.unmuteVideo();
				}
			},
			// 转换时间方法
			sToHms(s) {
				s = Math.floor(s); //如果输入的是浮点数，则舍弃小数位
				var h = Math.floor(s / 3600); //计算得出小时数
				if (h < 10) { //调整为两位数的格式
					h = '0' + h;
				}
				var m = Math.floor(s / 60 - h * 60); //计算得出分钟数
				if (m < 10) { //调整为两位数的格式
					m = '0' + m;
				}
				var s = s % 60; //计算得出剩下的秒数
				if (s < 10) { //调整为两位数的格式
					s = '0' + s;
				}
				return h + ':' + m + ':' + s; //最后连接成字符串并返回
			},
			// 获取是否开启阅后即焚
			getYHJFstatus() {
				const _this = this
				_mixins.methods.$httpSend({
					path: '/im/get/base',
					success(data) {
						console.log("阅后即焚状态", data)
						_this.disappear_after_read = data.disappear_after_read; //后台是否开启阅后即焚
						if (data.disappear_after_read == '1') {
							_this.disappear_delay_time = Number(data.disappear_delay_time)
							const arr = [..._this.msgList.list];
							arr.map(item => {
								// 阅后即焚,不是自己发出的消息
								if (item.msg.content.yhjf && item.msg.user_info.uid != _this.my_data.id) {
									let id = item.msg.id + ''
									console.log("阅后即焚", id, _this.disappear_delay_time * 1000)
									setTimeout(() => {
										_this.autoYHJF(id)
									}, _this.disappear_delay_time * 1000)
								}
							})
						}
					},
					fail(err) {
						console.log("err", err);
					}
				});
			},
			// 消息是否是图片
			isImage(con) {
				// console.log("con",con);
				// 如果是图片，则转换成图片
				let reg =
					/^https?:\/\/(.+\/)+.+(\.(gif|png|jpg|jpeg|webp|svg|psd|bmp|tif))$/i;
				let reg2 = RegExp(/data:image\/.*;base64,/);
				if (reg.test(con) || reg2.test(con)) {
					return true;
				} else {
					return false;
				}
			},
			// 选择要禁言的人
			selectMember(row) {
				console.log("row", row);
				let user_id = row.msg.user_info.uid + "";
				if (user_id) {
					let i = this.members.indexOf(user_id);
					if (i > -1) {
						this.members.splice(i, 1);
					} else {
						this.members.push(user_id);
					}
				}
				let _this = this;
				_this.$httpSend({
					path: "/im/message/setGroupAdmin",
					data: {
						users: JSON.stringify(_this.members),
						list_id: _this.list_id,
						type: 2,
					},
					success_action: true,
					success(res) {
						console.log("res", res)
						if (res.err == 0) {
							row.showAction = false;
							_this.$forceUpdate();
							// 禁言
							uni.showToast({
								icon: 'none',
								title: 'success'
							});
						} else {
							row.showAction = false;
							_this.$forceUpdate();
							uni.showToast({
								icon: 'none',
								title: res.msg
							});
						}
						_this.getSetting()
					},
				});
			},
			// 选择要剔出的人
			selectRemoveMember(row) {
				console.log("row", row);
				let user_id = row.msg.user_info.uid;
				if (user_id) {
					let i = this.members.indexOf(user_id);
					if (i > -1) {
						this.members.splice(i, 1);
					} else {
						this.members.push(user_id);
					}
				}
				let _this = this;
				_this.$httpSend({
					path: "/im/message/removeChat",
					data: {
						users: JSON.stringify(_this.members),
						list_id: _this.list_id,
					},
					success_action: true,
					success(res) {
						if (res.err == 0) {
							row.showAction = false;
							_this.$forceUpdate();
							uni.showToast({
								icon: 'none',
								title: 'success'
							});
						} else {
							uni.showToast({
								icon: 'none',
								title: rs.msg
							});
						}

					},
				});
			},
			// 所有群成员
			getGroupMembers(row) {
				let _this = this;
				_this.$httpSend({
					path: "/im/message/getGroupAdmin",
					data: {
						list_id: this.list_id,
						type: 2,
					},
					success(data) {
						if (data) {
							console.log("成员数量", data)
							_this.members = data.user_ids;
							console.log("_this.members", _this.members);
							row.showAction = true;
						} else {

						}

						_this.$forceUpdate();
					},
				});
			},
			//  长按显示面板
			showAction(row, id) {
				if (this.msgList.type == 0) {
					this.goDetails(row, id)
					return
				}
				this.msgList.list.map((item) => {
					item.showAction = false;
				});
				row.showAction = true
				this.$forceUpdate()
				return
				this.getGroupMembers(row);
			},
			// 长按头像@好友
			addFriendChat(msg) {
				console.log("群昵称", msg)
				msg.showAction = false;
				// 获取用户群昵称
				let name = this.getNickname_(msg.msg.user_info.uid)
				this.textMsg = this.textMsg + "@" + name + " ";
				if (!this.send_user_id) {
					this.send_user_id = msg.msg.user_info.uid;
				} else {
					this.send_user_id = this.send_user_id + "," + msg.msg.user_info.uid;
				}
			},
			closeFriends() {
				this.$refs.popup_friends.close();
			},
			// 初始化数据
			initData() {
				
				_hook.routeSonHook();
				_get.getUserInfo({});
				//  选择@好友高度
				this.popHeight = uni.getSystemInfoSync().windowHeight;

				let _this = this;
				/** 先移除监听事件（避免重复触发消息） */
				uni.$off("video_invite");
				uni.$off("video_refuse");
				uni.$off("remove_member");
				uni.$off("group_delete_chat");
				uni.$off("chat_del");
				uni.$off("data_chat_data_unshift");
				uni.$off("data_chat_data_push");
				uni.$off("data_chat_data");
				uni.$off("data_user_info");
				uni.$off("data_chat_data_delete");
				uni.$off("update_text_msg");
				uni.$off("memberJoinRoom");
				uni.$off("closeVoiceRoom");
				uni.$off("newReadTime");
				uni.$off("data_online_status")
				clearInterval(_this.timer);
				clearInterval(_this.redTimer);
				_this.getReadTime();
				uni.$on("newReadTime", function(time) {
					_this.nowReadTime = time;
				});
				_this.my_photo = _data.data("cache").local_photo;
				
				_get.getChatData({
					send_data: {
						list_id: _this.list_id,
						time: 0,
						is_up: 1,
					},
					is_action_data: 1,
				});
				
				let chat_data = _data.localData(_this.list_id);
				_this.my_data = _data.data("user_info");

				var chatList = _data.localData('chat_list');
				var chatPreTitle = '';
				for (let i = 0; i < chatList.length; i++) {
					if (chatList[i].list_id == _this.list_id) {
						chatPreTitle = chatList[i].show_name;
						break;
					}
				}
				if (chat_data && chat_data.list.length) {
					console.log('------true-----');
					_this.scrollAnimation = false;
					//  图片列表
					let msg = "";
					if (chat_data.online == 1) {
						// msg = "(在线)";
						msg = `(${_this.$t('g_m.online')})`
					} else {
						// msg = "(离线)";
						msg = `(${_this.$t('g_m.offline')})`
					}
					uni.setNavigationBarTitle({
						title: chat_data.show_name + (chat_data.type == 1 ? "" : msg),
						// title: chatPreTitle + (chat_data.type == 1 ? "" : msg),
					});
					_this.addMsgImgList(chat_data.list);
					chat_data.list = _this.msgDataHandle(chat_data.list);
					_this.msgList = chat_data;
					_this.receive_list = _this.msgList.receive_list;
					
					/** 滚动到指定位置 */
					setTimeout(function() {
						_this.$nextTick(function() {
							_this.scrollTop = new Date().getTime();
							 
							 _this.scrollToView = 'msg' + chat_data.list[chat_data.list.length - 1].msg.id;
						});
					}, 400);
					/** 如果是群聊要实时检测群有无禁言 */
					_this.type = chat_data.type;
					if (chat_data.type == 1) {
						_this.getGroupSteate();
					}
				} else {
					_get.getChatData({
						send_data: {
							list_id: _this.list_id,
							time: 0,
							is_up: 1,
						},
						is_action_data: 1,
					});
					let msg = "";
					if (chat_data.online == 1) {
						// msg = "(在线)";
						msg = `(${_this.$t('g_m.online')})`
					} else {
						// msg = "(离线)";
						msg = `(${_this.$t('g_m.offline')})`
					}
					console.log('------null-----', chatPreTitle + (chat_data.type == 1 ? "" : msg));
					/** 滚动到指定位置 */
					setTimeout(function() {
						_this.$nextTick(function() {
							 _this.scrollToView = 'msg' + _this.msgList.list[_this.msgList.list.length - 1].msg.id;
						});
					}, 500);
					uni.setNavigationBarTitle({
						// title: chat_data.show_name + (chat_data.type == 1 ? "" : msg),
						title: chatPreTitle + (chat_data.type == 1 ? "" : msg),
					});
		
				}

				/** 添加当前的会话list_id */
				_data.localData("message_list_id", this.list_id);

				uni.$on("video_refuse", function(data) {
					_this.closeMedia()
				})
				// 加入音视频通话
				uni.$on("video_invite", function(data) {
					console.log("音视频通话", data)
					console.log("音视频通话房间id", data.data.msg.content.room)
					// 发来的邀请非本人再提示进入通话
					// 来自id
					let invite_user_id = data.data.msg.user_info.uid
					let invite_name = data.data.msg.user_info.name
					let my_id = _this.my_data.id
					if (invite_user_id != my_id && data.data.msg.content.invite) {
						// 判断是音频type==1还是视频通话type==2
						let media_type = data.data.msg.content.type == 1 ? _this.$t('new_message.1') : _this.$t(
							'new_message.2')
						uni.showModal({
							title: _this.$t('new_message.3'),
							content: `${_this.$t('new_message.3')}${invite_name}的${media_type}`,
							cancelText: _this.$t('new_message.5'),
							confirmText: _this.$t('new_message.6'),
							success: (res) => {
								if (res.confirm) {
									console.log("打印", res)
									// 清除计时器
									clearInterval(_this.vide_timer)
									_this.vide_time = 0
									// 计时器
									_this.vide_timer = setInterval(function() {
										_this.vide_time++
									}, 1000)

									if (_this.current_type == 1) {
										_this.isShow = false
									}
									if (_this.current_type == 2) {
										_this.isShow = true
									}
									_this.joinMedia(data.data.msg.content.room, data.data.msg.content
										.type)
								} else {
									// 拒绝
									let msg = {
										room: data.data.msg.content.room,
										refuse: true,
										confirm: false,
										invite: false,
										text: ""
									};
									_this.sendMsg(msg, 15);
								}
							}
						})
					}

				})

				/** 监听会话数据变化 */
				uni.$on("data_chat_data_unshift", function(data) {
					console.log("监听会话数据变化", data)
					data = _this.msgDataHandle(data);
					_this.scrollAnimation = false;
					let position_id = _this.msgList.list[0].msg.id;
					_this.msgList.list.unshift(...data);
					/** 滚动到指定位置 */
					_this.$nextTick(function() {
						//_this.scrollToView = "msg" + position_id;
					});
					//  图片列表
					// console.log("图片列表", _this.msgList);
				});
				/** 监听会话数据变化 */
				uni.$on("data_chat_data_push", function(data) {
					var _position = null;
					// console.log('-------------');
					console.log(_this.current_scrollHeight, _this.current_scrollTop);
					// console.log('-------------');
					const windowHeight = _this.scrollInfo.totall_height - _this.scrollInfo.input_box_height2 - _this.scrollInfo.input_box_height1;
					// console.log(windowHeight);
					// console.log('-------------');
					// 滑动屏幕内都自动滚到底部
					if((_this.current_scrollHeight - _this.current_scrollTop) < windowHeight * 2){
						_position = new Date().getTime();
					} else {
						_position = _this.current_scrollTop;
					}
					// console.log(_position);
					console.log("新增消息1", data);
					_this.setReadTime();
					/** 保持页面15条数据，提升性能 */
					_this.noMore = 0;
					data = _this.msgDataHandle(data);
					_this.scrollAnimation = true;
					if (data.length > 0) {
					    const lastElement = data[data.length - 1];
					    _this.msgList.list.push(lastElement);
					} 
					// _this.msgList.list = data;
					// 检查data数组是否非空  
					const item_ = [..._this.msgList.list].pop()
					// 处理阅后即焚
					// 阅后即焚,不是自己发出的消息
					if (item_.msg.content.yhjf && item_.msg.user_info.uid != _this.my_data.id) {
						let id = item_.msg.id + ''
						console.log("阅后即焚", id)
						setTimeout(() => {
							_this.autoYHJF(id)
						}, _this.disappear_delay_time * 1000)
					}
					if (item_.msg.type == 0 && item_.msg.user_info.uid == _this.my_data.id) {
						_this.sendMsgList.shift()
					}
					//  图片列表
					// console.log("图片列表", _this.msgList);
					_this.receive_list = _this.msgList.receive_list;

					/** 滚动到指定位置 */
					setTimeout(function() {
						_this.$nextTick(function() {
							// _this.scrollTop =(new Date()).getTime();
							_this.scrollTop = _position;
							let user = uni.getStorageSync('localLoginData');
							if(this.isGroup){
								if(user.myname == _this.msgList.list[_this.msgList.list.length - 1].msg.user_info.nickname){
									_this.scrollToView = 'msg' + _this.msgList.list[_this.msgList.list.length - 1].msg.id;
								}
							}else{
								_this.scrollToView = 'msg' + _this.msgList.list[_this.msgList.list.length - 1].msg.id;
							}
							
			
							 
						});
					}, 400);
				});
				/** 监听撤回消息 */
				uni.$on("data_chat_data_delete", function(list) {
					_this.msgList.list = list;
					//  图片列表
					// console.log("图片列表", _this.msgList);
				});
				// TODO 监听对话登陆状态变化
				uni.$on("data_online_status", function(data) {
					let msg = "";
					if (data.online == 1) {
						// msg = "(在线)";
						msg = `(${_this.$t('g_m.online')})`
					} else {
						// msg = "(离线)";
						// TODO
						let offline_time = _this.timestampFormat(data.last_login);
						console.log("offline_time", offline_time, data.last_login)
						msg = `(${_this.$t('g_m.offline')}${offline_time})`
					}
					uni.setNavigationBarTitle({
						// title: chat_data.show_name + (chat_data.type == 1 ? "" : msg),
						title: chatPreTitle + (chat_data.type == 1 ? "" : msg),
					});
				})
				/** 监听会话数据变化 */
				uni.$on("data_chat_data", function(data) {
					console.log("监听数据变化", data)
					data.list = _this.msgDataHandle(data.list);
					_this.scrollAnimation = false;
					_this.msgList = data;
					_this.receive_list = _this.msgList.receive_list;

					if (_this.msgList.type == 1) {
						_this.getGroupSteate();
					}
					/** 滚动到指定位置 */
					_this.$nextTick(function() {
						// _this.scrollTop =(new Date()).getTime();
						// _this.scrollToView = 'msg' + data.list[data.list.length - 1].msg.id;
						_this.scrollTop = new Date().getTime();
					});
				});
				/** 监听新的个人数据 */
				uni.$on("data_user_info", function(data) {
					_this.my_data = data;
					_this.my_photo = _data.staticPhoto() + _this.my_data.photo;
				});
				//监听键盘高度变化
				uni.onKeyboardHeightChange((res) => {
					_this.Keyboard = res.height;
					if (res.height) {
						// @好友软键盘高度变化
						this.popHeight = uni.getSystemInfoSync().windowHeight - res.height;
						_this.getScrollContentHeight("show", 0);
						 _this.scrollToView = null;
						/** 滚动到指定位置 */
						setTimeout(function() {
							_this.$nextTick(function() {
								 _this.scrollToView = 'msg' + _this.msgList.list[_this.msgList.list.length - 1].msg.id;
							});
						}, 400);
					} else {
						this.popHeight = uni.getSystemInfoSync().windowHeight;
						_this.getScrollContentHeight("hide", 0);
					}
					
					
				
					
				});
				
				
				uni.$on("update_text_msg", function(res) {
					_this.textMsg += res.msg;
					// @好友  如果消息不为空，
					_this.$refs.popup_friends.close();
					if (!_this.send_user_id) {
						_this.send_user_id = res.user_id;
					} else {
						_this.send_user_id = _this.send_user_id + "," + res.user_id;
					}
				});

				uni.$on("memberJoinRoom", function(res) {
					_this.$refs.serving.memberJoin(_this.list_id, function() {
						_this.onLine = true;
						_this.showServing = true;
					});
				});
				uni.$on("closeVoiceRoom", function(res) {
					_this.$refs.serving.closeVoiceRoom();
				});
				_get.getMemberPhotos({
						list_id: _this.list_id,
					},
					function(ret) {
						_this.memberPhotos = ret;
					}
				);
				// 监听清空消息
				uni.$on("chat_del", function(res) {
					uni.showModal({
						title: "提示",
						showCancel: false,
						content: "消息被清空",
						success: function(res) {},
					});
					_this.msgList = [];
				});
				// 监听消息清空
				uni.$on("group_delete_chat", function(list_id) {
					_this.msgList = [];
					_get.getChatData({
						send_data: {
							list_id: _this.list_id,
							time: 0,
							is_up: 1,
						},
						is_action_data: 1,
					});
				});
				// 监听踢出会员重新获取消息
				uni.$on("remove_member", function(list_id) {
					_this.msgList = [];
					_data.localData(list_id, null);
					_this.initData();
				});
				//收到信息 回传
				this.setReadTime();
			},
			// 选择收藏
			chooseLike() {
				this.hideDrawer(1); //隐藏抽屉
				uni.navigateTo({
					url: "/pages/my/store?choose_collect=1",
				});
			},
			// 下载文件
			downFile(file) {
				// #ifdef H5
				window.open(file, "_blank")
				// #endif
				// #ifdef APP-PLUS
				uni.downloadFile({
					url: file,
					success: (data) => {
						if (data.statusCode === 200) {
							uni.saveFile({
								tempFilePath: data.tempFilePath,
								success(res) {
									uni.showModal({
										title: "下载成功",
										content: "文件已保存:" + res.savedFilePath,
										success: (res_) => {},
									});
								},
							});
						}
					},
				});
				// #endif
			},
			// 打开地图
			openMap(pos) {
				uni.openLocation({
					latitude: pos.latitude,
					longitude: pos.longitude,
					name: pos.name,
					address: pos.address,
				});
			},
			uploadAFile(data) {
				let _this = this;
				for (let i = 0; i < data.length; i++) {
					let msg = {
						url: data[i].url,
						name: data[i].name,
						length: parseInt(data[i].sizeMB * 1024),
					};
					_this.sendMsg(msg, 11);
				}
			},
			// 上传文件
			chooseFile() {
				const _this = this;
				_this.hideDrawer(1); //隐藏抽屉
				// #ifdef H5
				uni.chooseFile({
					success: function(res) {
						for (let i = 0; i < res.tempFilePaths.length; i++) {
							let msg = {
								url: res.tempFilePaths[i],
								name: res.tempFiles[i].name,
								length: parseInt(res.tempFiles[i].size / 1024),
							};
							_this.sendMsg(msg, 11);
						}
					},
				});
				// #endif
				// #ifdef APP-PLUS
				this.showUploadFile = true;
				// #endif
			},
			// 戳一戳
			chooseChuo() {
				this.sendChuoYiChuoMsg();
			},
			// 发送位置
			sendPos() {
				let _this = this;
				uni.chooseLocation({
					success: function(res) {
						console.log("位置名称：" + res.name);
						console.log("详细地址：" + res.address);
						console.log("纬度：" + res.latitude);
						console.log("经度：" + res.longitude);
						let msg = {
							latitude: res.latitude,
							longitude: res.longitude,
							name: res.name,
							address: res.address,
						};
						_this.sendMsg(msg, 10);
					},
				});
			},

			getHtml(content) {
				const text = htmlParser(content)
				return text;
			},

			inputText(e) {
				//截取最后一位
				// console.log("文本信息", e)
				let str = e.detail.value;
				//  @好友
				if (str === "") {
					this.send_user_id = "";
				}
				let length1 = str.length;
				let key = str.substr(length1 - 1, 1);
				if (
					key &&
					key == "@" &&
					this.msgList.type == 1 &&
					length1 > this.textMsg.length
				) {
					this.textMsg = str;
					// 群成员弹窗
					// 关闭输入框
					uni.hideKeyboard();
					this.$refs.popup_friends.open();
					// uni.navigateTo({
					// 	url: '/pages/chat/group_list?list_id=' + this.list_id,
					// 	animationType: "slide-in-bottom"
					// });
					return true;
				}
				// 换行替换
				this.textMsg = str;
			},
			huanhang() {
				this.textMsg += '\n'
				this.$refs.textarea.focus()
			},
			getScrollContentHeight(type = "show", not_return = 1) {
				let _this = this;
				let query = uni.createSelectorQuery();
				query.select(".more-layer").boundingClientRect();
				query.select(".input-box").boundingClientRect();
				uni.getSystemInfo({
					success: function(res) {
						_this.scrollInfo.totall_height = res.windowHeight;
						query.exec((data) => {
							_this.scrollInfo.input_box_height1 = data[0].height || 0;
							_this.scrollInfo.input_box_height2 = data[1].height || 0;

							_this.autoHeight(type, not_return);
						});
					},
				});
			},
			autoHeight(type, not_return) {
				let _this = this;
				if (type == "show") {
					if (this.Keyboard) {
						this.scrollHeight =
							_this.scrollInfo.totall_height -
							_this.Keyboard -
							_this.scrollInfo.input_box_height2 - 30 +
							"px";
					} else {
						this.scrollHeight =
							_this.scrollInfo.totall_height -
							_this.scrollInfo.input_box_height1 -
							_this.scrollInfo.input_box_height2 - 30 +
							"px";
					}
				} else {
					//content高度 = 屏幕高度-tool高度
					uni.getSystemInfo({
						success: function(res) {
							res.windowHeight = res.windowHeight;
							if (_this.Keyboard) {
								_this.scrollHeight =
									res.windowHeight -
									_this.scrollInfo.Keyboard -
									_this.scrollInfo.input_box_height2 +
									"px";
							} else {
								_this.scrollHeight =
									res.windowHeight - _this.scrollInfo.input_box_height2 + "px";
							}
						},
					});
					// this.scrollHeight = '100%'
				}
				if (not_return == 0) {
					this.$nextTick(() => {
						_this.scrollTop = new Date().getTime();
					});
				}
			},
			getGroupSteate() {
				let _this = this;
				this.$httpSend({
					path: "/im/action/groupState",
					data: {
						list_id: _this.list_id,
					},
					success(res) {
						_this.msgList.is_msg = res.is_msg;
						_this.msgList.is_action = res.is_action;
						_this.msgList.is_niming = res.is_niming;
						_this.niming_msg = res.is_niming == 0 ? "匿名" : "退出匿名";
						_this.miaoqiang = res.miaoqiang;
						_this.vendor_status = res.vendor_status;
						_this.notice = res.notice;
						_this.is_main = res.is_main;
						_this.group_state = res;

						if (_this.miaoqiang && _this.is_main && res.qiang_time > 0) {
							_this.autoFaRed(res.qiang_time);
						}
						if (res.voice_room_state) {
							//有人发起语音则自动加入
							//加入视频
							_this.$refs.serving.memberJoin(_this.list_id, function() {
								_this.onLine = true;
							});
						}
						_this.is_niming = res.is_niming;
					},
				});
			},
			videoErrorCallback() {},
			autoVideo(msg) {
				this.showVedio = true;
				this.videoPath =
					_data.staticChat() + this.list_id + "/" + msg.content.url;
			},
			getCard(msg) {
				if (msg.content.user_id != undefined) {
					uni.navigateTo({
						url: "/pages/details/index?user_id=" + msg.content.user_id,
					});
				}
			},
			chooseCard() {
				uni.navigateTo({
					url: "./message/card_list?list_id=" + this.list_id,
				});
			},
			imageError(e) {
				// this.my_photo = _data.staticPhoto() + '/default_photo_path.png';

				let index = e.currentTarget.dataset.id;
				//替换index对应的图片

				this.msgList.list[index].msg.user_info.face = "/default_photo_path.png";
			},
			imageError2(e) {
				this.my_photo = _data.staticPhoto() + "/default_photo_path.png";
			},
			scrollToDom() {
				let that = this;
				let query = uni.createSelectorQuery();
				query.select("#msg" + that.chat_id).boundingClientRect();
				query.select("#scrollview").boundingClientRect();
				query.exec((res) => {
					that.style.mitemHeight = 0;

					let rect = res[0];
					that.style.mitemHeight = that.style.mitemHeight + rect.height + 40;
					if (that.style.mitemHeight > that.style.contentViewHeight - 100) {
						//判断子元素高度是否大于显示高度
						that.scrollTop =
							that.style.mitemHeight - that.style.contentViewHeight; //用子元素的高度减去显示的高度就获益获得序言滚动的高度
					}
				});
			},
			//
			//发起视频聊天
			videoBut(type) {
				console.log("发起通话->", type);
				let data = {};
				if (type == "voice") {
					data.callType = 1
				} else {
					data.callType = 2
				}

				let arr = [];
				this.memberPhotos.forEach(item => {
					arr.push(item.user_id.toString());
				})
				data.user_ids = arr;
				console.log("发起通话数据", data);
				this.sendCall(data);

				return;

				let content_type = 6;
				this.call_ret = false;
				if (type === "voice") {
					this.voiceLoading = true;
					content_type = 7;
				} else {
					this.videoLoading = true;
				}
				let _this = this;

				this.$httpSend({
					path: "/im/message/sendVideo",
					data: {
						list_id: this.list_id,
						content_type: content_type,
						_token: uni.getStorageSync("token"),
					},
					success_action: true,
					success(res) {
						if (res.err === 0) {
							console.log("通话数据", res);
							//图片转化
							res.data.myavatar = _this.staticPhoto + res.data.myavatar;
							res.data.avatar = _this.staticPhoto + res.data.avatar;
							_this.getVideo(res.data);
						} else {}
					},
				});
			},
			// 发起腾讯通话
			sendCall(data) {
				let my_id = this.my_data.id;
				let user_id = '';
				data.user_ids.forEach(item => {
					if (item != my_id) {
						user_id = item;
					}
				})
				console.log("开始打电话", data);
				uni.showToast({
					title: 'loading...',
					icon: 'none',
				})
				uni.$TUICallKit.call({
						callMediaType: data.callType, // 语音通话(callMediaType = 1)、视频通话(callMediaType = 2)
						userID: Number(user_id).toString(),
					},
					(res) => {
						uni.showToast({
							title: JSON.stringify(res),
							icon: 'none',
						})
						if (res.code === 0) {
							console.log('通话success');

						} else {
							uni.showToast({
								title: this.$t('err.2'),
								icon: 'none',
							})
							console.log(`通话failed, error message = ${res.msg}`);
						}
					},
					(err) => {
						uni.showToast({
							title: JSON.stringify(err),
							icon: 'none',
						})
					}
				);
			},

			//调用视频/音频
			getVideo(data) {
				this.sendCall(data);
				return;
				data.usersig = genTestUserSig(data.userid).userSig;
				console.log("调用传参", data);
				console.log("_this.call", _this.call);
				console.log("调用腾讯云data", data);
				let _this = this;
				_this.call.groupCall({
						type: data.callType == "voice" ? 1 : 2,
						groupID: "",
						userIDList: data.user_ids,
					},
					(ret) => {
						this.doubleClick = false;
						console.log(data);
						console.log(ret);
						console.log("9909090909090");
						if (ret) {
							_this.videPoup = false;
							_this.voiceLoading = false;
							if (ret.code == 5 && !_this.payTimer) {
								console.log("发起付费");
								//先扣一次
								_get.payVideoAamount({
										list_id: _this.list_id,
									},
									function(res) {
										console.log(res);
									},
									function(res) {
										console.log(res);
									}
								);
								_this.payTimer = setInterval(function() {
									_get.payVideoAamount({
											list_id: _this.list_id,
										},
										function(res) {
											console.log(res);
										},
										function(res) {
											console.log(res);
											clearInterval(_this.payTimer); //取消收费
											_this.payTimer = false;
										}
									);
								}, 60000);
							}
							if (ret.code == 1 && ret.time != undefined) {
								//对方或者自己取消
								data.time = ret.time;
								data.ret_code = ret.code;
								console.log(JSON.stringify(data));
								_get.cancelCall(data, function(res) {});
							}
						}
					}
				);
			},
			// 发起视频通话
			videoCall(type) {
				let _this = this;
				_this.callType = type;
				//
				console.log("确认开始->")
				_this.confirm();
				// this.videPoup = true
				// this.hideDrawer();
			},
			confirm() {
				// if (this.doubleClick) return false;
				// this.doubleClick = true;
				if (this.callType == 1) {
					this.videoBut("video");
				} else {
					this.videoBut("voice");
				}
				this.$refs.popup.close();
			},
			msgDataHandle(data, type) {
				for (let i = 0, j = data.length, msg_img; i < j; i++) {
					if (data[i].type == 0 && data[i].msg.type == 2) {
						msg_img =
							this.staticPath +
							this.list_id +
							"/" +
							data[i].msg.content.url.replace("_thumb", "");
						if (type) {
							this.msgImgList.unshift(msg_img);
						} else {
							this.msgImgList.push(msg_img);
						}
						data[i].msg.content = this.setPicSize(data[i].msg.content);
					} else if (data[i].type == 0 && data[i].msg.type == 0) {
						data[i].msg.content.text = this.replaceEmoji(
							data[i].msg.content.text
						);
					}
				}
				// console.log("this.msgImgList",this.msgImgList);
				return data;
			},
			// 所有图片列表
			addMsgImgList(data) {
				this.msgImgList = [];
				for (let i = 0, j = data.length, msg_img; i < j; i++) {
					if (data[i].type == 0 && data[i].msg.type == 2) {
						this.msgImgList.push(
							this.staticPath +
							this.list_id +
							"/" +
							data[i].msg.content.url.replace("_thumb", "")
						);
					}
				}
			},
			timestampFormat(time) {
				return _action.timestampFormat(time);
			},
			msgAction(id, user_id, content, type, name, origin) {
				let _this = this;
				_this.current_scrollTop_ = _this.current_scrollTop

				setTimeout(() => {
					if (_this.current_scrollTop_ != _this.current_scrollTop) {
						return
					} else {
						// 添加到表情包,如果是图片，或者图片类型，显示添加表情包
						let action = [this.$t('chat.message.chehui'), this.$t('chat.message.shoucang'), this.$t(
							'chat.message.zhuanfa'), this.$t('chat.message.fuzhi'), this.$t(
							'chat.message.yinyong'), this.$t('chat.message.zhuanfa') + this.$t(
							'friend.index.group_chat')];
						if (type == 2 || (type == 0 && this.isImage(content.text))) {
							action.push(this.$t('chat.message.biaoqing'))
						}
						_this.members_.forEach(item => {
							if (item.is_admin > 0 && item.user_id == _this.my_data.id) {
								action.push(this.$t('chat.message.chehui_all'))
							}
						})
						
						uni.showActionSheet({
							itemList: action,
							success: function(res) {
								console.log(res)
								switch (res.tapIndex) {
									case 0:
										_this.$httpSend({
											path: "/im/message/withdraw",
											data: {
												list_id: _this.list_id,
												type: _this.msgList.type,
												msg_id: id,
											},
											success_action: true,
											success(res) {
												if (res.err == 0) {
													uni.showToast();
												} else {
													uni.showToast({
														icon: 'none',
														title: res.msg
													})
												}
											},
											fail_callback(err) {
												uni.showToast({
													icon: 'none',
													title: _this.$t('err.2')
												})
											}
										});
										break;
									case 1:
										console.log("收藏");
										console.log("收藏文件", {
											list_id: _this.list_id,
											type: _this.msgList.type,
											msg_id: id,
										});
										_this.$httpSend({
											path: "/im/vendor/saveStore",
											data: {
												list_id: _this.list_id,
												type: _this.msgList.type,
												msg_id: id,
											},
											success_action: true,
											success(res) {
												uni.showToast();
											},
										});
										break;
									case 2:
										console.log("转发");
										let datas = {
											list_id: _this.list_id,
											type: _this.msgList.type,
											msg_id: id,
										};
										uni.setStorageSync("data_msg", JSON.stringify(datas));
										uni.navigateTo({
											url: "../push/sendallsome?type=" +
												type +
												"&content=" +
												JSON.stringify(content),
										});
										break;
										//收藏
									case 3:
										console.log("复制", content);
										if (type == 0) {
											let reg = /<\/?.+?\/?>/g;
											let str = content.text;
											str = str.replace(reg, "");
											uni.setClipboardData({
												data: str,
												success: function() {
													uni.showToast({
														icon: "none",
														title: "OK",
													});
												},
												fail: function() {
													uni.showToast({
														icon: "none",
														title: "Fail",
													});
												},
											});
										} else {
											uni.showToast({
												icon: "none",
												title: "Fail",
											});
										}

										break;
									case 4:
										
										// 显示引用，引用内容
										// type=0文字，type=2图片， type其他
										// content type name
										let msg_content = ""

										if (type == 0) {
											msg_content = content.text
											_this.yy_content = {
												text: msg_content,
												type: type,
												yy_username: name,
											}
											console.log("_this.yy_contents", _this.yy_content)
											
										} else if (type == 2) {
											msg_content = {
												...content,
												text: " ",
												type: type,
												yy_username: name,
											}
											console.log("msg_content", msg_content)
											
											_this.yy_content = {
												...msg_content
											}
										} else {
											_this.yy_content = {
												text: "[其他]",
												type: type,
												yy_username: name,
											}
										}
										// 引用原数据
										_this.yy_content.origin = origin
										_this.yy_type = type
										console.log("引用类型", _this.yy_content)
										return false
										break;
									case 5:
										console.log("转发");
										let datas1 = {
											list_id: _this.list_id,
											type: _this.msgList.type,
											msg_id: id,
										};
										uni.setStorageSync("data_msg", JSON.stringify(datas1));
										uni.navigateTo({
											url: "../push/sendallgroup?type=" +
												type +
												"&content=" +
												JSON.stringify(content),
										});
										break;
									case 6:
										// 0文字类型图片
										//图片类型2 staticPath + list_id + '/' + row.msg.content.url
										// 添加自定义表情
										if (type == 2 || (type == 0 && _this.isImage(content.text))) {
											let url_ = ''
											if (type == 2) {
												url_ = _this.staticPath + _this.list_id + '/' + content.url
											}
											if (type == 0) {
												url_ = content.text
											}
											uni.showModal({
												title: '提示',
												content: '确认添加到表情包么？',
												success: (res) => {
													if (res.confirm) {
														_this.addCustomEmo(url_)
													}
												}
											})
										} else {
											_this.$httpSend({
												path: "/im/message/withdraw",
												data: {
													list_id: _this.list_id,
													type: _this.msgList.type,
													msg_id: id,
													clear_more: 1
												},
												success_action: true,
												success(res) {
													if (res.err == 0) {
														uni.showToast();
													} else {
														uni.showToast({
															icon: 'none',
															title: res.msg
														})
													}
												},
												fail_callback(err) {
													uni.showToast({
														icon: 'none',
														title: _this.$t('err.2')
													})
												}
											});
										}
										break;
									case 7:
										_this.$httpSend({
											path: "/im/message/withdraw",
											data: {
												list_id: _this.list_id,
												type: _this.msgList.type,
												msg_id: id,
												clear_more: 1
											},
											success_action: true,
											success(res) {
												if (res.err == 0) {
													uni.showToast();
												} else {
													uni.showToast({
														icon: 'none',
														title: res.msg
													})
												}
											},
											fail_callback(err) {
												uni.showToast({
													icon: 'none',
													title: _this.$t('err.2')
												})
											}
										});
										break;
									default:
										break;
								}
							},
							fail: function(res) {
								//console.log(res.errMsg);
							},
						});
					}
				}, 300)
			},
			copyToClipboard(str) {
				const el = document.createElement("textarea");
				el.value = str;
				el.setAttribute("readonly", "");
				el.style.position = "absolute";
				el.style.left = "-9999px";
				document.body.appendChild(el);
				const selected =
					document.getSelection().rangeCount > 0 ?
					document.getSelection().getRangeAt(0) :
					false;
				el.select();
				document.execCommand("copy");
				document.body.removeChild(el);
				if (selected) {
					document.getSelection().removeAllRanges();
					document.getSelection().addRange(selected);
				}
			},
			// 阅后即焚
			autoYHJF(id) {
				const _this = this;
				_this.$httpSend({
					path: "/im/message/burnRead",
					data: {
						list_id: _this.list_id,
						type: _this.msgList.type,
						msg_id: id,
					},
					success_action: true,
					success(res) {
						uni.showToast();
					},
				});
			},
			goDetails(row, user_id) {
				uni.navigateTo({
					url: "../details/index?user_id=" + user_id,
				});
				return
				if (this.msgList.type == 0) {
					uni.navigateTo({
						url: "../details/index?user_id=" + user_id,
					});
					return
				}
				/** 如果是群聊，没有权限的话，查看不了其他会员信息 */
				if (this.msgList.is_action == 0 || row.msg.is_niming == 1) {
					uni.showToast({
						title: this.$t('chat.message.more.quan_xian'),
						icon: "none",
						duration: 1000,
					});
					return;
				}
				uni.navigateTo({
					url: "../details/index?user_id=" + user_id,
				});
			},

			// 接受消息(筛选处理)
			screenMsg(msg) {
				//从长连接处转发给这个方法，进行筛选处理
				if (msg.type == 2) {
					//已读信息
					this.nowReadTime = msg.msg.time;
				} else if (msg.type == 1) {
					// 系统消息
					switch (msg.msg.type) {
						case 0:
							this.addSystemTextMsg(msg);
							break;
						case 5:
							this.addSystemRedEnvelopeMsg(msg);
							break;
					}
				} else if (msg.type == 0) {
					// 用户消息
					switch (msg.msg.type) {
						case 0:
							this.addTextMsg(msg);
							break;
						case 1:
							this.addVoiceMsg(msg);
							break;
						case 2:
							this.addImgMsg(msg);
							break;
						case 5:
							this.addRedEnvelopeMsg(msg);
							break;
					}
					//console.log('用户消息');
					//非自己的消息震动
					if (msg.msg.user_info.uid != this.my_data.id) {
						//console.log('振动');
						uni.vibrateLong();
					}
					//收到信息 回传
					this.setReadTime();
				}
				let _this = this;
				this.$nextTick(function() {
					// 滚动到底
					_this.scrollTop = new Date().getTime();
				});
			},
			getReadTime() {
				var _this = this;
				this.$httpSend({
					path: "/im/message/getListTime",
					data: {
						list_id: this.list_id,
					},
					success_action: true,
					success(res) {
						_this.nowReadTime = res.read_time;
					},
				});
			},
			setReadTime() {
				this.$httpSend({
					path: "/im/message/setListTime",
					data: {
						list_id: this.list_id,
					},
					success_action: true,
					success(res) {
						// console.log(res)
					},
				});
			},

			//触发滑动到顶部(加载历史信息记录)
			loadHistory() {
				if (this.isHistoryLoading || this.noMore) {
					return;
				}
				let _this = this;
				this.isHistoryLoading = true; //参数作为进入请求标识，防止重复请求

				_get.getChatData({
					send_data: {
						list_id: _this.list_id,
						time: _this.msgList.list[0].msg.time,
						is_up: 0,
					},
					callback(data) {
						if (data.list.length < 15) {
							_this.noMore = 1;
						}
						_this.isHistoryLoading = false;
					},
					is_action_data: 0,
				});
			},

			//处理图片尺寸，如果不处理宽高，新进入页面加载图片时候会闪
			setPicSize(content) {
				// 让图片最长边等于设置的最大长度，短边等比例缩小，图片控件真实改变，区别于aspectFit方式。
				let maxW = uni.upx2px(350); //350是定义消息图片最大宽度
				let maxH = uni.upx2px(350); //350是定义消息图片最大高度
				if (content.w > maxW || content.h > maxH) {
					let scale = content.w / content.h;
					content.w = scale > 1 ? maxW : maxH * scale;
					content.h = scale > 1 ? maxW / scale : maxH;
					let url_array = content.url.split(".");
					if (content.url.indexOf("_thumb.") == -1) {
						content.url = url_array[0] + "_thumb." + url_array[1];
					}
				}
				return content;
			},
			//更多功能(点击+弹出)
			showMore() {
				this.isVoice = false;
				this.hideEmoji = true;
				if (this.hideMore) {
					this.hideMore = false;
					this.openDrawer();
				} else {
					this.hideDrawer();
				}
			},
			// 打开抽屉
			openDrawer() {
				let _this = this;
				this.popupLayerClass = "showLayer";
				this.hideMore = false;
				setTimeout(function() {
					console.log("scorll...");
					_this.getScrollContentHeight("show", 0);
				}, 150);
			},
			// 隐藏抽屉
			hideDrawer(not_return = 0, type = "hide") {
				//判断时间
				if (not_return == 3) {
					let time = new Date().getTime();
					if (this.doubleTime.flag) {
						this.doubleTime.firstTime = time;
						this.doubleTime.flag = false;
					} else {
						this.doubleTime.towTime = time;
						this.doubleTime.flag = true;
					}
					let timeBucket = this.doubleTime.towTime - this.doubleTime.firstTime;
					console.log("timeBucket:", timeBucket);
					if (timeBucket < 200 && this.doubleTime.flag) {
						//第二次进来
						clearTimeout(this.timer);
						this.doubleTime.towTime = "";
						this.doubleTime.firstTime = "";
						// this.sendChuoYiChuoMsg();
						// this.textMsg = '[戳一戳]'
						// this.sendMsg(this.textMsg, 0);
						// this.textMsg = ''
						// //发送戳一戳
						return false;
					}
					let _this = this;
					this.timer = setTimeout(function() {
						_this.toHideDrawer(not_return, type);
					}, 280);
				} else {
					this.toHideDrawer(not_return, type);
				}
			},
			sendChuoYiChuoMsg() {
				_get.sendChuoYiChuoMsg({
						list_id: this.list_id,
					},
					function() {}
				);
			},
			toHideDrawer(not_return = 0, type = "hide") {
				this.popupLayerClass = "";
				setTimeout(() => {
					this.hideMore = true;
					this.hideEmoji = true;
					this.getScrollContentHeight(type, not_return);
				}, 150);
			},
			// 选择图片发送
			chooseImage() {
				this.getImage("album");
			},
			//拍照发送
			camera() {
				this.getImage("camera");
			},
			// 关闭音视频通话
			async closeMedia(data) {
				// 如果data == 1,主动挂断，谁主动挂断显示谁
				if (this.localStream && this.localStream.close) {
					clearInterval(this.vide_timer)

					if (data == 1) {
						let msg = {
							room: this.current_room,
							refuse: false,
							confirm: false,
							invite: false,
							leave: true, //挂断
							longTime: this.sToHms(this.vide_time), //通话时间
							text: ""
						};
						this.sendMsg(msg, 15);
					}
					this.localStream.close()
					await this.client.leave();
					this.client.destroy();
					this.client = null
					this.localStream = null
				}
				this.$refs.media.close()
			},
			//加入音视频通话
			async joinMedia(roomId, type) {
				this.current_room = roomId
				const _this = this
				// 我的
				let my_id = this.my_data.id.toString();
				if (type == 1) {
					this.video_status = true
					this.audio_status = true
				}
				if (type == 2) {
					this.video_status = false
					this.audio_status = true
				}
				this.logoPic = this.staticPhoto + this.other_avatar
				this.username = this.show_name
				// 客户端
				// client = TRTC.createClient({ mode: 'rtc', sdkAppId, userId, userSig });
				console.log("my_id", my_id)
				this.$refs.media.open()
				this.client = TRTC.createClient({
					mode: 'rtc',
					sdkAppId: genTestUserSig(my_id).sdkAppID,
					userId: my_id,
					userSig: genTestUserSig(my_id).userSig
				});
				// 1.监听事件
				this.client.on('stream-added', event => {
					const remoteStream = event.stream;
					console.log('远端流增加: ' + remoteStream.getId());
					//订阅远端流
					this.client.subscribe(remoteStream);
				});
				this.client.on('stream-subscribed', event => {
					console.log('远端流订阅成功: ' + event);
					// 远端流订阅成功
					const remoteStream = event.stream;
					// 播放远端流，传入的元素 ID 必须是页面里存在的 div 元素
					remoteStream.play('remoteStreamContainer');
				});
				this.client.on('stream-removed', evt => {
					const remoteStream = evt.stream;
					this.$refs.media.close()
				});
				// 监听关闭远端视频流
				this.client.on('mute-video', evt => {
					_this.isShow = true
					const remoteStream = evt.stream;
				})
				// 监听开启远端视频流
				this.client.on('unmute-video', evt => {
					_this.isShow = false
					const remoteStream = evt.stream;
				})
				// 2.进房成功后开始推流
				try {
					await this.client.join({
						roomId: Number(roomId)
					});
					this.localStream = TRTC.createStream({
						userId: my_id,
						audio: true,
						video: type == 1 ? true : false, //判断音视频通话
					});
					await this.localStream.initialize();
					// 播放本地流
					this.localStream.play('localStreamContainer');
					await this.client.publish(this.localStream);
				} catch (error) {
					console.error(error);
				}
				let msg = {
					refuse: false,
					confirm: true,
					invite: false,
					type: type,
					text: "",
				};
				this.sendMsg(msg, 15);
			},
			// 发送音视频邀请
			async sendMediaInvite(type) {
				this.current_type = type
				const _this = this
				// type=1视频 type=2音频
				if (type == 1) {
					this.video_status = true
					this.audio_status = true
				}
				if (type == 2) {
					this.video_status = false
					this.audio_status = true
				}
				_this.vide_time = 0
				// 我的
				let my_id = this.my_data.id.toString();
				// 客户端
				// client = TRTC.createClient({ mode: 'rtc', sdkAppId, userId, userSig });
				console.log("my_id", my_id)
				this.$refs.media.open()
				this.client = TRTC.createClient({
					mode: 'rtc',
					sdkAppId: genTestUserSig(my_id).sdkAppID,
					userId: my_id,
					userSig: genTestUserSig(my_id).userSig
				});
				this.logoPic = this.staticPhoto + this.other_avatar
				this.username = this.show_name
				// 1.监听事件
				this.client.on('stream-added', event => {
					const remoteStream = event.stream;
					console.log('远端流增加: ' + remoteStream.getId());
					//订阅远端流
					this.client.subscribe(remoteStream);
				});
				this.client.on('stream-subscribed', event => {
					console.log('远端流订阅成功: ' + event);
					// 远端流订阅成功
					const remoteStream = event.stream;

					if (_this.current_type == 1) {
						_this.isShow = false //头像和用户名关闭
					}
					if (_this.current_type == 2) {
						_this.isShow = true //头像和用户名关闭
					}

					// 计时器开始
					_this.vide_time = 0
					_this.vide_timer = setInterval(function() {
						_this.vide_time++
					}, 1000)

					// 播放远端流，传入的元素 ID 必须是页面里存在的 div 元素
					remoteStream.play('remoteStreamContainer');
				});
				this.client.on('stream-removed', evt => {
					const remoteStream = evt.stream;
					this.closeMedia()
				});
				// 监听关闭远端视频流
				this.client.on('mute-video', evt => {
					_this.isShow = true
					const remoteStream = evt.stream;
				})
				// 监听开启远端视频流
				this.client.on('unmute-video', evt => {
					_this.isShow = false
					const remoteStream = evt.stream;
				})

				// 2.进房成功后开始推流
				try {
					await this.client.join({
						roomId: Number(my_id)
					});
					this.localStream = TRTC.createStream({
						userId: my_id,
						audio: true,
						video: type == 1 ? true : false, //根据type显示音视频
					});
					await this.localStream.initialize();
					// 播放本地流
					this.localStream.play('localStreamContainer');
					await this.client.publish(this.localStream);
				} catch (error) {
					console.error(error);
				}

				let msg = {
					room: my_id,
					refuse: false,
					confirm: false,
					invite: true,
					type: type,
					text: "",
				};
				this.sendMsg(msg, 15);
			},
			//拍摄视频发送
			video() {
				uni.chooseVideo({
					success: (res) => {
						let min = parseInt(res.size / 60),
							sec = res.size % 60;
						min = min < 10 ? "0" + min : min;
						sec = sec < 10 ? "0" + sec : sec;
						let msg = {
							url: res.tempFilePath,
							length: min + ":" + sec,
						};
						this.sendMsg(msg, 3);
					},
				});
			},
			//发红包
			handRedEnvelopes() {
				// this.hideDrawer(1);
				console.log(111);
				let url =
					"message/hand?list_id=" +
					this.list_id +
					"&msg_type=" +
					this.msgList.type;
				if (this.vendor_status)
					url =
					"message/hand_pin?list_id=" +
					this.list_id +
					"&msg_type=" +
					this.msgList.type;
				uni.navigateTo({
					url: url,
				});
			},
			//转账
			transfers() {
				//跳转到转账页面
			},

			//选照片 or 拍照
			getImage(type) {
				this.hideDrawer(1);
				uni.chooseImage({
					sourceType: [type],
					sizeType: ["original", "compressed"], //可以指定是原图还是压缩图，默认二者都有
					success: (res) => {
						for (let i = 0; i < res.tempFilePaths.length; i++) {
							uni.getImageInfo({
								src: res.tempFilePaths[i],
								success: (image) => {
									//console.log(image.width);
									//console.log(image.height);
									let msg = {
										url: res.tempFilePaths[i],
										w: image.width,
										h: image.height,
									};
									this.sendMsg(msg, 2);
								},
							});
						}
					},
				});
			},
			// 选择表情
			chooseEmoji() {
				this.hideMore = true;
				if (this.hideEmoji) {
					this.hideEmoji = false;
					this.openDrawer();
				} else {
					this.hideDrawer();
				}
			},
			//添加表情
			addEmoji(em) {
				this.textMsg += em.alt;
			},
			isSafari() {
				const u = navigator.userAgent
				if (u.indexOf('iPhone') > -1) {
					return true
				} else {
					return false
				}
			},
			// IOS
			blurFocus() {
				// #ifdef H5
				if (this.isSafari()) {
					this.ios_content = false
					// window.scrollTo(0,0)
				}
				// #endif
			},
			//获取焦点，如果不是选表情ing,则关闭抽屉
			textareaFocus() {
				let _this = this;
				_this.hideDrawer(0, "show");
				// 如果是IOS
				// #ifdef H5
				if (_this.isSafari()) {
					setTimeout(() => {
						_this.jp_height = _this.innerHeight - window.innerHeight

						_this.ios_content = true

					}, 200)
				}
				// #endif
				return;
				if (_this.popupLayerClass == "showLayer" && this.hideMore == false) {
					_this.hideDrawer();
				}
			},
			// 发送自定义表情包
			toSendEmo(item) {
				this.hideDrawer(1);
				this.textMsg = this.globalData.http_url + item.full_url
				this.sendMsg("", 0);
				//清空输入框
			},
			// 发送文字消息
			sendText() {
				//this.hideDrawer(1); //隐藏抽屉
				// 先隐藏
				this.focus_show = false
				this.$nextTick(() => {
					this.focus_show = true
					this.focusing = true
					this.scrollToView = "msg" + this.chat_id;
				})
				if (!this.textMsg) {
					return;
				}
				// 替换换行符
				// let str = this.textMsg
				// str = str.replace(/\n/g,"<br/>")
				// str = str.replace(/\r\n/g,"<br/>")
				// this.textMsg = str
				this.sendMsg("", 0);
				//清空输入框
				this.textMsg = "";
			},

			//替换表情符号为图片
			replaceEmoji(str) {
				str = str ? str : "";
				let replacedStr = str.replace(/\[([^(\]|\[)]*)\]/g, (item, index) => {
					// console.log("item: " + item);
					for (let i = 0; i < this.emojiList.length; i++) {
						let row = this.emojiList[i];
						for (let j = 0; j < row.length; j++) {
							let EM = row[j];
							if (EM.alt == item) {
								//在线表情路径，图文混排必须使用网络路径，请上传一份表情到你的服务器后再替换此路径
								//比如你上传服务器后，你的100.gif路径为https://www.xxx.com/emoji/100.gif 则替换onlinePath填写为https://www.xxx.com/emoji/
								let imgstr =
									'<img style="width:22px;height:22px;" src="' +
									_data.data("static_url") +
									"/static/emoji/" +
									EM.url +
									'">';
								// console.log("imgstr: " + imgstr);
								return imgstr;
							}

						}
					}
				});
				// display: flex;
				// return '<div style="align-items: center;word-break:break-all;">' + replacedStr + '</div>';
				return replacedStr;
			},
			showQiang() {
				this.$refs.qiang.open();
			},
			autoFaRed(num) {
				let _this = this;
				let time = num * 1000;
				if (time <= 0) return false;
				if (_this.timer) clearInterval(_this.redTimer);
				_this.redTimer = setInterval(function() {
					_get.autoBigRed({
							list_id: _this.list_id,
						},
						function() {}
					);
				}, num * 1000);
			},
			goQiang(e) {
				let _this = this;
				e.list_id = _this.list_id;
				_get.updateMiaoqiang(e, function(res) {
					_this.miaoqiang = e.status;
					console.log(e);
					if (e.status == 1) {
						console.log("发包.......");
						_this.autoFaRed(e.num);
					} else {
						clearInterval(_this.redTimer);
					}
					setTimeout(function() {
						uni.showToast({
							title: "操作成功",
							duration: 2000,
						});
						_this.$refs.qiang.close();
					}, 500);
				});
			},
			// 发送消息
			sendMsg(content, type) {
				// uni.showLoading();
				let _this = this,
					sendMsg = content;
				((callback) => {
					switch (type) {
						/** 文字/表情消息 */
						case 0:
							let msg = this.textMsg.replace(/</g, "&lt;");
							sendMsg = {
								text: msg,
							};

							if (_this.yy_content.text) {
								sendMsg.yy = _this.yy_content
							}
							
							if(_this.yy_content.type == 2 && _this.yy_content.origin && _this.yy_content.full_url){
								sendMsg.yy = _this.yy_content
							}
							
							// 引用源数据
							if (_this.yy_content.origin) {
								sendMsg.origin = _this.yy_content.origin
							}
							//  @好友
							if (_this.send_user_id) {
								sendMsg.user_id = _this.send_user_id;
							}
							
							_this.sendMsgList.push({'text':msg});
							callback();
							break;
							/** 语音/图片/视频/文件 */
						case 1:
						case 2:
						case 3:
						case 4:
							uni.showLoading();
							_this.$httpSendFile({
								type: 0,
								local_url: sendMsg.url,
								data: {
									list_id: _this.list_id,
									type: type,
								},
								success(data) {
									console.log("数据", data);

									uni.hideLoading();
									sendMsg.url = data.save_name;
									sendMsg.full_url = data.full_url;
									sendMsg.full_movie = data.full_movie;
									if ("save_gif_path" in data)
										sendMsg.save_pic_path = data.save_gif_path;
									console.log("success");
									callback();

								},
							});
							break;
							/** 红包消息 */
						case 5:
							// 邀请音视频
							callback();
							break;

						case 10:
							// 地图
							sendMsg = content;
							callback();
							break;
						case 11:
							// 文件
							uni.showLoading();
							_this.$httpSendFile({
								type: 0,
								local_url: sendMsg.url,
								data: {
									list_id: _this.list_id,
								},
								success(data) {
									console.log("数据");

									uni.hideLoading();
									sendMsg.url = data.save_name;
									sendMsg.full_url = data.full_url;
									sendMsg.full_movie = data.full_movie;
									if ("save_gif_path" in data)
										sendMsg.save_pic_path = data.save_gif_path;
									console.log("success");
									callback();
								},
							});
							break;
						case 15:
							// 音视频
							sendMsg = content;
							callback();
							break;
						default:
							break;
					}
				})(() => {
					// @好友 发送后清空user_id
					_this.send_user_id = "";
					// 是否开启阅后即焚并且后台开启阅后即焚
					if (_data.localData(_this.list_id + '_yhjf') && _this.disappear_after_read == '1') {
						sendMsg.yhjf = true; //阅后即焚秒数
					}
					sendMsg.origin = _this.yy_content.origin
					let send_content = JSON.stringify(sendMsg)
					console.log("发送消息", send_content)
					//  清空引用
					_this.yy_content = {}
					_this.yy_type = ""
					_this.$httpSend({
						path: "/im/message/textMsg",
						data: {
							list_id: _this.list_id,
							content_type: type,
							content: send_content,
						},
						success_action: true,
						success(res) {
							// uni.hideLoading();
							switch (res.err) {
								case 0:
									if (type == 1) {
										_action.playVoice("/static/voice/voice.mp3");
									}
									break;
								case 1:
									uni.showModal({
										title: "好友提示",
										confirmText: "发送好友申请",
										content: res.msg,
										success: function(res) {
											if (res.confirm) {
												uni.navigateTo({
													url: "../friend/apply?user_id=" +
														_data
														.localData(
															_this
															.list_id
														)
														.obj_id +
														"&is_type=0",
												});
											}
										},
									});
									break;
								case 2:
									uni.showModal({
										content: res.msg,
									});
									let data = _data.localData(data.list_id);
									data.is_msg = 1;
									_this.msgList.is_msg = 1;
									_data.localData(data.list_id, data);
									break;
								default:
									break;
							}
						},
					});
				});
			},

			// 添加文字消息到列表
			addTextMsg(msg) {
				this.msgList.list.push(msg);
			},
			// 添加语音消息到列表
			addVoiceMsg(msg) {
				this.msgList.list.push(msg);
			},
			addImgMsg(msg) {
				this.msgImgList.push(
					this.staticPath +
					this.list_id +
					"/" +
					msg.content.url.replace("_thumb", "")
				);
				msg.msg.content = this.setPicSize(msg.msg.content);
				this.msgList.list.push(msg);
				console.log("this.msgImgList", this.msgImgList);
				console.log("this.msgList", this.msgList);
			},
			addRedEnvelopeMsg(msg) {
				this.msgList.push(msg);
			},
			// 添加系统文字消息到列表
			addSystemTextMsg(msg) {
				console.log("系统消息", msg)
				this.msgList.list.push(msg);
			},
			// 添加系统红包消息到列表
			addSystemRedEnvelopeMsg(msg) {
				this.msgList.list.push(msg);
			},
			openRed(params) {
				let _this = this;
				_this.luckbtn = "luckbtn";
				uni.showLoading({
					title: "loading...",
				});
				// 判断是哪种红包
				if (this.vendor_status == 1) {
					_get.getLeiHongBao(
						params,
						function(ret) {
							_this.receive_list.push(params.rid);
							_this.msgList.receive_list = _this.receive_list;
							_data.localData(_this.list_id, _this.msgList);
							console.log(ret);
							uni.$emit("data_user_info", ret);
							_data.data("user_info", ret);
							setTimeout(function() {
								_this.luckbtn = "";
								_this.closeRedEnvelope();
								_this.toDetails(params.rid);
							}, 1000);
						},
						function(ret) {
							setTimeout(function() {
								_this.luckbtn = "";
								_this.closeRedEnvelope();
								_this.toDetails(params.rid);
							}, 1000);
						}
					);
				} else {
					_get.getHongBao(
						params,
						function(ret) {
							_this.receive_list.push(params.rid);
							_this.msgList.receive_list = _this.receive_list;
							_data.localData(_this.list_id, _this.msgList);
							console.log(ret);
							uni.$emit("data_user_info", ret);
							_data.data("user_info", ret);
							setTimeout(function() {
								_this.luckbtn = "";
								_this.closeRedEnvelope();
								_this.toDetails(params.rid);
							}, 1000);
						},
						function(ret) {
							setTimeout(function() {
								_this.luckbtn = "";
								_this.closeRedEnvelope();
								_this.toDetails(params.rid);
							}, 1000);
						}
					);
				}

				uni.hideLoading();
			},
			// 打开红包
			openRedEnvelope(msg, index) {
				if (this.receive_list.indexOf(msg.content.rid) >= 0) {
					this.toDetails(msg.content.rid);
					return true;
				}
				this.windowsState = "show";
				if(msg.is_niming == 1){
					msg.content.from = this.$t('chat.message.anonymous');
					msg.content.face_new = './static/theme/default/my/niming.png';
				}else{
					msg.content.face_new = _data.staticPhoto() + msg.content.face;
				}
				this.redenvelopeData = msg.content;
				this.redenvelopeData.index = index;
				return true;
			},
			// 关闭红包弹窗
			closeRedEnvelope() {
				this.windowsState = "hide";
				setTimeout(() => {
					this.windowsState = "";
				}, 200);
			},
			sendSystemMsg(content, type) {
				let lastid = this.msgList.list[this.msgList.list.length - 1].msg.id;
				lastid++;
				let row = {
					type: "system",
					msg: {
						id: lastid,
						type: type,
						content: content,
					},
				};
				this.screenMsg(row);
			},
			//领取详情
			toDetails(rid) {
				uni.navigateTo({
					url: "message/details?rid=" + rid + "&list_id=" + this.list_id,
				});
			},
			// 预览图片
			showPic(msg) {
				console.log("msg预览1", msg);
				this.previewImageFlag = true;
				let url =
					this.staticPath +
					this.list_id +
					"/" +
					msg.content.url.replace("_thumb", "");
				uni.previewImage({
					indicator: "none",
					urls: [url],
				});
			},
			// 预览图片
			showPic1(msg) {
				console.log("msg预览2类型图片", msg);
				this.previewImageFlag = true;
				let url =
					this.staticPath +
					this.list_id +
					"/" +
					msg.content.url.replace("_thumb", "");
				uni.previewImage({
					current: url,
					indicator: "none",
					urls: this.msgImgList,
				});
			},
			// 预览文字图片链接
			showPic2(url) {
				console.log("msg预览3", url);
				this.previewImageFlag = true;
				uni.previewImage({
					indicator: "none",
					urls: [url],
				});
			},
			// 播放语音
			playVoice(msg) {
				console.log("播放语音", msg);
				this.AUDIO.stop();
				let _this = this;
				if (this.playMsgid == msg.id) {
					this.playMsgid = null;
				} else {
					this.playMsgid = msg.id;
					console.log("this.AUDIO", this.AUDIO)
					// 修复语音
					let url = this.staticPath + msg.content.full_url + '?_=' + Math.random();

					_this.AUDIO.src = url;
					setTimeout(() => {
						_this.$nextTick(function() {
							_this.AUDIO.play();
						});
					}, 20)
				}
			},
			// 录音开始H5
			voiceBeginH5(e) {
				if (!this.is_start_record) {
					navigator.mediaDevices.getUserMedia({
						video: false,
						audio: true
					}).then((stream) => {
						this.recorder_h5 = RecordRTC(stream, {
							type: 'audio',
							mimeType: 'audio/mp3'
						});
						this.is_start_record = true
						console.log("recorder", this.recorder_h5)
						this.recorder_h5.startRecording();
						this.recorder_time = 0
						this.recorder_timer = setInterval(() => {
							this.recorder_time += 0.1
						}, 100)
						uni.showModal({
							title: '提示',
							content: '正在录音中....',
							confirmText: '发送录音',
							cancelText: '取消录音',
							success: (res) => {
								clearInterval(this.recorder_timer);
								this.recorder_timer = null
								if (res.confirm) {
									this.recorder_h5.stopRecording((res_data) => {
										console.log("res_data", res_data)
										let blob = this.recorder_h5.getBlob();
										console.log("blob", blob)
										// RecordRTC.invokeSaveAsDialog(blob);
										uni.downloadFile({
											url: res_data,
											success: e => {
												console.log("e", e)
												let msg = {
													length: 0,
													url: e.tempFilePath,
												};
												console.log(JSON.stringify(msg));
												let min = parseInt(this
													.recorder_time / 60);
												let sec = parseInt(this
													.recorder_time % 60);
												min = min < 10 ? "0" + min : min;
												sec = sec < 10 ? "0" + sec : sec;
												if (min > 0 || sec > 0) {
													msg.length = min + ":" + sec;
													this.sendMsg(msg, 1);
												}
											}
										})
										this.is_start_record = false
										this.recorder_h5.destroy();
									});
								} else {
									this.is_start_record = false
									this.recorder_h5.destroy();
								}
							}
						})
					});
				}

			},
			// 录音开始
			voiceBegin(e) {
				if (e.touches.length > 1) {
					return;
				}
				this.initPoint.Y = e.touches[0].clientY;
				this.initPoint.identifier = e.touches[0].identifier;
				// this.RECORDER.start({ format: "mp3" });//录音开始,
				// 开始录音
				this.RECORD.start({
					format: "mp3",
				});
			},
			//录音开始UI效果
			recordBegin(e) {
				/** 暂停语音播放 */
				this.AUDIO.pause();
				this.recording = true;
				this.voiceTis = this.$t("chat.message.release_end");
			},
			// 录音被打断
			voiceCancel() {
				this.recording = false;
				this.voiceTis = this.$t("chat.message.hold_to_talk");
				this.recordTis = this.$t("chat.message.slide_your_finger_up_to_cancel_sending");
				this.willStop = true; //不发送录音
				this.RECORD.stop(); //录音结束
			},
			// 录音中(判断是否触发上滑取消发送)
			voiceIng(e) {
				if (!this.recording) {
					return;
				}
				let touche = e.touches[0];
				//上滑一个导航栏的高度触发上滑取消发送
				if (this.initPoint.Y - touche.clientY >= uni.upx2px(100)) {
					this.willStop = true;
					this.recordTis = this.$t("chat.message.release_finger_to_cancel_sending");
				} else {
					this.willStop = false;
					this.recordTis = this.$t("chat.message.slide_your_finger_up_to_cancel_sending");
				}
			},
			// 结束录音
			voiceEnd(e) {
				if (!this.recording) {
					return;
				}
				this.recording = false;
				this.voiceTis = this.$t("chat.message.hold_to_talk");
				this.recordTis = this.$t("chat.message.slide_your_finger_up_to_cancel_sending");
				this.RECORD.stop(); //录音结束
			},
			//录音结束(回调文件)
			recordEnd(e) {
				if (!this.willStop) {
					//console.log("e: " + JSON.stringify(e));
					let msg = {
						length: 0,
						url: e.tempFilePath,
					};
					console.log(JSON.stringify(msg));
					let min = parseInt(this.RecordTime / 60);
					let sec = this.RecordTime % 60;
					min = min < 10 ? "0" + min : min;
					sec = sec < 10 ? "0" + sec : sec;
					if (min > 0 || sec > 0) {
						msg.length = min + ":" + sec;
						this.sendMsg(msg, 1);
					}
				} else {
					console.log("取消发送录音");
				}
				this.willStop = false;
			},
			// 切换语音/文字输入
			switchVoice() {
				this.hideDrawer(1);
				this.isVoice = this.isVoice ? false : true;
			},
			discard() {
				return;
			},
			sayCall() {
				let status = 0; //默认关闭匿名
				console.log("this.msgList.is_niming:", this.msgList.is_niming);
				if (this.msgList.is_niming == 0) {
					uni.showLoading({
						title: "匿名开启中...",
					});
					status = 1;
				}
				let _this = this;
				_get.updateUserSayType({
						list_id: this.list_id,
						status: status,
					},
					function() {
						if (_this.msgList.is_niming == 0) {
							uni.showToast({
								image: "/static/theme/default/my/niming.png",
								duration: 2000,
							});
							_this.msgList.is_niming = 1;

							_this.niming_msg = _this.$t('chat.message.logout_anonymous');
						} else {
							_this.msgList.is_niming = 0;
							_this.niming_msg = _this.$t('chat.message.anonymous');
						}
						_this.textareaFocus(); //隐藏抽屉
					},
					function(ret) {
						uni.showToast({
							title: ret.msg,
							icon: "none",
							duration: 2000,
						});
					}
				);
			},
			// 滚动事件
			scrollEven(e) {
				// 滚动中禁止弹窗
				// console.log("滚动--------", e.detail.scrollHeight);
				this.current_scrollTop = e.detail.scrollTop;
				this.current_scrollHeight = e.detail.scrollHeight;
			},
			zhendong() {
				_get.zhendong({
						list_id: this.list_id,
					},
					function(res) {},
					function(res) {
						uni.showToast({
							title: res.msg,
							duration: 2000,
							icon: "none",
						});
					}
				);
			},
			group_info() {
				uni.navigateTo({
					url: "./message/more?list_id=" +
						this.list_id +
						"&type=" +
						this.msgList.type,
				});
			},
			toUserDetail(item) {
				if (this.msgList.type == 1 && this.msgList.is_action == 0) {
					uni.showToast({
						title: this.$t('chat.message.no_permission'),
						icon: "none",
						duration: 1000,
					});
					return;
				}
				uni.navigateTo({
					url: "../details/index?user_id=" +
						item.user_id +
						"&type=1&list_id=" +
						this.list_id +
						"&is_action=" +
						this.is_action,
				});
			},
			getServing() {
				//判断权限
				if (
					this.msgList.type == 1 &&
					this.msgList.is_action == 0 &&
					this.group_state &&
					this.group_state.can_shangmai == 0
				) {
					uni.showToast({
						title: this.$t(
							'chat.message.this_group_is_set_so_that_only_group_owners_and_administrators_can_use_the_microphone'
						),
						icon: "none",
						duration: 1000,
					});
					return;
				}
				let _this = this;
				if (this.onLine) {
					//在房间里直开启
					_this.showServing = true;
					console.log("onLine.....");
					this.$refs.serving.joinOnline(this.list_id);
					return true;
				}
				console.log("_this.servingState:", _this.servingState);
				if (_this.servingState == 1) {
					//下麦
					_this.showServing = false;
					_this.$refs.serving.xiaMai(this.list_id);
				} else {
					//上麦
					console.log("joinRoom....");
					_this.showServing = true;
					this.$refs.serving.joinRoom(this.list_id);
				}
			},
			setSeringState(detail) {
				console.log("this.servingState:", JSON.stringify(detail));
				this.servingState = detail.state;
			},
		},

		onNavigationBarButtonTap(e) {
			uni.navigateTo({
				url: "./message/more?list_id=" + this.list_id + "&type=" + this.msgList.type,
			});
		},
	};
</script>

<style lang="scss">
	@import "@/static/css/chat/style.scss";

	.custom-name {
		display: flex;
		flex-direction: column;
		align-items: flex-end;

		.custom-username {
			font-size: 24rpx;
			color: gray;
		}
	}

	.custom-content {
		display: flex;
		align-items: center;
	}

	// 针对IOS弹起输入框处理
	.page-content-ios {
		height: calc(100vh - 500px);
	}

	// 自定义表情
	.grid {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		grid-template-rows: 1fr;
		grid-column-gap: 0px;
		grid-row-gap: 10rpx;
		margin-top: 18rpx;

		.grid-item {
			display: flex;
			justify-content: center;
			align-items: center;
			position: relative;

			.close-icon {
				position: absolute;
				right: 0;
				top: 0;
				width: 40rpx;
				height: 40rpx;
				display: flex;
				align-items: center;
				justify-content: center;
			}
		}
	}

	// 引用
	.box .yinyong {
		background-color: #eee;
		border-radius: 40rpx;
		margin-top: 10rpx;
		box-sizing: border-box;
		width: 60vw;
		padding: 10rpx 0 10rpx 20rpx;
		color: #333;
		min-height: 48rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		word-wrap: break-word;

		.yinyong_text {
			font-size: 24rpx;
			line-height: 28rpx;
			flex: 1;
			max-width: 70vw;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}

		.yinyong_close {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 48rpx;
			height: 48rpx;
			flex-shrink: 0;
		}

	}

	.yinyong_content {
		background-color: #ddd;
		border-radius: 10rpx;
		margin-top: 10rpx;
		box-sizing: border-box;
		width: 100%;
		padding: 10rpx;
		color: #333;
		font-size: 24rpx;
		line-height: 30rpx;
		word-break: break-all;
	}

	.yinyongtupian {
		display: flex;
		align-items: flex-start;
	}


	.bubble {
		position: relative;
	}

	.yhjf .bubble::after {
		content: "";
		position: absolute;
		bottom: -4px;
		border-radius: 4rpx;
		width: 100%;
		height: 4rpx;
		background: linear-gradient(to right, #625cef, #3e61fb);
		// transition: all var(--time) linear;
		animation: YHJF var(--time) linear forwards;
	}

	.my .bubble::after {
		right: 0;
	}

	.other .bubble::after {
		left: 0;
	}

	@keyframes YHJF {
		0% {
			width: 100%;
		}

		100% {
			width: 0;
		}
	}

	.read-icon {
		width: 30upx !important;
		margin-right: 10upx;
		flex-shrink: 0;
	}

	.flex {
		display: flex;
	}

	.align-center {
		align-items: center;
	}

	.justify-center {
		justify-content: center;
	}

	.handle-box {
		position: absolute;
		bottom: 20px;
		width: 100vw;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		min-height: 120px;
	}

	.media-box {
		width: 100vw;
		height: 100vh;
		position: relative;
		background-color: #000;

		#remoteStreamContainer {
			position: absolute;
			top: 0;
			left: 0;
			bottom: 0;
			right: 0;
		}

		#localStreamContainer {
			position: absolute;
			z-index: 10;
			top: 50px;
			right: 0;
			width: 80px;
			height: 120px;
		}
	}

	.other {
		.left {
			position: relative;
			width: 200rpx;
			height: 200rpx;

			.action {
				width: 160rpx;
				background: #fff;
				border-radius: 10rpx;
				box-shadow: 0 0 10rpx 0 rgba(0, 0, 0, 0.2);
				position: absolute;
				z-index: 10;
				top: 100rpx;
				left: 0;
				display: flex;
				flex-direction: column;
				align-items: center;
				box-sizing: border-box;
				padding: 0 30rpx;

				.action-line {
					height: 2rpx;
					width: 100rpx;
					margin: 6rpx auto;
					background-color: #ddd;
				}

				.action-item {
					font-size: 24rpx;
					display: flex;
					align-items: center;
					height: 54rpx;
				}
			}
		}
	}

	.popup_friends {
		background-color: rgba(0, 0, 0, 0.3);
		height: 100vh;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
	}

	.popup_friends-top {
		height: 200rpx;
		flex-shrink: 0;
		/* #ifdef H5 */
		height: 500rpx;
		/* #endif */
	}

	.text-gray {
		color: gray;
	}

	.address-name {
		display: flex;
		flex-direction: column;
	}

	.address-flex {

		display: flex;
		align-items: center;
	}

	// .address-flex image{
	// 	width: 64rpx;
	// 	height: 64rpx;
	// }
	.fun-icon {
		width: 100rpx;
		height: 100rpx;
		// border: 1px solid #000;
		width: 64rpx;
		height: 64rpx;
		margin: 10rpx;
	}

	.more-layer {
		// height: 800rpx;
	}

	.send-card {
		width: 700rpx;
		height: 200rpx;
		display: flex;
		max-width: 70%;
		min-height: 25px;
		border-radius: 5px;
		font-size: 14px;
		background-color: #fff;
		flex-direction: column;
		color: #333;
	}

	.send-card-content {
		display: flex;
		justify-content: flex-start;
		align-items: center;
		padding: 20upx;
		height: 100%;
		border-bottom: 2px solid #e1e1e1;
	}

	.send-card-content text {
		margin-left: 20upx;
	}

	.send-card-content-text {
		display: flex;
		justify-content: center;
		flex-direction: column;
		height: 100%;
		margin-left: 20upx;
	}

	.video-but-view {
		padding: 20upx;
		border-radius: 10upx 10upx 0 0;

		.video-but {
			margin-bottom: 18upx;
			background: #817e7e;
			color: #fff;
		}
	}

	.box {
		display: flex;
		flex-direction: column;
	}

	.box textarea {
		padding-left: 5px;
	}

	.list .list-box {
		width: 20%;
		display: flex;
		margin-left: 28rpx;
		margin-top: 10rpx;
		align-items: center;
		flex-direction: column;
	}

	.tool_text {
		font-size: 26rpx;
		color: #727785;
	}

	.luckbtn {
		-webkit-transform: rotateY(360deg);
		animation: rotation 0.4s linear infinite;
		-moz-animation: rotation 0.4s linear infinite;
		-webkit-animation: rotation 0.4s linear infinite;
		-o-animation: rotation 0.4s linear infinite;
	}

	@-webkit-keyframes rotation {
		from {
			-webkit-transform: rotateY(0deg);
		}

		to {
			-webkit-transform: rotateY(360deg);
		}
	}

	.bubble-bofang {
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
	}

	.bubble-bofang-left {
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
	}

	.showVedio {
		width: 100%;
		height: 100%;
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		z-index: 300;
	}

	.cloneBut {
		position: relative;
		text-align: right;
		font-size: 24px;
		color: red;
		margin-left: 10px;
		margin-top: 10px;
		height: 30px;
		width: 30px;
	}

	.cloneBut-img {
		position: absolute;
		width: 30px;
	}

	::-webkit-scrollbar {
		width: 0;
		height: 0;
		color: transparent;
	}

	.gong-gao-content {
		position: fixed;
		/*height: 30px;*/
		width: 100%;
		z-index: 2;
		/*padding: 10rpx 10rpx;*/
	}

	.gong-gao-content-info {
		display: flex;
		align-items: center;
		background-color: #e0e0e0;
		height: 100%;
	}

	.gong-gao-content-info-icon {
		font-size: 20px;
		margin-right: 20rpx;
		margin-left: 20rpx;
	}

	.sys:nth-child(1) {
		// margin-top: 50px;
	}

	.member-image-logo {
		display: flex;
		justify-content: flex-start;
		align-items: center;
		padding-top: 10px;
		box-shadow: inset 0px 15px 15px -23px #000;
		background-color: #ffffff;
		overflow-x: auto;
		width: 686rpx;
		height: 80rpx;
		margin-left: 32rpx;
		margin-top: 22rpx;
		background-color: #fff;
	}

	.member-content {
		width: 80rpx;
		height: 80rpx;
		white-space: nowrap;
		text-align: center;
		margin-left: 20rpx;
		margin-top: -20rpx;
	}

	.img-logo {
		width: 40px !important;
		height: 40px !important;
		border-radius: 50%;
		display: inline-block;

	}


	.jiazai {
		margin-right: 20px;
	}

	.jiazai image {
		width: 40rpx;
		height: 40rpx;
	}

	.pic-box {
		position: fixed;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);

		.pic {
			width: 160rpx;
			height: 160rpx;
			border: 1px solid #000;
			border-radius: 10rpx;
		}

		.username-name {
			color: white;
			margin: 10rpx auto;
		}
	}

	.startTime {
		display: flex;
		justify-content: center;
		align-items: center;
		color: white;
		margin-bottom: 20rpx;
	}
</style>