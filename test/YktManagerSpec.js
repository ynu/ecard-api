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

    const yktManager = new YktManager({url: process.env.DATABASE_URL});

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


    it('should return a list of shopBill in js object data structure', () => {
      return yktManager.getShopBills("15", "20170111").then(function(data) {
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

  });

});
