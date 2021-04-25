// 环境变量
const env = process.env.NODE_ENV
// 数据库配置
let MYSQL_CONF
let REDIS_CONF

if (env === 'dev') {
    MYSQL_CONF = {
            host: 'localhost',
            port: '3306',
            user: '自己的数据库用户名',
            password: '自己的数据库密码',
            database: '自己的数据库名字'
        },
        REDIS_CONF = {
            port: '6379',
            host: 'localhost',
        }
}

if (env === 'production') {
    MYSQL_CONF = {
            host: 'localhost',
            port: '3306',
            user: '自己的数据库用户名',
            password: '自己的数据库密码',
            database: '自己的数据库名字'
        },
        REDIS_CONF = {
            port: '6379',
            host: 'localhost',
        }
}

module.exports = {
    MYSQL_CONF,
    REDIS_CONF
}