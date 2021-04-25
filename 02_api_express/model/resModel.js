class BaseModel {
    // data是对象，message是字符串
    constructor(data, message) {
        // 第一个是字符串 第二个没传 要兼容
        if (typeof data === 'string') {
            this.message = data
            data = null
            message = null
        }

        if (data) {
            this.data = data
        }

        if (message) {
            this.message = message
        }
    }
}

class SuccessModel extends BaseModel {
    constructor(data, message) {
        super(data, message)
        this.errno = 0
    }
}

class ErrorModel extends BaseModel {
    constructor(data, message) {
        super(data, message)
        this.errno = -1
    }
}

module.exports = {
    SuccessModel,
    ErrorModel,
}