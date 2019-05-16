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
    console.info(options);
    console.info(this.pool);

    this.queryDevicesSql =
      'select deviceid as deviceId, devicename as deviceName, fdeviceid as fDeviceId, devphyid as devPhyId, deviceno as deviceNo, devphytype as devPhyType, devtypecode as devTypeCode, devverno as devVerNo, status as status from t_device;';
    // this.queryDevicesByShopIdSql = 'select deviceid as deviceId, devicename as deviceName, id as id, areacode as areaCode, level_jb as levelJb, fshopid as fShopId, shopid as shopId, accno as accNo, shopfullname as shopFullName, shopname as shopName, shop_status as shopStatus, shoptype as shopType, accflag as accFlag, deviceno as deviceNo, devphyid as devPhyId, devtypecode as devTypeCode, device_status as deviceStatus from t_shopdevice where fshopid=%s;';
    this.queryDevicesByShopIdSql =
      'select deviceid as deviceId, devicename as deviceName, fdeviceid as fDeviceId, devphyid as devPhyId, deviceno as deviceNo, devphytype as devPhyType, devtypecode as devTypeCode, devverno as devVerNo, status as status from t_device where deviceid in (select distinct deviceid from t_shopdevice where fshopid=%s);';
    this.queryShopsSql =
      'select shopid as shopId, shopname as shopName, fshopid as fShopId, areacode as areaCode, shoptype as shopType, accflag as accFlag, status as status, accno as accNo from t_shop order by shopname;';
    this.queryShopByShopIdSql =
      'select shopid as shopId, shopname as shopName, fshopid as fShopId, areacode as areaCode, shoptype as shopType, accflag as accFlag, status as status, accno as accNo from t_shop where shopid=%s;';
    this.queryShopBillByShopIDAndAccDateSql =
      'select shopid as shopId, shopname as shopName, accdate as accDate, transcnt as transCnt, dramt as drAmt, cramt as crAmt, level1 as level1, fshopid as fShopId, shopname2 as shopName2 from t_shop_bill where shopid=%s and accdate=%s;';
    this.queryShopBillsByShopID =
      'select shopid as shopId, shopname as shopName, accdate as accDate, transcnt as transCnt, dramt as drAmt, cramt as crAmt, level1 as level1, fshopid as fShopId, shopname2 as shopName2 from t_shop_bill where shopid=%s;';
    this.queryShopBillsByAccDate =
      'select shopid as shopId, shopname as shopName, accdate as accDate, transcnt as transCnt, dramt as drAmt, cramt as crAmt, level1 as level1, fshopid as fShopId, shopname2 as shopName2 from t_shop_bill where accdate=%s;';
    this.queryDeviceBillSql =
      'select deviceid as deviceId, devicename as deviceName, accdate as accDate, transcnt as transCnt, dramt as drAmt, cramt as crAmt, fshopid as fShopId, shopid as shopId, accno as accNo, shopname as shopName, deviceno as deviceNo, devphyid as devPyhId from t_shopdevice_bill where deviceid=%s and accdate=%s;';
    this.queryTotalBillSql =
      'select count(transcnt) as totalTransCnt, count(dramt) as totalDrAmt, count(cramt) as totalCrAmt from t_shopdevice_bill;';
    this.queryShopBillsSql =
      'select shopid as shopId, shopname as shopName, accdate as accDate, transcnt as transCnt, dramt as drAmt, cramt as crAmt, level1 as level1, fshopid as fShopId, shopname2 as shopName2 from t_shop_bill where accDate=%s;';
    this.queryShopBillsByFShopIdSql =
      'select shopid as shopId, shopname as shopName, accdate as accDate, transcnt as transCnt, dramt as drAmt, cramt as crAmt, level1 as level1, fshopid as fShopId, shopname2 as shopName2 from t_shop_bill where accDate=%s and fshopid=%s;';
    this.queryDeviceBillsByShopIdSql =
      'select deviceid as deviceId, devicename as deviceName, accdate as accDate, transcnt as transCnt, dramt as drAmt, cramt as crAmt, fshopid as fShopId, shopid as shopId, accno as accNo, shopname as shopName, deviceno as deviceNo, devphyid as devPyhId from t_shopdevice_bill where accdate=%s and shopid=%s;';
    this.queryShopBillMonthSql =
      'select accdate as accDate, rn as rn, l1 as l1, fshopid as fShopId, shopid as shopId, shopname2 as shopName2, shopname as shopName, transcnt as transCnt, drmant as drAmt, cramt as crAmt from t_shop_bill_month where shopid=%s and accDate=%s;';
    this.queryShopBillsMonthSql =
      'select accdate as accDate, rn as rn, l1 as l1, fshopid as fShopId, shopid as shopId, shopname2 as shopName2, shopname as shopName, transcnt as transCnt, drmant as drAmt, cramt as crAmt from t_shop_bill_month where accDate=%s;';
    this.queryShopBillsMonthByFShopIdSql =
      'select accdate as accDate, rn as rn, l1 as l1, fshopid as fShopId, shopid as shopId, shopname2 as shopName2, shopname as shopName, transcnt as transCnt, drmant as drAmt, cramt as crAmt from t_shop_bill_month where fshopid=%s and accDate=%s;';
    this.queryOperatorBillsByAccDateSql =
      'select primarykey as primaryKey, accdate as accDate, opercode as operCode, opername as operName, subjno as subjNo, subjname as subjName, transtype as transType, summary as summary, transcnt as transCnt, inamt as inAmt, outamt as outAmt from t_operator_bill where accDate=%s;';
    this.queryOperatorBillsByOperCodeAndAccDateSql =
      'select primarykey as primaryKey, accdate as accDate, opercode as operCode, opername as operName, subjno as subjNo, subjname as subjName, transtype as transType, summary as summary, transcnt as transCnt, inamt as inAmt, outamt as outAmt from t_operator_bill where opercode=%s and accDate=%s;';
    this.queryCustCardInfoSql =
      'select `stuempno`, `custname`, `cardno`, `cardstatus`, `balance`, `showcardno`, `cardphyid`, `expiredate`, `opendate`, `cardverno`, `cardtype`, `cardtypename`, `custid`, `feetype`, `feename`, `custtype`, `custtypename`, `deptcode`, `deptname`, `specialtycode`, `specialtyname`, `sex`, `idtype`, `idtypename`, `idno`, `areacode`, `areaname`, `classcode`, `countrycode`, `country`, `email`, `nationcode`, `nation`, `tel`, `mobile`, `zipcode`, `cardupdtime`, `custupdtime`, `STUEMPNO`, `CUSTNAME`, `CARDNO`, `CARDSTATUS`, `BALANCE`, `SHOWCARDNO`, `CARDPHYID`, `EXPIREDATE`, `OPENDATE`, `CARDVERNO`, `CARDTYPE`, `CARDTYPENAME`, `CUSTID`, `FEETYPE`, `FEENAME`, `CUSTTYPE`, `CUSTTYPENAME`, `DEPTCODE`, `DEPTNAME`, `SPECIALTYCODE`, `SPECIALTYNAME`, `SEX`, `IDTYPE`, `IDTYPENAME`, `IDNO`, `AREACODE`, `AREANAME`, `CLASSCODE`, `COUNTRYCODE`, `COUNTRY`, `EMAIL`, `NATIONCODE`, `NATION`, `TEL`, `MOBILE`, `ZIPCODE`, `CARDUPDTIME`, `CUSTUPDTIME` from t_custcardinfo;';
    this.queryCustCardInfoStuempnoSql = 'select `stuempno` from t_custcardinfo;';
    this.queryCustCardInfoByStuempnoSql =
      'select `stuempno`, `custname`, `cardno`, `cardstatus`, `balance`, `showcardno`, `cardphyid`, `expiredate`, `opendate`, `cardverno`, `cardtype`, `cardtypename`, `custid`, `feetype`, `feename`, `custtype`, `custtypename`, `deptcode`, `deptname`, `specialtycode`, `specialtyname`, `sex`, `idtype`, `idtypename`, `idno`, `areacode`, `areaname`, `classcode`, `countrycode`, `country`, `email`, `nationcode`, `nation`, `tel`, `mobile`, `zipcode`, `cardupdtime`, `custupdtime`, `STUEMPNO`, `CUSTNAME`, `CARDNO`, `CARDSTATUS`, `BALANCE`, `SHOWCARDNO`, `CARDPHYID`, `EXPIREDATE`, `OPENDATE`, `CARDVERNO`, `CARDTYPE`, `CARDTYPENAME`, `CUSTID`, `FEETYPE`, `FEENAME`, `CUSTTYPE`, `CUSTTYPENAME`, `DEPTCODE`, `DEPTNAME`, `SPECIALTYCODE`, `SPECIALTYNAME`, `SEX`, `IDTYPE`, `IDTYPENAME`, `IDNO`, `AREACODE`, `AREANAME`, `CLASSCODE`, `COUNTRYCODE`, `COUNTRY`, `EMAIL`, `NATIONCODE`, `NATION`, `TEL`, `MOBILE`, `ZIPCODE`, `CARDUPDTIME`, `CUSTUPDTIME` from t_custcardinfo where stuempno = %s;';
    this.queryUserDtlSql =
      'select `accdate`, `acctime`, `refno`, `cardno`, `termdate`, `termtime`, `beffrozebal`, `befavailbal`, `aftavailbal`, `aftfrozebal`, `amount`, `ispwdconfirm`, `managefee`, `managefeetype`, `revflag`, `transcode`, `transmode`, `transtype`, `transdesc`, `merchaccno`, `termid`, `termseqno`, `operid`, `custid`, `custname`, `stuempno`, `srctable`, `barcode`, `status`, `wcstatus`, `errcode`, `remark`, `mac` from t_userdtl;';
    this.queryUserDtlByRefnoSql =
      'select `accdate`, `acctime`, `refno`, `cardno`, `termdate`, `termtime`, `beffrozebal`, `befavailbal`, `aftavailbal`, `aftfrozebal`, `amount`, `ispwdconfirm`, `managefee`, `managefeetype`, `revflag`, `transcode`, `transmode`, `transtype`, `transdesc`, `merchaccno`, `termid`, `termseqno`, `operid`, `custid`, `custname`, `stuempno`, `srctable`, `barcode`, `status`, `wcstatus`, `errcode`, `remark`, `mac` from t_userdtl where refno=%s;';
    this.queryUserDtlByAccDateSql =
      'select `accdate`, `acctime`, `refno`, `cardno`, `termdate`, `termtime`, `beffrozebal`, `befavailbal`, `aftavailbal`, `aftfrozebal`, `amount`, `ispwdconfirm`, `managefee`, `managefeetype`, `revflag`, `transcode`, `transmode`, `transtype`, `transdesc`, `merchaccno`, `termid`, `termseqno`, `operid`, `custid`, `custname`, `stuempno`, `srctable`, `barcode`, `status`, `wcstatus`, `errcode`, `remark`, `mac` from t_userdtl where accDate=%s;';
    this.queryDeviceidSql = 'select `deviceid` from t_device;';
    this.queryDeviceByDeviceidSql =
      'select `fdeviceid`, `deviceid`, `devicename`, `devphyid`, `deviceno`, `devphytype`, `devtypecode`, `devverno`, `status` from `t_device` where deviceid=%s;';
  }
  getShopBill(shopId, accDate) {
    return new Promise((resolve, reject) => {
      const queryShopBillSqlBuild = util.format(
        this.queryShopBillByShopIDAndAccDateSql,
        mysql.escape(shopId),
        mysql.escape(accDate)
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
  getShopBillsByShopId(shopId) {
    return new Promise((resolve, reject) => {
      const queryShopBillsSqlBuild = util.format(this.queryShopBillsByShopID, mysql.escape(shopId));
      info(`getShopBill: Executing ${queryShopBillsSqlBuild}\n`);
      this.pool.query(queryShopBillsSqlBuild, (err, rows) => {
        if (err) {
          error(`Error executing ${queryShopBillsSqlBuild}, with error ${err.stack}\n`);
          reject(err);
          return;
        }
        if (rows.length === 0) {
          info(`Executing ${queryShopBillsSqlBuild} return empty result\n`);
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
  getShopBillsByAccDate(accDate) {
    return new Promise((resolve, reject) => {
      const queryShopBillsSqlBuild = util.format(
        this.queryShopBillsByAccDate,
        mysql.escape(accDate)
      );
      info(`getShopBill: Executing ${queryShopBillsSqlBuild}\n`);
      this.pool.query(queryShopBillsSqlBuild, (err, rows) => {
        if (err) {
          error(`Error executing ${queryShopBillsSqlBuild}, with error ${err.stack}\n`);
          reject(err);
          return;
        }
        if (rows.length === 0) {
          info(`Executing ${queryShopBillsSqlBuild} return empty result\n`);
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
  getDeviceBill(deviceId, accDate) {
    return new Promise((resolve, reject) => {
      const queryDeviceBillSqlBuild = util.format(
        this.queryDeviceBillSql,
        mysql.escape(deviceId),
        mysql.escape(accDate)
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
  getShopBills(fShopId, accDate) {
    // 如果fShopId为null或undefined则全部获取
    return new Promise((resolve, reject) => {
      const querySql = fShopId
        ? util.format(this.queryShopBillsByFShopIdSql, mysql.escape(accDate), mysql.escape(fShopId))
        : util.format(this.queryShopBillsSql, mysql.escape(accDate));
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
      const queryDeviceBillsByShopIdSqlBuild = util.format(
        this.queryDeviceBillsByShopIdSql,
        mysql.escape(accDate),
        mysql.escape(shopId)
      );
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
      const querySql = shopId
        ? util.format(this.queryDevicesByShopIdSql, mysql.escape(shopId))
        : this.queryDevicesSql;
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
      const querySql = util.format(this.queryShopByShopIdSql, mysql.escape(shopId));
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
  getShopBillMonth(shopId, accDate) {
    return new Promise((resolve, reject) => {
      const queryShopBillMonthSqlBuild = util.format(
        this.queryShopBillMonthSql,
        mysql.escape(shopId),
        mysql.escape(accDate)
      );
      info(`getShopBill: Executing ${queryShopBillMonthSqlBuild}\n`);
      this.pool.query(queryShopBillMonthSqlBuild, (err, rows) => {
        if (err) {
          error(`Error executing ${queryShopBillMonthSqlBuild}, with error ${err.stack}\n`);
          reject(err);
          return;
        }
        if (rows.length === 0) {
          info(`Executing ${queryShopBillMonthSqlBuild} return empty result\n`);
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
          rn: rows[0].rn,
          l1: rows[0].l1,
          fShopId: rows[0].fShopId,
          shopName2: rows[0].shopName2,
        };
        resolve(shopBill);
      });
    });
  }
  getShopBillsMonth(fShopId, accDate) {
    // 如果fShopId为null或undefined则全部获取
    return new Promise((resolve, reject) => {
      const querySql = fShopId
        ? util.format(
            this.queryShopBillsMonthByFShopIdSql,
            mysql.escape(fShopId),
            mysql.escape(accDate)
          )
        : util.format(this.queryShopBillsMonthSql, mysql.escape(accDate));
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
          rn: row.rn,
          l1: row.l1,
          fShopId: row.fShopId,
          shopName2: row.shopName2,
        }));
        resolve(shopBills);
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
      return [...getAncestors(father), father];
    };
    return getAncestors(shop);
  }
  getOperatorBillsByAccDate(accDate) {
    return new Promise((resolve, reject) => {
      const queryOperatorBillsSqlBuild = util.format(
        this.queryOperatorBillsByAccDateSql,
        mysql.escape(accDate)
      );
      info(`getOperatorBillsByAccDate: Executing ${queryOperatorBillsSqlBuild}\n`);
      this.pool.query(queryOperatorBillsSqlBuild, (err, rows) => {
        if (err) {
          error(`Error executing ${queryOperatorBillsSqlBuild}, with error ${err.stack}\n`);
          reject(err);
          return;
        }
        if (rows.length === 0) {
          info(`Executing ${queryOperatorBillsSqlBuild} return empty result\n`);
          resolve(null);
          return;
        }
        const operatorBills = rows.map(row => ({
          primaryKey: row.primaryKey,
          accDate: row.accDate,
          operCode: row.operCode,
          operName: row.operName,
          subjNo: row.subjNo,
          subjName: row.subjName,
          transType: row.transType,
          summary: row.summary,
          transCnt: row.transCnt,
          inAmt: row.inAmt,
          outAmt: row.outAmt,
        }));
        resolve(operatorBills);
      });
    });
  }

  getOperatorBillsByOperCodeAndAccDate(operCode, accDate) {
    return new Promise((resolve, reject) => {
      const queryOperatorBillsSqlBuild = util.format(
        this.queryOperatorBillsByOperCodeAndAccDateSql,
        mysql.escape(operCode),
        mysql.escape(accDate)
      );
      info(`getOperatorBillsByOperCodeAndAccDate: Executing ${queryOperatorBillsSqlBuild}\n`);
      this.pool.query(queryOperatorBillsSqlBuild, (err, rows) => {
        if (err) {
          error(`Error executing ${queryOperatorBillsSqlBuild}, with error ${err.stack}\n`);
          reject(err);
          return;
        }
        if (rows.length === 0) {
          info(`Executing ${queryOperatorBillsSqlBuild} return empty result\n`);
          resolve(null);
          return;
        }
        const operatorBills = rows.map(row => ({
          primaryKey: row.primaryKey,
          accDate: row.accDate,
          operCode: row.operCode,
          operName: row.operName,
          subjNo: row.subjNo,
          subjName: row.subjName,
          transType: row.transType,
          summary: row.summary,
          transCnt: row.transCnt,
          inAmt: row.inAmt,
          outAmt: row.outAmt,
        }));
        resolve(operatorBills);
      });
    });
  }

  getOperatorBillsByOperCodeAndAccDate(operCode, accDate) {
    return new Promise((resolve, reject) => {
      const queryOperatorBillsSqlBuild = util.format(
        this.queryOperatorBillsByOperCodeAndAccDateSql,
        mysql.escape(operCode),
        mysql.escape(accDate)
      );
      info(`getOperatorBillsByOperCodeAndAccDate: Executing ${queryOperatorBillsSqlBuild}\n`);
      this.pool.query(queryOperatorBillsSqlBuild, (err, rows) => {
        if (err) {
          error(`Error executing ${queryOperatorBillsSqlBuild}, with error ${err.stack}\n`);
          reject(err);
          return;
        }
        if (rows.length === 0) {
          info(`Executing ${queryOperatorBillsSqlBuild} return empty result\n`);
          resolve(null);
          return;
        }
        const operatorBills = rows.map(row => ({
          primaryKey: row.primaryKey,
          accDate: row.accDate,
          operCode: row.operCode,
          operName: row.operName,
          subjNo: row.subjNo,
          subjName: row.subjName,
          transType: row.transType,
          summary: row.summary,
          transCnt: row.transCnt,
          inAmt: row.inAmt,
          outAmt: row.outAmt,
        }));
        resolve(operatorBills);
      });
    });
  }

  getCustCardInfo() {
    return new Promise((resolve, reject) => {
      const queryCustCardInfoSqlBuild = util.format(this.queryCustCardInfoSql);
      info(`getCustCardInfo: Executing ${queryCustCardInfoSqlBuild}\n`);
      this.pool.query(queryCustCardInfoSqlBuild, (err, rows) => {
        if (err) {
          error(`Error executing ${queryCustCardInfoSqlBuild}, with error ${err.stack}\n`);
          reject(err);
          return;
        }
        if (rows.length === 0) {
          info(`Executing ${queryCustCardInfoSqlBuild} return empty result\n`);
          resolve(null);
          return;
        }
        const custCardInfos = rows.map(row => ({
          stuempno: row.stuempno,
          custname: row.custname,
          cardno: row.cardno,
          cardstatus: row.cardstatus,
          balance: row.balance,
          showcardno: row.showcardno,
          cardphyid: row.cardphyid,
          expiredate: row.expiredate,
          opendate: row.opendate,
          cardverno: row.cardverno,
          cardtype: row.cardtype,
          cardtypename: row.cardtypename,
          custid: row.custid,
          feetype: row.feetype,
          feename: row.feename,
          custtype: row.custtype,
          custtypename: row.custtypename,
          deptcode: row.deptcode,
          deptname: row.deptname,
          specialtycode: row.specialtycode,
          specialtyname: row.specialtyname,
          sex: row.sex,
          idtype: row.idtype,
          idtypename: row.idtypename,
          idno: row.idno,
          areacode: row.areacode,
          areaname: row.areaname,
          classcode: row.classcode,
          countrycode: row.countrycode,
          country: row.country,
          email: row.email,
          nationcode: row.nationcode,
          nation: row.nation,
          tel: row.tel,
          mobile: row.mobile,
          zipcode: row.zipcode,
          cardupdtime: row.cardupdtime,
          custupdtime: row.custupdtime,
        }));
        resolve(custCardInfos);
      });
    });
  }

  getCustCardInfoStuempnos() {
    return new Promise((resolve, reject) => {
      const queryCustCardInfoStuempnoSqlBuild = util.format(this.queryCustCardInfoStuempnoSql);
      info(`getCustCardInfoStuempnos: Executing ${queryCustCardInfoStuempnoSqlBuild}\n`);
      this.pool.query(queryCustCardInfoStuempnoSqlBuild, (err, rows) => {
        if (err) {
          error(`Error executing ${queryCustCardInfoStuempnoSqlBuild}, with error ${err.stack}\n`);
          reject(err);
          return;
        }
        if (rows.length === 0) {
          info(`Executing ${queryCustCardInfoStuempnoSqlBuild} return empty result\n`);
          resolve(null);
          return;
        }
        const cardInfoStuempnos = rows.map(row => row.stuempno);
        resolve(cardInfoStuempnos);
      });
    });
  }

  getCustCardInfoByStuempno(stuempno) {
    return new Promise((resolve, reject) => {
      const queryCustCardInfoByStuempnoSqlBuild = util.format(
        this.queryCustCardInfoByStuempnoSql,
        mysql.escape(stuempno)
      );
      info(`getCustCardInfoByStuempno: Executing ${queryCustCardInfoByStuempnoSqlBuild}\n`);
      this.pool.query(queryCustCardInfoByStuempnoSqlBuild, (err, rows) => {
        if (err) {
          error(
            `Error executing ${queryCustCardInfoByStuempnoSqlBuild}, with error ${err.stack}\n`
          );
          reject(err);
          return;
        }
        if (rows.length === 0) {
          info(`Executing ${queryCustCardInfoByStuempnoSqlBuild} return empty result\n`);
          resolve(null);
          return;
        }
        const custCardInfo = {
          stuempno: rows[0].stuempno,
          custname: rows[0].custname,
          cardno: rows[0].cardno,
          cardstatus: rows[0].cardstatus,
          balance: rows[0].balance,
          showcardno: rows[0].showcardno,
          cardphyid: rows[0].cardphyid,
          expiredate: rows[0].expiredate,
          opendate: rows[0].opendate,
          cardverno: rows[0].cardverno,
          cardtype: rows[0].cardtype,
          cardtypename: rows[0].cardtypename,
          custid: rows[0].custid,
          feetype: rows[0].feetype,
          feename: rows[0].feename,
          custtype: rows[0].custtype,
          custtypename: rows[0].custtypename,
          deptcode: rows[0].deptcode,
          deptname: rows[0].deptname,
          specialtycode: rows[0].specialtycode,
          specialtyname: rows[0].specialtyname,
          sex: rows[0].sex,
          idtype: rows[0].idtype,
          idtypename: rows[0].idtypename,
          idno: rows[0].idno,
          areacode: rows[0].areacode,
          areaname: rows[0].areaname,
          classcode: rows[0].classcode,
          countrycode: rows[0].countrycode,
          country: rows[0].country,
          email: rows[0].email,
          nationcode: rows[0].nationcode,
          nation: rows[0].nation,
          tel: rows[0].tel,
          mobile: rows[0].mobile,
          zipcode: rows[0].zipcode,
          cardupdtime: rows[0].cardupdtime,
          custupdtime: rows[0].custupdtime,
        };
        resolve(custCardInfo);
      });
    });
  }

  getAllDeviceid() {
    return new Promise((resolve, reject) => {
      const queryDeviceidSqlBuild = util.format(this.queryDeviceidSql);
      info(`getAllDeviceid: Executing ${queryDeviceidSqlBuild}\n`);
      this.pool.query(queryDeviceidSqlBuild, (err, rows) => {
        if (err) {
          error(`Error executing ${queryDeviceidSqlBuild}, with error ${err.stack}\n`);
          reject(err);
          return;
        }
        if (rows.length === 0) {
          info(`Executing ${queryDeviceidSqlBuild} return empty result\n`);
          resolve(null);
          return;
        }
        const deviceids = rows.map(row => row.deviceid);
        resolve(deviceids);
      });
    });
  }

  getDeviceByDeviceid(stuempno) {
    return new Promise((resolve, reject) => {
      const queryDeviceByDeviceidSqlBuild = util.format(
        this.queryDeviceByDeviceidSql,
        mysql.escape(stuempno)
      );
      info(`getDeviceByDeviceid: Executing ${queryDeviceByDeviceidSqlBuild}\n`);
      this.pool.query(queryDeviceByDeviceidSqlBuild, (err, rows) => {
        if (err) {
          error(`Error executing ${queryDeviceByDeviceidSqlBuild}, with error ${err.stack}\n`);
          reject(err);
          return;
        }
        if (rows.length === 0) {
          info(`Executing ${queryDeviceByDeviceidSqlBuild} return empty result\n`);
          resolve(null);
          return;
        }
        const device = {
          fdeviceid: rows[0].fdeviceid,
          deviceid: rows[0].deviceid,
          devicename: rows[0].devicename,
          devphyid: rows[0].devphyid,
          deviceno: rows[0].deviceno,
          devphytype: rows[0].devphytype,
          devtypecode: rows[0].devtypecode,
          status: rows[0].status,
        };
        resolve(device);
      });
    });
  }

  getUserDtl() {
    return new Promise((resolve, reject) => {
      const queryUserDtlSqlBuild = util.format(this.queryUserDtlSql);
      info(`getCustCardInfo: Executing ${queryUserDtlSqlBuild}\n`);
      this.pool.query(queryUserDtlSqlBuild, (err, rows) => {
        if (err) {
          error(`Error executing ${queryUserDtlSqlBuild}, with error ${err.stack}\n`);
          reject(err);
          return;
        }
        if (rows.length === 0) {
          info(`Executing ${queryUserDtlSqlBuild} return empty result\n`);
          resolve(null);
          return;
        }
        const userDtls = rows.map(row => ({
          accdate: row.accdate,
          acctime: row.acctime,
          refno: row.refno,
          cardno: row.cardno,
          termdate: row.termdate,
          termtime: row.termtime,
          beffrozebal: row.beffrozebal,
          befavailbal: row.befavailbal,
          aftavailbal: row.aftavailbal,
          aftfrozebal: row.aftfrozebal,
          amount: row.amount,
          ispwdconfirm: row.ispwdconfirm,
          managefee: row.managefee,
          managefeetype: row.managefeetype,
          revflag: row.revflag,
          transcode: row.transcode,
          transmode: row.transmode,
          transtype: row.transtype,
          transdesc: row.transdesc,
          merchaccno: row.merchaccno,
          termid: row.termid,
          termseqno: row.termseqno,
          operid: row.operid,
          custid: row.custid,
          custname: row.custname,
          stuempno: row.stuempno,
          srctable: row.srctable,
          barcode: row.barcode,
          status: row.status,
          wcstatus: row.wcstatus,
          errcode: row.errcode,
          remark: row.remark,
          mac: row.mac,
        }));
        resolve(userDtls);
      });
    });
  }

  getUserDtlByRefnoSql(refno) {
    return new Promise((resolve, reject) => {
      const queryUserDtlByRefnoSqlBuild = util.format(
        this.queryUserDtlByRefnoSql,
        mysql.escape(refno)
      );
      info(`getCustCardInfoByStuempno: Executing ${queryUserDtlByRefnoSqlBuild}\n`);
      this.pool.query(queryUserDtlByRefnoSqlBuild, (err, rows) => {
        if (err) {
          error(`Error executing ${queryUserDtlByRefnoSqlBuild}, with error ${err.stack}\n`);
          reject(err);
          return;
        }
        if (rows.length === 0) {
          info(`Executing ${queryUserDtlByRefnoSqlBuild} return empty result\n`);
          resolve(null);
          return;
        }
        const userDtl = {
          accdate: rows[0].accdate,
          acctime: rows[0].acctime,
          refno: rows[0].refno,
          cardno: rows[0].cardno,
          termdate: rows[0].termdate,
          termtime: rows[0].termtime,
          beffrozebal: rows[0].beffrozebal,
          befavailbal: rows[0].befavailbal,
          aftavailbal: rows[0].aftavailbal,
          aftfrozebal: rows[0].aftfrozebal,
          amount: rows[0].amount,
          ispwdconfirm: rows[0].ispwdconfirm,
          managefee: rows[0].managefee,
          managefeetype: rows[0].managefeetype,
          revflag: rows[0].revflag,
          transcode: rows[0].transcode,
          transmode: rows[0].transmode,
          transtype: rows[0].transtype,
          transdesc: rows[0].transdesc,
          merchaccno: rows[0].merchaccno,
          termid: rows[0].termid,
          termseqno: rows[0].termseqno,
          operid: rows[0].operid,
          custid: rows[0].custid,
          custname: rows[0].custname,
          stuempno: rows[0].stuempno,
          srctable: rows[0].srctable,
          barcode: rows[0].barcode,
          status: rows[0].status,
          wcstatus: rows[0].wcstatus,
          errcode: rows[0].errcode,
          remark: rows[0].remark,
          mac: rows[0].mac,
        };
        resolve(userDtl);
      });
    });
  }

  getUserDtlByAccDate(accDate) {
    return new Promise((resolve, reject) => {
      const queryUserDtlByAccDateSqlBuild = util.format(
        this.queryUserDtlByAccDateSql,
        mysql.escape(accDate)
      );
      info(`getCustCardInfo: Executing ${queryUserDtlByAccDateSqlBuild}\n`);
      this.pool.query(queryUserDtlByAccDateSqlBuild, (err, rows) => {
        if (err) {
          error(`Error executing ${queryUserDtlByAccDateSqlBuild}, with error ${err.stack}\n`);
          reject(err);
          return;
        }
        if (rows.length === 0) {
          info(`Executing ${queryUserDtlByAccDateSqlBuild} return empty result\n`);
          resolve(null);
          return;
        }
        const userDtls = rows.map(row => ({
          accdate: row.accdate,
          acctime: row.acctime,
          refno: row.refno,
          cardno: row.cardno,
          termdate: row.termdate,
          termtime: row.termtime,
          beffrozebal: row.beffrozebal,
          befavailbal: row.befavailbal,
          aftavailbal: row.aftavailbal,
          aftfrozebal: row.aftfrozebal,
          amount: row.amount,
          ispwdconfirm: row.ispwdconfirm,
          managefee: row.managefee,
          managefeetype: row.managefeetype,
          revflag: row.revflag,
          transcode: row.transcode,
          transmode: row.transmode,
          transtype: row.transtype,
          transdesc: row.transdesc,
          merchaccno: row.merchaccno,
          termid: row.termid,
          termseqno: row.termseqno,
          operid: row.operid,
          custid: row.custid,
          custname: row.custname,
          stuempno: row.stuempno,
          srctable: row.srctable,
          barcode: row.barcode,
          status: row.status,
          wcstatus: row.wcstatus,
          errcode: row.errcode,
          remark: row.remark,
          mac: row.mac,
        }));
        resolve(userDtls);
      });
    });
  }
}
export default YktManager;
