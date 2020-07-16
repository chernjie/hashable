#!/usr/bin/env node

const fs = require('fs')

async function sampleUsage() {
  const { args, options } = parseArgs(process.argv.slice(2))
  const input = await readInput(
    { args },
    argv => readFiles(argv).shift(),
    data => data,
  )
  printJSON(input)
}

function readInput({ args }, argvCallback, stdinCallback) {
  return new Promise((resolve, reject) => {
    if (args.length) {
      return resolve(argvCallback(args))
    }
    process.stdin.setEncoding('utf8')
    process.stdin.on('data', data => resolve(stdinCallback(data)))
  })
}

function parseArgs(argv) {
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

function readFiles(files) {
  return files.map(file => fs.readFileSync(file).toString())
}

function printJSON(data) {
  console.log(JSON.stringify(data, null, 2))
}

module.exports = {
  parseArgs,
  readInput,
  readFiles,
  printJSON,
}
