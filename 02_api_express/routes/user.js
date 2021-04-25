const express = require('express');
const router = express.Router();
// 引入controller 之后会连接数据库
const { login } = require('../controller/user')
// 引入model 做执行结果判断
const { SuccessModel, ErrorModel } = require('../model/resModel')

// 登录
router.post('/login', function (req, res, next) {
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

            res.json(new SuccessModel('登录成功'))
            return 
        }
        res.json(new ErrorModel('登录失败！'))
    })
});

module.exports = router;
