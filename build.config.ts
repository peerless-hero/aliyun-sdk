/*
 * @Author: peerless_hero peerless_hero@outlook.com
 * @Date: 2024-06-08 16:00:58
 * @LastEditors: peerless_hero peerless_hero@outlook.com
 * @LastEditTime: 2024-06-16 22:20:55
 * @FilePath: \aliyun-sdk\build.config.ts
 * @Description:
 *
 */
import { defineBuildConfig } from 'unbuild'
import consola from 'consola'
import fs from 'fs-extra'
import type { TranspileOptions } from 'typescript'
import { generatePackages } from './src/generate/index'

const typescript: TranspileOptions = {
  compilerOptions: {
    // 编译时不进行模块解析
    noResolve: true,
  },
}
export default defineBuildConfig({
  entries: [
    {
      builder: 'mkdist',
      input: './packages',
      outDir: './dist',
      format: 'cjs',
      ext: 'cjs',
      typescript,
    },
    {
      builder: 'mkdist',
      input: './packages',
      outDir: './dist',
      format: 'esm',
      typescript,
    },
  ],
  declaration: true,
  clean: true,

  rollup: {
    emitCJS: true,
  },
  hooks: {
    'build:before': async function () {
      consola.info('Empty packages directory.')
      await fs.emptyDir('./packages')
      await generatePackages()
    },
  },
})
