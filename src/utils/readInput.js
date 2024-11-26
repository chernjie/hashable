#!/usr/bin/env node

import { readFileSync } from 'fs'

async function sampleUsage() {
  const { args, options } = parseArgs(process.argv.slice(2))
  const input = await readInput(
    { args },
    argv => readFiles(argv).shift(),
    data => data,
  )
  printJSON(input)
}

export function readInput({ args }, argvCallback, stdinCallback) {
  return new Promise((resolve, reject) => {
    if (args.length) {
      return resolve(argvCallback(args))
    }
    const buffer = []
    process.stdin.setEncoding('utf8')
    process.stdin.on('data', data => buffer.push(data))
    process.stdin.on('end', () => resolve(stdinCallback(buffer.join(''))))
  })
}

export function parseArgs(argv) {
  return argv.reduce((last, arg)=> {
      if (/^--/.test(arg)) {
        const equals = arg.split('=')
        last.options[equals.shift().replace(/^--/, '')] = equals.join('=') || true
      } else {
        last.args.push(arg)
      }
      return last
    }, { args: [], options: {} }
  )
}

export function readFiles(files) {
  return files.map(file => readFileSync(file).toString())
}

export function printJSON(data) {
  console.log(JSON.stringify(data, null, 2))
}
