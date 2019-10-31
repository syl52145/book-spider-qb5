const http = require('http');
const express = require('express');
const webSocket = require('ws');
const spider = require('./src/spider');

var app = express();
app.use('/',express.static(__dirname+'/public'));
app.use('/download', express.static(__dirname+'/download'));
var server = http.createServer(app);


var wss = new webSocket.Server({
	// host: "127.0.0.1",
	// port: 3000
	server,
	verifyClient: socketVerify //可选，验证连接函数
});
function socketVerify(info) {
  let url = info.req.url;
  return true; //否则拒绝
  //传入的info参数会包括这个连接的很多信息，你可以在此处使用console.log(info)来查看和选择如何验证连接
}


//广播
//let user = {};//存储连接用户
var online = 0;//在线人数

wss.broadcast = function broadcast(data) {
	// console.log(wss);
	if(!data.hasOwnProperty('msg')){
		data.msg = ""
	};
	if(!data.hasOwnProperty('online')){
		data.online = online; // 指 .on('message' 在线人数为总人数
	};
	
	online = 0; //重置在线人数
    wss.clients.forEach(function each(client) {	
        if (client.readyState === webSocket.OPEN) {
			online++; //遍历在线人数 --> 使全局变量online为总在线人数
			client.send(JSON.stringify(data));
		}
    });
};
// 初始化
wss.on('connection', function(ws,req) {
    // console.log("在线人数", online);
	wss.broadcast({online: (online+1)}) // 连接成功，但未遍历 总在线人数应+1
    ws.on('message',async function(msg) {
		var msg = JSON.parse(msg)
		if(msg.hasOwnProperty("msg")){
			msg = msg.msg;
			var reg=/^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~\/])+$/;
			if(!reg.test(msg)){
				wss.broadcast({msg:'请输入正确的网址！'});
				return;
			}
			await spider.loader(msg,wss);
			await spider.run(wss);
		}else
		if(msg.hasOwnProperty("chat")){
			chat = msg.chat
			wss.broadcast({msg:chat}) 
		}
    });
	// 退出聊天
	ws.on('close', function(close) {
		try{
			wss.broadcast({online:(online-1)}) // 退出
		}catch(e){
			console.log('刷新页面了');
		}
	});
});

server.listen(8000, function listening() {
    console.log('服务器启动成功！');
});
// async function() {
//     var arguments = process.argv.splice(2);
//     const spider = require('./src/spider');
//     console.log('开始下载');
//     await spider.loader(arguments[0]); // 小说目录地址 
//     await spider.run();
//     var cronJob = require("cron").CronJob;  // 爬虫
//     new cronJob('*/20 * * * * *', async function() { //每20秒爬一次
//         await spider.run();
//     }, null, true, 'Asia/Shanghai');
// };

