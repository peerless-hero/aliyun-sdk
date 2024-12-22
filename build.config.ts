/*
 * @Author: peerless_hero peerless_hero@outlook.com
 * @Date: 2024-06-08 16:00:58
 * @LastEditors: peerless_hero peerless_hero@outlook.com
 * @LastEditTime: 2024-12-22 21:34:48
 * @FilePath: \aliyun-sdk\build.config.ts
 * @Description:
 *
 */
import type { TranspileOptions } from 'typescript'
import consola from 'consola'
import fs from 'fs-extra'
import { defineBuildConfig } from 'unbuild'
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
