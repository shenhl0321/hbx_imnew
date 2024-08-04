import _data from './_data';
import _lang from '../lang/lang';
import _mixins from './_mixins';
let innerAudioContext = uni.createInnerAudioContext();
export default {
	/** 显示状态通知提醒 */
	setStatusTips() {
		let pages = getCurrentPages();
		if (pages.length < 1) {
			return;
		}
		let route = pages[pages.length - 1].route,
			/** 只有tabbar页面才更新消息状态 */
			routes = [
				'pages/chat/index',
				'pages/friend/index',
				'pages/push/index',
				'pages/my/index'
			];
		if (routes.indexOf(route) == -1) {
			return;
		}
		/** 通讯录提示 */
		let num = (_data.data('new_friend_tips_num') * 1),
			num_ = (_data.data('new_group_tips_num') * 1);
		if (num_) {
			uni.$emit('data_new_group_apply_tips', num_);
		}
		if (num) {
			uni.$emit('data_new_friend_tips', num);
		}
		if (num + num_) {
			uni.setTabBarBadge({
				index: 1,
				text: (num + num_ + ''),
			});
		} else {
			uni.removeTabBarBadge({
				index: 1
			});
		}
		uni.$emit('unread_concat_msg', num);
		/** 会话列表提示 */
		num = _data.chatTipsNum();
		if (num) {
			uni.setTabBarBadge({
				index: 0,
				text: (num + ''),
			});

			if (route == 'pages/chat/index') {
				uni.setNavigationBarTitle({
					title: _lang.t('message.message') + '(' + num + ')',
				});

			}
		} else {
			uni.removeTabBarBadge({
				index: 0
			});
			if (route == 'pages/chat/index') {
				uni.setNavigationBarTitle({
					title: _lang.t('message.message'),
				});
			}
		}
		uni.$emit('unread_msg', num);



		/** 朋友圈提示(优先显示消息条数，再提示好友动态) */
		num = _data.data('no_reader_circle_chat_num');
		let num2 = _data.data('no_reader_pay_num');
		let num3 = parseInt(num) + parseInt(num2);
		if (num3) {
			uni.setTabBarBadge({
				index: 2,
				text: (num2 + ''),
			});
			if (num) uni.$emit('data_circle_tips', num);
			if (num2) uni.$emit('data_pay_tips', num2);
		} else {
			uni.removeTabBarBadge({
				index: 2
			});
			num = _data.data('no_reader_circle');
			if (num) {
				uni.showTabBarRedDot({
					index: 2
				});
				uni.$emit('data_circle_tips', '好友动态');
			} else {
				uni.hideTabBarRedDot({
					index: 2
				});
			}
		}



	},
	/** 路由守卫执行方法 */
	routeTool() {
		_data.data('isOnlie', true);
		let token = _data.localData('token');
		/** 没有token就跳转到登陆去获得token */
		if (!token) {
			uni.reLaunch({
				url: '/pages/in/login'
			});
			return;
		}
		/** 如果没有连接上socket,则连接 */
		if (!_data.data('socket_state')) {
			_mixins.methods.$reset().$reconnect();
		}

	},
	/** 验证失败后执行 */
	checkFail() {
		/** 好友申请通知 */
		_data.data('new_friend_tips_num', 0);
		/** 朋友圈通知 */
		_data.data('no_reader_circle', 0);
		/** 朋友圈消息未读数 */
		_data.data('no_reader_circle_chat_num', 0);
		/** 清空自己的头像保存的本地的临时地址 */
		let data = _data.data('cache');
		data.local_photo = '';
		_data.data('cache', data);
		/** 归档用户信息 */
		_data.data('user_info', {
			id: 0,
			nickname: '',
			username: '',
			photo: 'default_man/90.jpg',
			doodling: '',
			circle_img: 'default_circle_img.jpg',
		});
		// 保存语言
		let locale = _data.localData('lang') || '';
		//清除缓存
		uni.clearStorageSync();
		_data.localData('lang', locale)
		// /** 跳转到登陆界面 */
		// uni.reLaunch({
		//   url: '/pages/in/login'
		// });
	},
	/** 更新未读消息为0 */
	updataNoReader(list_id) {
		_mixins.methods.$httpSend({
			path: '/im/message/updataNoReader',
			data: {
				list_id: list_id
			},
		});
		uni.$emit('')
	},
	/** 下载自己的头像 */
	downloadPhoto() {
		let url = _data.staticPhoto() + _data.data('user_info').photo;
		let data = _data.data('cache');
		uni.downloadFile({
			url: url,
			success: (res) => {
				console.log("download:", res)
				if (res.statusCode === 200) {
					data.local_photo = res.tempFilePath;
					if (!data.local_photo) data.local_photo = url
					_data.data('cache', data);
				}
			},
			fail(res) {
				data.local_photo = url;
				console.log(1111)
				_data.data('cache', data);
			}
		});
		if (!_data.data('cache').local_photo) {
			data.local_photo = url;
			console.log("data", data)
			_data.data('cache', data);
		}
		console.log("_cache", _data.data('cache'))
	},
	/** 播放音效 */
	playVoice(path, loop) {
		innerAudioContext.src = path;
		innerAudioContext.loop = loop;
		// innerAudioContext.obeyMuteSwitch = false;
		innerAudioContext.play();
		innerAudioContext.onPlay(() => {
			//console.log('开始播放');
		});
		innerAudioContext.onError((res) => {
			innerAudioContext.destroy();
			return;
			uni.showToast({
				title: '音效播放错误 ->' + JSON.stringify(res),
				icon: 'none',
			});
		});
	},
	// 停止播放
	stopVoice() {
		console.log("停止")
		innerAudioContext.stop()
	},
	/** 时间戳转换 */
	timestampFormat(timestamp) {
		let curTimestamp = parseInt(new Date().getTime() / 1000), //当前时间戳
			timestampDiff = curTimestamp - timestamp, // 参数时间戳与当前时间戳相差秒数
			curDate = new Date(curTimestamp * 1000), // 当前时间日期对象
			tmDate = new Date(timestamp * 1000), // 参数时间戳转换成的日期对象
			Y = tmDate.getFullYear(),
			m = tmDate.getMonth() + 1,
			d = tmDate.getDate(),
			H = tmDate.getHours(),
			i = tmDate.getMinutes(),
			s = tmDate.getSeconds();
		if (timestampDiff < 60) { // 一分钟以内
			return _lang.t('js.action.just_now');
		} else if (timestampDiff < 3600) { // 一小时前之内
			return Math.floor(timestampDiff / 60) + _lang.t('js.action.minutes_ago');
		} else if (curDate.getFullYear() == Y && curDate.getMonth() + 1 == m && curDate.getDate() == d) {
			return _lang.t('js.action.today') + ((String(H).length == 1 ? '0' : '') + H) + ':' + ((String(i).length ==
				1 ? '0' : '') + i);
		} else {
			// var newDate = new Date((curTimestamp - 86400) * 1000); // 参数中的时间戳加一天转换成的日期对象
			// if (newDate.getFullYear() == Y && newDate.getMonth() + 1 == m && newDate.getDate() == d) {
			// 	return _lang.t('js.action.yesterday') + ((String(H).length == 1 ? '0' : '') + H) + ':' + ((String(i)
			// 			.length == 1 ? '0' : '') +
			// 		i);
			// } else if (curDate.getFullYear() == Y) {
			// 	return ((String(m).length == 1 ? '0' : '') + m) + _lang.t('js.action.month') + ((String(d).length == 1 ?
			// 			'0' : '') + d) +
			// 		_lang.t('js.action.day') + ((String(H).length == 1 ? '0' : '') + H) + ':' + ((String(i).length ==
			// 			1 ? '0' : '') + i);
			// } else {
			// 	return Y + _lang.t('js.action.year') + ((String(m).length == 1 ? '0' : '') + m) + _lang.t(
			// 		'js.action.month') + ((String(d).length == 1 ? '0' : '') +
			// 		d) + _lang.t('js.action.day') + ((String(H).length == 1 ? '0' : '') + H) + ':' + ((String(i)
			// 		.length == 1 ? '0' :
			// 		'') + i);
			// }
			// 获取年、月、日  
			// 获取年、月、日  
			const year = tmDate.getFullYear(); // 获取完整的年份(4位数字)  
			const month = String(tmDate.getMonth() + 1).padStart(2, '0'); // 月份从0开始，所以要加1  
			const day = String(tmDate.getDate()).padStart(2, '0'); // 天数  

			// // 获取小时、分钟、秒  
			// const hours = String(tmDate.getHours()).padStart(2, '0'); // 24小时制  
			// const minutes = String(tmDate.getMinutes()).padStart(2, '0');
			// const seconds = String(tmDate.getSeconds()).padStart(2, '0');

			// 拼接成"YYYY-MM-DD HH:MM:SS"格式  
			const formattedDateTime = `${day}-${month}-${year}`;
			
			return formattedDateTime;
		}
	},
	getStrCharLength(val) {
		var str = new String(val);
		var bytesCount = 0;
		for (var i = 0, n = str.length; i < n; i++) {
			var c = str.charCodeAt(i);
			if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
				bytesCount += 1;
			} else {
				bytesCount += 2;
			}
		}
		return bytesCount;
	},
	getWebUrl() {
		_mixins.methods.$httpSend({
			path: '/im/middle.Middle/get_list',
			success: function(res) {
				console.log("res网站", res);
				uni.setTabBarItem({
					index: 0,
					text: _lang.t("tabbar.chat"),
					success: function(res) {
						console.log(res);
					},
				});
				uni.setTabBarItem({
					index: 1,
					text: _lang.t("tabbar.friend"),
					success: function(res) {
						console.log(res);
					},
				});

				uni.setTabBarItem({
					index: 3,
					text: _lang.t("tabbar.find"),
					success: function(res) {
						console.log(res);
					},
				});
				uni.setTabBarItem({
					index: 4,
					text: _lang.t("tabbar.my"),
					success: function(res) {
						console.log(res);
					},
				});
				let arr = res;
				let active = {};
				if (arr.length) {
					arr.forEach(item => {
						if (item.status == 1) {
							active = item;
							return
						}
					})
					if (!active.url) {
						uni.setTabBarItem({
							index: 2,
							visible: false
						})
					} else {

						function titleCase(str) {
							let newStr = str.slice(0, 1).toUpperCase() + str.slice(1).toLowerCase();
							return newStr;
						}
						let name = active.name;
						let lang = _data.localData('lang');
						// 设置底部导航图标
						let origin_url = _data.staticUrl() + active.logo
						let url = origin_url + '?_=' + Math.random()
						// #ifdef APP
						// 查看是否本地有图标，且图标跟接口返回的是否一致
						let active_origin_url = uni.getStorageSync('active_origin_url')
						if (active_origin_url && active_origin_url == origin_url) {
							let active_url = uni.getStorageSync('active_url');
							uni.setTabBarItem({
								index: 2,
								visible: true,
								text: name,
								iconPath: active_url,
								selectedIconPath: active_url,
							})
							uni.$emit("show_weburl", active.url);
						} else {
							// 下载图标到本地
							uni.downloadFile({
								url: url, //
								success: (res) => {
									if (res.statusCode === 200) {
										console.log('下载成功', res);
										var tempFilePath = res.tempFilePath;
										uni.saveFile({
											tempFilePath: tempFilePath,
											success: function(res_) {
												var savedFilePath = res_
													.savedFilePath;
												console.log('保存本地成功', res_);
												uni.setStorageSync('active_url',
													savedFilePath);
												uni.setStorageSync(
													'active_origin_url',
													origin_url);
												uni.setTabBarItem({
													index: 2,
													visible: true,
													text: name,
													iconPath: savedFilePath,
													selectedIconPath: savedFilePath,
												})
												uni.$emit("show_weburl", active
													.url);
											}
										});
									}
								}
							});
						}
						// #endif
						// #ifdef H5
						uni.setTabBarItem({
							index: 2,
							visible: true,
							text: name,
							iconPath: url,
							selectedIconPath: url,
						})
						uni.$emit("show_weburl", active.url);
						// #endif

					}
				} else {
					uni.setTabBarItem({
						index: 2,
						visible: false
					})
				}
			}
		})
	},
}