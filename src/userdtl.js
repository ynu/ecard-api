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

// 获取所有用户详情信息
// GET /userdtl/all/?token=TOKEN
router.get('/all/', expressJwt(expressJwtOptions), async (req, res) => {
  try {
    const userdtls = await yktManager.getUserDtl();
    res.json({ ret: 0, data: userdtls });
  } catch (err) {
    res.json({ ret: 500, data: err });
  }
});

// 根据指定refno获取单个用户详情
// GET /userdtl/by-refno/:refno?token=TOKEN
router.get('/by-refno/:refno', expressJwt(expressJwtOptions), async (req, res) => {
  try {
    const refno = req.params.refno;
    const userdtl = await yktManager.getUserDtlByRefnoSql(refno);
    res.json({ ret: 0, data: userdtl });
  } catch (err) {
    res.json({ ret: 500, data: err });
  }
});

// 根据指定日期获取用户详情
// GET /userdtl/by-accdate/:accDate?token=TOKEN
router.get('/by-accdate/:accDate', expressJwt(expressJwtOptions), async (req, res) => {
  try {
    const accDate = req.params.accDate;
    const userdtls = await yktManager.getUserDtlByAccDate(accDate);
    res.json({ ret: 0, data: userdtls });
  } catch (err) {
    res.json({ ret: 500, data: err });
  }
});

export default router;
