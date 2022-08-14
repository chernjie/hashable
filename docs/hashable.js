/**
 * Generate consistent hashable JSON payload
 *   great for piping through hash functions.
 *
 * Use `sortObject` to sort object keys. Default: false
 * Use `priority` to specify array sorting
 *   priority (default priority is used
 *   if not specified)
 * 
 * @author CJ <lim@chernjie.com>
 */

const defaultSort = require('../../config/priority')

function hashable(data, { priority = defaultSort, sortObject = false } = {}) {
  if (!_isObject(data)) return data

  const sorted = {}
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
    return Object.keys(sorted)
      .sort()
      .reduce((accumulator, key) => {
        accumulator[key] = sorted[key]
        return accumulator
      }, {})
  }

  return sorted
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

if (module) module.exports = hashable
