const sl = require('./skiplist')

const array = [
	{key: 4, value: 'four'},
	{key: 3, value: 'three'},
	{key: 7, value: 'seven'},
	{key: 2, value: 'two'},
	{key: 12, value: 'twelve'},
	{key: 9, value: 'nine'},
	{key: 5, value: 'five'},
	{key: 19, value: 'nineteen'},
]

const printIds = false

let skipList = sl.create(array)

skipList.print(printIds)

console.log(skipList.lookup(9))

console.log()


skipList.add({key: 10, value: 'ten'})

skipList.print(printIds)

console.log(skipList.lookup(10))

console.log()


skipList.remove(7)

skipList.print(printIds)

console.log(skipList.lookup(7))

console.log()


skipList.update(12, 'three times four')

skipList.print(printIds)

console.log(skipList.lookup(12))
