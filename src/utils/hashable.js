#!/usr/bin/env node

/**
 * Generate consistent hashable JSON payload
 *   great for piping through hash functions
 * Use --sort-object to sort object keys
 * Use --in-place to overwrite the original
 *   JSON payload
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
const { readInput, parseArgs } = require('./readInput')
const defaultSort = ['id', '_id', 'name', 'category', 'value', 'label', 'page']

if (module && module.parent) {
  module.exports = {
    hashable,
  }
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
      ? fs.writeFile(file, JSON.stringify(content, null, 2), () => {})
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

function hashable(data, { priority = defaultSort, sortObject = false } = {}) {
  if (!_isObject(data)) return data

  let sorted = {}
  Object.keys(data).forEach(key => {
    // array
    if (Array.isArray(data[key])) {
      sorted[key] = data[key].filter(e => e !== null)
      .sort((a, b) => {
        if (['number', 'string'].includes(typeof a)) return sortBy(a, b)

        for (var i in priority) {
          const field = priority[i]
          const first = _get(a, field)
          if (typeof first !== 'undefined') return sortBy(first, _get(b, field))
        }
        console.error('hashable sorting', a, b)
      })
      .map(obj => hashable(obj, { priority, sortObject }))
    }
    
    // object
    else if (_isObject(data[key])) {
      sorted[key] = hashable(data[key], { priority, sortObject })
    }

    // primitive
    else {
      sorted[key] = data[key]
    }
  })

  if (sortObject) {
    sorted = sortObjectByKeys(sorted)
  }

  return sorted
}

function sortBy(a, b) {
  if (a === b) return 0
  return a > b ? 1 : -1
}

function sortObjectByKeys(obj) {
  sorted = Object.keys(obj)
  .sort()
  .reduce((accumulator, key) => {
    accumulator[key] = obj[key];
    return accumulator;
  }, {});
  return sorted;
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
