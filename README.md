# is-subset-of

is-subset-of verifies whether an array or an object is a subset.

## Installation

```shell
$ npm install is-subset-of
```

## Quick Start

First you need to add a reference to is-subset-of to your application:

```javascript
const isSubsetOf = require('is-subset-of');
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

## License

The MIT License (MIT)
Copyright (c) 2019 the native web. All rights reserved.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
