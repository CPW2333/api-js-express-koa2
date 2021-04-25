const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
// 错误处理
const onerror = require('koa-onerror')
// 处理postData的
const bodyparser = require('koa-bodyparser')
// 处理日志
const logger = require('koa-logger')
// 引入session、redis
const session = require('koa-generic-session')
const redisStore = require('koa-redis')
// 写日志需要
const fs = require('fs')
const path = require('path')
const morgan = require('koa-morgan')

// 引用路由
const index = require('./routes/index')
const users = require('./routes/users')
const blog = require('./routes/blog')
const user = require('./routes/user')

// 引入数据库配置
const { REDIS_CONF } = require('./config/db')
// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  // 接收body的不同格式
  enableTypes: ['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// 写日志
const ENV = process.env.NODE_ENV
if (ENV !== 'production') {
  app.use(morgan('dev', {
    // 默认的stream
    stream: process.stdout
  }));
} else {
  const logFileName = path.join(__dirname, 'logs', 'access.log')
  const writeStream = fs.createWriteStream(logFileName, {
    flags: 'a'
  })
  app.use(morgan('combined', {
    stream: writeStream
  }));
}

// redis session 要在注册路由之前写完
app.keys = ['GzOtmHD5Cb@o^rb^rNugXa']
app.use(session({
  // 配置cookie
  cookie: {
    path: '/', //默认配置
    httpOnly: true, //默认配置
    // 设置失效时间
    maxAge: 24 * 60 * 60 * 1000
  },
  // 配置session
  store: redisStore({
    // all: '127.0.0.1:6379',// 先写死
    all: `${REDIS_CONF.host}:${REDIS_CONF.port}`
  }),
}))


// routes
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())
app.use(blog.routes(), blog.allowedMethods())
app.use(user.routes(), user.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
