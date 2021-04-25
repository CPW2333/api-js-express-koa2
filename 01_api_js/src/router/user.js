// 引入controller 之后会连接数据库
const { login } = require('../controller/user')
// 引入redis数据库连接配置
const { set, } = require('../db/redis')
// 引入model 做执行结果判断
const { SuccessModel, ErrorModel } = require('../model/resModel')

// 获取、设置cookie过期时间
const getCookieExpires = () => {
    const datetime = new Date()
    datetime.setTime(datetime.getTime() + (24 * 60 * 60 * 1000))
    return datetime.toGMTString()
}

const handleUserRouter = (req, res) => {
    const method = req.method //GET POST

    // 登录博客 需要有cookie验证

    if (method === 'POST' && req.path == '/api/user/login') {
        const { username, password } = req.body
        // const { username, password } = req.query
        const result = login(username, password) 
        return result.then(data => {
            if (data.username) {
                // 如果用户名密码正确 

                // 设置session 
                req.session.username = data.username
                req.session.realname = data.realname
                // console.log('Session是：',req.session);

                // 同步session到redis
                set(req.sessionId, req.session)

                return new SuccessModel('登录成功')
            }
            return new ErrorModel('登录失败！')
        })
    }
}

module.exports = {
    handleUserRouter,
    getCookieExpires,
}