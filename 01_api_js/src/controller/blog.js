// 引入数据库连接配置
const { exec, escape } = require('../db/mysql')
// 预防 xss攻击
const xss = require('xss')

// 获取博客列表 会返回一个查询结果对象
const getBlogList = (author, keyword) => {
    // author = escape(author)
    // keyword = escape(keyword)

    // 1=1 预防后面没有值 直接 order by 报错
    let sql = `select * from myblog_blogs where 1=1 `
    if (author) {
        sql += `and author = ${escape(author)} `
    }
    if (keyword) {
        // %已经自带过滤%
        sql += `and title like '%${keyword}%' `
    }
    sql += `order by create_time desc;`

    // 返回从msyql返回的promise对象给router
    return exec(sql)
}

// 获取博客详情
const getBlogDetail = (id) => {

    const sql = `select * from myblog_blogs where id = ${escape(id)}; `
    return exec(sql).then(rows => {
        return rows[0]
    })

}

// 新建博客
const newBlog = (blogData = {}) => {
    // blogData是一个博客对象，包含title、content... body传过来的
    const title = xss(blogData.title)
    const content = xss(blogData.content)
    const author = blogData.author
    const create_time = Date.now()

    // 数字可以不加引号
    const sql = `insert into myblog_blogs (title, content, author ,create_time) values (${escape(title)},${escape(content)},${escape(author)},'${create_time}');`
    return exec(sql).then(insertData => {
        // console.log(insertData);
        return {
            id: insertData.insertId
        }
    })
}

// 更新博客
const updateBlog = (id, blogData = {}) => {
    // id在url中
    const title = xss(blogData.title)
    const content = xss(blogData.content)

    const sql = `
        update myblog_blogs set title = ${escape(title)}, content = ${escape(content)} where id =${escape(id)};
    `
    return exec(sql).then(updateData => {
        // console.log(updateData);
        if (updateData.affectedRows > 0) {
            return true
        }
        return false
    })
}

// 删除博客   
const deleteBlog = (id, author) => {
    // console.log('deleteBlog blogData：',id)
    const sql = `delete from myblog_blogs where id = ${escape(id)} and author = ${escape(author)};`
    return exec(sql).then(deleteData => {
        // console.log(deleteData);
        if (deleteData.affectedRows > 0) {
            return true
        }
        return false
    })
}

module.exports = {
    getBlogList,
    getBlogDetail,
    newBlog,
    updateBlog,
    deleteBlog
}