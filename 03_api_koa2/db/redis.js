// 引入数据库
const redis = require('redis')
// 引入数据库配置文件
const { REDIS_CONF } = require('../config/db')

// 创建客户端
const redisClient = redis.createClient(REDIS_CONF.port, REDIS_CONF.host)
redisClient.on('error', err => {
    console.log(err);
})


module.exports = redisClient
