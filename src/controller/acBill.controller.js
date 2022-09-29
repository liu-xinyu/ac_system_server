//注意 createUser是异步函数
const BillService = require('../service/acBill.service')
const statusCode = require('../utils/status-code')
class BillController {
    async create(ctx, next) {
        // 1.获取数据   注意一定传的要是JSON结构才能对request.body解构
         const { money, remark } = ctx.request.body
         console.log('money, remark: ', money, remark);
        // 2.操作数据库 将参数传到service层 
         await BillService.create(money, remark )
        // 3.返回给客户端
            ctx.body = statusCode.SUCCESS_200('记账成功')
        
    }
}
// 导出实例化的对象
module.exports = new BillController()