###### koa2
express原团队打造的async/await形式的框架
```js
安装与运行：
    `npm i -g koa-generator`
    `koa2 03_api_koa2`
    切换到对应目录：
        `npm install`
        `npm install` & `npm start`
    package.json:
        "scripts": {
            ...
            "dev": "cross-env NODE_ENV=dev nodemon ./bin/www",
            "prd": "cross-env NODE_ENV=production pm2 start ./bin/www --name api_blog_koa2"
        },
    `npm run dev`
/routes/:
    blog.js:
    user.js:
```

###### koa2 开发接口
1. 安装插件
   `npm i -S mysql `
   `npm i -S xss `
   `npm i -S redis `
2. mysql、controller、resModel、config、utils等可复用
3. 登录：
    ```js
    `npm i -S koa-generic-session` `npm i -S koa-redis` ，可简单实现
    `req.session` 保存登录信息，登录校验做成express中间件
    app.js:
        // 引入 以上俩插件
    /middleWare/:
        // 所有的中间件存放
        loginCheck.js:
            
    ```
4. morgan写日志：
    ```js
    `npm i -S koa-morgan`
    写自定义日志：
        console.log console.error
        
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
