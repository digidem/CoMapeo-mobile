// This file sets up some global variables that are incorrectly set in
// nodejs-mobile, e.g. the cwd points to root ("/") on mobile, so we override it
// with the nodejs project dir

import os from 'os'
import path from 'path'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
/** @type {import('./types/rn-bridge.js')} */
const rnBridge = require('rn-bridge')

const nodejsProjectDir = path.resolve(rnBridge.app.datadir(), 'nodejs-project')
os.homedir = () => nodejsProjectDir
process.cwd = () => nodejsProjectDir
process.env = process.env || {}

import './index.js'
