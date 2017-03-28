/**
 * Babel Starter Kit (https://www.kriasoft.com/babel-starter-kit)
 *
 * Copyright © 2015-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import { expect } from 'chai';
import YktManager from '../src/YktManager';
import util from 'util';
import debug from 'debug';

const error = debug('ecard-api:error');
const info = debug('ecard-api:info');

describe('YktManager', () => {

  describe('yktManager test', () => {

    let yktManager;

    before(function() {
      // runs before all tests in this block
      yktManager = new YktManager({
        connectionLimit : process.env.CONNECTION_LIMIT || 10,
        host            : process.env.DATABASE_HOST,
        user            : process.env.USER,
        password        : process.env.PASSWORD,
        database        : process.env.DATABASE,
      });

    });

    after(function() {
      // runs after all tests in this block

      function exitHandler(options, err) {
        if (err) {
          error(err.stack);
        }
        if (options.cleanup | options.exit) {
          yktManager.pool.end(function (err) {
            if (err) {
              error(err.stack);
              return;
            }
            info("all connection were clean up");
          });
        }
        process.exit();
      }

      process.stdin.resume();//so the program will not close instantly

      //do something when app is closing
      process.on('exit', exitHandler.bind(null,{cleanup:true}));

      //catches ctrl+c event
      process.on('SIGINT', exitHandler.bind(null, {exit:true}));

      //catches uncaught exceptions
      process.on('uncaughtException', exitHandler.bind(null, {exit:true}));

    });

    it('should return a single shopBill in js object data structure', () => {
      return yktManager.getShopBill("107", "20170111").then(function(data) {
        info(`The return data is ${JSON.stringify(data, null, 2)}\n`);
        expect(data).to.be.ok;
      });
    });

    it('should return a single deviceBill in js object data structure', () => {
      return yktManager.getDeviceBill("2207", "20170111").then(function(data) {
        info(`The return data is ${JSON.stringify(data, null, 2)}\n`);
        expect(data).to.be.ok;
      });
    });

    it('should return a list of devices in js object data structure', () => {
      return yktManager.getDevices().then(function(data) {
        info(`The return data is ${JSON.stringify(data, null, 2)}\n`);
        expect(data.length).to.be.equal(1054);
      });
    });

    it('should return a list of shops in js object data structure', () => {
      return yktManager.getShops().then(function(data) {
        info(`The return data is ${JSON.stringify(data, null, 2)}\n`);
        expect(data.length).to.be.equal(150);
      });
    });

    it('should return a single shop in js object data structure', () => {
      return yktManager.getShop('15').then(function(data) {
        info(`The return data is ${JSON.stringify(data, null, 2)}\n`);
        expect(data).to.be.ok;
      });
    });


    it('should return a list of shopBill in js object data structure', () => {
      return yktManager.getShopBillsByShopId("15", "20170111").then(function(data) {
        info(`The return data is ${JSON.stringify(data, null, 2)}\n`);
        expect(data.length).to.be.greaterThan(0);
      });
    });

    it('should return a list of deviceBill in js object data structure', () => {
      return yktManager.getDeviceBills("107", "20170111").then(function(data) {
        info(`The return data is ${JSON.stringify(data, null, 2)}\n`);
        expect(data.length).to.be.greaterThan(0);
      });
    });

    it('should return a single shopBill in js object data structure', () => {
      return yktManager.getShopBillMonth("107", "201703").then(function(data) {
        info(`The return data is ${JSON.stringify(data, null, 2)}\n`);
        expect(data).to.be.ok;
      });
    });

    it('should return a list of shopBill in js object data structure', () => {
      return yktManager.getShopBillsMonth("15", "201703").then(function(data) {
        info(`The return data is ${JSON.stringify(data, null, 2)}\n`);
        expect(data.length).to.be.equal(5);
      });
    });

    it('should return a list of shopBill in js object data structure', () => {
      return yktManager.getShopBillsMonth(null, "201703").then(function(data) {
        info(`The return data is ${JSON.stringify(data, null, 2)}\n`);
        expect(data.length).to.be.greaterThan(0);
      });
    });

    it('should return a list of operatorBills in js object data structure', () => {
      return yktManager.getOperatorBillsByAccDate("20170303").then(function(data) {
        info(`The return data is ${JSON.stringify(data, null, 2)}\n`);
        expect(data.length).to.be.equal(12);
      });
    });

    it('should return a list of operatorBills in js object data structure', () => {
      return yktManager.getOperatorBillsByOperCodeAndAccDate("1002680", "20170303").then(function(data) {
        info(`The return data is ${JSON.stringify(data, null, 2)}\n`);
        expect(data.length).to.be.equal(2);
      });
    });



  });

});
