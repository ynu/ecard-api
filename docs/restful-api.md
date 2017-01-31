# RESTful 接口
`ecard-api` 以RESTful的方式提供数据读取API。

## 返回值说明
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

## API
### 获取指定商户信息
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

### 获取指定商户单日账单
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

### 获取指定商户日账单列表
`GET /shop/:shopId/daily-bill?token=TOKEN`

- 参数
  - `shopId` 指定的商户Id；
  - `token` 访问系统的token。
- 返回值
```javascript
{
  ret: 0,
  data: [ ... ] // ShopBill 对象数组
}
```

### 获取子商户单日账单列表
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
### 获取所属商户的设备的日账单列表
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

### 获取指定商户单月账单
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

### 获取子商户月账单列表
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
### 获取所属商户的设备的月账单列表
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

### 获取指定商户节点的所有祖先节点

`GET /shop/:shopId/ancestors?token=TOKEN`

- 参数
  - `shopId` 指定的商户Id；
  - `token` 访问系统的token。
- 返回值
```javascript
{
  ret: 0,
  data: [ ... ] // Shop 对象数组
}
```
