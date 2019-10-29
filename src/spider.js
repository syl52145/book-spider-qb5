const charset = require('superagent-charset');//设置编码类型
const request = require('superagent'); // 获取url内容源码
const Promise = require('bluebird'); // es6语法
const cheerio = require("cheerio"); //使用方法类似jq
const fs = require("fs");
const flow = require("async");  // 同步操作
// const DB = require("./db");
charset(request);
var download_path = ''; // 路径 ./download/小说名
var textname = ''; //小说名
var baseurl = ''; // 基础地址
var data = []; // 存储 所有章节目录的title，href

function getPage(url) {  // api封装请求
    return new Promise(function(resolve, reject) {
        request.get(url)
            .charset('gbk')
            .end(function(err, res) {
                if (err) {
                    reject(err);
                } else {
                    resolve(res);
                }
            });
    });
}

async function downloadPage(params) {  // run 调用 根据 章节href下载指定章节
	let title = params.title,href = params.href,id = params.id;
	console.log(id+', '+title+ ', '+href)
	let page = await getPage(baseurl+href);
    let filename = id + '-' + params.title + '.txt'; // id+章节名.txt
    let path = download_path + '/' + filename; // 路径 ./download/小说名 
    let html = page.text.replace(/<br.*?\/>/g, '\n'); // 去除br标签，保留换行
    let $ = cheerio.load(html);
    let content = $("#content").text();  // 小说主题内容
    content = params.title + content.replace("全本小说网 WWW.QB5.TW，最快更新沧元图最新章节！","") + '\n'; // 对小说章节内容进行处理
    fs.writeFileSync(path, content, 'utf8'); // 写入txt文件 至 ./download/小说名 下 
}

async function merge() {  // 合并所有章节.txt文件
    console.log('开始合并');
    let files = await fs.readdirSync(download_path).sort(function(a, b) { //数组排序 ["1-第一章 孟川和云青萍.txt","2-第二章 学其上，仅得其中.txt","3-第三章 匠人和宗师.txt"]
        let x = parseInt( a.match(/^[0-9]+\-/g)[0] );
        let y = parseInt( b.match(/^[0-9]+\-/g)[0] );
        return x - y;
    });
	// let filepath = download_path +'.txt'
	// fs.writeFileSync(filepath, JSON.stringify(files), 'utf8');
    let filepath = download_path +'/'+ textname+ '.txt'; // 路径 ./download/小说名/小说名.txt
    fs.writeFileSync(filepath, '', 'utf8');

    for(let i=0; i<files.length; i++) {
        let content = fs.readFileSync(download_path + '/' + files[i], 'utf8');
        fs.appendFileSync(filepath, content, 'utf8');
		fs.unlink(download_path + '/' + files[i],function(err){
			if(err) throw err;
		})
    }
    console.log('合并完成');
}

module.exports = {
    loader: async function(url) {  // 第一步 从小说目录地址获取所有章节信息->并插入数组data中
        let url1 = url.split('/');
        baseurl = url1[0]+"//"+url1[2]; 
        let page = await getPage(url);
        let $ = cheerio.load(page.text,{decodeEntities:false}); //html内容源码 {decodeEntities:false}防止乱码
        textname = $('#info>h1').text(); // 小说名称
        download_path = './download/' + textname; 
        if (!fs.existsSync('./download')) { // 创建 目录./download
            fs.mkdirSync('./download'); 
        }

        if (!fs.existsSync(download_path)) { // 创建 目录./download/小说名
            fs.mkdirSync(download_path);
        }
		
		var id = 1; // 编号
        $('.zjlist dd a').each(function() { // 遍历所有章节信息 title，href
            let node = $(this);
            let href = node.attr('href');
            let title = node.text();
            data.push({  // 添加章节信息至data数组中
				href,
				title,
				id
            });
			id++
        });
		
    },

    run: async function() {  // 第二步 分段下载文件
		if(data.length === 0) { 
           console.log('下载完成');
           await merge();   // 合并所有章节.txt文件
           process.exit(); // 退出进程 
        }
		var data1 = data.splice(0,100); // splice做了两个操作1.使data被截取掉(减少) 2.把截取的内容赋值给data1
        flow.each(data1,function(item, callback) {  //  所有操作并发执行，且全部未出错，最终得到的err为undefined。注意最终callback只有一个参数err。
			downloadPage(item); //下载指定章节
			callback(null); //如果有错误传入错误 与异步函数一起使用容易出错
			// 这个函数告诉eachSeries函数，这个异步操作状态，是成功了，还是失败了，传(false)null表示这个异步成功完成，true(1)执行失败，还未执行的不再执行
        }, function(err) {
            if(err) { //接收错误 
                console.log(err);
            }
        });
		
    }
}
