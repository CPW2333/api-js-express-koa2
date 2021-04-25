###### API、路由
1. API
   ````
    前端和后端、不同端（子系统）之间对接的一个术语,包含url (路由)、输入、输出
2. 路由
    ```
    API 的一部分
    后端系统内部的一个定义

###### 假数据模拟部分
1. 原生js 需要 `npm i -D cross-env@5.2.0` 设置环境变量（兼容三系统）
2. 把服务器相关的配置放在`bin/www.js`里，
3. `npm i -D nodemon@1.18.9`，用命令 `npm run dev`执行
4. 把路由与数据分离
5. 相关的接口
   
| 描述             | 接口             | 方法 | 参数                                    | 备注                         |
| :--------------- | :--------------- | :--- | :-------------------------------------- | :--------------------------- |
| 获取博客列表     | /api/blog/list   | get  | url:author,keyword                      | 参数为空，不进行查询过滤     |
| 获取一篇博客内容 | /api/blog/detail | get  | url:id                                  |                              |
| 新增一篇博客     | /api/blog/new    | post | body:{title,content,author,create_time} | author,create_time登录后获取 |
| 更新一篇博客     | /api/blog/update | post | url:id 、 body:{title,content}          | postData中有更新内容         |
| 删除一篇博客     | /api/blog/del    | post | url:id 、 body:{author}                 | author登录后获取             |
| 登录             | /api/user/login  | post | body:{username,password}                | postData中有用户名密码       |

6. 根目录建`src`文件夹，写需要的代码
    ```js
    /bin/:
        第一层：
        www.js // 负责创建服务器的配置
    app.js:
        第二层：
        // 负责系统基本设置，如设置返回类型、分割url为path+query、判断请求类型，响应请求结果给客户端
    /src/：
        /router/
            第三层：
            // 处理路由请求、判断请求路径,解析rul的query、body参数，为下一层返回的数据作数据模型处理，增加一个 判断码，返回此数据给上一层
            blog.js
            user.js
        /controller/
            第四层：
            // 负责接收数据库返回的数据，按要求返回给上一层
            blog.js
            user.js
        /model/
            resModel.js // 改造数据，加上一个状态码判断对应操作是否成功
    ```

###### 连接MySql
1. 删除数据建议通过`status`软删除
2. `npm i mysql@2.16.0 -S`
3. `/src/`创建`/config/`
    ```js
    /src/:
        /config/:
            // 连接数据库的配置信息
            db.js
        /db/:
            第五层
            // 负责连接数据库，返回数据库结果给上一层
            mysql.js
                // 操作数据库，返回的结果是数组、对象等， 不同操作语句返回不同结果 
                // 增 ，
                OkPacket {
                    fieldCount: 0,
                    affectedRows: 1,
                    insertId: 11,
                    serverStatus: 2,
                    warningCount: 0,
                    message: '',
                    protocol41: true,
                    changedRows: 0
                }            
                // 删 ，
                OkPacket {
                    fieldCount: 0,
                    affectedRows: 1,
                    insertId: 0,
                    serverStatus: 2,
                    warningCount: 0,
                    message: '',
                    protocol41: true,
                    changedRows: 0
                }
                // 改 ，
                OkPacket {
                    fieldCount: 0,
                    affectedRows: 1,
                    insertId: 0,
                    serverStatus: 2,
                    warningCount: 0,
                    message: '(Rows matched: 1  Changed: 1  Warnings: 0',
                    protocol41: true,
                    changedRows: 1
                }
                // 查 ，
                [ 
                    RowDataPacket { 
                        username: 'zhangsan', 
                        realname: '张三' 
                    } 
                    ...
                ]
    ```

###### 登录功能
1. 核心：登录校验、登录信息存储
   ```js
   cookie: 
    存储在浏览器的一段字符串（最大5K)
    跨域不共享，请求哪个域（server）就会发对应的cookie
        登录用浏览器联调
        跨域不共享 前端和server端需要同域
    结构化数据：如k1=v1;k2=v2;...
    每次发送http请求，会将请求域的cookie一起发送给server
    server可修改并发送给cookie浏览器
    浏览器也能通过js修改cookie（有限制）：
        可在浏览器控制台请求头响应头、application、输入document.cookie、网址栏最前面查看
        document.cookie = 'userid=1;'
        document.cookie = 'k2=200;'
        ...// 追加的方式
   ```
2. cookie用于登录验证：
    ```js
    app.js:
        // 增加解析cookie的方法
    ``` 
3. session用于登录验证
    ```js
    // cookie会暴露如username等隐私信息，大小有限制
    解决方案：
        session：server存储用户信息
        cookie存储userid, server端对应username
    app.js:
        // 增加session数据
    ``` 
4. redis用于登录验证
    ```js
    // session如果是js变量，放在nodejs内存中，
    // 内存有限 访问量多会暴增内存，
    // 线上多线程、多机器运行，进程之间无法共享内存
    解决方案：
        redis: web server最常用的缓存数据库，数据在内存中
        session存进redis中
        下载安装跳过~
            先开启服务器才能从客户端连接
            `redis-server`
            `redis-cli`
        使用：
            `set myname wjjw`
            `get myname`
            `keys *`
            `del myname`
            `flushall`
    `npm i redis@2.8.0 -S`
    /db/:
        redis.js
    /router/:
        // session数据 存入redis
        user.js
    ``` 
5. 和前端联调
    ```js
    /html/:
        `npm i http-server -g`
        `http-server -p 3001 `
    nginx: 高性能web服务器
        静态服务（服务端不需要解析直接返回的）、
        负载均衡
        反向代理，让前端与后端公用一个相同端口，解决异域问题
        `start nginx` || `nginx.exe`
        /nginx.conf:
            #cpu 核心 默认1个
            #键值对不需要冒号
            worker_processes 4;
            http{
                server{
                    listen       8080;
                    server_name  localhost;
                    location / {
                        proxy_pass  http://localhost:3001;
                    }
                    location /api/ {
                        proxy_pass  http://localhost:3000;
                        proxy_set_header Host $host;
                    }
                }
            }
        `nginx -t` 测试配置是否成功
    ```

###### 日志功能  
1. 访问日志 `access log` (server端最重要的日志)
2. 自定义日志（自定义事件、错误记录等）
3. node.js 文件操作`nodejs stream`，`fs`处理大文件非常占资源
   1. 日志功能开发
   2. 日志文件拆分(`linux` 的 `crontab`命令)、日志内容分析
   3. 日志存储在文件中
    ```js
    /logs/:新增三个日志文件
    /src/utils/:(工具文件夹)
        log.js:
            // 写日志的
        copy.sh: linux来做
            // 设置定时任务：
                格式：***** command
                `crontab -e`
                `* 0 * * * * sh ..copy.sh`
        readLine.js:
            // 日志分析

    ```
###### 安全功能
1. sql注入:输入sql片段，拼接成攻击sql语句
    ```js
    /controller/:
        所有有关sql的语句，建议都加上过滤函数：
            escape= mysql.escape()
        password = escape(password)
        password=${password}
    ```
2. xss攻击:页面内容写入特殊js代码段以此获取网页信息，前后端共同负责
    ```js
    `npm i xss -S`
    /controller/:
        特殊字符进行转换，如 `&`=>`&amp`,阻止形成js代码块
            // <script>alert(document.cookie)</script>
    ```
3. 密码加密：
    ```js
    /utils/:
        cryp.js:
    /controller/:
        user.js
            // 引入加密模块
    ```
4. DDos 需要OP支持 服务云提供