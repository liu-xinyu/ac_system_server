var DataTypes = require("sequelize").DataTypes;
var _ac_pay = require("./ac_pay");

function initModels(sequelize) {
  var ac_pay = _ac_pay(sequelize, DataTypes);


  return {
    ac_pay,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
