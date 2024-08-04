import i18n from '../../lang/lang.js'

export function getPushClientId(){
	return new Promise((resolve,reject)=>{
		uni.getPushClientId({
			success: (res) => {
				uni.setStorageSync('storage_push_id',res.cid);
				resolve(res.cid);
			},
			fail:reject
		})
	})
}

export function onPushMessage(callback){
	return uni.onPushMessage((res)=>{
		console.log(res)
		if(res.type == 'receive'){
			createPushMessage(res.data)
		}
		callback(res)
	})
}

export function offPushMessage(){
	// 没有传入参数，则移除App级别的所有事件监听器
	uni.offPushMessage();
}

// 创建本地通知栏消息
export function createPushMessage(data){
	const { appName } = uni.getSystemInfoSync()
	let params = {
		title: appName ||"",	
		content: appName ||"",
		payload: {},
		...data
	}
	return uni.createPushMessage(params)
}

export function createToPushMessage(pushId,data){
	const { appName } = uni.getSystemInfoSync()
	let params = {
		push_clientid:pushId,
		title: appName ||"",	
		content: appName ||"",
		payload: {},
		...data
	}
	return uniCloud.callFunction({
		name: 'push',
		data:params
	})
}


export function createTextPush(pushId,data){
	let user = uni.getStorageSync('localLoginData');
	let params = {
		action:'text',
		conversationType:data.conversationType || 'C2C',
		form:data.to || '',
		to:user.userid
	}
	return createToPushMessage(pushId,{
		payload:params,
		content:data.text ? data.text :"对方给你发送了一条文本消息"
	});
}

export function createImagePush(pushId,data){
	let user = uni.getStorageSync('localLoginData');
	let params = {
		action:'image',
		conversationType:data.conversationType || 'C2C',
		form:data.to || '',
		to:user.userid
	}
	return createToPushMessage(pushId,{
		payload:params,
		content:"对方给你发送了一张图片消息"
	});
}

export function createAudioPush(pushId,data){
	let user = uni.getStorageSync('localLoginData');
	let params = {
		action:'audio',
		conversationType:data.conversationType || 'C2C',
		form:data.to || '',
		to:user.userid
	}
	return createToPushMessage(pushId,{
		payload:params,
		content:"对方给你发送了一条语音消息"
	});
}

export function createVideoPush(pushId,data){
	let user = uni.getStorageSync('localLoginData');
	let params = {
		action:'video',
		conversationType:data.conversationType || 'C2C',
		form:data.to || '',
		to:user.userid
	}
	return createToPushMessage(pushId,{
		payload:params,
		content:"对方给你发送了一条短视频消息"
	});
}


// 设置手机通知权限
export function notifyPermissions() {
	// #ifdef APP-PLUS  
	if (plus.os.name == 'Android') { // 判断是Android
		var main = plus.android.runtimeMainActivity();
		var pkName = main.getPackageName();
		var uid = main.getApplicationInfo().plusGetAttribute("uid");
		var NotificationManagerCompat = plus.android.importClass("android.support.v4.app.NotificationManagerCompat");
		//android.support.v4升级为androidx
		if (NotificationManagerCompat == null) {
			NotificationManagerCompat = plus.android.importClass("androidx.core.app.NotificationManagerCompat");
		}
		var areNotificationsEnabled = NotificationManagerCompat.from(main).areNotificationsEnabled();
		// 未开通‘允许通知’权限，则弹窗提醒开通，并点击确认后，跳转到系统设置页面进行设置  
		if (!areNotificationsEnabled) {
			uni.showModal({
				title: i18n.t('unipush.title'),
				content: i18n.t('unipush.content'), 
				showCancel: false,
				confirmText: i18n.t('unipush.confirmText'),
				success: function(res) {
					if (res.confirm) {
						var Intent = plus.android.importClass('android.content.Intent');
						var Build = plus.android.importClass("android.os.Build");
						//android 8.0引导  
						if (Build.VERSION.SDK_INT >= 26) {
							var intent = new Intent('android.settings.APP_NOTIFICATION_SETTINGS');
							intent.putExtra('android.provider.extra.APP_PACKAGE', pkName);
						} else if (Build.VERSION.SDK_INT >= 21) { //android 5.0-7.0  
							var intent = new Intent('android.settings.APP_NOTIFICATION_SETTINGS');
							intent.putExtra("app_package", pkName);
							intent.putExtra("app_uid", uid);
						} else { //(<21)其他--跳转到该应用管理的详情页  
							intent.setAction(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
							var uri = Uri.fromParts("package", mainActivity.getPackageName(), null);
							intent.setData(uri);
						}
						// 跳转到该应用的系统通知设置页  
						main.startActivity(intent);
					}
				}
			});
		}
	} else if (plus.os.name == 'iOS') { // 判断是ISO
		var isOn = undefined;
		var types = 0;
		var app = plus.ios.invoke('UIApplication', 'sharedApplication');
		var settings = plus.ios.invoke(app, 'currentUserNotificationSettings');
		if (settings) {
			types = settings.plusGetAttribute('types');
			plus.ios.deleteObject(settings);
		} else {
			types = plus.ios.invoke(app, 'enabledRemoteNotificationTypes');
		}
		plus.ios.deleteObject(app);
		isOn = (0 != types);
		if (isOn == false) {
			uni.showModal({
				title: i18n.t('unipush.title'),
				content: i18n.t('unipush.content'), 
				showCancel: false,
				confirmText: i18n.t('unipush.confirmText'),
				success: function(res) {
					if (res.confirm) {
						var app = plus.ios.invoke('UIApplication', 'sharedApplication');
						var setting = plus.ios.invoke('NSURL', 'URLWithString:', 'app-settings:');
						plus.ios.invoke(app, 'openURL:', setting);
						plus.ios.deleteObject(setting);
						plus.ios.deleteObject(app);
					}
				}
			});
		}
	}
	// #endif  
}
