# ecard-api

一卡通系统数据API

## API

### 对象
#### Shop
- 示例
  ```js
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

### YktManager
一卡通数据操作类

#### async getAncestorShops(shop: Shop | shopId: String): [Shop]
获取指定商户的所有祖先商户节点。

- 参数
  - `shop` 指定的商户，至少包含`shopId`和`fShopId`两个字段；
  - 或 `shopId` 指定的商户Id，可转换给数字的字符串。
- 返回值
  - `Shop` 对象数组
