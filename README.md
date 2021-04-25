### Node-Blog

基于 ES6 / Node.js 原生开发 Web server 博客，并使用 Express / Koa 等框架进行重构，使用 Nginx 做反向代理。主要有登录、安全、日志等方面内容。

### 主要分为下面三个部分

- `node-blog`
- `node-express-blog`
- `node-koa2-blog`

### 实现的功能
- 开发路由
- 数据库 MySQL
- 登录
- nginx
- 日志
- 安全（防sql注入、xss攻击）
- Express
- Koa2
- 中间件原理

### 项目突出后端 前端非自己实现

### 相关接口
- 接口基准地址：(**可能会变**)
  - `https://wjdywk.ml:4568` (生产环境)

| 描述             | 接口             | 方法 | 参数                                    | 备注                         |
| :--------------- | :--------------- | :--- | :-------------------------------------- | :--------------------------- |
| 获取博客列表     | /api/blog/list   | get  | url:author,keyword                      | 参数为空，不进行查询过滤     |
| 获取一篇博客内容 | /api/blog/detail | get  | url:id                                  |                              |
| 新增一篇博客     | /api/blog/new    | post | body:{title,content,author,create_time} | author,create_time登录后获取 |
| 更新一篇博客     | /api/blog/update | post | url:id 、 body:{title,content}          | postData中有更新内容         |
| 删除一篇博客     | /api/blog/del    | post | url:id 、 body:{author}                 | author登录后获取             |
| 登录             | /api/user/login  | post | body:{username,password}                | postData中有用户名密码       |