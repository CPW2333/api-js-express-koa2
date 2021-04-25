// 引入querystring 解析参数
const querystring = require('querystring')
// 引入redis连接方法
const { set, get } = require('./src/db/redis')
// 引入路由
const { handleBlogRouter } = require('./src/router/blog')
const { handleUserRouter, getCookieExpires } = require('./src/router/user')
// 引入日志功能
const { access } = require('./src/utils/log')

// 处理post请求
const getPostData = (req) => {
    const promise = new Promise((resolve, reject) => {
        // 如果不是POST请求
        if (req.method !== 'POST') {
            resolve({})
            return
        }
        // 如果不是JSON格式
        if (req.headers['content-type'] !== 'application/json') {
            resolve({})
            return 
        }
        let postData = ''
        req.on('data', chunk => {
            postData += chunk.toString()
        })
        req.on('end', () => {
            // 空数据
            if (!postData) {
                resolve({})
                return
            }
            resolve(
                JSON.parse(postData)
            )
        })
    })
    return promise
}

const serverHandle = (req, res) => {
    // 记录access log 
    access(` ${req.method} -- ${req.url} -- ${req.headers['user-agent']} -- ${Date.now()}`)
    // 返回格式设置为JSON,比较规范
    res.setHeader('Content-type', 'application/json')

    // 获取path 并追加到req属性
    const url = req.url
    req.path = url.split('?')[0] //前半部分就是接口路径

    // 解析query 后半部分是参数
    req.query = querystring.parse(url.split('?')[1])

    // 解析cookie 获取userid
    req.cookie = {}
    const cookieStr = req.headers.cookie || ''
    cookieStr.split(';').forEach(item => {
        if (!item) {
            return
        }
        const arr = item.split('=')
        const key = arr[0].trim()
        const val = arr[1].trim()
        req.cookie[key] = val
    })

    // 解析session 
    let needSetCookie = false
    let userId = req.cookie.userid
    if (!userId) {
        // cookie是空对象 需要设置一个随机userId作为sessionId
        needSetCookie = true
        userId = `${Date.now()}_${Math.floor(Math.random() * (9999 - 1000)) + 1000}`
        // 初始化 redis 中的 session 值为空对象
        set(userId, {})
    }
    // console.log('userId is:', userId); 

    // 获取 session 值
    req.sessionId = userId
    // console.log('Cookie is:', req.cookie, '&& SessionId is', req.sessionId);
    get(req.sessionId).then(sessionData => {
        if (sessionData == null) {
            // 如果redie数据库没有值
            // 初始化 redis 中的 session 值
            set(req.sessionId, null)
            // 初始化 session 值为空对象
            req.session = {}
        } else {
            // redis数据库有数据  设置 session 值
            req.session = sessionData
        }
        // console.log('从redis取出的的Session是：', req.session);
        return getPostData(req)
    }).then(postData => {
        // 处理postData 
        req.body = postData

        // 处理blog路由
        const blogResult = handleBlogRouter(req, res)
        if (blogResult) {
            blogResult.then(blogData => {
                if (needSetCookie) {
                    res.setHeader('Set-Cookie', `userid=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`)
                }
                res.end(
                    JSON.stringify(blogData)
                )
            })
            return
        }

        // 处理user路由
        const userResult = handleUserRouter(req, res)
        if (userResult) {
            userResult.then(userData => {
                if (needSetCookie) {
                    res.setHeader('Set-Cookie', `userid=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`)
                }
                res.end(
                    JSON.stringify(userData)
                )
            })
            return
        }

        // 未命中路由
        res.writeHead(404, { 'Content-type': 'text/plain' })
        res.write('404 Not Found')
        res.end()
    })
}

module.exports = {
    serverHandle,
}
// process.env.NODE_ENV
