#!/usr/bin/env node

/**
 * Generate consistent hashable JSON payload
 *   great for piping through hash functions
 *   (does not sort object keys)
 * 
 * Usage:
 *   $0 first.json second.json
 *   cat first.json | $0
 * 
 * @author CJ <lim@chernjie.com>
 */

const fs = require('fs')
const path = require('path')
const { readInput, parseArgs } = require('./readInput')
const sortPriorities = ['language', 'name', 'category_id', 'id']

if (module && module.parent) {
  module.exports = {
    hashable,
  }
} else {
  useCommandLine(process.argv.slice(2))
}

async function useCommandLine(argv) {
  const { args, options } = parseArgs(argv)
  const inPlace = options['in-place'] || false
  const fileInputHandler = files => files
    .map(file => path.resolve(process.cwd(), file))
    .map(file => ({ file, content: require(file) }))
    .map(data => ({ ...data, content: hashable(data.content) }))
    .map(({ file, content }) => inPlace
      ? fs.writeFile(file, JSON.stringify(content, null, 2), () => {})
      : content
    )
  const dataInputHandler = data => hashable(JSON.parse(data))

  const formatted = await readInput({ args }, fileInputHandler, dataInputHandler)
  if (!inPlace) {
    process.stdout.write(JSON.stringify(formatted, null, 2))
  }
}

function hashable(data, priority = sortPriorities) {
  if (!_isObject(data)) return data

  Object.keys(data).forEach(key => {
    if (Array.isArray(data[key])) {
      data[key] = data[key].sort((a, b) => {
        if (typeof a == 'string') {
          return a > b ? 1 : -1
        }

        for (var i in priority) {
          var field = priority[i]
          if (typeof a[field] !== 'undefined') return sortBy(field, a, b)
        }
        console.error('hashable sorting', a, b)
      })
      return data[key].map(obj => hashable(obj, priority))
    }
    if (_isObject(data[key])) {
      return hashable(data[key], priority)
    }
    return data[key]
  })

  return data
}

function sortBy(type, a, b) {
  return a[type] > b[type] ? 1 : -1
}

function _isObject(obj) {
  const type = typeof obj
  return type === 'function' || (type === 'object' && !!obj)
}
