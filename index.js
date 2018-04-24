function get(skipList, key, returnNodesTraversed = false) {
  const node = lookupNode(skipList, key, returnNodesTraversed)
  if (!node) {
    return null
  }
  if (returnNodesTraversed) return node
  return node.value
}

function update(skipList, key, value) {
  const node = lookupNode(skipList, key)
  if (!node) {
    return null
  }
  node.value = value
  return skipList
}

function lookupNode(skipList, key, returnNodesTraversed = false) {
  validateKey(key)

  let currentNode = skipList
  let nodesTraversed = 0

  while (currentNode) {
    nodesTraversed++

    if (currentNode.key === key) {
      if (currentNode.down) {
        currentNode = currentNode.down
      } else {
        if (returnNodesTraversed) return nodesTraversed
        return currentNode
      }
    } else {
      if (currentNode.next) {
        if (cmpKey(currentNode.next.key, key) <= 0) {
          currentNode = currentNode.next
        } else {
          currentNode = currentNode.down
        }
      } else {
        currentNode = currentNode.down
      }
    }
  }

  if (returnNodesTraversed) return nodesTraversed
  return null
}

function getAll(skipList, test = function () { return true }) {
  let nodes = []
  each(skipList, function (node) {
    if (test(node)) {
      nodes.push({ key: node.key, value: node.value })
    }
  })
  return nodes
}

function getKeys(skipList) {
  let keys = []
  each(skipList, function (node) {
    keys.push(node.key)
  })
  return keys
}

function each(skipList, callback = function () {}) {
  let currentNode = skipList
  while (currentNode.down) {
    currentNode = currentNode.down
  }

  currentNode = currentNode.next
  while (currentNode) {
    callback(currentNode)
    currentNode = currentNode.next
  }

  return skipList
}

function remove(skipList, key) {
  validateKey(key)

  let currentNode = skipList.down

  while (currentNode) {
    if (currentNode.next && cmpKey(currentNode.next.key, key) == 0) {
      currentNode.next = currentNode.next.next
      currentNode = currentNode.down
    } else if (currentNode.next === null ||
      cmpKey(currentNode.next.key, key) > 0) {
      currentNode = currentNode.down
    } else {
      currentNode = currentNode.next
    }
  }

  if (skipList.down && nodesInLayer(skipList.down) === 0) {
    skipList.down = skipList.down.down
  }
  return skipList
}

function add(skipList, nodeToAdd) {
  validateNode(nodeToAdd)

  let currentNode = skipList.down
  let layerInsertPoints = []

  while (currentNode) {
    if (currentNode.key && cmp(currentNode, nodeToAdd) === 0) {
      console.log(currentNode)
      console.log(nodeToAdd)
      throw new Error('duplicate key')
    }
    if (
      (currentNode.key === null &&
      (currentNode.next === null || cmp(currentNode.next, nodeToAdd) > 0))
      || (currentNode.key !== null && cmp(currentNode, nodeToAdd) < 0 &&
        (currentNode.next === null || cmp(currentNode.next, nodeToAdd) > 0))
    ) {
      layerInsertPoints.push(currentNode)
      currentNode = currentNode.down
    } else {
      currentNode = currentNode.next
    }
  }

  let lastNodeAdded = null
  let lastLayerUpdated = null

  for (let i=layerInsertPoints.length-1; i>=-1; i--) {
    if (i === -1) {
      currentNode = createHead()
      currentNode.down = skipList.down
      skipList.down = currentNode
    } else {
      currentNode = layerInsertPoints[i]
    }
    const isDataLayer = !currentNode.down
    const newNode = cloneNode(nodeToAdd, isDataLayer)
    newNode.down = lastNodeAdded
    newNode.next = currentNode.next
    currentNode.next = newNode
    lastNodeAdded = newNode
    lastLayerUpdated = i

    if (Math.random() >= skipList.p) break
  }

  return skipList
}

