const fileUtils = require('./file-utils');
const dbConfig = require('../config/config.default.js');
// console.log('dbConfig: ', dbConfig);
const pg = require('pg');
const conStr = `postgres://${dbConfig.MYSQL_USER}:${dbConfig.MYSQL_PWD}@${dbConfig.MYSQL_HOST}:${dbConfig.MYSQL_PORT}/${dbConfig.MYSQL_DB}`;

console.log('conStr: ', conStr);
async function gen(tableName) {
    const client = new pg.Client(conStr);
    const showTable = `SELECT table_name as tableName, column_name as columnName, column_default as columnDefault, is_nullable as isNullable, udt_name as udtName
FROM information_schema.columns WHERE table_schema = 'public' AND table_name = '${tableName}'`;

    const tableColumnList = await pgSqlOne(client, showTable);

    console.log('tableColumnList: ', tableColumnList);
    const templeMap = new Map();
    const modelsList = {};
    //     // 解析表结构
    handelTableColumn(tableColumnList, templeMap, modelsList);
    console.log('templeMap, modelsList: ', templeMap, modelsList);
    // 异步生成文件
    // 生成models文件
    createFileModels('/app/models/', templeMap, modelsList);
    // // 生成dao文件
    createFileCommon('/app/dao/', 'template-dao.txt', templeMap, modelsList);
    // // 生成service文件
    createFileCommon('/app/service/', 'template-service.txt', templeMap, modelsList);
    // // 生成controller文件
    createFileCommon('/app/controller/', 'template-controller.txt', templeMap, modelsList);

}
/**
 * 解析表结构的数组语句，
 * @param tableColumnList
 * @param templeMap
 * @param modelsList
 */
function handelTableColumn(tableColumnList, templeMap, modelsList) {
    // 获取每一行的数据
    for (let j = 0, len = tableColumnList.length; j < len; j++) {
        const rowInfo = tableColumnList[j];
        if (j === 0) {
            // 第一行，获取表名称
            templeMap.set('tableName', rowInfo.tablename);
            templeMap.set('fileName', toConnectingLine(rowInfo.tablename));
            templeMap.set('objectName', camelCase(rowInfo.tablename));
            templeMap.set('className', firstUpperCase(camelCase(rowInfo.tablename)));
            templeMap.set('routerName', toItalicLine(rowInfo.tablename));
        }
        const attributes = {};
        // 获取类型
        if (rowInfo.udtname.includes('_int')) {
            attributes.type = 'DataTypes.ARRAY(DataTypes.INTEGER)';
        } else if (rowInfo.udtname.includes('int')) {
            attributes.type = 'DataTypes.INTEGER()';
        } else if (rowInfo.udtname.includes('_varchar')) {
            attributes.type = 'DataTypes.ARRAY(DataTypes.STRING)';
        } else if (rowInfo.udtname.includes('varchar') || rowInfo.udtname.includes('text')) {
            attributes.type = 'DataTypes.STRING()';
        } else if (rowInfo.udtname.includes('timestamp')) {
            attributes.type = 'DataTypes.DATE()';
        } else if (rowInfo.udtname.includes('jsonb')) {
            attributes.type = 'DataTypes.JSONB()';
        } else if (rowInfo.udtname.includes('json')) {
            attributes.type = 'DataTypes.JSON()';
        } else {
            attributes.type = 'DataTypes.STRING()';
        }
        // 封装默认值
        attributes.allowNull = rowInfo.isnullable === 'YES';
        // 封装默认值
        if (rowInfo.columndefault !== null && rowInfo.columndefault.includes('nextval') && rowInfo.columndefault.includes('id_seq')) {
            // 表示为主键
            attributes.primaryKey = true;
            attributes.autoIncrement = true;
        } else if (rowInfo.columndefault !== null) {
            attributes.defaultValue = rowInfo.columndefault;
        }

        if (rowInfo.columnname === 'create_time' || rowInfo.columnname === 'update_time') {
            attributes.defaultValue = 'sequelize.literal("CURRENT_TIMESTAMP")';
        }
        attributes.field = rowInfo.columnname;
        modelsList[camelCase(rowInfo.columnname)] = attributes;

    }
}

