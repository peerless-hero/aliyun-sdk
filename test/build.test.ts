/*
 * @Author: peerless_hero peerless_hero@outlook.com
 * @Date: 2024-06-11 04:20:59
 * @LastEditors: peerless_hero peerless_hero@outlook.com
 * @LastEditTime: 2024-06-16 04:30:18
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

describe('generateAPI rpc', () => {
  it('should render API documentation for a product', async () => {
    const product = products[0]
    const api = rpc

    await expect(renderAPI(product, api, 'Test')).resolves.not.toThrow()
  })
})

describe('renderAPI roa', () => {
  it('should render API documentation for a product', async () => {
    const product = products[17]
    const api = roa

    await expect(renderAPI(product, api, 'Test')).resolves.not.toThrow()
  })
})

describe('renderAPI RPC ICE', () => {
  it('should render API documentation for a product', async () => {
    const product = products[183]
    const api = ICE

    await expect(renderAPI(product, api, 'Test')).resolves.not.toThrow()
  })
})
