'use strict';
const uniPush = uniCloud.getPushManager({appId:"__UNI__8669DEA"})

exports.main = async (event, context) => {
	// https://doc.dcloud.net.cn/uniCloud/uni-cloud-push/api.html
	let source = context.SOURCE,params = {}
	if(source == 'http'){
		params = event.queryStringParameters
		params.payload = JSON.parse(params.payload)
	}else{
		params = event
	}
	// params.force_notification = true
	console.log('event : ', params , source)
	return await uniPush.sendMessage(params)
};
