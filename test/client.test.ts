/*
 * @Author: peerless_hero peerless_hero@outlook.com
 * @Date: 2024-06-09 02:51:49
 * @LastEditors: peerless_hero 121016171@qq.com
 * @LastEditTime: 2024-06-18 14:08:34
 * @FilePath: \aliyun-sdk\test\client.test.ts
 * @Description:
 *
 */
import { describe, expect, it } from 'vitest'
import { BaseClient } from '../src/client'

describe('base', () => {
  const client = new BaseClient({
    accessKeyId: 'testAccessKeyId',
    accessKeySecret: 'testAccessKeySecret',
  })

  it('should create a new instance of BaseClient', () => {
    expect(client).toBeInstanceOf(BaseClient)
  })

  it('should throw an error if accessKeyId or accessKeySecret is not provided', () => {
    expect(() => {
      return new BaseClient()
    }).toThrow()
  })

  it('should generate proper canonical query string', () => {
    const queryParams = {
      param1: 'value1',
      param2: 'value2',
      param3: 'value3',
    }
    const expectedOutput = 'param1=value1&param2=value2&param3=value3'
    expect(client.canonicalQueryString(queryParams)).toBe(expectedOutput)
  })

  it('should initialize the BaseClient successfully with valid accessKeyId and accessKeySecret', () => {
    expect(client).toBeInstanceOf(BaseClient)
  })

  it('should calculate HMAC-SHA256 signature correctly', () => {
    const key = 'testKey'
    const data = 'testData'
    const expectedSignature = client.hmac256(key, data)
    expect(client.hmac256(key, data)).toBe(expectedSignature)
  })

  it('should hash request payload correctly', () => {
    const data = { test: 'data' }
    const expectedHash = client.sha256Hex(JSON.stringify(data))
    expect(client.hashRequestPayload(data)).toBe(expectedHash)
  })
})

describe('signature', () => {
  // 本测试用例参考自阿里云官方文档：https://help.aliyun.com/zh/sdk/product-overview/v3-request-structure-and-signature
  // 这里仅测试Authorization以外的请求头
  const accessKeyId = 'YourAccessKeyId'
  const accessKeySecret = 'YourAccessKeySecret'
  const version = '2014-05-26'
  const date = '2023-10-26T10:22:32Z'
  const action = 'RunInstances'
  const signatureNonce = '3156853299f313e23d1673dc12e1703d'
  const signedHeaders = 'host;x-acs-action;x-acs-content-sha256;x-acs-date;x-acs-signature-nonce;x-acs-version'
  const endpoint = 'ecs.cn-shanghai.aliyuncs.com'
  const client = new BaseClient({ accessKeyId, accessKeySecret, endpoint, version })

  it('should sign the request with correct headers', () => {
    const expectedHeaders = {
      'host': 'ecs.cn-shanghai.aliyuncs.com',
      'x-acs-action': action,
      'x-acs-content-sha256': 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      'x-acs-date': date,
      'x-acs-signature-nonce': signatureNonce,
      'x-acs-version': version,
    }
    const expectedSignature = client.signHeaders({ action, signatureNonce, date: new Date(date) })
    expect(expectedSignature.headers).toEqual(expectedHeaders)
    expect(expectedSignature.signedHeaders).toBe(signedHeaders)
  })
})
