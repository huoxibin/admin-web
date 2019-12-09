var signalInited = false
var data = {};
var nim;
var timeSecond; //通话时间
nim = SDK.NIM.getInstance({
	debug: false,
	appKey: '99328967caf3ce7c458d53428dbc2fcd',
	account: 'dev_admin_26_1571973183',
	token: 'c3c437f6c27bc7f1669a4e4ab3deac94',
	db: false, //若不要开启数据库请设置false。SDK默认为true。
	// privateConf: {}, // 私有化部署方案所需的配置
	onconnect: onConnect,
	onwillreconnect: onWillReconnect,
	ondisconnect: onDisconnect,
	onerror: onError
});
var NIM = window.SDK.NIM;
var Netcall = window.Netcall;
var WebRTC = window.WebRTC;
NIM.use(WebRTC);
NIM.use(Netcall);


var callTimer;
var callTimerNum = null;

var beCalledInfo = null;
var beCalling = false;
var netcall = WebRTC.getInstance({
	nim: window.nim,
	// mirror: false, 非rtc 功能
	// mirrorRemote: false, 非rtc 功能
	/*kickLast: true,*/
	container: document.getElementById('netcall-video-local'),
	remoteContainer: document.getElementById('netcall-video-remote'),
})
// 信令通道初始化完毕之后, 开发者可以启用音视频通话相关的 UI, 比如说展示呼叫别人的按钮
// 信令通道初始化失败的时候, 请展示错误并禁用所有音视频通话相关的 UI

function signalInit (id, token) {
	netcall.initSignal().then(() => {
		nim = SDK.NIM.getInstance({
			debug: false,
			appKey: '99328967caf3ce7c458d53428dbc2fcd',
			account: id,
			token: token,
			db: false, //若不要开启数据库请设置false。SDK默认为true。
			// privateConf: {}, // 私有化部署方案所需的配置
			onconnect: onConnect,
			onwillreconnect: onWillReconnect,
			ondisconnect: onDisconnect,
			onerror: onError
		})

		signalInited = true;
	}).catch(err => {
		console.log('initSignalError', err)
		signalInited = false
	})
	// 当信令通道断开时, 会触发 signalClosed 事件
	netcall.on('signalClosed', () => {
		console.log('on signalClosed')
		signalInited = false
		//hangup()
	})
	// 初始化过程中会通过 devices 事件回传所有的设备列表
	netcall.on('devices', obj => {
		console.log('on devices', obj)
	})
}


//////---发起通话

function onConnect (obj) {
	console.log('连接成功');
	console.log(obj);
}

function onWillReconnect (obj) {
	// 此时说明 SDK 已经断开连接, 请开发者在界面上提示用户连接已断开, 而且正在重新建立连接
	console.log('即将重连');
	console.log(obj.retryCount);
	console.log(obj.duration);
}

function onDisconnect (error) {
	// 此时说明 SDK 处于断开状态, 开发者此时应该根据错误码提示相应的错误信息, 并且跳转到登录页面
	console.log('丢失连接');
	console.log(error);
	if (error) {
		switch (error.code) {
			// 账号或者密码错误, 请跳转到登录页面并提示错误
			case 302:
				break;
			// 重复登录, 已经在其它端登录了, 请跳转到登录页面并提示错误
			case 417:
				break;
			// 被踢, 请提示错误后跳转到登录页面
			case 'kicked':
				break;
			default:
				break;
		}
	}
}

function onError (error) {
	console.log(error);
}

netcall.on('beCalling', obj => {
	console.log('on beCalling', obj);
	document.getElementById('videoOnCall').style.display = 'block';
	totalTime();
	document.getElementById('netcall-video-local').innerHTML = obj.pushConfig.pushContent;

	// 获取通话标识符 channelId, 每一通会话的 channelId 都不一样
	const {channelId} = obj
	// 通知对方自己已经收到此次通话的请求
	// 如果是同一通呼叫，直接丢掉
	if (obj.channelId === channelId) return;
	// 只有在没有通话并且没有被叫的时候才记录被叫信息, 否则直接挂断
	if (!netcall.calling && !beCalling) {
		beCalling = true
		beCalledInfo = obj;
	}
	else {
		document.getElementById('videoOnCall').style.display = 'none';
		// 通知呼叫方我方繁忙
		netcall.control({
			channelId: channelId,
			command: Netcall.NETCALL_CONTROL_COMMAND_BUSY
		});
	}
})

var setTimeInterval = null;

function totalTime () {
	setTimeInterval = setInterval(() => {
		document.getElementById('timeSecond').innerHTML = getSecond(callTimerNum++);

	}, 1000)
}

function callPeople () {
	const switchToAudioIfNoVideoDevice = true
	let type = WebRTC.NETCALL_TYPE_AUDIO

	netcall.call({
		type,
		account: 'dev_admin_26_1571973183',
		pushConfig: {
			// enable: true,
			// needBadge: true,
			// needPushNick: true,
			channelId: '51510788392919',
			pushContent: '推送内容',
			custom: JSON.stringify({
				timeTag: 1509898767876,
				custom: {
					familyNum: '0108961',
					pushContent: "xxxx 正在呼叫你"
				}
			})
		},
		sessionConfig: {}
	}).then(obj => {
		console.log('call success', obj)
		// 设置超时计时器
		callTimer = setTimeout(() => {
			if (!netcall.callAccepted) {
				console.log('超时未接听, hangup')
				hangup()
			}
		}, 1000 * 30)
	}, err => {
		console.log('呼叫错误');
		// 被叫不在线
		if (err.code === 11001) {
			console.log('callee offline', err)
		}
	})
}

var acceptAndWait = false;

