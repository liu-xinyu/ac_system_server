const router = require('koa-router')();

/**
 * koa路由模块化处理
 * 所有路由请按功能模块写在./routers文件夹中,并统一在该文件引入功能模块的路由
 */

//  业务模块1
const userModule = require('../router/bill.route');
const billModule = require('../router/user.route');


router.use(userModule)
router.use(billModule)

// Export router
module.exports = router;