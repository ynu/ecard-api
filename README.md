# ecard-api

一卡通系统数据API

## API

### 对象
#### Shop
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

#### DeviceDailyBill
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
  - accDate 账单日期,
  - transCnt 消费笔数
  - drAmt 冲正金额
  - crAmt 消费金额
  - fShopId 父商户Id
  - shopId 商户Id
  - accNo
  - shopName 商户名称
  - deviceNo
  - devPyhId 设备物理Id

### YktManager
一卡通数据操作类

#### async getAncestorShops(shop: Shop | shopId: String): [Shop]
获取指定商户的所有祖先商户节点。

- 参数
  - `shop` 指定的商户，至少包含`shopId`和`fShopId`两个字段；
  - 或 `shopId` 指定的商户Id，可转换给数字的字符串。
- 返回值
  - `Shop` 对象数组

#### async getDeviceBill(deviceId: String, accDate: String): [DeviceDailyBill]
获取指定设备及日期的账单

- 参数
  - `deviceId` 指定设备的Id，可转换为数字的字符串；
  - `accDate` 账单日期。8为数字的日期，格式为`YYYYMMDD`，例如：`20170119`；
- 返回值
  `DeviceDailyBill` 对象数组
