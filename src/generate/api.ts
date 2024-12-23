import type { ApiDocs, ApiParameters, Product } from './meta.js'
/*
 * @Author: peerless_hero peerless_hero@outlook.com
 * @Date: 2024-06-09 04:38:43
 * @LastEditors: peerless_hero peerless_hero@outlook.com
 * @LastEditTime: 2024-12-22 04:38:24
 * @FilePath: \aliyun-sdk\src\generate\api.ts
 * @Description:
 *
 */
import { resolve } from 'node:path'
import consola from 'consola'
import { renderFile } from 'ejs'
import fs from 'fs-extra'
import { getProductApiDocMeta, getProductsMeta } from './meta.js'

const ejsPath = resolve('./src/ejs/api.ejs')

function getPrefix(string: string) {
  let prefix = ''
  let toUpperCase = true
  for (const str of string) {
    if (toUpperCase) {
      prefix += str.toUpperCase()
      toUpperCase = false
    }
    else if (str === '-') {
      toUpperCase = true
    }
    else {
      prefix += str
    }
  }
  return prefix
}

function filterParameters(parameters: ApiParameters[] = []) {
  const record: Record<string, ApiParameters> = {}
  for (const parameter of parameters) {
    if (parameter.in === 'query') {
      record[parameter.name] = parameter
    }
  }
  return Object.values(record)
}

/** 是否可省略parameters */
function notRequireParameters(parameters: ApiParameters[] = []) {
  for (const parameter of parameters) {
    if (parameter.in === 'query' && parameter.schema?.required) {
      // 存在必填参数
      return false
    }
  }
  return true
}

export async function renderAPI(product: Product, api: ApiDocs, PREFIX: string) {
  const keys = Object.keys(api.apis)
  if (keys.length === 0) {
    consola.warn(`No apis found for ${api.info.product} at ${api.info.version}`)
    return false
  }
  if (api.endpoints.length === 0) {
    consola.warn(`No endpoint found for ${api.info.product} at ${api.info.version}`)
    return false
  }

  // product.style和api.info.style 虽表达同一含义，但实际上二者可能出现完全相反的情况
  // 例如，product.style可能是'RPC'，而api.info.style却可能是'V3'
  const RPC = api.info.style === 'RPC' || product.style === 'RPC'
  try {
    const text = await renderFile(ejsPath, { PREFIX, api, RPC, filterParameters, notRequireParameters, name: product.name })
    await fs.outputFile(resolve(`./packages/${api.info.product}/${api.info.version}.ts`), text)
    return product.defaultVersion === api.info.version
  }
  catch (err) {
    consola.error(api.info.product, api.info.version, err)
    return false
  }
}

export type ApiList = {
  PREFIX: string
  product: Product
}[]

export async function generateAPI() {
  const products = await getProductsMeta()
  consola.start('Generate API with', products.length)
  const apiList: ApiList = []
  for (let i = 0; i < products.length; i++) {
    const product = products[i]
    consola.info('Generating', `${i + 1}/${products.length}`)
    if (product.code === 'Oss') {
      consola.info('This tool does not provide oss-related interfaces because the signature method of these interfaces is quite different from other interfaces. Because Alibaba Cloud oss is compatible with the s3 protocol, it is more recommended to use s3-sdk for related operations.')
      continue
    }
    const apis = await Promise.all(product.versions.map(version => getProductApiDocMeta(product.code, version)))
    const PREFIX = getPrefix(product.code)
    /** 默认版本是否构建成功 */
    let success = false
    await Promise.all(apis.map(async (api) => {
      const res = await renderAPI(product, api, PREFIX)
      success = success || res
    }))
    if (success) {
      apiList.push({ PREFIX, product })
    }
  }
  consola.start('Generate API end.')
  return apiList
}
