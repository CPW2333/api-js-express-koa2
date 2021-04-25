const crypto = require('crypto')

// 密钥
const SECRET_KEY = 'GzOtmHD5Cb@o^rb^rNugXa'

// md5 签名
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
console.log(genPassword('123456'));
module.exports = {
    genPassword
}