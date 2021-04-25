// 处理路径不存在 404
const createError = require('http-errors');
const express = require('express');
const path = require('path');
// 处理cookie
const cookieParser = require('cookie-parser');
// 处理日志相关的
const logger = require('morgan');
// 引入express-session
const session = require('express-session')
// 引入connect-redis,redis数据库连接配置
const redisStore = require('connect-redis')(session)
// 写日志需要
const fs = require('fs')

// 路由文件
// const indexRouter = require('./routes/index');
// const usersRouter = require('./routes/users');
const blogRouter = require('./routes/blog');
const userRouter = require('./routes/user');

const app = express();

// view engine setup 前端视图引擎的设置 可以去掉
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// 写日志
const ENV = process.env.NODE_ENV
if (ENV !== 'production') {
  app.use(logger('dev', {
    // 默认的stream
    stream: process.stdout
  }));
} else {
  const logFileName = path.join(__dirname, 'logs', 'access.log')
  const writeStream = fs.createWriteStream(logFileName, {
    flags: 'a'
  })
  app.use(logger('combined', {
    stream: writeStream
  }));
}

// 处理josn格式的postData请求 可轻松获取body信息
app.use(express.json());
// 设置postData数据可以兼容其他格式
app.use(express.urlencoded({ extended: false }));
// 解析cookie
app.use(cookieParser());

// 引入redis数据库连接配置
const redisClient = require('./db/redis')
const sessionStore = new redisStore({
  client: redisClient,
})
// 解析session
app.use(session({
  secret: 'GzOtmHD5Cb@o^rb^rNugXa',
  // 配置cookie
  cookie: {
    path: '/', //默认配置
    httpOnly: true, //默认配置
    // 设置失效时间
    maxAge: 24 * 60 * 60 * 1000
  },
  // 配置session  
  store: sessionStore,
}))
// 静态文件 可以去掉
app.use(express.static(path.join(__dirname, 'public')));

// 准备就绪 处理路由 redis session 要在注册路由之前写完
// app.use('/', indexRouter);
// app.use('/users', usersRouter);
app.use('/api/blog', blogRouter);
app.use('/api/user', userRouter);

// 中间件处理错误
// catch 404 and forward to error handler 处理路由错误
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler 程序错误抛错
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  // 参数需要与package.json 一致
  res.locals.error = req.app.get('env') === 'dev' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
