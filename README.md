# book-spider-qb5
### 简介
> 这是一个NodeJS爬虫项目， 用于爬取[全本小说网](https://www.qb5.tw/shu/114139.html)的小说资源 》从章节目录开始抓取

<<<<<<< HEAD
> 用到的模快主要有superagent，cheerio，superagent-charset，cron，bluebird，ws, express
=======
> 用到的模快主要有superagent，cheerio，superagent-charset，cron，bluebird
>>>>>>> three commit

> 本项目在Ubuntu环境下开发，未进行Windows测试，NodeJS版本为 v7.1.0

> 感谢开发本项目依赖模快的开源界前辈

> 修改来源 https://github.com/lxzan/book-spider

### 修改内容
> 去除使用数据库
> 添加webSocket聊天室

### 安装
```
git clone https://github.com/syl52145/book-spider-qb5.git
cd book-spider-qb5
npm install (安装速度较慢，建议使用cnpm)
```

> 不需创建数据库

> 配置


### 启动

```
启动命令 node index.js 
浏览器打开网址 127.0.0.1:8000
抓取小说 请使用目录页面url地址， 如 https://www.qb5.tw/shu/114139.html

```
