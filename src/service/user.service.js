const User = require('../model/user.model')
const acTag = require('../model/acTag.model')
class UserService {
    // 因为存入数据库 是异步的
    async createUser(user_name, password) {
        // 当我们属性名和传过来的值一致的时候可以简写
        // await表达式: 返回成功promise对象的值
        await User.create({ user_name, password });
        // let res = await acTag.findAll()
        // console.log('acTag: ', acTag);
        // console.log(res);
        // console.log('res: ', res);
        //    返回到controller
        return true;
    }
}
// 导出后 在控制器controller中使用
module.exports = new UserService()
