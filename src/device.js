/*
 eslint-disable no-param-reassign
*/

import { Router } from 'express';
import expressJwt from 'express-jwt';
import { getToken } from './utils';
import YktManager from './YktManager';

import {
  database_connectionLimit,
  database_host,
  database_user,
  database_password,
  database_database,
  secret,
} from './config';

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

// 获取所有卡信息deviceid
// GET /device/all-deviceid/?token=TOKEN
router.get('/all-deviceid/', expressJwt(expressJwtOptions), async (req, res) => {
  try {
    const deviceids = await yktManager.getAllDeviceid();
    res.json({ ret: 0, data: deviceids });
  } catch (err) {
    res.json({ ret: 500, data: err });
  }
});

// 根据指定deviceid获取单个卡详情
// GET /device/by-deviceid/:deviceid?token=TOKEN
router.get('/by-deviceid/:deviceid', expressJwt(expressJwtOptions), async (req, res) => {
  try {
    const deviceid = req.params.deviceid;
    const device = await yktManager.getDeviceByDeviceid(deviceid);
    res.json({ ret: 0, data: device });
  } catch (err) {
    res.json({ ret: 500, data: err });
  }
});

export default router;
