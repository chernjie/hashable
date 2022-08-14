#!/usr/bin/env node

/**
 * Generate consistent hashable JSON payload
 *   great for piping through hash functions.
 *   Works in CLI and importable
 *
 * Use --in-place to overwrite the original JSON file. Default: false
 * Use --sort-object to sort object keys. Default: false
 * Use --priority to specify array sorting
 *   priority (default priority is used
 *   if not specified)
 * 
 * Usage:
 *   $0 first.json second.json
 *   cat first.json | $0
 * 
 * @author CJ <lim@chernjie.com>
 */

const fs = require('fs')
const path = require('path')
const { hashable } = require('./src/utils/hashable')
const { readInput, parseArgs } = require('./src/utils/readInput')
const defaultSort = ['id', '_id', 'name', 'category', 'value', 'label', 'page']

if (module && module.parent) {
  module.exports = { hashable }
} else {
  useCommandLine(process.argv.slice(2))
}

async function useCommandLine(argv) {
  const { args, options } = parseArgs(argv)
  const sortObject = options['sort-object'] || false
  const inPlace = options['in-place'] || false
  if (options['sort']) console.error('@deprecated use --priority')
  const priority = (options['priority'] || options['sort'] || '').split(',').concat(defaultSort)
  const sortOptions = {
    priority,
    sortObject
  }
  const fileInputHandler = files => files
    .map(file => path.resolve(process.cwd(), file))
    .map(file => ({ file, content: require(file) }))
    .map(data => ({ ...data, content: hashable(data.content, sortOptions) }))
    .map(({ file, content }) => inPlace
      ? fs.writeFile(file, JSON.stringify(content, null, 2), () => { })
      : content
    )

  const dataInputHandler = data => {
    try {
      return hashable(JSON.parse(data), sortOptions)
    } catch (e) {
      console.error('JSON.parse', e)
      process.exit(1)
    }
  }

  const formatted = await readInput({ args }, fileInputHandler, dataInputHandler)
  if (!inPlace) {
    process.stdout.write(JSON.stringify(formatted, null, 2))
  }
}
