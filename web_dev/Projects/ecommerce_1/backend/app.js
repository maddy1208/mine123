import express from 'express'
import dotenv from 'dotenv'
import { product_router } from './Routes/product_route.js'
import { error_middleware } from './middlewares/error_middleware.js'
import user_router from './Routes/user_route.js'
import CookieParser from 'cookie-parser'

const app=express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(CookieParser())


app.use("/api/v1",product_router)
app.use("/api/v1/user",user_router)
app.use(error_middleware)

export {app}