function lookup(skipList, key, returnNodesTraversed = false) {
  if (key === null) {
    throw new Error('invalid lookup key')
  }

  let currentNode = skipList
  let nodesTraversed = 0

  while (currentNode) {
    nodesTraversed++

    if (currentNode.key === key) {
      if (currentNode.down) {
        currentNode = currentNode.down
      } else {
        if (returnNodesTraversed) return nodesTraversed
        return currentNode.value
      }
    } else {
      if (currentNode.next) {
        if (currentNode.next.key <= key) {
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

function remove(skipList, key) {
  if (key === null) {
    throw new Error('invalid delete key')
  }

  let currentNode = skipList.down

  while (currentNode) {
    if (currentNode.next && currentNode.next.key === key) {
      currentNode.next = currentNode.next.next
      currentNode = currentNode.down
    } else if (currentNode.next === null || currentNode.next.key > key) {
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

function add(skipList, nodeToAdd, p = 0.35) {
  validateNode(nodeToAdd)

  let currentNode = skipList.down
  let layerInsertPoints = []

  while (currentNode) {
    if (
      (currentNode.key === null &&
      (currentNode.next === null || currentNode.next.key >= nodeToAdd.key))
      || (currentNode.key !== null && currentNode.key < nodeToAdd.key &&
        (currentNode.next === null || currentNode.next.key >= nodeToAdd.key))
    ) {
      layerInsertPoints.push(currentNode)
      currentNode = currentNode.down
    } else {
      currentNode = currentNode.next
    }
  }

  let lastNodeAdded = null

  for (let i=layerInsertPoints.length-1; i>=0; i--) {
    currentNode = layerInsertPoints[i]
    const isDataLayer = !currentNode.down
    const newNode = cloneNode(nodeToAdd, isDataLayer)
    newNode.down = lastNodeAdded
    newNode.next = currentNode.next
    currentNode.next = newNode
    lastNodeAdded = newNode

    if (Math.random() >= p) break
  }

  skipList.down = addLayers(skipList.down, p)
  return skipList
}

function create(array, p = 0.35) {
  // Verify valid input
  array.forEach(validateNode)

  array.sort((a, b) => a.key - b.key)

  let layer = arrayToLinkedList(array)

  layer = addLayers(layer, p)

  const head = createHead()
  head.down = layer

  // Add methods
  head.lookup = (key) => lookup(head, key)
  head.add = (newNode) => add(head, newNode, p)
  head.remove = (key) => remove(head, key)
  head.print = () => print(head)

  return head
}

function validateNode(node) {
  if (typeof node !== 'object' ||
    !node.hasOwnProperty('key') ||
    !node.hasOwnProperty('value')) {
    throw new Error('invalid node')
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
  let id = 0

  return function (node, isDataNode = false) {
    id++

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
  remove,
  lookup,
  print,
}
