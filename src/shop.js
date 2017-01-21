/*
 eslint-disable no-param-reassign
*/

import { Router } from 'express';
import expressJwt from 'express-jwt';
import { getToken } from './utils'
import YktManager from './YktManager';

import { database_connectionLimit, database_host, database_user, database_password, database_database, secret } from './config';

const router = new Router();
const yktManager = new YktManager({
  connectionLimit : database_connectionLimit,
  host            : database_host,
  user            : database_user,
  password        : database_password,
  database        : database_database,
});

const expressJwtOptions = {
  secret: secret,
  credentialsRequired: true,
  getToken: getToken
};

// 获取指定商户信息
// GET /shop/:shopId?token=TOKEN
router.get('/:shopId', expressJwt(expressJwtOptions),async (req, res) => {
  const shopId = req.params.shopId;
  // const shop = await yktManager.getShop(shopId);
  const shop = {shopid: 123, shopname: 'shop123'};
  res.json({ ret: 0, data: shop });
});

// 获取指定商户日账单
// GET /shop/:shopId/daily-bill/:accDate?token=TOKEN
router.get('/:shopId/daily-bill/:accDate', expressJwt(expressJwtOptions),async (req, res) => {
  const shopId = req.params.shopId;
  const accDate = req.params.accDate;
  const shopBill = await yktManager.getShopBill(shopId, accDate);
  res.json({ ret: 0, data: shopBill });
});

// 获取子商户日账单列表
// GET /shop/:fShopId/sub-shop-daily-bills/:accDate?token=TOKEN
router.get('/:fShopId/sub-shop-daily-bills/:accDate', expressJwt(expressJwtOptions),async (req, res) => {
  const fShopId = req.params.fShopId;
  const accDate = req.params.accDate;
  const shopBills = await yktManager.getShopBills(fShopId, accDate);
  res.json({ ret: 0, data: shopBills });
});

// 获取所属商户的设备的日账单列表
// GET /shop/:shopId/device-daily-bills/:accDate?token=TOKEN
router.get('/:shopId/device-daily-bills/:accDate', expressJwt(expressJwtOptions),async (req, res) => {
  const shopId = req.params.shopId;
  const accDate = req.params.accDate;
  const shopBills = await yktManager.getDeviceBills(shopId, accDate);
  res.json({ ret: 0, data: shopBills });
});

// 获取商户月账单
// GET /shop/:shopId/monthly-bill/:accDate?token=TOKEN


export default router;
