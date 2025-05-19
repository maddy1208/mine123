// const path = require('path')

const { readFile, writeFile, appendFile, rename } = require('fs')
const path = require('path')

// //k
// console.log("ois")
// // console.log(global)
// os=require('os')
// pat=require('path')
// console.log(os.type(),os.version(),os.homedir())
// console.log(__dirname)
// console.log(__filename)

// console.log(pat.dirname(__filename),pat.basename(__filename),"\n",pat.extname(__filename))
// console.log(path.parse(__filename))

// math=require('./mod')
// console.log(math.add(6,2))

file=require('fs')

// readFile('./sam.txyyt','utf-8',call);

// function call(err,data){
// if (err) throw err;
// else console.log(data)
// }

// process.on('uncaughtException',(err)=>{
//     console.log("errorru",err);process.exit(1);
// })
filename=path.join(__dirname,'renamed.txt')

call1=(err)=>{
    if (err) console.log("erroruuu",err)
    else { console.log("write complete")}
    appendFile(filename,' \nappend=>sample content123s',(err)=>{
        if (err) console.log("append failed")
            else console.log("append success")
    })
    rename(filename,'renamed123.txt',(err=>{
        if (err) console.log("rename failed")
            else console.log("rename success")
    }))
}
writeFile(filename,'sample content123s',call1);