function changeState () {
	acceptAndWait = false;
	console.log("音视频通话开始");
	// this.clearCallTimer();
	// this.clearRingPlay();
}

var deviceAudioInOn = false;

setDeviceAudioIn = function (state) {
	deviceAudioInOn = !!state;
	if (state) {
		console.log("开启麦克风");
		return netcall.startDevice({
			// 开启麦克风输入
			type: Netcall.DEVICE_TYPE_AUDIO_IN
		}).then(function () {
			console.log("开启麦克风成功，通知对方我方开启了麦克风");
			// 通知对方自己开启了麦克风
			netcall.control({
				command: Netcall.NETCALL_CONTROL_COMMAND_NOTIFY_AUDIO_ON
			})
			netcall.setCaptureVolume(255)
		}).catch(function () {
			console.log("开启麦克风失败");
			console.error("开启麦克风失败");
			console.log("开启麦克风失败");
			document.getElementById('videoOnCall').style.display = 'none';
			//通知对方，麦克风不可用
			netcall.control({
				command: Netcall.NETCALL_CONTROL_COMMAND_SELF_AUDIO_INVALID
			});
		});
	}
	else {
		console.log("关闭麦克风");
		return netcall.stopDevice(Netcall.DEVICE_TYPE_AUDIO_IN) // 关闭麦克风输入
			.then(function () {
				console.log("关闭麦克风成功，通知对方我方关闭了麦克风");
				// 通知对方自己关闭了麦克风
				netcall.control({
					command: Netcall.NETCALL_CONTROL_COMMAND_NOTIFY_AUDIO_OFF
				});
			}).catch(function () {
				console.log("关闭麦克风失败");
				console.error("关闭麦克风失败");
			});
	}
};


function onCallAccepted () {
	netcall.response({
		accepted: true,
		beCalledInfo: beCalledInfo,
		sessionConfig: {
			recordAudio: true,
			recordType: 0
		},
	}).then(() => {
		console.log("同意对方音视频请求成功");
		// 加个定时器 处理点击接听了 实际上对面杀进程了，没有callAccepted回调
		acceptAndWait = true;


		Promise.resolve().then(function () {
			console.log("开始webrtc连接")
			return netcall.startRtc();
		}).then(() => {
			console.log("webrtc连接成功")
			//return setDeviceVideoIn(WebRTC.NETCALL_TYPE_VIDEO);
		}).then(function () {
			return setDeviceAudioIn(true);
		}).then(function () {
			changeState();
		}).catch(function (e) {
			console.error(e);
			console.log("连接出错");
			document.getElementById('videoOnCall').style.display = 'none';

			if (/webrtc兼容开关/i.test(e)) {
				alert({
					type: 'error',
					msg: '无法接通!请让呼叫方打开"WebRTC兼容开关"，方可正常通话', //消息主体
					confirmBtnMsg: '知道了，挂断',
					cbConfirm: hangup
				})
			}
		})
		setTimeout(function () {
			if (acceptAndWait) {
				console.log("通话建立过程超时");
				//this.hideAllNetcallUI();
				hangup()
				acceptAndWait = false;
				document.getElementById('videoOnCall').style.display = 'none';
			}
		}.bind(this), 45 * 1000)
	}).catch(err => {
		console.log("通话建立失败！");
	})
}

function reject () {
	console.log("拒绝对方音视频通话请求");
	netcall.response({
		accepted: false,
		beCalledInfo: beCalledInfo
	}).then(() => {
		console.log("拒绝对方音视频通话请求成功");
		console.log("已拒绝");
		beCalledInfo = null;
		beCalling = false;
		//this.hideAllNetcallUI();
	}).catch((err) => {
		// 自己断网了
		document.getElementById('videoOnCall').style.display = 'none';
		console.log("拒绝对方音视频通话请求失败");
		console.log("error info:", err);
		beCalledInfo = null;
		beCalling = false;
		//this.hideAllNetcallUI();
	});

}

function clearCallTimer () {
	clearTimeout(callTimer)
}

function hangup () {  //挂断电话
	netcall.hangup()
	resetWhenHangup();
	clearInterval(setTimeInterval);

	document.getElementById('hangupCall').style.display = 'none';
	callTimerNum = 0;
}

function stopDeviceAudioIn () { //停止麦克风设备
	netcall.control({
		command: Netcall.NETCALL_CONTROL_COMMAND_NOTIFY_AUDIO_OFF
	})
}

function stopDeviceAudioOutLocal () { //停止播放自己声音的设备
	netcall.stopDevice(Netcall.DEVICE_TYPE_AUDIO_OUT_LOCAL)
}

function resetWhenHangup () {
	beCalledInfo = null
	beCalling = false
	netcall && netcall.stopSignal && netcall.stopSignal();
	clearCallTimer();
	// netcall.stopLocalStream()
	// netcall.stopRemoteStream()
	stopDeviceAudioOutLocal();
	stopDeviceAudioIn();
}

function getSecond (time) {
	//let time = '30.255';
	let min = Math.floor(time / 60) < 10 ? `0${ Math.floor(time / 60) }` : Math.floor(time / 60);
	let sec = time % 60 < 10 ? `0${ time % 60 }` : `${ time % 60 }`;
	let s = `${ min }:${ sec }`;
	return s;
}

var linkUrlFg = false;
var telFg = 0;

function callLinkUrl (data, url) {
	data.children.some(item => {
		if (item.linkUrl.includes(url)) {
			linkUrlFg = true;
		}
		else {
			callLinkUrl(item, url);
		}
	})
}

netcall.on('hangup', obj => {
	console.log('on hangup', obj)
	hangup();
	document.getElementById('videoOnCall').style.display = 'none';
})


