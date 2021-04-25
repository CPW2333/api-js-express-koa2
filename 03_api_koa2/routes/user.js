const router = require('koa-router')()
// 引入controller 之后会连接数据库
const { login } = require('../controller/user')
// 引入model 做执行结果判断
const { SuccessModel, ErrorModel } = require('../model/resModel')

router.prefix('/api/user/')

router.post('/login', async (ctx, next) => {
    const { username, password } = ctx.request.body
    const data = await login(username, password)
    if (data.username) {
        // 如果用户名密码正确  

        // 设置session 
        ctx.session.username = data.username
        ctx.session.realname = data.realname

        ctx.body = new SuccessModel('登录成功')
        return
    }
    ctx.body = new ErrorModel('登录失败！')
})


module.exports = router