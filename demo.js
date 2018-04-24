const sl = require('./index')

const array = [
	{key: 'a', value: 'string key 1'},
	{key: 'herp', value: 'string key 2'},
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

console.log('Create')
let skiplist = sl.create(array)
skiplist.print(printIds)
console.log(skiplist.count() + ' items')
console.log(skiplist.get(9))
console.log()

console.log('Add with numeric key')
skiplist.add({key: 10, value: 'ten'})
skiplist.print(printIds)
console.log(skiplist.count() + ' items')
console.log(skiplist.get(10))
console.log()

console.log('Add with string key')
skiplist.add({key: 'foo', value: {bar: 'bar'}})
skiplist.print(printIds)
console.log(skiplist.count() + ' items')
console.log(skiplist.get(10))
console.log()

console.log('Remove with numeric key')
skiplist.remove(7)
skiplist.print(printIds)
console.log(skiplist.count() + ' items')
console.log(skiplist.get(7))
console.log()

console.log('Remove with string key')
skiplist.remove('a')
skiplist.print(printIds)
console.log(skiplist.count() + ' items')
console.log(skiplist.get('a'))
console.log()

console.log('Update')
skiplist.update(12, 'three times four')
skiplist.print(printIds)
console.log(skiplist.count() + ' items')
console.log(skiplist.get(12))
console.log()

console.log('Get all')
console.log(skiplist.getAll())
