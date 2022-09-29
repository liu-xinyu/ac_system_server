// 解构出sequelize的DataTypes
const { DataTypes } = require('sequelize')
// 这是我们创建好的 连接数据库的
const seq = require('../db/seq')

// 创建模型   可以给表加前缀因为其自动化推断表名称，也可以让他不推断
const acTag = seq.define('ac_tag', {
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      // defaultValue: 1
    },
    create_time: {
      type: DataTypes.DATE,
      allowNull: false
    },
    update_time: {
      type: DataTypes.DATE,
      allowNull: false
    },
    tag_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: "标签名称"
    },
    belong_book_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "账本id"
    },
    is_add_budget: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      comment: "是否加入预算"
    },
    is_add_statistics: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      comment: "是否加入统计"
    },
    text_color: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    bg_color: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
},{ freezeTableName: true, timestamps: false })
// force如果之前存在这张表 会删了重建 文档：模型重建  用过后要注释掉
// acTag.sync({ force: true })
acTag.sync({ force: false })
module.exports = acTag
