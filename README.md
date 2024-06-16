# @peerless-hero/aliyun-sdk

本工具是对基于阿里云OpenAPI封装的SDK工具。由于官方提供的SDK难于使用，且文档过少，因此自己封装了一套工具。

## 安装

```bash
pnpm i -g @@peerless-hero/aliyun-sdk
```

## 使用

```ts
// 以Cas功能模块为例
import { type Cas, CasClient } from '@@peerless-hero/aliyun-sdk'

const cas = new CasClient({
  // 阿里云AccessKey
  accessKeyId: 'xxxxxxxxxxxxxxxx',
  // 阿里云AccessKeySecret
  accessKeySecret: 'xxxxxxxxxxxxxxxx',
})
// 使用其中的类型
let result: Cas.DescribeCACertificateListData | null = null
// 使用
// 所有方法名称均取自官方文档
result = await cas.DescribeCACertificateList({})
```

```ts
// 使用特定版本
import { type Cas, CasClient } from '@peerless-hero/aliyun-sdk/versions/2020-06-30'
```

## License

[MIT](./LICENSE) License © 2023-PRESENT [Peerless Hero](https://github.com/peerless-hero)
