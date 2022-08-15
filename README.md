[![Node.js CI](https://github.com/chernjie/hashable/actions/workflows/node.js.yml/badge.svg)](https://github.com/chernjie/hashable/actions/workflows/node.js.yml)
[![Node.js Package](https://github.com/chernjie/hashable/actions/workflows/npm-publish.yml/badge.svg)](https://github.com/chernjie/hashable/actions/workflows/npm-publish.yml)
[![pages-build-deployment](https://github.com/chernjie/hashable/actions/workflows/pages/pages-build-deployment/badge.svg)](https://github.com/chernjie/hashable/actions/workflows/pages/pages-build-deployment)

# hashable-cli

Generate consistent hashable JSON payload, great for piping through hash functions.

- sort arrays by predefined keys
- sort object by keys (optional)
- works as command line tool, module and in browser
- supports in-place modification of JSON file
- great for storing JSON in Git

Try it in the browser at https://chernjie.github.io/hashable/

## Command Line Usage

### Installation

```shell
npm i -g hashable-cli
```

### Example

#### via stdin
```shell
cat file.json | npx hashable-cli > sorted.json
```

#### as argument

```shell
npx hashable-cli file.json > sorted.json
```

#### as argument and in-place overwriting file

```shell
npx hashable-cli --in-place file.json
```

#### using priority option for sorting arrays

```shell
npx hashable-cli --priority=id,label file.json
```

## Module Usage

### Installation

```shell
npm i --save hashable-cli
```

### Example

```javascript
import hashable from 'hashable-cli'
import md5 from "md5"

const sorted1 = hashable({ a: 'b', c: ['e', 'd']}, { sortObject: true })
const sorted2 = hashable({ c: ['d', 'e'], a: 'b'}, { sortObject: true })

const hash1 = md5(JSON.stringify(sorted1))
const hash2 = md5(JSON.stringify(sorted2))

return hash1 === hash2
```

## Options

Command Line | Module | Default | Description
-- | -- | -- | --
`--in-place` | N/A | `false` | to overwrite the original JSON file
`--sort-object` | `sortObject` | `false` | to sort object keys.
`--priority` | `priority` | see [priority](https://github.com/chernjie/hashable/blob/main/config/priority.json) | to specify array sorting priority (default priority is used if not specified). In CLI-mode, use comma-separated strings to specify multiple sort keys. e.g. `--priority=id,label`

## License

see [LICENSE](./LICENSE)

## Alternatives you might prefer

- <!-- 118 lastpub1 --> [safe-stable-stringify](https://www.npmjs.com/package/safe-stable-stringify) - Safe, deterministic and fast serialization alternative to `JSON.stringify`. Zero dependencies. ESM and CJS. 100% coverage.
- <!-- 1690, lastpub7 --> [json-stable-stringify](https://www.npmjs.com/package/json-stable-stringify) - deterministic version of `JSON.stringify()` so you can get a consistent hash from stringified results
- <!-- 1056, lastpub3 -->  [fast-json-stable-stringify](https://www.npmjs.com/package/fast-json-stable-stringify) - Deterministic `JSON.stringify()` - a faster version of @substack's `json-stable-strigify` without `jsonify`.
- <!-- 679 lastpub1 --> [fast-safe-stringify](https://www.npmjs.com/package/fast-safe-stringify) - Safe and fast serialization alternative to `JSON.stringify`.
- <!-- 437 lastpub6 --> [json-stable-stringify-without-jsonify](https://www.npmjs.com/package/json-stable-stringify-without-jsonify)
- <!-- 347 lastpub1 --> [sort-keys](https://www.npmjs.com/package/sort-keys) - Useful to get a deterministically ordered object, as the order of keys can vary between engines.
- <!-- 47 lastpub6 --> [fast-stable-stringify](https://www.npmjs.com/package/fast-stable-stringify) - faster `json-stable-stringify`
- <!-- 27 lastpub6 --> [json-hash](https://www.npmjs.com/package/json-hash) - Generates hash for JSON objects.
- <!-- 14 lastpub4 --> [fastest-stable-stringify](https://www.npmjs.com/package/fastest-stable-stringify) - Deterministic `JSON.stringify()` - fastest stable JSON stringifier. This project combines `fast-json-stable-stringify` and `fast-stable-stringify` to create the fastest stable JSON stringifier
- <!-- 0 lastpub5 --> [json-hashable](https://www.npmjs.com/package/json-hashable) - sorts object keys only, arrays remain the same. Returns a hash but no longer a strict equal of the input payload
