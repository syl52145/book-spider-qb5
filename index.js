(async function() {
    var arguments = process.argv.splice(2);
    const spider = require('./src/spider');
    console.log('开始下载');
    await spider.loader(arguments[0]); // 小说目录地址 
    await spider.run();
    var cronJob = require("cron").CronJob;  // 爬虫
    new cronJob('*/20 * * * * *', async function() { //每20秒爬一次
        await spider.run();
    }, null, true, 'Asia/Shanghai');
})();
