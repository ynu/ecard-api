import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import { host, port } from './config';
import shop from './shop';
import debug from 'debug';

const error = debug('ecard-api:error');
const info = debug('ecard-api:info');
const app = express();

//
// Register Node.js middleware
// -----------------------------------------------------------------------------
app.use(cookieParser('my cookie key'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

const morgan = require('morgan');
app.use(morgan('dev'));

/*
注册API
*/
app.use('/shop', shop);

// 处理异常
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  error('Unhandled error', err.message);
  error(err.stack);
  res.send({
    ret: 500,
    msg: err.message,
  });
});

app.listen(port, () => {
  console.log(`The server is running at http://${host}/`);
});
