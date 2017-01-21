# 数据结构
此文档描述一卡通系统数据API使用的对象的数据结构。

## Shop
- 示例
```javascript
  {
    shopId: "1",
    fShopId: "0",
    shopName: "云南大学",
    areaCode: "",
    shopType: "",
    accFlag: "",
    status: "",
    accNo: ""
  }
```
- 字段说明
  - shopId 商户编号
  - fShopId 父商户编号
  - shopName 商户名称
  - areaCode
  - shopType
  - accFlag
  - status
  - accNo

## DeviceBill
设备账单

- 示例
```javascript
{
  deviceId: "1"
  deviceName: "POS机",
  accDate: "20170119",
  transCnt: "234",
  drAmt: "2.44",
  crAmt: "44253.22",
  fShopId: "34",
  shopId: "67",
  accNo: "",
  shopName: "商户1",
  deviceNo: "",
  devPyhId: "45334",
}
```
- 字段说明
  - deviceId 设备Id
  - deviceName 设备名称
  - accDate 账单日期，8位日期代表日账单，6位日期代表月账单。
  - transCnt 消费笔数
  - drAmt 冲正金额
  - crAmt 消费金额
  - fShopId 父商户Id
  - shopId 商户Id
  - accNo
  - shopName 商户名称
  - deviceNo
  - devPyhId 设备物理Id
