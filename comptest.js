const sl = require('./skiplist')

const testIterations = 100

for (let power=1; power < 7; power++) {
	const n = Math.pow(10, power)

	const array = new Array(n)

	for (let i=0; i<n; i++) {
		array[i] = {
			key: Math.random(),
			value: 1,
		}
	}

	const skipList = sl.create(array)

	let runningTotal = 0

	for (let i=0; i<testIterations; i++) {
		const key = array[Math.floor(Math.random() * n)].key
		const nodesTraversed = sl.lookup(skipList, key, true)
		runningTotal += nodesTraversed
	}

	const average = runningTotal / testIterations

	console.log('n:', n, 'avg:', average)
}