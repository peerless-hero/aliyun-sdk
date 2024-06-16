/*
 * @Author: peerless_hero peerless_hero@outlook.com
 * @Date: 2024-06-09 03:59:35
 * @LastEditors: peerless_hero peerless_hero@outlook.com
 * @LastEditTime: 2024-06-16 23:10:24
 * @FilePath: \aliyun-sdk\src\generate\meta.ts
 * @Description:
 *
 */
import axios from 'axios'
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
  responses: Record<'200', Partial<Record<'schema', ApiSchema>>>
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

export async function getProductsMeta() {
  const res = await axios.get<Product[]>('https://api.aliyun.com/meta/v1/products/')
  return res.data
}

export async function getProductApiDocMeta(code: string, version: string) {
  const api = await axios.get<ApiDocs>(`https://api.aliyun.com/meta/v1/products/${code}/versions/${version}/api-docs.json`)
  consola.log(`Load ${code} ${version} api doc meta from https://api.aliyun.com/meta/v1/products/${code}/versions/${version}/api-docs.json`)
  return api.data
}
