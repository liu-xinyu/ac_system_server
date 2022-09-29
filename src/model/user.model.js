// 解构出sequelize的DataTypes
const { DataTypes } = require('sequelize')
// 这是我们创建好的 连接数据库的
const seq = require('../db/seq')

// 创建模型   可以给表加前缀因为其自动化推断表名称，也可以让他不推断
const User = seq.define('user', {
    // id 自动创建
    user_name: {
        // 去问档查看
        type: DataTypes.STRING,
        // 约束是否为空
        allowNull: false,
        // 唯一
        // unique: true,
        comment: '用户名 唯一'
    },
    password: {
        type: DataTypes.CHAR(64),
        allowNull: false,
        comment: '密码'
    },
    is_admin: {
        // boolean 就是 tinity(1)
        type: DataTypes.INTEGER,
        defaultValue: 1,
        comment: '是否为管理员 0不是管理员'
    }
}, { freezeTableName: true, timestamps: false })
// freezeTableName=false 默认加个s
// timestamps false 不生成字段createAt updateAt
// force如果之前存在这张表 会删了重建 文档：模型重建  用过后要注释掉{ force: true }
User.sync({ force: false })

module.exports = User