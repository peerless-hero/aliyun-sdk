/*
 * @Author: peerless_hero peerless_hero@outlook.com
 * @Date: 2024-06-11 04:20:59
 * @LastEditors: peerless_hero 121016171@qq.com
 * @LastEditTime: 2024-06-18 16:18:54
 * @FilePath: \aliyun-sdk\test\build.test.ts
 * @Description:
 *
 */
import { describe, expect, it } from 'vitest'
import { renderAPI } from '../src/generate/api'

import products from './products.json'
import roa from './roa.json'
import rpc from './rpc.json'
import ICE from './ICE.json'
import Oss from './Oss.json'

describe('generateAPI rpc', () => {
  it('should render API documentation for a product', async () => {
    const product = products[0]
    const api = rpc

    await expect(renderAPI(product, api, 'RPC')).resolves.not.toThrow()
  })
})

describe('renderAPI roa', () => {
  it('should render API documentation for a product', async () => {
    const product = products[17]
    const api = roa

    await expect(renderAPI(product, api, 'ROA')).resolves.not.toThrow()
  })
})

describe('renderAPI RPC ICE', () => {
  it('should render API documentation for a product', async () => {
    const product = products[183]
    const api = ICE

    await expect(renderAPI(product, api, 'ICE')).resolves.not.toThrow()
  })
})
describe('renderAPI RPC Oss', () => {
  it('should render API documentation for a product', async () => {
    const index = products.findIndex(p => p.code === 'Oss')

    const product = products[index]
    const api = Oss

    await expect(renderAPI(product, api, 'Oss')).resolves.not.toThrow()
  })
})
