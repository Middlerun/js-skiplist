const sl = require('./skiplist')

const testIterations = 100

for (let p=0.25; p < 0.45; p+=0.025) {
	const n = 100000

	const array = new Array(n)

	for (let i=0; i<n; i++) {
		array[i] = {
			key: i,
			value: 1,
		}
	}

	let runningTotal = 0

	for (let i=0; i<testIterations; i++) {
		const skipList = sl.create(array, p)
		const key = array[Math.floor(Math.random() * n)].key
		const nodesTraversed = skipList.get(key, true)
		runningTotal += nodesTraversed
	}

	const average = runningTotal / testIterations

	console.log('p:', p, 'avg:', average)
}