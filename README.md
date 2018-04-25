# js-skiplist

A JavaScript skip list implementation

Written by Eddie McLean

## Usage

```
const sl = require('js-skiplist')

const data = [
  { key: 1, value: 'foo' },
  { key: 'bar', value: { baz: 7 } },
]

const myList = sl.create(data) // Returns a skip list object

const retreivedValue = myList.get('bar') // Returns { baz: 7 }

```

## Methods

  - `.add(node)` (where node is an object with properties `key` and `value`)
  - `.get(key)`
  - `.update(key, value)`
  - `.remove(key)`
  - `.print()`
  - `.count()`
  - `.each(callback)`
  - `.getAll([filter])` (optional filter function)
  - `.getKeys()`

Keys can be either integers or strings.

## License

Copyright 2018 Eddie McLean

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
