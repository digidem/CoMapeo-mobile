#!/usr/bin/env node
import { parseArgs } from 'util'
import { rollup } from 'rollup'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import esmShim from '@rollup/plugin-esm-shim'
import { minify } from 'rollup-plugin-esbuild'
import nativePaths from './rollup-plugin-native-paths.mjs'

const { values } = parseArgs({
  options: {
    entry: { type: 'string' },
    output: { type: 'string' },
    minify: { type: 'boolean' },
  },
})

const { entry, output, minify: shouldMinify } = values

/** @type {import('rollup').RollupOptions['plugins']} */
const plugins = [
  nativePaths(),
  commonjs({
    ignoreDynamicRequires: true,
  }),
  esmShim(),
  nodeResolve({ preferBuiltins: true }),
  json(),
]

if (shouldMinify) {
  plugins.push(minify())
}

async function build() {
  const bundle = await rollup({
    external: ['rn-bridge'],
    input: entry,
    plugins,
  })
  await bundle.write({ file: output, format: 'esm' })
  await bundle.close()
}

build()
