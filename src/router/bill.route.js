const Router = require('koa-router')
// 引入controller
const acBillController = require('../controller/acBill.controller')
const router = new Router({ prefix: '/account' })

// 会和 /users拼接
router.post('/createBill', acBillController.create)


// 导出
module.exports = router.routes()