###### express
```js
node.js中 最常用的 web server 框架

安装与运行： (使用脚手架快速生成项目文件 `express-generator` 提前下载好)
    默认安装的全栈文件，有前端的东西（无前后端分离时期的.php、.jsp、.asp、、、）
        `/public/`、`/views/`在前后端分离时期基本用不到了 可删除
    `express 02_api_express`
    `npm i nodemon cross-env -S`
    切换到对应目录：
        `npm install`
        `npm install` & `npm start`
    package.json:
        "scripts": {
            ...
            "dev": "cross-env NODE_ENV=dev nodemon ./bin/www",
            "prd": "cross-env NODE_ENV=production pm2 start ./bin/www --name api_blog_express"
        },
    `npm run dev`

app.js:
    app.use(): 中间件机制
        所有符合要求的在中间件定义的函数都会被按顺序执行
        通过 `next()` 函数串联起来
/routes/:
    blog.js:
    user.js:
        // post 可用 x-www-form-urlencoded 等格式测试
```

###### express开发接口
1. 安装插件
   `npm i -S mysql `
   `npm i -S xss `
   `npm i -S redis `
2. mysql、controller、resModel、config、utils等可复用
3. 登录：
    ```js
    `npm i -S express-session` `npm i -S connect-redis` ，可简单实现
    `req.session` 保存登录信息，登录校验做成express中间键
    app.js:
        // 引入 以上俩插件
    /middleWare/:
        // 所有的中间件存放
        loginCheck.js:
            
    ```
4. morgon写日志：
    ```js
    写自定义日志：
        console.log console.error
    pm2: 进程管理工具
        常用命令：
            pm2 start AppName [--name OtherName]、
            pm2 list [|status Id/AppName]
            pm2 stop AN/Id
            pm2 delete AN/Id
            pm2 info AN/Id
            pm2 log AN/Id
            pm2 info AN/Id
            pm2 monit AN/Id
        pm2配置：
            pm2.conf.json:
                {
                    "apps": {
                        "name": "api_blog_express",
                        "script": "./bin/www",
                        "watch": true,
                        "ignore_watch": [
                            "node_modules",
                            "logs"
                        ],
                        "instances": 2,
                        "error_file": "./logs/err.log",
                        "out_file": "./logs/out.log",
                        "log_date_format": "YYYY-MM-DD HH:mm:ss"
                    }
                }
    ```


###### 相关接口

| 描述             | 接口             | 方法 | 参数                                    | 备注                         |
| :--------------- | :--------------- | :--- | :-------------------------------------- | :--------------------------- |
| 获取博客列表     | /api/blog/list   | get  | url:author,keyword                      | 参数为空，不进行查询过滤     |
| 获取一篇博客内容 | /api/blog/detail | get  | url:id                                  |                              |
| 新增一篇博客     | /api/blog/new    | post | body:{title,content,author,create_time} | author,create_time登录后获取 |
| 更新一篇博客     | /api/blog/update | post | url:id 、 body:{title,content}          | postData中有更新内容         |
| 删除一篇博客     | /api/blog/del    | post | url:id 、 body:{author}                 | author登录后获取             |
| 登录             | /api/user/login  | post | body:{username,password}                | postData中有用户名密码       |
