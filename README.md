# hashable-json

Generate consistent hashable JSON payload, great for piping through hash functions.

- sort arrays by predefined keys
- sort object by keys (optional)
- works as module, command line tool and in browser
- supports in-place modification of JSON file
- great for storing JSON in Git

## Command Line Usage

### Installation

```shell
npm i -g hashable-json
```

### Example

#### via stdin
```shell
cat file.json | npx hashable-json > sorted.json
```

#### as argument

```shell
npx hashable-json file.json > sorted.json
```

#### as argument and in-place overwriting file

```shell
npx hashable-json --in-place file.json
```

#### using priority option for sorting arrays

```shell
npx hashable-json --priority=id,label file.json
```

## Module Usage

### Installation

```shell
npm i --save hashable-json
```

### Example

```javascript
import hashable from 'hashable-json'
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

- [json-hashable](https://www.npmjs.com/package/json-hashable) - sorts object keys only, arrays remain the same. Returns a hash but no longer a strict equal of the input payload
- [json-hash](https://www.npmjs.com/package/json-hash) - Generates hash for JSON objects.