function create(array, p = 0.35) {
  // Verify valid input
  array.forEach(validateNode)

  array.sort(cmp)

  let layer = arrayToLinkedList(array)

  layer = addLayers(layer, p)

  const head = createHead()
  head.down = layer

  // Add methods
  head.get = function (key, returnNodesTraversed) { return get(head, key, returnNodesTraversed) }
  head.update = function (key, value) { return update(head, key, value) }
  head.add = function (newNode) { return add(head, newNode) }
  head.remove = function (key) { return remove(head, key) }
  head.print = function (includeIds) { return print(head, includeIds) }
  head.count = function () { return count(head) }
  head.each = function (callback) { return each(head, callback) }
  head.getKeys = function () { return getKeys(head) }
  head.getAll = function (test) { return getAll(head, test) }

  // Add metadata
  head.p = p

  return head
}

function cmp(a, b) {
  return cmpKey(a.key, b.key)
}

function cmpKey(a, b) {
  if (a === null && b !== null) return -1
  if (b === null && a !== null) return 1
  if (Number.isInteger(a) && typeof b === 'string') return -1
  if (Number.isInteger(b) && typeof a === 'string') return 1
  if (a < b) return -1
  if (a > b) return 1
  return 0
}

function validateNode(node) {
  if (typeof node !== 'object' ||
    !node.hasOwnProperty('key') ||
    !node.hasOwnProperty('value')) {
    throw new Error('invalid node')
  }
  validateKey(node.key)
}

function validateKey(key) {
  if (!Number.isInteger(key) &&
    typeof key !== 'string') {
    throw new Error('invalid key')
  }
}

function addLayers(skipList, p) {
  let layer = skipList
  let nodeCount = nodesInLayer(layer)

  while (nodeCount > 1) {
    const { layer: newLayer, nodeCount: newNodeCount } = nextLayer(layer, p)
    if (newNodeCount < nodeCount) {
      layer = newLayer
      nodeCount = newNodeCount
    }
  }

  if (nodeCount === 0 && layer.down) {
    layer = layer.down
  }

  return layer
}

function print(skipList, includeIds = false) {
  let currentLayer = skipList
  while (currentLayer) {
    let string = ''
    let currentNode = currentLayer
    while (currentNode) {
      if (string) string += ' - '
      if (currentNode.key == null) {
        string += 'head'
      } else {
        string += currentNode.key
      }
      if (includeIds) {
        string += '[' + currentNode.id + ',' + (currentNode.next ? currentNode.next.id : '') + ',' +
          (currentNode.down ? currentNode.down.id : '') + ']'
      }
      if (currentNode.value) string += ` (${currentNode.value})`
      currentNode = currentNode.next
    }
    console.log(string)

    currentLayer = currentLayer.down
  }
}

function count(skipList) {
  let layer = skipList
  while (layer.down) {
    layer = layer.down
  }
  return nodesInLayer(layer)
}

function nodesInLayer(layer) {
  let currentNode = layer.next
  let count = 0
  while (currentNode) {
    count++
    currentNode = currentNode.next
  }
  return count
}

function nextLayer(prevLayer, p) {
  if (p <= 0 || p >= 1) {
    throw new Error('invalid p value')
  }
  let layer = cloneNode(prevLayer)
  let currentNextLayerNode = layer
  currentNextLayerNode.down = prevLayer
  let currentPrevLayerNode = prevLayer
  let nodeCount = 0

  while (currentPrevLayerNode.next) {
    currentPrevLayerNode = currentPrevLayerNode.next

    if (Math.random() < p) {
      // Clone to next layer
      const newNode = cloneNode(currentPrevLayerNode)
      newNode.down = currentPrevLayerNode
      currentNextLayerNode.next = newNode
      currentNextLayerNode = newNode
      nodeCount++
    }
  }

  return { layer, nodeCount }
}

function arrayToLinkedList(array) {
  let head = createHead()
  let currentNode = head

  for (let i=0; i<array.length; i++) {
    const newNode = cloneNode(array[i], true)

    currentNode.next = newNode
    currentNode = newNode
  }
  return head
}

function createHead() {
  return cloneNode({ key: null })
}

const cloneNode = (function () {
  let nextId = 1

  return function (node, isDataNode = false) {
    const id = nextId++

    if (isDataNode) {
      return {
        id,
        key: node.key,
        value: node.value,
        next: null,
        down: null,
      }
    }

    return {
      id,
      key: node.key,
      next: null,
      down: null,
    }
  }
})()

module.exports = {
  create,
  add,
  update,
  remove,
  get,
  print,
  count,
  each,
  getAll,
  getKeys,
}
