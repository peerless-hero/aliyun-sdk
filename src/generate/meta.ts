/*
 * @Author: peerless_hero peerless_hero@outlook.com
 * @Date: 2024-06-09 03:59:35
 * @LastEditors: peerless_hero peerless_hero@outlook.com
 * @LastEditTime: 2024-12-22 04:10:37
 * @FilePath: \aliyun-sdk\src\generate\meta.ts
 * @Description:
 *
 */
import consola from 'consola'

export interface Product {
  code: string
  name: string
  description: string
  shortName: string | null
  group: string
  style: string | null
  versions: string[]
  defaultVersion: string
}

interface ApiDocDirectory {
  id?: number
  title?: string
  type?: string
  children?: (string | ApiDocDirectory)[]
}

export interface Api {
  summary: string
  methods: string[]
  schemes: string[]
  security: Partial<Record<'AK' | 'Anonymous', any[]>>[]
  operationType?: string
  deprecated?: boolean
  systemTags: ApiSystemTags
  parameters: ApiParameters[]
  responses: {
    '200'?: {
      schema?: ApiSchema
      headers?: any
    }
    '4xx'?: {
      schema?: ApiSchema
      headers?: any
    }
  }
  staticInfo?: Partial<Record<'returnType', string>>
  responseDemo: string
  title?: string
}

interface ApiSystemTags {
  operationType?: string
  riskType?: string
  chargeType?: string
  abilityTreeCode?: string
  abilityTreeNodes?: string[]
}

export interface ApiParameters {
  name: string
  in: string
  schema?: ApiSchema
}

export interface ApiSchema {
  schema?: ApiSchema
  title?: string
  description?: string
  type?: string
  format?: string
  required?: boolean
  example?: string
  enumValueTitles?: Partial<Record<string, string>>
  properties?: Partial<Record<string, ApiSchema>>
  items?: ApiSchema
  additionalProperties?: ApiSchema
  $ref?: string
}

export interface ApiDocs {
  version: string
  info: {
    style: string
    product: string
    version: string
  }
  directories: ApiDocDirectory[]
  components: {
    schemas: object
  }
  apis: {
    [action: string]: Api
  }
  endpoints: Record<'regionId' | 'endpoint', string>[]
}

/**
 * 阿里云产品元数据 API 的 URL
 */
const ALIYUN_PRODUCTS_META_URL = 'https://api.aliyun.com/meta/v1/products'

/**
 * 获取阿里云产品的元数据
 * @returns {Promise<Product[]>} 返回一个 Promise，解析为 Product 数组
 */
export async function getProductsMeta(): Promise<Product[]> {
  // 发送 GET 请求到阿里云元数据 API 获取产品列表
  const response = await fetch(ALIYUN_PRODUCTS_META_URL)
  // 将响应数据解析为 JSON 格式
  const data = await response.json()
  // 将解析后的数据转换为 Product 数组并返回
  return data as Product[]
}

/**
 * 获取指定产品和版本的阿里云 API 文档元数据
 * @param {string} code - 产品代码
 * @param {string} version - 产品版本
 * @returns {Promise<ApiDocs>} 返回一个 Promise，解析为 ApiDocs 对象
 */
export async function getProductApiDocMeta(code: string, version: string): Promise<ApiDocs> {
  // 构建 API 文档元数据的 URL
  const url = `${ALIYUN_PRODUCTS_META_URL}/${code}/versions/${version}/api-docs.json`
  // 发送 GET 请求到阿里云元数据 API 获取 API 文档元数据
  const response = await fetch(url)
  // 将响应数据解析为 JSON 格式
  const data = await response.json()
  // 使用 consola 库记录日志，显示从哪个 URL 加载了 API 文档元数据
  consola.log(`Load ${code} ${version} api doc meta from ${url}`)
  // 将解析后的数据转换为 ApiDocs 对象并返回
  return data as ApiDocs
}
