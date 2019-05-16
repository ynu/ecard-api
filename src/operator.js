/*
 eslint-disable no-param-reassign
*/

import { Router } from 'express';
import expressJwt from 'express-jwt';
import { getToken } from './utils';
import YktManager from './YktManager';

import { database_connectionLimit, database_host, database_user, database_password, database_database, secret } from './config';

const router = new Router();
const yktManager = new YktManager({
  connectionLimit: database_connectionLimit,
  host: database_host,
  user: database_user,
  password: database_password,
  database: database_database,
});

const expressJwtOptions = {
  secret,
  credentialsRequired: true,
  getToken,
};

// 获取指定日期所有操作员的日账单
// GET /operator/all/daily-bill/:accDate?token=TOKEN
router.get('/all/daily-bill/:accDate', expressJwt(expressJwtOptions), async (req, res) => {
  try {
    const accDate = req.params.accDate;
    const operatorBills = await yktManager.getOperatorBillsByAccDate(accDate);
    res.json({ ret: 0, data: operatorBills });
  } catch (err) {
    res.json({ ret: 500, data: err });
  }
});

// 获取指定操作员单日账单
// GET /operator/:operatorCode/daily-bill/:accDate?token=TOKEN
router.get('/:operatorCode/daily-bill/:accDate', expressJwt(expressJwtOptions), async (req, res) => {
  try {
    const operatorCode = req.params.operatorCode;
    const accDate = req.params.accDate;
    const operatorBills = await yktManager.getOperatorBillsByOperCodeAndAccDate(operatorCode, accDate);
    res.json({ ret: 0, data: operatorBills });
  } catch (err) {
    res.json({ ret: 500, data: err });
  }
});

export default router;
