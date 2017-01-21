# YktManager
一卡通数据操作类

## async getAncestorShops(shop: Shop | shopId: String): [Shop]
获取指定商户的所有祖先商户节点。

- 参数
  - `shop` 指定的商户，至少包含`shopId`和`fShopId`两个字段；
  - 或 `shopId` 指定的商户Id，可转换给数字的字符串。
- 返回值
  - `Shop` 对象数组

## async getDeviceBill(deviceId: String, accDate: String): [DeviceDailyBill]
获取指定设备及日期的账单

- 参数
  - `deviceId` 指定设备的Id，可转换为数字的字符串；
  - `accDate` 账单日期。8为数字的日期，格式为`YYYYMMDD`，例如：`20170119`；
- 返回值
  `DeviceDailyBill` 对象数组
