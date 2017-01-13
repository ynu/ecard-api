import mysql from 'mysql';
import util from 'util';

class YktManager {
  constructor(options) {
    this.url = options.url;
    this.connection = mysql.createConnection(this.url);
    this.connection.connect();

    this.queryDevicesSql = 'select deviceid as deviceId, devicename as deviceName from t_device;';
    this.queryDevicesByShopIdSql = 'select deviceid as deviceId, devicename as deviceName from t_shopdevice where fshopid="%s";';
    this.queryShopsSql = 'select distinct shopid as shopId, shopname as shopName from t_shop order by shopname;';
    this.queryShopBillSql = 'select shopid as shopId, shopname as shopName, accdate as accDate, transcnt as transCnt, dramt as drAmt, cramt as crAmt from t_shop_bill where shopid="%s" and accdate="%s";';
    this.queryDeviceBillSql = 'select deviceid as deviceId, devicename as deviceName, ACCDATE as accDate, TRANSCNT as transCnt, DRAMT as drAmt, CRAMT as crAmt from t_shopdevice_bill where deviceid="%s" and accdate="%s";';
    this.queryTotalBillSql = 'select count(transcnt) as totalTransCnt, count(dramt) as totalDrAmt, count(cramt) as totalCrAmt from t_shopdevice_bill;';
    this.queryTotalShopBillsSql = 'select shopid as shopId, shopname as shopName, transcnt as transCnt, dramt as drAmt, cramt as crAmt, accdate as accDate from t_shop_bill where accDate="%s";';
    this.queryTotalShopBillsByFShopIdSql = 'select shopid as shopId, shopname as shopName, transcnt as transCnt, dramt as drAmt, cramt as crAmt, accdate as accDate from t_shop_bill where accDate="%s" and fshopid="%s";';
    this.queryDeviceBillsByShopIdSql = 'select deviceid as deviceId, devicename as deviceName, transcnt as transCnt, dramt as drAmt, cramt as crAmt, accdate as accDate from t_shopdevice_bill where accdate="%s" and shopid="%s";';
  }
  getShopBill(shopId, accDate) {
    return new Promise((resolve, reject) => {
      const queryShopBillSqlBuild = util.format(this.queryShopBillSql, shopId, accDate);
      console.info(`getShopBill: Executing ${queryShopBillSqlBuild}\n`);
      this.connection.query(queryShopBillSqlBuild, (err, rows) => {
        if(err) {
          console.error(`Error executing ${queryShopBillSqlBuild}, with error ${err.stack}\n`);
          reject(err);
          return;
        }
        if(rows.length == 0) {
          console.warn(`Executing ${queryShopBillSqlBuild} return empty result\n`);
          resolve(null);
          return;
        }
        const shopBill = {
          shopId: rows[0].shopId,
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
  getDeviceBill(deviceId, accDate) {
    return new Promise((resolve, reject) => {
      const queryDeviceBillSqlBuild = util.format(this.queryDeviceBillSql, deviceId, accDate);
      console.info(`getDeviceBill: Executing ${queryDeviceBillSqlBuild}\n`);
      this.connection.query(queryDeviceBillSqlBuild, (err, rows) => {
        if(err) {
          console.error(`Error executing ${queryDeviceBillSqlBuild}, with error ${err.stack}\n`);
          reject(err);
          return;
        }
        if(rows.length == 0) {
          console.warn(`Executing ${queryDeviceBillSqlBuild} return empty result\n`);
          resolve(null);
          return;
        }
        const deviceBill = {
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
  getTotalBill() {

  }
  getShopBills(fShopId, accDate) {
    // 如果fShopId为null或undefined则全部获取
    return new Promise((resolve, reject) => {
      const querySql = fShopId ? util.format(this.queryTotalShopBillsByFShopIdSql, accDate, fShopId) : util.format(this.queryTotalShopBillsSql, accDate);
      console.info(`getDevices: Executing ${querySql}\n`);
      this.connection.query(querySql, (err, rows) => {
        if(err) {
          console.error(`Error executing ${querySql}, with error ${err.stack}\n`);
          reject(err);
          return;
        }
        if(rows.length == 0) {
          console.warn(`Executing ${querySql} return empty result\n`);
          resolve(null);
          return;
        }
        const shopBills = rows.map(row => {
          return {
            shopId: row.shopId,
            shopName: row.shopName,
            accDate: row.accDate,
            transCnt: row.transCnt,
            drAmt: row.drAmt,
            crAmt: row.crAmt
          };
        });
        resolve(shopBills);
      });
    });
  }
  getDeviceBills(shopId, accDate) {
    return new Promise((resolve, reject) => {
      const queryDeviceBillsByShopIdSqlBuild = util.format(this.queryDeviceBillsByShopIdSql, accDate, shopId);
      console.info(`getDeviceBill: Executing ${queryDeviceBillsByShopIdSqlBuild}\n`);
      this.connection.query(queryDeviceBillsByShopIdSqlBuild, (err, rows) => {
        if(err) {
          console.error(`Error executing ${queryDeviceBillsByShopIdSqlBuild}, with error ${err.stack}\n`);
          reject(err);
          return;
        }
        if(rows.length == 0) {
          console.warn(`Executing ${queryDeviceBillsByShopIdSqlBuild} return empty result\n`);
          resolve(null);
          return;
        }
        const deviceBills = rows.map(row => {
          return {
            deviceId: row.deviceId,
            deviceName: row.deviceName,
            accDate: row.accDate,
            transCnt: row.transCnt,
            drAmt: row.drAmt,
            crAmt: row.crAmt
          };
        });
        resolve(deviceBills);
      });
    });
  }
  getDevices(shopId) {
    return new Promise((resolve, reject) => {
      const querySql = shopId ? util.format(this.queryDevicesByShopIdSql, shopId) : this.queryDevicesSql;
      console.info(`getDevices: Executing ${querySql}\n`);
      this.connection.query(querySql, (err, rows) => {
        if(err) {
          console.error(`Error executing ${querySql}, with error ${err.stack}\n`);
          reject(err);
          return;
        }
        if(rows.length == 0) {
          console.warn(`Executing ${querySql} return empty result\n`);
          resolve(null);
          return;
        }
        const devices = rows.map(row => {
          return {deviceId: row.deviceId, deviceName: row.deviceName};
        });
        resolve(devices);
      });
    });
  }
  getShops() {
    return new Promise((resolve, reject) => {
      console.info(`getShops: Executing ${this.queryShopsSql}\n`);
      this.connection.query(this.queryShopsSql, (err, rows) => {
        if(err) {
          console.error(`Error executing ${this.queryShopsSql}, with error ${err.stack}\n`);
          reject(err);
          return;
        }
        if(rows.length == 0) {
          console.warn(`Executing ${queryShopsSql} return empty result\n`);
          resolve(null);
          return;
        }
        const shops = rows.map(row => {
          return {shopId: row.shopId, shopName: row.shopName};
        });
        resolve(shops);
      });
    });
  }
}

export default YktManager;
