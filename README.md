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

#### DeviceBill
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

### RESTful 接口
为方便使用，`ecard-api` 以RESTful的方式提供数据读取API。

#### 返回值说明
所有请求的返回值包括两种类型：
- 操作成功返回：
```javascript
{
  ret: 0,   // 操作成功时，返回码为0
  data: ... // 操作返回的数据
}
```
- 操作失败返回：
```javascript
{
  ret: 401, // 操作失败时，返回码为非0值
  msg: ""   // 错误提示
}
```

#### 获取指定商户信息
`GET /shop/:shopId?token=TOKEN`

- 参数
  - `shopId` 指定的商户Id；
  - `token` 访问系统的token。
- 返回值
```javascript
{
  ret: 0,
  data: { ... } // Shop 对象
}
```

#### 获取指定商户日账单
`GET /shop/:shopId/daily-bill/:accDate?token=TOKEN`

- 参数
  - `shopId` 指定的商户Id；
  - `accDate` 账单日期。8位数字的日期，格式为`YYYYMMDD`，例如：`20170119`；
  - `token` 访问系统的token。
- 返回值
```javascript
{
  ret: 0,
  data: { ... } // ShopBill 对象
}
```

#### 获取子商户日账单列表
`GET /shop/:fShopId/sub-shop-daily-bills/:accDate?token=TOKEN`

- 参数
  - `fShopId` 指定的父商户Id；
  - `accDate` 账单日期。8位数字的日期，格式为`YYYYMMDD`，例如：`20170119`；
  - `token` 访问系统的token。
- 返回值
```javascript
{
  ret: 0,
  data: [ ... ] // ShopBill 对象数组
}
```
#### 获取所属商户的设备的日账单列表
`GET /shop/:shopId/device-dayly-bills/:accDate?token=TOKEN`

- 参数
  - `shopId` 指定的商户Id；
  - `accDate` 账单日期。8位数字的日期，格式为`YYYYMMDD`，例如：`20170119`；
  - `token` 访问系统的token。
- 返回值
```javascript
{
  ret: 0,
  data: [ ... ] // DeviceBill 对象数组
}
```

#### 获取指定商户月账单
`GET /shop/:shopId/monthly-bill/:accDate?token=TOKEN`

- 参数
  - `shopId` 指定的商户Id；
  - `accDate` 账单日期。6位数字的日期，格式为`YYYYMM`，例如：`201701`；
  - `token` 访问系统的token。
- 返回值
```javascript
{
  ret: 0,
  data: { ... } // ShopBill 对象
}
```

#### 获取子商户月账单列表
`GET /shop/:fShopId/sub-shop-monthly-bills/:accDate?token=TOKEN`

- 参数
  - `fShopId` 指定的父商户Id；
  - `accDate` 账单日期。8位数字的日期，格式为`YYYYMM`，例如：`201701`；
  - `token` 访问系统的token。
- 返回值
```javascript
{
  ret: 0,
  data: [ ... ] // ShopBill 对象数组
}
```
#### 获取所属商户的设备的月账单列表
`GET /shop/:shopId/device-monthly-bills/:accDate?token=TOKEN`

- 参数
  - `shopId` 指定的商户Id；
  - `accDate` 账单日期。8位数字的日期，格式为`YYYYMM`，例如：`201701`；
  - `token` 访问系统的token。
- 返回值
```javascript
{
  ret: 0,
  data: [ ... ] // DeviceBill 对象数组
}
```
