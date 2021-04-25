// 引入数据库连接配置
const { exec, escape } = require('../db/mysql')
// 引入加密函数
const {genPassword} = require('../utils/cryp')

// 用户登录 usename, password是已经从req.body解构的数据
const login = (username, password) => {
    // username = escape(username)
    // password = escape(password)

    // 加密密码
    password = genPassword(password)

    const sql = `select username,realname from myblog_users where username=${escape(username)} and password=${escape(password)};`

    return exec(sql).then(rows => {
        return rows[0] || {}
    })
}

module.exports = {
    login,
}