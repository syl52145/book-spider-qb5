# book-spider
### 简介
> 这是一个NodeJS爬虫项目， 用于爬取[全本小说网](https://www.qb5.tw/shu/114139.html)的小说资源 从章节目录开始抓取

> 用到的模快主要有superagent，cheerio，superagent-charset，mysql，cron，bluebird

> 本项目在Ubuntu环境下开发，未进行Windows测试，NodeJS版本为 v7.1.0

> 感谢开发本项目依赖模快的开源界前辈

### 安装
```
git clone https://github.com/lxzan/book-spider.git
cd book-spider
npm install (安装速度较慢，建议使用cnpm)
```

> 创建数据库，文件在spider.sql

> 配置 src/db.js.template的mysql账户密码并将文件文件改名为db.js


### 启动

```
node --harmony index.js <url>
url表示小说目录页面url， 如 http://www.aiquxs.com/read/41/41742/index.html
```
