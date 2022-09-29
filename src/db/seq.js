const { Sequelize } = require('sequelize')
const { MYSQL_DB, MYSQL_PWD, MYSQL_USER } = require('../config/config.default')
/**
 * database
 * username
 * password
 */
// MYSQL_DB, MYSQL_USER, MYSQL_PWD, 
const seq = new Sequelize({
    host: 'localhost',
    dialect: 'postgres',
    port: 5432,
    database: 'ac',
    username: 'postgres',
    password: 'liuxinyu'
})
// 返回值是一个promise对象
seq.authenticate().then(() => {
    console.log('数据库连接成功')
}).catch(err => {
    console.log('数据库连接失败', err)
})

module.exports = seq