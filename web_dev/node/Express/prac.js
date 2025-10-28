express=require('express')
const path=require('path')
const app=express()

app.get("/",(req,res,next)=>{
res.sendFile(path.join(__dirname,'package.json'));next()},
(req1,res1,next1)=>{
    console.log("function1 exec");next1()
},(req1,res1)=>{
    console.log("function2 exec")
},
).listen('5000')

