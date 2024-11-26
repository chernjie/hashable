#!/usr/bin/env node

import { readFile } from 'fs/promises'

async function sampleUsage() {
  const { args, options } = parseArgs(process.argv.slice(2))

  if (!args.length && !options.stdin) {
    throw new Error('No input provided')
  }

  // arguments takes precedence over stdin
  const input = args.length
    ? await Promise.all(readFiles(args))
    : await options.stdin

  printJSON(input)
}

export function readInput() {
  return new Promise((resolve, reject) => {
    const buffer = []
    process.stdin.setEncoding('utf8')
    process.stdin.on('data', data => buffer.push(data))
    process.stdin.on('end', () => resolve(buffer.join('')))
  })
}

export function parseArgs(argv) {
  const { args, options } = argv.reduce((last, arg)=> {
      if (/^--/.test(arg)) {
        const equals = arg.split('=')
        last.options[equals.shift().replace(/^--/, '')] = equals.join('=') || true
      } else {
        last.args.push(arg)
      }
      return last
    }, { args: [], options: {} }
  )
  if (!args.length) {
    options.stdin = readInput()
  }
  return { args, options }
}

export function readFiles(files) {
  return files
    .map(file => path.resolve(process.cwd(), file))
    .map(file =>
      readFile(file)
        .then(res => res.toString())
    )
}

export function printJSON(data) {
  console.log(JSON.stringify(data, null, 2))
}
