# @peerless-hero/aliyun-sdk

本工具是对基于阿里云OpenAPI封装的SDK工具。由于官方提供的SDK难于使用，且文档过少，因此自己封装了一套工具。

## 目录

- [English Version](README.md)
- [中文版](README.zh-cn.md)

## 安装

```bash
# npm
npm install --save @peerless-hero/aliyun-sdk

# yarn
yarn add -D @peerless-hero/aliyun-sdk

# pnpm
pnpm add -D @peerless-hero/aliyun-sdk
```

## 使用

```ts
// 以Cas功能模块为例
// 默认导出均为当前API文档描述的默认版本
import { type Cas, CasClient } from '@peerless-hero/aliyun-sdk'
// 初始化实例时，你可以不直接传入accessKeyId和accessKeySecret的参数
// 而是提供环境变量 ALIYUN_ACCESS_KEY_ID 和 ALIYUN_ACCESS_KEY_SECRET
// SDK会自动读取环境变量并使用
const cas = new CasClient({
  // 阿里云AccessKey
  accessKeyId: 'xxxxxxxxxxxxxxxx',
  // 阿里云AccessKeySecret
  accessKeySecret: 'xxxxxxxxxxxxxxxx',
})
// 使用其中的类型
let result: Cas.DescribeCACertificateListData | null = null
// 调用方法
// 所有方法名称均取自官方文档
result = await cas.DescribeCACertificateList({})
```

```ts
// 默认导出均为当前API的默认版本，如需使用特定版本，请以如下方式导入
// 例如使用2020-06-30版本的Cas模块
import { type Cas, CasClient } from '@peerless-hero/aliyun-sdk/versions/2020-06-30'
```

```ts
// 所有模块均默认使用了文档提供的第一个Endpoint，如需切换，请使用如下方式设置
cas.setEndpoint('cn-hangzhou') // 设置请求域名
```

## 注意事项

- 本工具仅支持版本不小于17.15.0的Node.js环境。
- 本工具不提供oss相关接口，因为这部分接口签名方式与其他接口存在较大差异。因为阿里云oss是兼容s3协议的，所以更推荐[s3-sdk](https://github.com/aws/aws-sdk-js-v3)进行相关操作，
- 本工具代码基于阿里云公开的[产品文档接口](https://api.aliyun.com/meta/v1/products)自动生成，可能因文档更新而产生遗漏。届时如有更新需求，请在github上提[issue](https://github.com/peerless-hero/aliyun-sdk/issues)。

## License

[MIT](./LICENSE) License © 2023-PRESENT [Peerless Hero](https://github.com/peerless-hero)
