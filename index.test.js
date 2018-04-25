/* eslint-disable no-unused-expressions */

const expect = require('chai').expect

const sl = require('./index')

const array = [
  {key: 'a', value: 'string key 1'},
  {key: 'herp', value: 'string key 2'},
  {key: 4, value: 'four'},
  {key: 3, value: 'three'},
  {key: 7, value: 'seven'},
]

let skiplist

describe('skiplist', () => {
  beforeEach(() => {
    skiplist = sl.create(array)
  })

  describe('count()', () => {
    it('returns the number of items in the list', () => {
      expect(skiplist.count()).to.equal(5)
    })
  })

  describe('get()', () => {
    it('returns the value for the given key', () => {
      expect(skiplist.get('herp')).to.equal('string key 2')
      expect(skiplist.get(7)).to.equal('seven')
    })

    it('returns null for a nonexistent given key', () => {
      expect(skiplist.get(666)).to.equal(null)
    })
  })

  describe('getKeys()', () => {
    it('returns array of keys for all items', () => {
      expect(skiplist.getKeys()).to.deep.equal([3, 4, 7, 'a', 'herp'])
    })
  })

  describe('getAll()', () => {
    it('returns array of all items', () => {
      expect(skiplist.getAll()).to.deep.equal([
        {key: 3, value: 'three'},
        {key: 4, value: 'four'},
        {key: 7, value: 'seven'},
        {key: 'a', value: 'string key 1'},
        {key: 'herp', value: 'string key 2'},
      ])
    })

    it('filters using the given callback', () => {
      const filter = function (node) {
        return node.key === 'herp' || (Number.isInteger(node.key) && node.key > 3)
      }
      expect(skiplist.getAll(filter)).to.deep.equal([
        {key: 4, value: 'four'},
        {key: 7, value: 'seven'},
        {key: 'herp', value: 'string key 2'},
      ])
    })
  })

  describe('add()', () => {
    it('inserts a node into the list', () => {
      skiplist.add({key: 'foo', value: {bar: 'bar'}})
      expect(skiplist.get('foo')).to.deep.equal({bar: 'bar'})
      expect(skiplist.count()).to.equal(6)
    })
  })

  describe('remove()', () => {
    it('removes a node the list', () => {
      skiplist.remove(7)
      expect(skiplist.get(7)).to.be.null
      expect(skiplist.count()).to.equal(4)
    })
  })

  describe('update()', () => {
    it('updates the value for a key', () => {
      skiplist.update(7, 'new value')
      expect(skiplist.get(7)).to.equal('new value')
    })
  })

  describe('each()', () => {
    it('executes a callback on each node', () => {
      let string = ''
      const callback = function (node) {
        string = node.key + string + node.value
      }
      skiplist.each(callback)
      expect(string).to.equal('herpa743threefoursevenstring key 1string key 2')
    })
  })
})
