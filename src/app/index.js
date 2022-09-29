
const Koa = require('koa')
// const userRouter = require('../router/user.route')
const userRouter = require('./router')
const app = new Koa()
const KoaBody = require('koa-body')

// 在注册路由前注册
app.use(KoaBody())

// 必须是一个函数
app.use(userRouter.routes())
module.exports = app