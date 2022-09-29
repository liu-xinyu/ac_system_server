const acBill = require('../model/acBill.model')
class AcBillService {
    // 因为存入数据库 是异步的
    async create(money, remark ) {
        // 当我们属性名和传过来的值一致的时候可以简写
        // await表达式: 返回成功promise对象的值
        let all = await acBill.create({money, remark });
        return true;
    }
}
// 导出后 在控制器controller中使用
module.exports = new AcBillService()
