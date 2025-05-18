const path = require('path')

//k
console.log("ois")
// console.log(global)
os=require('os')
pat=require('path')
console.log(os.type(),os.version(),os.homedir())
console.log(__dirname)
console.log(__filename)

console.log(pat.dirname(__filename),pat.basename(__filename),"\n",pat.extname(__filename))
console.log(path.parse(__filename))

math=require('./mod')
console.log(math.add(6,2))