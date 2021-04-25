const router = require('koa-router')()
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

router.prefix('/api/blog')

// 获取博客列表
router.get('/list', async (ctx, next) => {
    let author = ctx.query.author || ''
    const keyword = ctx.query.keyword || ''
    // 管理员后台
    if (ctx.query.isadmin) {
        console.log('is admin')
        if (ctx.session.username == null) {
            console.error('is admin,but no login');
            ctx.body = new ErrorModel('未登录！')
            return
        }
        // 强制使用自己的用户名
        author = ctx.session.username
    }

    const listData = await getBlogList(author, keyword)
    ctx.body = new SuccessModel(listData)
})

// 获取博客详情
router.get('/detail', async (ctx, next) => {
    const data =await getBlogDetail(ctx.query.id)
    ctx.body = new SuccessModel(data) 
});

// 新建博客
router.post('/new', loginCheck, async (ctx, next) => {
    const body = ctx.request.body
    body.author = ctx.session.username
    const data = await newBlog(body)
    ctx.body = new SuccessModel(data)
})

// 更新博客
router.post('/update', loginCheck, async (ctx, next) => {
    const val = await updateBlog(ctx.query.id, ctx.request.body) //(ctx.body)
    if (val) {
        ctx.body = new SuccessModel()
    } else {
        ctx.body = new ErrorModel('更新博客失败！')
    }
})

// 删除博客
router.post('/del', loginCheck, async (ctx, next) => {
    const val = await deleteBlog(ctx.query.id, ctx.session.username)
    if (val) {
        ctx.body = new SuccessModel()
    } else {
        ctx.body = new ErrorModel('更新博客失败！')
    }
})

module.exports = router