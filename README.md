# is-subset-of

is-subset-of verifies whether an array or an object is a subset.

## Status

| Category         | Status                                                                                                    |
| ---------------- | --------------------------------------------------------------------------------------------------------- |
| Version          | [![npm](https://img.shields.io/npm/v/is-subset-of)](https://www.npmjs.com/package/is-subset-of)           |
| Dependencies     | ![David](https://img.shields.io/david/thenativeweb/is-subset-of)                                          |
| Dev dependencies | ![David](https://img.shields.io/david/dev/thenativeweb/is-subset-of)                                      |
| Build            | ![GitHub Actions](https://github.com/thenativeweb/is-subset-of/workflows/Release/badge.svg?branch=master) |
| License          | ![GitHub](https://img.shields.io/github/license/thenativeweb/is-subset-of)                                |

## Installation

```shell
$ npm install is-subset-of
```

## Quick Start

First you need to add a reference to is-subset-of to your application:

```javascript
const { isSubsetOf } = require('is-subset-of');
```

If you use TypeScript, use the following code instead:

```typescript
import { isSubsetOf } from 'is-subset-of';
```

Then you can verify if an array or an object is a subset of another array or object by calling the `isSubsetOf` function and handing over the arrays or objects:

```javascript
console.log(isSubsetOf(
  [ 2, 3, 5 ],
  [ 2, 3, 5, 7, 11 ]
));
// => true

console.log(isSubsetOf(
  { name: 'the native web' },
  { name: 'the native web', city: 'Riegel am Kaiserstuhl' },
));
// => true
```

### Verifying subsets structurally

From time to time, you are only interested if one object is a structural subset of another object, i.e. if its keys are contained within the other one, but you want to ignore the values. For that, use the `isSubsetOf.structural` function:

```javascript
console.log(isSubsetOf.structural(
  { name: 'Node.js' },
  { name: 'the native web', city: 'Riegel am Kaiserstuhl' }
));
// => true

console.log(isSubsetOf.structural(
  { firstName: 'Golo', lastName: 'Roden' },
  { name: 'the native web' }
));
// => false
```

## Running the build

To build this module use [roboter](https://www.npmjs.com/package/roboter).

```shell
$ npx roboter
```
