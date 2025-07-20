import { exec as cpExec, execFile as cpExecFile } from 'child_process'

export function exec(command, options) {
  return new Promise((resolve, reject) => {
    cpExec(command, options, (error, stdout, stderr) => {
      if (error) {
        return reject(error)
      }
      resolve({ stdout, stderr })
    })
  })
}

export function execFile(command, options) {
  return new Promise((resolve, reject) => {
    cpExecFile(command, options, (error, stdout, stderr) => {
      if (error) {
        return reject(error)
      }
      resolve({ stdout, stderr })
    })
  })
}
