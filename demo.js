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
let skipList = sl.create(array)
skipList.print(printIds)
console.log(skipList.count() + ' items')
console.log(skipList.get(9))
console.log()

console.log('Add with numeric key')
skipList.add({key: 10, value: 'ten'})
skipList.print(printIds)
console.log(skipList.count() + ' items')
console.log(skipList.get(10))
console.log()

console.log('Add with string key')
skipList.add({key: 'foo', value: {bar: 'bar'}})
skipList.print(printIds)
console.log(skipList.count() + ' items')
console.log(skipList.get(10))
console.log()

console.log('Remove with numeric key')
skipList.remove(7)
skipList.print(printIds)
console.log(skipList.count() + ' items')
console.log(skipList.get(7))
console.log()

console.log('Remove with string key')
skipList.remove('a')
skipList.print(printIds)
console.log(skipList.count() + ' items')
console.log(skipList.get('a'))
console.log()

console.log('Update')
skipList.update(12, 'three times four')
skipList.print(printIds)
console.log(skipList.count() + ' items')
console.log(skipList.get(12))
