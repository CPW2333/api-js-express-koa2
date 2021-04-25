const fs = require('fs')
const path = require('path')


// 往文件生成 write Stream（stream对象）
function createWriteStream(fileName) {
    const fullFileName = path.join(__dirname, '../', '../', 'logs', fileName)
    const writeStream = fs.createWriteStream(fullFileName, {
        // 末尾追加的方式
        flags: 'a'
    })
    return writeStream
}

// 写日志（log内容、格式）
function writeLog(writeStream, log) {
    // 用 log + '\n' 的方式把stream写成日志
    writeStream.write(log + '\n')
}  

// 写访问日志：stream对象+书写方式
const accessWriteStream = createWriteStream('access.log')
function access(log) {
    // log是自定义的写日志的格式
    writeLog(accessWriteStream,log)    
}  

module.exports = {
    access,
}