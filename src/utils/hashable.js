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
const defaultSort = ['language', 'id', 'name', 'store_id', 'category_id', 'value', 'label']

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
  const priority = (options['sort'] || '').split(',').concat(defaultSort)
  const fileInputHandler = files => files
    .map(file => path.resolve(process.cwd(), file))
    .map(file => ({ file, content: require(file) }))
    .map(data => ({ ...data, content: hashable(data.content, priority) }))
    .map(({ file, content }) => inPlace
      ? fs.writeFile(file, JSON.stringify(content, null, 2), () => {})
      : content
    )
  const dataInputHandler = data => {
    try {
      return hashable(JSON.parse(data), priority)
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

function hashable(data, priority = defaultSort) {
  if (!_isObject(data)) return data

  Object.keys(data).forEach(key => {
    if (Array.isArray(data[key])) {
      data[key] = data[key].filter(e => e !== null).sort((a, b) => {
        if (['number', 'string'].includes(typeof a)) return sortBy(a, b)

        for (var i in priority) {
          const field = priority[i]
          const first = _get(a, field)
          if (typeof first !== 'undefined') return sortBy(first, _get(b, field))
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

function sortBy(a, b) {
  if (a === b) return 0
  return a > b ? 1 : -1
}

function _get(obj, path) {
  return path.split('.').reduce((v, k) => {
    if (typeof v === 'undefined') return undefined
    if (typeof v[k] === 'undefined') return undefined
    return v[k]
  }, obj)
}

function _isObject(obj) {
  const type = typeof obj
  return type === 'function' || (type === 'object' && !!obj)
}
