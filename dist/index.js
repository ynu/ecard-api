'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var _Promise = _interopDefault(require('babel-runtime/core-js/promise'));
var _classCallCheck = _interopDefault(require('babel-runtime/helpers/classCallCheck'));
var _createClass = _interopDefault(require('babel-runtime/helpers/createClass'));
var mysql = _interopDefault(require('mysql'));
var util = _interopDefault(require('util'));

var YktManager = function () {
  function YktManager(options) {
    _classCallCheck(this, YktManager);

    this.url = options.url;
    this.connection = mysql.createConnection(this.url);
    this.connection.connect();

    this.queryDevicesSql = 'select DEVPHYID as deviceId, DEVICENAME as deviceName from t_tmp_shoppos;';
    this.queryDevicesByShopIdSql = 'select DEVPHYID as deviceId, DEVICENAME as deviceName from t_tmp_shoppos where FSHOPID="%s";';
    this.queryShopsSql = 'select distinct shopid as shopId, shopname as shopName from t_shop order by shopname;';
    this.queryShopBillSql = 'select shopname as shopName, accdate as accDate, transcnt as transCnt, dramt as drAmt, cramt as crAmt from t_shop_bill where shopname=(select shopname from t_shop where shopid="%s") and accdate="%s";';
    this.queryDeviceBillSql = 'select devicename as deviceName, ACCDATE as accDate, TRANSCNT as transCnt, DRAMT as drAmt, CRAMT as crAmt from t_shopdevice_bill where devphyid="%s" and accdate="%s";';
    this.queryTotalBillSql = 'select count(TRANSCNT) as totalTransCnt, count(DRAMT) as totalDrAmt, count(CRAMT) as totalCrAmt from t_shopdevice_bill;';
  }

  _createClass(YktManager, [{
    key: 'getShopBill',
    value: function getShopBill(shopId, accDate) {
      var _this = this;

      return new _Promise(function (resolve, reject) {
        var queryShopBillSqlBuild = util.format(_this.queryShopBillSql, shopId, accDate);
        console.info('getShopBill: Executing ' + queryShopBillSqlBuild);
        _this.connection.query(queryShopBillSqlBuild, function (err, rows) {
          if (err) {
            console.error('Error executing ' + queryShopBillSqlBuild + ', with error ' + err.stack);
            reject(err);
          }
          if (rows.length == 0) {
            console.warn('Executing ' + queryShopBillSqlBuild + ' return empty result');
            resolve(null);
          }
          var shopBill = {
            shopId: shopId,
            shopName: rows[0].shopName,
            accDate: rows[0].accDate,
            transCnt: rows[0].transCnt,
            drAmt: rows[0].drAmt,
            crAmt: rows[0].crAmt
          };
          resolve(shopBill);
        });
      });
    }
  }, {
    key: 'getDeviceBill',
    value: function getDeviceBill(deviceId, accDate) {
      var _this2 = this;

      return new _Promise(function (resolve, reject) {
        var queryDeviceBillSqlBuild = util.format(_this2.queryDeviceBillSql, deviceId, accDate);
        console.info('getDeviceBill: Executing ' + queryDeviceBillSqlBuild);
        _this2.connection.query(queryDeviceBillSqlBuild, function (err, rows) {
          if (err) {
            console.error('Error executing ' + queryDeviceBillSqlBuild + ', with error ' + err.stack);
            reject(err);
          }
          if (rows.length == 0) {
            console.warn('Executing ' + queryDeviceBillSqlBuild + ' return empty result');
            resolve(null);
          }
          var deviceBill = {
            deviceId: deviceId,
            deviceName: rows[0].deviceName,
            accDate: rows[0].accDate,
            transCnt: rows[0].transCnt,
            drAmt: rows[0].drAmt,
            crAmt: rows[0].crAmt
          };
          resolve(deviceBill);
        });
      });
    }
  }, {
    key: 'getTotalBill',
    value: function getTotalBill() {}
  }, {
    key: 'getDevices',
    value: function getDevices(shopId) {
      var _this3 = this;

      return new _Promise(function (resolve, reject) {
        var querySql = shopId ? util.format(_this3.queryDevicesByShopIdSql, shopId) : _this3.queryDevicesSql;
        console.info('getDevices: Executing ' + querySql);
        _this3.connection.query(querySql, function (err, rows) {
          if (err) {
            console.error('Error executing ' + querySql + ', with error ' + err.stack);
            reject(err);
          }
          var devices = rows.map(function (row) {
            return { deviceId: row.deviceId, deviceName: row.deviceName };
          });
          resolve(devices);
        });
      });
    }
  }, {
    key: 'getShops',
    value: function getShops() {
      var _this4 = this;

      return new _Promise(function (resolve, reject) {
        console.info('getShops: Executing ' + _this4.queryShopsSql);
        _this4.connection.query(_this4.queryShopsSql, function (err, rows) {
          if (err) {
            console.error('Error executing ' + this.queryShopsSql + ', with error ' + err.stack);
            reject(err);
          }
          var shops = rows.map(function (row) {
            return { shopId: row.shopId, shopName: row.shopName };
          });
          resolve(shops);
        });
      });
    }
  }]);

  return YktManager;
}();

/**
 * Babel Starter Kit (https://www.kriasoft.com/babel-starter-kit)
 *
 * Copyright © 2015-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

exports.YktManager = YktManager;
//# sourceMappingURL=index.js.map
