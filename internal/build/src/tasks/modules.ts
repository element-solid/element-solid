import path from 'path'
import { series } from 'gulp'
import { build } from 'vite'
import solidPlugin from 'vite-plugin-solid'
import { rollup } from 'rollup'

import glob from 'fast-glob'
import { epRoot, excludeFiles, pkgRoot } from '@element-solid/build-utils'
import { generateExternal, withTaskName, writeBundles } from '../utils'
import { ElementPlusAlias } from '../plugins/element-plus-alias'
import { buildConfigEntries, target } from '../build-info'
import type { TaskFunction } from 'gulp'

import type { OutputOptions } from 'rollup'

async function buildModulesComponents() {
  const input = excludeFiles(
    await glob(['**/*.{js,ts}', '!**/style/(index|css).{js,ts}'], {
      cwd: pkgRoot,
      absolute: true,
      onlyFiles: true,
    })
  )
  for (const [module, config] of buildConfigEntries) {
    await build({
      plugins: [ElementPlusAlias(), solidPlugin()],
      build: {
        lib: {
          entry: input,
          formats: [module],
        },
        outDir: config.output.path,
        target,
        // write: false,
        rollupOptions: {
          output: {
            exports: module === 'cjs' ? 'named' : undefined,
            preserveModules: true,
            preserveModulesRoot: epRoot,
            sourcemap: true,
            entryFileNames: `[name].${config.ext}`,
          },
          treeshake: { moduleSideEffects: false },
          external: await generateExternal({ full: false }),
          // format: config.format,
        },
      },
    })
  }
}

async function buildModulesStyles() {
  const input = excludeFiles(
    await glob('**/style/(index|css).{js,ts}', {
      cwd: pkgRoot,
      absolute: true,
      onlyFiles: true,
    })
  )
  const bundle = await rollup({
    input,
    treeshake: false,
    plugins: [ElementPlusAlias()],
  })

  await writeBundles(
    bundle,
    buildConfigEntries.map(([module, config]): OutputOptions => {
      return {
        format: config.format,
        dir: path.resolve(config.output.path, 'components'),
        exports: module === 'cjs' ? 'named' : undefined,
        preserveModules: true,
        preserveModulesRoot: epRoot,
        sourcemap: true,
        entryFileNames: `[name].${config.ext}`,
      }
    })
  )
}

export const buildModules: TaskFunction = series(
  withTaskName('buildModulesComponents', buildModulesComponents),
  withTaskName('buildModulesStyles', buildModulesStyles)
)
