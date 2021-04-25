const crypto = require('crypto')

// 密钥
const SECRET_KEY = 'GzOtmHD5Cb@o^rb^rNugXa'

// md5 加密 ,传入明文和密钥
function md5(content) {
    let md5 = crypto.createHash('md5')
    // 'hex'16进制的方式输出 
    return md5.update(content).digest('hex')
}

// 加密函数
function genPassword(password) {
    const str = `password=${password}&key=${SECRET_KEY}`
    return md5(str)
}

module.exports={
    genPassword
}