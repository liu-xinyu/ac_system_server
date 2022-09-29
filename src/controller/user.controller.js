//注意 createUser是异步函数
const userService = require('../service/user.service')
class UserController {
    async register(ctx, next) {
        // 1.获取数据   注意一定传的要是JSON结构才能对request.body解构
         const { user_name, password } = ctx.request.body
        //  console.log('user_name, password: ', user_name, password);
        // 2.操作数据库 将参数传到service层 
         const res = await userService.createUser(user_name, password)
        // 3.返回给客户端
            ctx.body = {
                code: 0,
                messgae: '用户注册成功',
                user_name: res.user_name
            }
        
    }
}
// 导出实例化的对象
module.exports = new UserController()