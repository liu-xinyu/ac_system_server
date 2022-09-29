// 解构出sequelize的DataTypes
const { DataTypes } = require('sequelize')
// 这是我们创建好的 连接数据库的
const seq = require('../db/seq')

// 创建模型   可以给表加前缀因为其自动化推断表名称，也可以让他不推断
const acBill = seq.define('ac_bill', {
  status: {
    type: DataTypes.INTEGER,
    defaultValue:1
    // allowNull: false,
    // defaultValue: 1
  },
  create_time: {
    type: DataTypes.DATE,
    defaultValue:new Date()
    // allowNull: false
  },
  update_time: {
    type: DataTypes.DATE,
    defaultValue:new Date()
    // allowNull: false
  },
  remark: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: "备注"
  },
  money: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: "金额"
  },
  is_add_budget:{
    type: DataTypes.INTEGER,
    defaultValue:0
  },
  is_add_statistics:{
    type: DataTypes.INTEGER,
    defaultValue:0
  }
}, { freezeTableName: true, timestamps: false })
acBill.sync({ force: false })
module.exports = acBill