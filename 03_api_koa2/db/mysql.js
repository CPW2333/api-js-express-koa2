// 引入数据库
const mysql = require('mysql')
// 引入数据库配置文件
const { MYSQL_CONF } = require('../config/db')

/* 传统连接方式 */ 
// 1.创建连接对象
const con = mysql.createConnection(MYSQL_CONF)
// 2.开始连接 可以不在此处关闭连接
con.connect()

// 统一执行sql的函数 会返回一个带结果的promise对象
function exec(sql) {
    // 返回promise对象给controller
    return new Promise((resolve, reject) => {
        con.query(sql, (err, result) => {
            // console.log(err,'####',result,'####');
            if (err) {
                reject(err) 
                return
            }
            // console.log(result)
            resolve(result)
        })
        // 释放连接
        // con.end()
    })
}

module.exports = {
    exec,
    escape: mysql.escape,
}