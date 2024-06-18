# @peerless-hero/aliyun-sdk

本工具是对基于阿里云OpenAPI封装的SDK工具。由于官方提供的SDK难于使用，且文档过少，因此自己封装了一套工具。

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

## License

[MIT](./LICENSE) License © 2023-PRESENT [Peerless Hero](https://github.com/peerless-hero)
