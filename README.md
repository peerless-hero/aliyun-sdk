# @peerless-hero/aliyun-sdk

This tool is an SDK tool encapsulated based on Alibaba Cloud OpenAPI. Because the officially provided SDK is difficult to use and has too few documents, we have encapsulated a set of tools ourselves.

## Documentation

- [中文版](README.zh-cn.md)
- [English Version](README.md)

## Installation

```bash
# npm
npm install --save @peerless-hero/aliyun-sdk

# yarn
yarn add -D @peerless-hero/aliyun-sdk

# pnpm
pnpm add -D @peerless-hero/aliyun-sdk
```

## Usage

```ts
// Taking the Cas function module as an example
// The default export is the default version described in the current API document
import { type Cas, CasClient } from '@peerless-hero/aliyun-sdk'
// When initializing the instance, you can not directly pass in the parameters of accessKeyId and accessKeySecret
// Instead, provide the environment variables ALIYUN_ACCESS_KEY_ID and ALIYUN_ACCESS_KEY_SECRET
// The SDK will automatically read the environment variables and use them
const cas = new CasClient({
  // Alibaba Cloud AccessKey
  accessKeyId: 'xxxxxxxxxxxxxxxx',
  // Alibaba Cloud AccessKeySecret
  accessKeySecret: 'xxxxxxxxxxxxxxxx',
})
// Use the types in it
let result: Cas.DescribeCACertificateListData | null = null
// Call the method
// All method names are taken from the official documentation
result = await cas.DescribeCACertificateList({})
```

```ts
// The default export is the default version of the current API. If you need to use a specific version, please import it in the following way
// For example, using the 2020-06-30 version of the Cas module
import { type Cas, CasClient } from '@peerless-hero/aliyun-sdk/versions/2020-06-30'
```

```ts
// All modules use the first Endpoint provided in the document by default. If you need to switch, please set it in the following way
cas.setEndpoint('cn-hangzhou') // Set the request domain name
```

## Notes

- This tool only supports Node.js environments with a version not less than 17.15.0.
- This tool does not provide oss-related interfaces because the signature method of these interfaces is quite different from other interfaces. Because Alibaba Cloud oss is compatible with the s3 protocol, it is more recommended to use [s3-sdk](https://github.com/aws/aws-sdk-js-v3) for related operations.
- This tool's code is automatically generated based on the [product document interface](https://api.aliyun.com/meta/v1/products) publicly provided by Alibaba Cloud and may be missing due to document updates. If there is an update requirement at that time, please raise an [issue](https://github.com/peerless-hero/aliyun-sdk/issues) on github.

## License

[MIT](./LICENSE) License © 2023-PRESENT [Peerless Hero](https://github.com/peerless-hero)
