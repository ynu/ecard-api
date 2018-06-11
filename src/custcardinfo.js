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

// 获取所有的用户卡信息
// GET /custcardinfo/all/?token=TOKEN
router.get('/all/', expressJwt(expressJwtOptions), async (req, res) => {
  try {
    const custCardInfos = await yktManager.getCustCardInfo();
    res.json({ ret: 0, data: custCardInfos });
  } catch (err) {
    res.json({ ret: 500, data: err });
  }
});

// 根据stuempno获取单个用户卡信息
// GET /custcardinfo/:stuempno?token=TOKEN
router.get('/by-stuempno/:stuempno', expressJwt(expressJwtOptions), async (req, res) => {
  try {
    const stuempno = req.params.stuempno;
    const custCardInfo = await yktManager.getCustCardInfoByStuempno(stuempno);
    res.json({ ret: 0, data: custCardInfo });
  } catch (err) {
    res.json({ ret: 500, data: err });
  }
});

export default router;
