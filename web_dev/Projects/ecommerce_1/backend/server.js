import { app } from "./app.js";
import path from "path";
import dotenv from 'dotenv'

import mongoose from 'mongoose'

//err handler
process.on('uncaughtException',(err)=>{
console.log("server shutting down due to uncaughtexception",err.message)

})

dotenv.config({path:"./backend/config/config.env"})
const PORT=process.env.PORT || 5000;

const mongo_connect=mongoose.connect(process.env.MONGO_URL).then((data)=>console.log("db connected on ",data.connection.host)).catch((err)=>console.log("error"))

const server=app.listen(PORT,()=>console.log("server running at port",PORT))

//err handler
process.on("unhandledRejection",(err)=>{
console.log("server shutting down due to unhandledrejection",err.message)

server.close(()=>process.exit(1))
})