// 执行一条sql语句
function pgSqlOne(client, sql) {
    return new Promise((resolve, reject) => {
        console.log(1);
        client.connect(function (err) {
            if (err) {
                return console.error('could not connect to postgres', err);
            }
            client.query(sql, [], function (isErr, rst) {
                console.info('33当前指定sql语句为：', sql);
                if (isErr) {
                    console.error('44sql执行失败:' + isErr.message);
                    resolve(isErr);
                } else {
                    console.info('55sql执行成功, data is: ' + rst);
                    resolve(rst.rows);
                }
                client.end();
            });
        });
    });
}
/**
 * 替换通用的参数
 * @param path
 * @param templeFileName
 * @param templeMap
 * @param modelsList
 * @returns {Promise<void>}
 */
async function createFileCommon(path, templeFileName, templeMap, modelsList) {
    const dirBool = await fileUtils.createDirectoryRelative(path);
    console.info(templeMap.get('fileName') + '.js' + '-创建【文件夹】是否成功：' + dirBool);
    // 读取模板文件
    let fileContent = await fileUtils.readFile('/utils/template-file', templeFileName);
    fileContent = fileContent.replace(/\${className}/g, templeMap.get('className'));
    fileContent = fileContent.replace(/\${fileName}/g, templeMap.get('fileName'));
    fileContent = fileContent.replace(/\${routerName}/g, templeMap.get('routerName'));
    fileContent = fileContent.replace(/\${objectName}/g, templeMap.get('objectName'));
    // 创建文件
    const createFileBool = await fileUtils.createFile(path, templeMap.get('fileName') + '.js', fileContent);
    console.info(templeMap.get('fileName') + '.js' + '-创建DAO文件是否成功：' + createFileBool);
}
/**
 * 生成models文件
 * @param path
 * @param templeMap
 * @param modelsList
 * @returns {Promise<void>}
 */
async function createFileModels(path, templeMap, modelsList) {
    // 创建文件夹
    const dirBool = await fileUtils.createDirectoryRelative(path);
    console.info('创建Models【文件夹】是否成功：' + dirBool);
    // 读取模板文件
    let fileContent = await fileUtils.readFile('/utils/template-file', 'template-models.txt');
    console.log('1212---fileContent: ', fileContent);
    fileContent = fileContent.replace(/\${tableName}/g, templeMap.get('tableName'));
    fileContent = fileContent.replace(/\${className}/g, templeMap.get('className'));
    fileContent = fileContent.replace(/\${objectName}/g, templeMap.get('objectName'));
    let attributes = '{\n';
    for (const key in modelsList) {
        // console.info(key)
        attributes += `\t\t${key}: {\n`;
        const arrtObj = modelsList[key];
        for (const attrKey in arrtObj) {
            // console.info('\t'+arrtObj[attrKey])
            attributes += `\t\t\t${attrKey}: ${attrKey === 'field' ? '\'' + arrtObj[attrKey] + '\'' : arrtObj[attrKey]},\n`;
        }
        attributes = attributes.substr(0, attributes.length - 2) + '\n\t\t},\n';
    }
    attributes = attributes.substr(0, attributes.length - 2) + '\n\t}';
    fileContent = fileContent.replace(/\${attributes}/g, attributes);
    // 创建文件
    const createFileBool = await fileUtils.createFile(path, templeMap.get('fileName') + '.js', fileContent);
    console.info(templeMap.get('fileName') + '.js' + '-创建Models文件是否成功：' + createFileBool);

}
// 下划线转驼峰格式的数据
function camelCase(str) {
    return str.replace(/([^_])(?:_+([^_]))/g, function ($0, $1, $2) {
        return $1 + $2.toUpperCase();
    });
}
// 下划线转连接线
function toConnectingLine(str) {
    return str.replace(/([^_])(?:_+([^_]))/g, function ($0, $1, $2) {
        return $1 + '-' + $2;
    });
}
// 下划线转斜杠
function toItalicLine(str) {
    return str.replace(/([^_])(?:_+([^_]))/g, function ($0, $1, $2) {
        return $1 + '/' + $2;
    });
}
// 首字母大写
function firstUpperCase(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
// 去除字符串两边的引号
function deleteQuo(str) {
    return str.replace(/\"/g, '');
}