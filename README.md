[![Node.js CI](https://github.com/chernjie/hashable/actions/workflows/node.js.yml/badge.svg)](https://github.com/chernjie/hashable/actions/workflows/node.js.yml)
[![Node.js Package](https://github.com/chernjie/hashable/actions/workflows/npm-publish.yml/badge.svg)](https://github.com/chernjie/hashable/actions/workflows/npm-publish.yml)
[![pages-build-deployment](https://github.com/chernjie/hashable/actions/workflows/pages/pages-build-deployment/badge.svg)](https://github.com/chernjie/hashable/actions/workflows/pages/pages-build-deployment)

# hashable-cli

Generate consistent, hashable JSON output for use in command-line interfaces, Node.js modules, and web browsers.  Sorts arrays based on configurable priority, optionally sorts object keys, and supports in-place file modification. Ideal for hashing, deterministic comparisons, and version control of JSON data.

Published as an ES module and compatible with both Node.js and browser environments.

## Features

- Sorts arrays by predefined keys.
- Optionally sorts object keys (`--sort-object` or `sortObject` option).
- Works as a command-line tool, a module, and in the browser.
- Supports in-place modification of JSON files (`--in-place` option).
- Great for storing JSON in Git (deterministic output).
- Uses modern ES modules for easy integration into contemporary JavaScript projects.

[Try it in the browser](https://chernjie.github.io/hashable/)  (Live Demo)


## Breaking changes in v2.0.0

### ES Module Support

The entire project now uses ES modules. This affects both how the library is imported/required and how the CLI is executed.

Impact: Users in older environments without ES module support will need to update their Node.js versions or use a build process that handles ES modules.

### Removal of config/priority.json

The default priority is now handled internally in `hashable.js`.

Impact: Users who relied on customizing the default priority by modifying `config/priority.json` will need to use `getDefaultPriority()` to retrieve the default and create a modified copy.

### Consistent CLI Output for Single File

The CLI now returns a single JSON object (not wrapped in an array) for single file input without `--in-place`. This makes the output consistent with `stdin` handling.

Impact: User scripts or tools that relied on the previous array output (even for single files) will need to be updated to handle a single JSON object.

## Command Line Usage

### Installation

```shell
# Install globally (for use as a CLI command anywhere):
npm install -g hashable-cli

# Install locally (for use within a specific project):
npm install --save hashable-cli
```

### Example

#### via stdin (pipe)
```shell
cat file.json | npx hashable-cli > sorted.json
```

#### as argument

```shell
npx hashable-cli file.json > sorted.json

npx hashable-cli --in-place file.json # In-place modification

npx hashable-cli --priority=id,label file.json # Custom priority for sorting arrays

npx hashable-cli --sort-object file.json # Sort object keys
```

## Module Usage

### Installation

```shell
npm install --save hashable-cli
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

#### Adjusting priority

```javascript
const appendPriority = getDefaultPriority().concat(['field1', 'field2']) // append to default priority
const sorted3 = hashable(input, {priority: appendPriority })

const overridePriority = ['field1', 'field2'] // override default priority
const sorted4 = hashable(input, {priority: overridePriority})
```

## Options

CLI Flag | Module Option | Default | Description
-- | -- | -- | --
`--in-place` | N/A | `false` | Overwrite the original JSON file (CLI only)
`--sort-object` | `sortObject` | `false` | Sort object keys alphabetically.
`--priority` | `priority` | `id`, `_id`, `name`, `key`, `category`, `value`, `label`, `page`, `language`, `store_id`, `category_id` | Specify the priority for sorting arrays. Provide an array of strings (field names) in module usage. In CLI mode, provide a comma-separated string of field names. e.g. `--priority=id,label`

## License

see [LICENSE](./LICENSE)

## Alternatives

Consider these alternatives if `hashable-cli` doesn't fully meet your needs. Please check the latest status of these projects:

<!-- 118 lastpub1 -->
- [safe-stable-stringify](https://www.npmjs.com/package/safe-stable-stringify) - Safe, deterministic and fast serialization alternative to `JSON.stringify`. Zero dependencies. ESM and CJS. 100% coverage.
<!-- 1690 lastpub7 -->
- [json-stable-stringify](https://www.npmjs.com/package/json-stable-stringify) - deterministic version of `JSON.stringify()` so you can get a consistent hash from stringified results
<!-- 1056 lastpub3 -->
-  [fast-json-stable-stringify](https://www.npmjs.com/package/fast-json-stable-stringify) - Deterministic `JSON.stringify()` - a faster version of @substack's `json-stable-strigify` without `jsonify`.
<!-- 679 lastpub1 -->
- [fast-safe-stringify](https://www.npmjs.com/package/fast-safe-stringify) - Safe and fast serialization alternative to `JSON.stringify`.
<!-- 437 lastpub6 -->
- [json-stable-stringify-without-jsonify](https://www.npmjs.com/package/json-stable-stringify-without-jsonify)
<!-- 347 lastpub1 -->
- [sort-keys](https://www.npmjs.com/package/sort-keys) - Useful to get a deterministically ordered object, as the order of keys can vary between engines.
<!-- 47 lastpub6 -->
- [fast-stable-stringify](https://www.npmjs.com/package/fast-stable-stringify) - faster `json-stable-stringify`
<!-- 27 lastpub6 -->
- [json-hash](https://www.npmjs.com/package/json-hash) - Generates hash for JSON objects.
<!-- 14 lastpub4 -->
- [fastest-stable-stringify](https://www.npmjs.com/package/fastest-stable-stringify) - Deterministic `JSON.stringify()` - fastest stable JSON stringifier. This project combines `fast-json-stable-stringify` and `fast-stable-stringify` to create the fastest stable JSON stringifier
<!-- 0 lastpub5 -->
- [json-hashable](https://www.npmjs.com/package/json-hashable) - sorts object keys only, arrays remain the same. Returns a hash but no longer a strict equal of the input payload
