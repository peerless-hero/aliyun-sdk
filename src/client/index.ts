/*
 * @Author: peerless_hero peerless_hero@outlook.com
 * @Date: 2024-06-08 16:49:48
 * @LastEditors: peerless_hero peerless_hero@outlook.com
 * @LastEditTime: 2024-06-19 00:12:09
 * @FilePath: \aliyun-sdk\src\client\index.ts
 * @Description:
 *
 */
import { env } from 'node:process'
import { Buffer } from 'node:buffer'
import { createHash, createHmac, randomBytes } from 'node:crypto'
import { stringify } from 'fast-querystring'

import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosRequestHeaders } from 'axios'

/**
 * 基础客户端配置
 */
export interface BaseClientConfig {
  /**
   * 阿里云访问密钥ID
   *
   * 不提供时，自动识别并注入环境变量 `ALIYUN_ACCESS_KEY_ID`
   */
  accessKeyId?: string
  /**
   * 阿里云访问密钥
   *
   * 不提供时，自动识别并注入环境变量 `ALIYUN_ACCESS_KEY_SECRET`
   */
  accessKeySecret?: string
  /**
   * 阿里云服务地址
   *
   * 即 Endpoint。您可以查阅不同云产品的服务接入地址文档，查阅不同服务区域下的服务地址。
   */
  endpoint?: string
  /** 阿里云API的版本 */
  version?: string
  /** 接口风格是否为RPC */
  RPC?: boolean
}

interface GeneratedHeader {
  action: string
  signatureNonce?: string
  data?: any
  date?: Date
}

/**
 * 基础客户端
 */
export class BaseClient {
  private accessKeyId: string
  private accessKeySecret: string
  protected endpoint = ''
  protected version: string
  protected RPC: boolean
  /** 阿里云API请求实例（基于axios） */
  protected request: AxiosInstance
  constructor(config: BaseClientConfig = {}) {
    const {
      accessKeyId = env.ALIYUN_ACCESS_KEY_ID,
      accessKeySecret = env.ALIYUN_ACCESS_KEY_SECRET,
      endpoint = '',
      version = '',
      RPC = false,
    } = config
    if (!accessKeyId) {
      throw new Error('Please provide accessKeyId, or set ALIYUN_ACCESS_KEY_ID in environment variables.')
    }
    if (!accessKeySecret) {
      throw new Error('Please provide accessKeySecret, or set ALIYUN_ACCESS_KEY_SECRET in environment variables.')
    }
    this.accessKeyId = accessKeyId
    this.accessKeySecret = accessKeySecret
    this.endpoint = endpoint
    this.request = axios.create({
      baseURL: `https://${endpoint}`,
      timeout: 10000,
    })
    this.version = version
    this.RPC = RPC
  }

  private canonicalQueryString(queryParam: object = {}) {
    return Object.entries(queryParam)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([key, value]) => stringify({ [key]: value }))
      .join('&')
  }

  /**
   * 计算HMAC-SHA256签名
   */
  private hmac256(key: string, data: string) {
    const hmac = createHmac('sha256', Buffer.from(key, 'binary'))
    hmac.update(data, 'utf8')
    return hmac.digest('hex').toLowerCase()
  }

  /**
   *
   * 计算SHA256摘要
   */
  private sha256Hex(str: string) {
    const hash = createHash('sha256')
    const digest = hash.update(str, 'utf8').digest('hex')
    return digest.toLowerCase()
  }

  private hashRequestPayload(data?: any) {
    if (!data) {
      return this.sha256Hex('')
    }
    const requestPayload = this.RPC ? data : JSON.stringify(data)
    return this.sha256Hex(requestPayload)
  }

  /**
   * 获取请求头相关的签名信息
   */
  private signHeaders({ action, data, signatureNonce = randomBytes(16).toString('hex'), date = new Date() }: GeneratedHeader) {
    const hashedRequestPayload = this.hashRequestPayload(data)
    const headers: AxiosRequestHeaders = {
      'content-type': this.RPC ? 'application/x-www-form-urlencoded' : 'application/json',
      'host': this.endpoint,
      'x-acs-action': action,
      'x-acs-content-sha256': hashedRequestPayload,
      'x-acs-date': date.toISOString().replace(/\..+/, 'Z'),
      'x-acs-signature-nonce': signatureNonce,
      'x-acs-version': this.version,
    }
    if (!data) {
      // 无请求体时，删除content-type请求头
      delete headers['content-type']
    }
    const sortedKeys = Object.keys(headers)
    // 已签名消息头列表，多个请求头名称（小写）按首字母升序排列并以英文分号（;）分隔
    const signedHeaders = sortedKeys.join(';')
    // 构造请求头，多个规范化消息头，按照消息头名称（小写）的字符代码顺序以升序排列后拼接在一起
    const canonicalHeaders = sortedKeys.reduce((result, key) => {
      const value = headers[key]
      // 根据需要格式化结果字符串
      return `${result}${key}:${value}\n`
    }, '')
    return {
      headers,
      /** 已签名消息头列表 */
      signedHeaders,
      /** 规范化请求头 */
      canonicalHeaders,
      hashedRequestPayload,
    }
  }

  /**
   * 根据统一的签名协议，生成签名并发送请求
   * @param action 接口名称
   * @param config 请求配置
   */
  fetch(action: string, config: AxiosRequestConfig) {
    const { method, url = '/', data, params } = config
    /** 签名协议（SignatureAlgorithm） */
    const ALGORITHM = 'ACS3-HMAC-SHA256'
    // 步骤 1：拼接规范请求串
    const canonicalURI = url
    const canonicalQueryString = this.canonicalQueryString(params)
    const { headers, canonicalHeaders, signedHeaders, hashedRequestPayload } = this.signHeaders({ action, data })
    const canonicalRequest = `${method}\n${canonicalURI}\n${canonicalQueryString}\n${canonicalHeaders}\n${signedHeaders}\n${hashedRequestPayload}`
    // 步骤 2：拼接待签名字符串
    const hashedCanonicalRequest = this.sha256Hex(canonicalRequest)
    const stringToSign = `${ALGORITHM}\n${hashedCanonicalRequest}`
    // 步骤 3：计算签名
    const signature = this.hmac256(this.accessKeySecret, stringToSign)
    headers.authorization = `${ALGORITHM} Credential=${this.accessKeyId},SignedHeaders=${signedHeaders},Signature=${signature}`
    config.headers = headers
    return this.request(config)
  }
}
