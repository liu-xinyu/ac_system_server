const Router = require('koa-router')
// 引入controller
const UserController = require('../controller/user.controller')
const router = new Router({ prefix: '/account' })

// 会和 /users拼接
router.post('/users', UserController.register)


// 导出
module.exports = router.routes()