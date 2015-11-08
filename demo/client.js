'use strict';
const _ = require('lodash');
const logger = require('..');

logger.init({
	app: 'test'
});

// logger.add('console');
logger.add('udp', {
	port: 6000,
	host: '127.0.0.1'
});

let messages = [
	'Creates an array of values by running each element in collection through iteratee. The iteratee is bound to thisArg and invoked with three arguments: (value, index|key, collection). If a property name is provided for iteratee the created _.property style callback returns the property value of the given element. ',
	'主要功能：群组聊天，直接通信，私聊群，桌面通知，媒体嵌入，链接预览，文件上传，语音/视频 聊天，截图等等。Rocket.Chat 原生支持 Windows，Mac OS X ，Linux，iOS 和 Android 平台。Rocket.Chat 通过 hubot 集成了非常流行的服务，比如 GitHub，GitLab，Confluence，JIRA 等等。',
	'来自卡巴斯基实验室(Kaspersky Labs）以及Imperva今年第三季度的研究报告显示，DDoS攻击已经成为相当频繁的话题，甚至掩盖了不少更严重的攻击行为，成为对企业或者竞争对手进行敲诈和干扰的重要手段。',
	'而Imperva的研究则指出，相较今年第二季度，本季度网络层DDoS攻击增加了108.5%，每天影响至少超过100Gbps的速度，记录中某次攻击的峰值带宽占用达到260Gbps。而在应用层，62.3%的DDoS攻击藏于浏览器层级'
];
let types = 'log info warn error'.split(' ');
let total = 0;

function send() {
	let index = _.sample([0, 1, 2, 3]);
	setTimeout(function() {
		let type = types[index];
		console[type](messages[index]);
		send();
		console.dir(++total);
	}, (index + 1) * 10);
}

send();
