const expect = require('chai').expect
const ss = require('simple-statistics')

const sl = require('./index')

const powerGranularity = 3
const maxPower = 6 * powerGranularity

describe('time complexity of skiplist', () => {
  it('performs search with O(log n) complexity', () => {
    let searchTimes = []

    // First get a dataset of search time vs number of items.

    for (let multipliedPower = 1; multipliedPower <= maxPower; multipliedPower++) {
      const power = multipliedPower / powerGranularity
      const n = Math.floor(Math.pow(10, power))

      const average = averageSearchTimeForNItems(n, 10)

      searchTimes.push([power, average])
    }

    // If time complexity is O(log n), the search time should be linear with
    // respect to 'power' (since 'power' is the log in base 10 of n).

    const line = ss.linearRegression(searchTimes)
    const expectedTimeForPower = ss.linearRegressionLine(line)

    // To test that the complexity is linear, plot the residuals against the
    // power and against the value predicted by the linear regression.
    // Both plots should have an m value near zero.

    const residualsAgainstPower = searchTimes.map(searchTime => {
      const expectedTime = expectedTimeForPower(searchTime[0])
      return [ searchTime[0], (searchTime[1] - expectedTime) ]
    })
    const residualsAgainstPowerLine = ss.linearRegression(residualsAgainstPower)
    expect(Math.abs(residualsAgainstPowerLine.m)).to.be.below(0.1)

    const residualsAgainstPredictedValues = searchTimes.map(searchTime => {
      const expectedTime = expectedTimeForPower(searchTime[0])
      return [ expectedTime, (searchTime[1] - expectedTime) ]
    })
    const residualsAgainstPredictedValuesLine = ss.linearRegression(residualsAgainstPredictedValues)
    expect(Math.abs(residualsAgainstPredictedValuesLine.m)).to.be.below(0.1)

    // Check that the results are mostly close to the prediction
    // (i.e. residuals have low standard deviation)

    const residuals = searchTimes.map(searchTime => {
      const expectedTime = expectedTimeForPower(searchTime[0])
      return Math.abs(searchTime[1] - expectedTime)
    })
    const residualsSD = ss.standardDeviation(residuals)
    expect(residualsSD).to.be.below(3)
  })
})

function averageSearchTimeForNItems(n, testIterations) {
  const array = new Array(n)

  for (let i = 0; i < n; i++) {
    array[i] = {
      key: i,
      value: 1,
    }
  }

  let runningTotal = 0
  const skipList = sl.create(array)

  for (let i = 0; i < testIterations; i++) {
    const key = array[Math.floor(Math.random() * n)].key
    const nodesTraversed = skipList.get(key, true)
    runningTotal += nodesTraversed
  }

  return runningTotal / testIterations
}
