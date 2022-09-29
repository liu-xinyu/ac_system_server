const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const secret = 'menuPath';
const uuid = require('node-uuid');
const axios = require('axios');
const onlinePath = path.join(__dirname, '../');
module.exports = {
  createDirectoryRelative: async (fileName) => {
    const createPath = path.join(onlinePath, fileName);
    // console.log(createPath);
    return mkdirsSync(createPath);
  },
  readFile: async (filePath, fileName) => {
    const absoluteFilePath = path.join(onlinePath, filePath, fileName);
    console.log('onlinePath: ', onlinePath);
    console.log('absoluteFilePath: ', absoluteFilePath);
    return new Promise((resolve, reject) => {
      fs.readFile(absoluteFilePath, 'utf-8', function (err, data) {
        if (err) {
          resolve(null);
        } else {
          resolve(data);
        }
      });
    });
  },
  createFile: async (filePath, title, content) => {
    const newFilePath = path.join(onlinePath, filePath, title);
    return new Promise((resolve, reject) => {
      fs.writeFile(newFilePath, content, function (err) {
        resolve(!err);
      });
    });
  },
}

// 递归创建目录，同步方法
function mkdirsSync(dirname) {
  if (fs.existsSync(dirname)) {
    // console.log(dirname);
    return true;
  } else {
    if (mkdirsSync(path.dirname(dirname))) {
      console.log(path.dirname(dirname));
      fs.mkdirSync(dirname);
      return true;
    }
  }
}