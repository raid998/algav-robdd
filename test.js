import {
  nodeCount,
  Arbre,
  table,
  generateRandomBigInt,
} from './echauffement.js'
import * as fs from 'fs'

const graph = {}
const nVars = parseInt(process.argv[2])
const nLeaves = 2 ** nVars
const nROBDD = BigInt((2n ** BigInt(nLeaves)).toString())
var start = Date.now()
for (let i = 0; i < 500003; i++) {
  const a2 = new Arbre()
  a2.cons_arbre(
    table(generateRandomBigInt(0n, BigInt(nROBDD.toString())), nLeaves)
  )
  a2.luka()
  a2.compression_bdd()
  const count = nodeCount(a2)
  if (!graph[count]) {
    graph[count] = 1
  } else {
    graph[count]++
  }
}

console.log(JSON.stringify(graph))
console.log((Date.now() - start) / 1000)

/* const a = new Arbre()
a.cons_arbre(
  table(
    BigInt(
      '101247173429701308769807673754056716620117458044746632656397076520187575777199'
    ),
    256
  )
)
a.luka()
a.compression_bdd()
const content = a.dot()

fs.writeFile('./test.txt', content, (err) => {
  if (err) {
    console.error(err)
    return
  }
  //file written successfully
}) */
