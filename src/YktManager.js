import mysql from 'mysql';
import util from 'util';
import debug from 'debug';

const error = debug('ecard-api:error');
const info = debug('ecard-api:info');

class YktManager {
  constructor(options) {
    this.pool = mysql.createPool({
      connectionLimit: options.connectionLimit,
      host: options.host,
      user: options.user,
      password: options.password,
      database: options.database,
    });

    this.queryDevicesSql = 'select deviceid as deviceId, devicename as deviceName, fdeviceid as fDeviceId, devphyid as devPhyId, deviceno as deviceNo, devphytype as devPhyType, devtypecode as devTypeCode, devverno as devVerNo, status as status from t_device;';
    // this.queryDevicesByShopIdSql = 'select deviceid as deviceId, devicename as deviceName, id as id, areacode as areaCode, level_jb as levelJb, fshopid as fShopId, shopid as shopId, accno as accNo, shopfullname as shopFullName, shopname as shopName, shop_status as shopStatus, shoptype as shopType, accflag as accFlag, deviceno as deviceNo, devphyid as devPhyId, devtypecode as devTypeCode, device_status as deviceStatus from t_shopdevice where fshopid=%s;';
    this.queryDevicesByShopIdSql = 'select deviceid as deviceId, devicename as deviceName, fdeviceid as fDeviceId, devphyid as devPhyId, deviceno as deviceNo, devphytype as devPhyType, devtypecode as devTypeCode, devverno as devVerNo, status as status from t_device where deviceid in (select distinct deviceid from t_shopdevice where fshopid=%s);';
    this.queryShopsSql = 'select shopid as shopId, shopname as shopName, fshopid as fShopId, areacode as areaCode, shoptype as shopType, accflag as accFlag, status as status, accno as accNo from t_shop order by shopname;';
    this.queryShopByIdSql = 'select shopid as shopId, shopname as shopName, fshopid as fShopId, areacode as areaCode, shoptype as shopType, accflag as accFlag, status as status, accno as accNo from t_shop where shopid=%s;';
    this.queryShopBillSql = 'select shopid as shopId, shopname as shopName, accdate as accDate, transcnt as transCnt, dramt as drAmt, cramt as crAmt, level1 as level1, fshopid as fShopId, shopname2 as shopName2 from t_shop_bill where shopid=%s and accdate=%s;';
    this.queryDeviceBillSql = 'select deviceid as deviceId, devicename as deviceName, accdate as accDate, transcnt as transCnt, dramt as drAmt, cramt as crAmt, fshopid as fShopId, shopid as shopId, accno as accNo, shopname as shopName, deviceno as deviceNo, devphyid as devPyhId from t_shopdevice_bill where deviceid=%s and accdate=%s;';
    this.queryTotalBillSql = 'select count(transcnt) as totalTransCnt, count(dramt) as totalDrAmt, count(cramt) as totalCrAmt from t_shopdevice_bill;';
    this.queryTotalShopBillsSql = 'select shopid as shopId, shopname as shopName, accdate as accDate, transcnt as transCnt, dramt as drAmt, cramt as crAmt, level1 as level1, fshopid as fShopId, shopname2 as shopName2 from t_shop_bill where accDate=%s;';
    this.queryTotalShopBillsByFShopIdSql = 'select shopid as shopId, shopname as shopName, accdate as accDate, transcnt as transCnt, dramt as drAmt, cramt as crAmt, level1 as level1, fshopid as fShopId, shopname2 as shopName2 from t_shop_bill where accDate=%s and fshopid=%s;';
    this.queryDeviceBillsByShopIdSql = 'select deviceid as deviceId, devicename as deviceName, accdate as accDate, transcnt as transCnt, dramt as drAmt, cramt as crAmt, fshopid as fShopId, shopid as shopId, accno as accNo, shopname as shopName, deviceno as deviceNo, devphyid as devPyhId from t_shopdevice_bill where accdate=%s and shopid=%s;';
  }
  getShopBill(shopId, accDate) {
    return new Promise((resolve, reject) => {
      const queryShopBillSqlBuild = util.format(
        this.queryShopBillSql,
        this.pool.escape(shopId),
        this.pool.escape(accDate)
      );
      info(`getShopBill: Executing ${queryShopBillSqlBuild}\n`);
      this.pool.query(queryShopBillSqlBuild, (err, rows) => {
        if (err) {
          error(`Error executing ${queryShopBillSqlBuild}, with error ${err.stack}\n`);
          reject(err);
          return;
        }
        if (rows.length === 0) {
          info(`Executing ${queryShopBillSqlBuild} return empty result\n`);
          resolve(null);
          return;
        }
        const shopBill = {
          shopId: rows[0].shopId,
          shopName: rows[0].shopName,
          accDate: rows[0].accDate,
          transCnt: rows[0].transCnt,
          drAmt: rows[0].drAmt,
          crAmt: rows[0].crAmt,
          level1: rows[0].level1,
          fShopId: rows[0].fShopId,
          shopName2: rows[0].shopName2,
        };
        resolve(shopBill);
      });
    });
  }
  getDeviceBill(deviceId, accDate) {
    return new Promise((resolve, reject) => {
      const queryDeviceBillSqlBuild = util.format(
        this.queryDeviceBillSql,
        this.pool.escape(deviceId),
        this.pool.escape(accDate)
      );
      info(`getDeviceBill: Executing ${queryDeviceBillSqlBuild}\n`);
      this.pool.query(queryDeviceBillSqlBuild, (err, rows) => {
        if (err) {
          error(`Error executing ${queryDeviceBillSqlBuild}, with error ${err.stack}\n`);
          reject(err);
          return;
        }
        if (rows.length === 0) {
          info(`Executing ${queryDeviceBillSqlBuild} return empty result\n`);
          resolve(null);
          return;
        }
        const deviceBill = {
          deviceId: rows[0].deviceId,
          deviceName: rows[0].deviceName,
          accDate: rows[0].accDate,
          transCnt: rows[0].transCnt,
          drAmt: rows[0].drAmt,
          crAmt: rows[0].crAmt,
          fShopId: rows[0].fShopId,
          shopId: rows[0].shopId,
          accNo: rows[0].accNo,
          shopName: rows[0].shopName,
          deviceNo: rows[0].deviceNo,
          devPyhId: rows[0].devPyhId,
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
      const querySql = fShopId ? util.format(this.queryTotalShopBillsByFShopIdSql, this.pool.escape(accDate), this.pool.escape(fShopId)) : util.format(this.queryTotalShopBillsSql, this.pool.escape(accDate));
      info(`getDevices: Executing ${querySql}\n`);
      this.pool.query(querySql, (err, rows) => {
        if (err) {
          error(`Error executing ${querySql}, with error ${err.stack}\n`);
          reject(err);
          return;
        }
        if (rows.length == 0) {
          info(`Executing ${querySql} return empty result\n`);
          resolve(null);
          return;
        }
        const shopBills = rows.map(row => ({
          shopId: row.shopId,
          shopName: row.shopName,
          accDate: row.accDate,
          transCnt: row.transCnt,
          drAmt: row.drAmt,
          crAmt: row.crAmt,
          level1: row.level1,
          fShopId: row.fShopId,
          shopName2: row.shopName2,
        }));
        resolve(shopBills);
      });
    });
  }
  getDeviceBills(shopId, accDate) {
    return new Promise((resolve, reject) => {
      const queryDeviceBillsByShopIdSqlBuild = util.format(this.queryDeviceBillsByShopIdSql, this.pool.escape(accDate), this.pool.escape(shopId));
      info(`getDeviceBill: Executing ${queryDeviceBillsByShopIdSqlBuild}\n`);
      this.pool.query(queryDeviceBillsByShopIdSqlBuild, (err, rows) => {
        if (err) {
          error(`Error executing ${queryDeviceBillsByShopIdSqlBuild}, with error ${err.stack}\n`);
          reject(err);
          return;
        }
        if (rows.length == 0) {
          info(`Executing ${queryDeviceBillsByShopIdSqlBuild} return empty result\n`);
          resolve(null);
          return;
        }
        const deviceBills = rows.map(row => ({
          deviceId: row.deviceId,
          deviceName: row.deviceName,
          accDate: row.accDate,
          transCnt: row.transCnt,
          drAmt: row.drAmt,
          crAmt: row.crAmt,
          fShopId: row.fShopId,
          shopId: row.shopId,
          accNo: row.accNo,
          shopName: row.shopName,
          deviceNo: row.deviceNo,
          devPyhId: row.devPyhId,
        }));
        resolve(deviceBills);
      });
    });
  }
  getDevices(shopId) {
    return new Promise((resolve, reject) => {
      const querySql = shopId ? util.format(this.queryDevicesByShopIdSql, this.pool.escape(shopId)) : this.queryDevicesSql;
      info(`getDevices: Executing ${querySql}\n`);
      this.pool.query(querySql, (err, rows) => {
        if (err) {
          error(`Error executing ${querySql}, with error ${err.stack}\n`);
          reject(err);
          return;
        }
        if (rows.length == 0) {
          info(`Executing ${querySql} return empty result\n`);
          resolve(null);
          return;
        }
        const devices = rows.map(row => ({
          deviceId: row.deviceId,
          deviceName: row.deviceName,
          fDeviceId: row.fDeviceId,
          devPhyId: row.devPhyId,
          deviceNo: row.deviceNo,
          devPhyType: row.devPhyType,
          devTypeCode: row.devTypeCode,
          devVerNo: row.devVerNo,
          status: row.status,
        }));
        resolve(devices);
      });
    });
  }
  getShops() {
    return new Promise((resolve, reject) => {
      info(`getShops: Executing ${this.queryShopsSql}\n`);
      this.pool.query(this.queryShopsSql, (err, rows) => {
        if (err) {
          error(`Error executing ${this.queryShopsSql}, with error ${err.stack}\n`);
          reject(err);
          return;
        }
        if (rows.length == 0) {
          info(`Executing ${queryShopsSql} return empty result\n`);
          resolve(null);
          return;
        }
        const shops = rows.map(row => ({
          shopId: row.shopId,
          shopName: row.shopName,
          fShopId: row.fShopId,
          areaCode: row.areaCode,
          shopType: row.shopType,
          accFlag: row.accFlag,
          status: row.status,
          accNo: row.accNo,
        }));
        resolve(shops);
      });
    });
  }
  getShop(shopId) {
    return new Promise((resolve, reject) => {
      const querySql = util.format(this.queryShopByIdSql, this.pool.escape(shopId));
      info(`getDevices: Executing ${querySql}\n`);
      this.pool.query(querySql, (err, rows) => {
        if (err) {
          error(`Error executing ${querySql}, with error ${err.stack}\n`);
          reject(err);
          return;
        }
        if (rows.length == 0) {
          info(`Executing ${querySql} return empty result\n`);
          resolve(null);
          return;
        }
        const shop = {
          shopId: rows[0].shopId,
          shopName: rows[0].shopName,
          fShopId: rows[0].fShopId,
          areaCode: rows[0].areaCode,
          shopType: rows[0].shopType,
          accFlag: rows[0].accFlag,
          status: rows[0].status,
          accNo: rows[0].accNo,
        };
        resolve(shop);
      });
    });
  }

  /*
    获取指定商户的所有祖先商户节点
    - 参数
      - `shop` 指定的商户，至少包含`shopId`和`fShopId`两个字段；
      - 或 `shopId` 指定的商户Id，可转换给数字的字符串。
    - 返回值
      - `Shop` 对象数组
   */
  async getAncestorShops(shop) {
    const shops = await this.getShops();
    if (!shop.shopId) {
      info('getAncestorShops:', 'the parameter shopId is ', shop);
      shop = shops.find(s => s.shopId === shop); // eslint-disable-line no-param-reassign
    }
    info('getAncestorShops:', 'the parameter shop is ', shop);
    const getAncestors = (shop2) => {
      // “0”是根节点的父节点
      if (shop2.fShopId === '0') return [];
      // 当前节点的父节点
      const father = shops.find(s => s.shopId === shop2.fShopId);
      return [
        ...getAncestors(father),
        father,
      ];
    };
    return getAncestors(shop);
  }
}

export default YktManager;
