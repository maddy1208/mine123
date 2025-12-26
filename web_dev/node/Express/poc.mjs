import express from 'express'
const app=express()


app.get("/",(req,res,next)=>{

res.status(200).send("oi")

})



app.listen(8000,(daata)=>console.log("server running"))