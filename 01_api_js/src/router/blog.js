// 引入controller 之后会连接数据库
const {
    getBlogList,
    getBlogDetail,
    newBlog,
    updateBlog,
    deleteBlog } = require('../controller/blog')

// 引入model 做执行结果判断
const { SuccessModel, ErrorModel } = require('../model/resModel')

// 统一的登录验证函数
const loginCheck = (req) => {
    if (!req.session.username) {
        // 未定义说明是未登录状态
        return Promise.resolve(
            new ErrorModel('尚未登录!')
        )
    }
    // 登录返回undefined
}

const handleBlogRouter = (req, res,) => {
    const method = req.method //GET POST
    const id = req.query.id || ''
    
    // 获取博客列表
    if (method === 'GET' && req.path == '/api/blog/list') {
        let author = req.query.author || ''
        const keyword = req.query.keyword || ''
        // 管理员后台
        if (req.query.isadmin) {
            const loginCheckResult = loginCheck(req)
            if (loginCheckResult) { 
                return loginCheckResult
            }
            // 强制使用自己的用户名
            author = req.session.username
        }

        // console.log('author is', author);
        const result = getBlogList(author, keyword)
        return result.then(listData => {
            // 返回加工处理过的promise对象，有判断码
            return new SuccessModel(listData)
        })
    }
    // 获取一篇博客内容
    if (method === 'GET' && req.path == '/api/blog/detail') {
        // const data = getBlogDetail(id)
        // return new SuccessModel(data)
        const result = getBlogDetail(id)
        return result.then(data => {
            return new SuccessModel(data)
        })
    }
    // 新增一篇博客
    if (method === 'POST' && req.path == '/api/blog/new') {
        const loginCheckResult = loginCheck(req)
        if (loginCheckResult) {
            // 有数据说明未登录
            // return 未登录信息
            return loginCheckResult
        }

        req.body.author = req.session.username
        const blogData = req.body
        const result = newBlog(blogData) //(req.body)
        return result.then(data => {
            return new SuccessModel(data)
        })
    }
    // 更新一篇博客
    if (method === 'POST' && req.path == '/api/blog/update') {
        const loginCheckResult = loginCheck(req)
        if (loginCheckResult) {
            // 有数据说明未登录
            // return
            return loginCheckResult
        }

        const blogData = req.body
        const result = updateBlog(id, blogData) //(req.body)
        return result.then(val => {
            if (val) {
                return new SuccessModel()
            } else {
                return new ErrorModel('更新博客失败！')
            }
        })
    }  
    // 删除一篇博客
    if (method === 'POST' && req.path == '/api/blog/del') {
        const loginCheckResult = loginCheck(req)
        if (loginCheckResult) {
            // 有数据说明未登录
            // return
            return loginCheckResult
        }

        const author = req.session.username
        req.body.author = author
        const result = deleteBlog(id, author)
        return result.then(val => {
            if (val) {
                return new SuccessModel()
            } else {
                return new ErrorModel('删除博客失败！')
            }
        })
    }

}

module.exports = {
    handleBlogRouter,
}