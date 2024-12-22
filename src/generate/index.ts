/*
 * @Author: zjf 121016171@qq.com
 * @Date: 2024-06-11 15:57:57
 * @LastEditors: peerless_hero peerless_hero@outlook.com
 * @LastEditTime: 2024-12-22 20:32:27
 * @FilePath: \aliyun-sdk\src\generate\index.ts
 * @Description:
 *
 */
import { resolve } from 'node:path'
import { cwd } from 'node:process'
import consola from 'consola'
import { renderFile } from 'ejs'
import fs from 'fs-extra'
import { type ApiList, generateAPI } from './api.js'

async function generateIndex(apiList: ApiList) {
  const root = cwd()
  const ejsPath = resolve(root, './src/ejs/index.ejs')
  const newPath = resolve(root, './packages/index.ts')
  const file = await renderFile(ejsPath, { apiList })
  return fs.outputFile(newPath, file)
}

export async function generatePackages() {
  const root = cwd()
  const clientPath = resolve(root, './src/client/index.ts')
  const newClientPath = resolve(root, './packages/client.ts')
  await fs.copyFile(clientPath, newClientPath)
  const apiList = await generateAPI()
  await generateIndex(apiList)
  consola.success('Generate packages success!')
}
