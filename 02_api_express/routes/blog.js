const express = require('express');
const router = express.Router();
// 引入controller 之后会连接数据库
const {
    getBlogList,
    getBlogDetail,
    newBlog,
    updateBlog,
    deleteBlog } = require('../controller/blog')
// 引入model 做执行结果判断
const { SuccessModel, ErrorModel } = require('../model/resModel')
// 引入登录验证中间件
const loginCheck = require('../middleware/loginCheck')

// 获取博客列表
router.get('/list', async (req, res, next) => {
    let author = req.query.author || ''
    const keyword = req.query.keyword || ''
    // 管理员后台
    if (req.query.isadmin) {
        console.log('is admin')
        if (req.session.username == null) {
            console.error('is admin,but no login');
            res.json(new ErrorModel('未登录！'))
            return
        }
        // 强制使用自己的用户名
        author = req.session.username
    }

    const result = await getBlogList(author, keyword)
    // console.log('res is', result);
    res.json(new SuccessModel(result))
    // return result.then(listData => {
    //     // 返回加工处理过的promise对象，有判断码
    //     res.json(new SuccessModel(listData))
    // })
});

// 获取博客详情
router.get('/detail', (req, res, next) => {
    const result = getBlogDetail(req.query.id)
    return result.then(data => {
        res.json(new SuccessModel(data))
    })
});

// 新建博客
router.post('/new', loginCheck, (req, res, next) => {
    req.body.author = req.session.username
    const blogData = req.body
    const result = newBlog(blogData) //(req.body)
    return result.then(data => {
        res.json(new SuccessModel(data))
    })
})

// 更新博客
router.post('/update', loginCheck, (req, res, next) => {
    const blogData = req.body
    const result = updateBlog(req.query.id, blogData) //(req.body)
    return result.then(val => {
        if (val) {
            res.json(new SuccessModel())
        } else {
            res.json(new ErrorModel('更新博客失败！'))
        }
    })
})

// 删除博客
router.post('/del', loginCheck, (req, res, next) => {
    const author = req.session.username
    req.body.author = author
    const result = deleteBlog(req.query.id, author)
    return result.then(val => {
        if (val) {
            res.json(new SuccessModel())
        } else {
            res.json(new ErrorModel('更新博客失败！'))
        }
    })
})

module.exports = router;
