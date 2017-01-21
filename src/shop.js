/*
 eslint-disable no-param-reassign
*/

import { Router } from 'express';
import YktManager from 'YktManager';
import { database_connectionLimit, database_host, database_user, database_password, database_database } from './config';

const router = new Router();
const yktManager = new YktManager({
  connectionLimit : database_connectionLimit,
  host            : database_host,
  user            : database_user,
  password        : database_password,
  database        : database_database,
});

router.use('/', (req, res) => {

  res.send({ ret: 0, data: 'hell, world' });
});

export default router;
