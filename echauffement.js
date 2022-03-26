const decomposition = (x) => {
  const result = []
  const x2 = x.toString(2)
  for (let i = x2.length - 1; i >= 0; i--) result.push(x2[i] == 1)
  return result
}
const completion = (l, n) => {
  if (n <= l.length) return l.slice(0, n)
  else {
    for (; l.length < n; ) l.push(false)
    return l
  }
}
export const table = (x, n) => {
  let dec = decomposition(x)
  return completion(dec, n)
}

/** *********************************************************************** */
/** *********************************************************************** */
export class Node {
  constructor(data, left, right) {
    this.data = data
    this.left = left
    this.right = right
  }
}

export class Arbre {
  constructor() {
    this.root = null
    this.table = {}
  }
  cons_arbre(liste) {
    if (liste.length == 1) {
      this.root = new Node(liste[0], null, null)
      return
    }
    const height = Math.ceil(Math.log2(liste.length))
    this.root = new Node(`x${height}`, null, null)
    const node = this.root
    let count = 0,
      level = 0
    let helper = (node) => {
      if (level < height - 1) {
        node.left = new Node(`x${height - 1 - level}`, null, null)
        node.left.id = Math.random()
        node.right = new Node(`x${height - 1 - level}`, null, null)
        node.right.id = Math.random()
        level++
        helper(node.left)
        helper(node.right)
        level--
      } else {
        node.left = new Node(liste[count], null, null)
        node.right = new Node(liste[count + 1], null, null)
        count = count + 2
      }
    }
    helper(node)
  }
  luka() {
    if (!this.root) return
    const node = this.root
    let helper = (node) => {
      if (!node.left) {
        node.luka = `${node.data}`
        node.id = Math.random()
        return `${node.data}`
      }
      if (!node.right) {
        node.luka = `${node.data}(${helper(node.left)})`
        return node.luka
      }
      node.luka = `${node.data}(${helper(node.left)})(${helper(node.right)})`
      return node.luka
    }
    helper(node)
  }
  compression() {
    const table = this.table
    const helper = (node) => {
      if (!table[node.luka]) {
        if (!node.left) {
          table[node.luka] = node
        } else {
          helper(node.left)
          helper(node.right)
          table[node.luka] = node
          table[node.luka].left = table[node.left.luka]
          table[node.luka].right = table[node.right.luka]
        }
      } else return
    }
    helper(this.root)
    return table
  }
  dot() {
    const table = this.table
    let code = 'graph {'
    for (let node in table) {
      code = code + `"${table[node].luka} " [label="${table[node].data}"] `
      if (table[node].left) {
        code =
          code +
          `
        edge [style="filled"]
        "${table[node].luka} " -- "${table[node].right.luka} ";
        edge [style="dashed"]
        "${table[node].luka} "-- "${table[node].left.luka} ";
        `
      }
    }
    code = code + '}'
    return code
  }
  compression_bdd() {
    const node = this.root
    const F = new Node(false, null, null)
    const T = new Node(true, null, null)
    F.luka = 'false'
    T.luka = 'true'
    T.id = Math.random()
    F.id = Math.random()
    const helper = (node) => {
      if (!node.left) {
        if (node.data == false) return F
        return T
      } else {
        node.left = helper(node.left)
        node.right = helper(node.right)
        if (node.left == node.right) {
          delete this.table[node.luka]
          const left = node.left

          delete table[node.luka]
          node = null
          return left
        } else {
          return node
        }
      }
    }
    this.compression()
    this.root = helper(this.root)
  }
}

export const nodeCount = (robdd) => {
  let count = 0
  const node = robdd.root
  if (!node) return count
  const visited = {}
  const nodeCountHelper = (node) => {
    if (node) {
      if (!visited[node.luka]) {
        count++
        visited[node.luka] = true
        nodeCountHelper(node.left)
        nodeCountHelper(node.right)
      }
    }
  }
  nodeCountHelper(node)
  return count
}
export function generateRandomBigInt(lowBigInt, highBigInt) {
  if (lowBigInt >= highBigInt) {
    throw new Error('lowBigInt must be smaller than highBigInt')
  }

  const difference = highBigInt - lowBigInt
  const differenceLength = difference.toString().length
  let multiplier = ''
  while (multiplier.length < differenceLength) {
    multiplier += Math.random().toString().split('.')[1]
  }
  multiplier = multiplier.slice(0, differenceLength)
  const divisor = '1' + '0'.repeat(differenceLength)

  const randomDifference =
    (difference * BigInt(multiplier.toString())) / BigInt(divisor.toString())

  return lowBigInt + randomDifference
}
