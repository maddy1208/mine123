// // // const path = require('path')

const { createReadStream } = require('fs')

// // const { readFile, writeFile, appendFile, rename } = require('fs')
// // const path = require('path')

// // // //k
// // // console.log("ois")
// // // // console.log(global)
// // // os=require('os')
// // // pat=require('path')
// // // console.log(os.type(),os.version(),os.homedir())
// // // console.log(__dirname)
// // // console.log(__filename)

// // // console.log(pat.dirname(__filename),pat.basename(__filename),"\n",pat.extname(__filename))
// // // console.log(path.parse(__filename))

// // // math=require('./mod')
// // // console.log(math.add(6,2))

// // file=require('fs')

// // // readFile('./sam.txyyt','utf-8',call);

// // // function call(err,data){
// // // if (err) throw err;
// // // else console.log(data)
// // // }

// // // process.on('uncaughtException',(err)=>{
// // //     console.log("errorru",err);process.exit(1);
// // // })
// // filename=path.join(__dirname,'renamed.txt')

// // call1=(err)=>{
// //     if (err) console.log("erroruuu",err)
// //     else { console.log("write complete")}
// //     appendFile(filename,' \nappend=>sample content123s',(err)=>{
// //         if (err) console.log("append failed")
// //             else console.log("append success")
// //     })
// //     rename(filename,'renamed123.txt',(err=>{
// //         if (err) console.log("rename failed")
// //             else console.log("rename success")
// //     }))
// // }
// // writeFile(filename,'sample content123s',call1);



// fs=require('fs').promises


// func= async ()=>{
//  try {
//     data=await fs.readFile('./sam.txt',{encoding:'utf-8'})
//     console.log(data)
//     await fs.writeFile('./sam.txt','sample file')
//     console.log("write complete")
//   await fs.appendFile('./sam.txt','\nappended text')
//   console.log("append complete")
//   await fs.rename('./sam.txt','./renamed.txt')
//   console.log("rename complete")

//     }
//     catch (err){
// console.log("error occured", err)
//     }
// }

// fs=require('fs').promises

// //readfile


// //wrirefile


// //appednfile

// //renamefile

// func()s

// fs=require('fs')

// fs.createWriteStream('./renamed.txt')
// .write("jhhgg")

// const event=require('events').EventEmitter

// event1=new event()

// event1.on('greet',()=>{
//     console.log("greet")
// })

// event1.emit('greet')
// date=require('date-fns')
// console.log(date.format(new Date(),"y,M,d,h,m,s"))
date=require('date-fns')
const path=require('path')
const fs=require('fs')


logfun=async (msg)=>{
if(!fs.existsSync(path.join(__dirname,'files','con.txt')))
{  fs.mkdirSync(path.join(__dirname,'files'))}
 await fs.promises.appendFile(path.join(__dirname,'files','con.txt'),`${date.format(new Date(),"y,M,d,h,m,s")}\t${msg}    
 `) 
console.log("success")

}


module.exports=logfun