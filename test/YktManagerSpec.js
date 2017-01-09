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

describe('YktManager', () => {

  describe('yktManager test', () => {

    const yktManager = new YktManager({url: process.env.DATABASE_URL});

    it('should return a single shopBill in js object data structure', () => {
      return yktManager.getShopBill("110", "20170108").then(function(data) {
        console.info(data);
        expect(data).to.be.ok;
      });
    });

    it('should return a single deviceBill in js object data structure', () => {
      return yktManager.getDeviceBill("50040223", "20170105").then(function(data) {
        console.info(data);
        expect(data).to.be.ok;
      });
    });

    it('should return a list of devices in js object data structure', () => {
      return yktManager.getDevices().then(function(data) {
        console.info(data);
        expect(data.length).to.be.equal(709);
      });
    });

    it('should return a list of shops in js object data structure', () => {
      return yktManager.getShops().then(function(data) {
        console.info(data);
        expect(data.length).to.be.equal(150);
      });
    });


    it('should return a list of shopBill in js object data structure', () => {
      return yktManager.getShopBills("196", "20170108").then(function(data) {
        console.info(data);
        expect(data.length).to.be.greaterThan(0);
      });
    });

    it('should return a list of deviceBill in js object data structure', () => {
      return yktManager.getDeviceBills("110", "20170105").then(function(data) {
        console.info(data);
        expect(data.length).to.be.greaterThan(0);
      });
    });

  });

});
