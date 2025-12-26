import express from 'express'
import { app_router } from './Routes/routes.js'
import mongoose from 'mongoose'
import cors from  'cors'
const app=express()
app.use(express.json())
app.use(cors({origin:"http://localhost:5173"}))

mongoose.connect("mongodb://127.0.0.1:27017").then((data)=>console.log("mongo connected",data.connection.host))
app.use("/user",app_router)
app.listen((9000),(err)=> console.log("App running on '9000' "))