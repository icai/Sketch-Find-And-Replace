import path from 'path'
import { execFile } from './exec.js'
import getSketchPath from './get-sketch-path.js'

const regex = /sketchtool Version ((\d|\.)+) \(\d+\)/

function extractVersion(string) {
  const match = regex.exec(string)
  return match?.[1]
}

const CACHED_VERSION = {}

function getSketchVersion(app) {
  return execFile(
    path.join(
      getSketchPath(app),
      '/Contents/Resources/sketchtool/bin/sketchtool'
    ),
    ['-v']
  )
    .then(({ stdout }) => {
      let version = extractVersion(stdout)
      if (!version) return undefined

      const pointNumbers = version.split('.').length
      if (pointNumbers === 1) version += '.0.0'
      else if (pointNumbers === 2) version += '.0'

      return version
    })
    .catch(() => undefined)
}

export default function getSketchVersionWithCache(app) {
  const key = app || 'undefined'
  if (CACHED_VERSION[key]) {
    return CACHED_VERSION[key]
  }
  CACHED_VERSION[key] = getSketchVersion(app)
  return CACHED_VERSION[key]
}
