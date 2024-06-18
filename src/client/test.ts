/*
 * @Author: peerless_hero 121016171@qq.com
 * @Date: 2024-06-18 10:46:16
 * @LastEditors: peerless_hero 121016171@qq.com
 * @LastEditTime: 2024-06-18 13:03:46
 * @FilePath: \aliyun-sdk\src\client\test.ts
 * @Description: 本地自测方法。鉴于阿里云接口的存在调用费率和频次限制，故没有添加单元测试。
 *
 */
import { stringify } from 'fast-querystring'
import consola from 'consola'
import { BaseClient } from './index'

export interface BaseClientConfig {
  accessKeyId?: string
  accessKeySecret?: string
  endpoint?: string
  baseURL?: string
}
    /**
     * `cas`可用端点
     */
    type CasEndpoint = 'cas.aliyuncs.com' | 'cas.eu-central-1.aliyuncs.com' | 'cas.ap-southeast-1.aliyuncs.com'
    /**
     * `cas`客户端配置
     */
    type CasClientConfig = BaseClientConfig & {
      endpoint?: CasEndpoint
    }

interface CasListDeploymentJobParameters {
  /**
   * 任务类型。
   *
   * @example
   * 'user'
   */
  JobType?: string
  /**
   * 部署任务状态。
   *
   * @example
   * 'pending'
   */
  Status?: string
  /**
   * 分页。当前页，默认1。
   *
   * @example
   * 1
   */
  CurrentPage?: number
  /**
   * 分页查询时，设置每页显示证书的数量。默认值为**50**。
   *
   * @example
   * 50
   */
  ShowSize?: number
}

/**
 * 数字证书管理服务（原SSL证书）
 *
 * @version 2020-04-07
 * @link https://api.aliyun.com/document/cas/2020-04-07/overview
 */
export class CasClient extends BaseClient {
  readonly RPC = true as const
  readonly version = '2020-04-07' as const
  endpoint: CasEndpoint = 'cas.aliyuncs.com'
  constructor({ endpoint = 'cas.aliyuncs.com', accessKeyId, accessKeySecret }: CasClientConfig = {}) {
    super({ endpoint, accessKeyId, accessKeySecret })
  }

  /**
   * 切换Endpoint
   */
  setEndpoint(endpoint: CasEndpoint) {
    this.endpoint = endpoint
    this.request.defaults.baseURL = `https://${endpoint}`
  }

  /**
   * 查询任务状态。
   */
  async DescribeDeploymentJobStatus(parameters: CasListDeploymentJobParameters) {
    const res = await this.fetch(
      'DescribeDeploymentJobStatus',
      {
        method: 'POST',
        data: stringify(parameters),
      },
    )
    return res.data
  }

  /**
   * 获取部署任务的资源列表。
   */
  async ListDeploymentJob(parameters: CasListDeploymentJobParameters) {
    const res = await this.fetch(
      'ListDeploymentJob',
      {
        method: 'POST',
        data: stringify(parameters),
      },
    )
    return res.data
  }
}

async function test() {
  // 请自备accessKeyId和accessKeySecret
  const casClient = new CasClient()
  try {
    const res = await casClient.ListDeploymentJob({
      CurrentPage: 1,
    })
    consola.success(res)
    return res
  }
  catch (err: any) {
    consola.fail(err.config)
    consola.fail(err.response.data)
  }
}
test()
