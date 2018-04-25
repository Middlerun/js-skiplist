// eslint-disable no-unused-expressions

const sl = require('./index')

const testIterations = 100

for (let power = 1; power < 7; power++) {
  const n = Math.pow(10, power)

  const array = new Array(n)

  for (let i = 0; i < n; i++) {
    array[i] = {
      key: i,
      value: 1,
    }
  }

  const skipList = sl.create(array)

  let runningTotal = 0

  for (let i = 0; i < testIterations; i++) {
    const key = array[Math.floor(Math.random() * n)].key
    const nodesTraversed = skipList.get(key, true)
    runningTotal += nodesTraversed
  }

  const average = runningTotal / testIterations

  console.log('n:', n, 'avg:', average)
}
