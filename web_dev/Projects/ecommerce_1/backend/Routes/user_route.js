import express from 'express'
import { register_user } from '../controllers/user_controller.js'

const user_router=express.Router()

user_router.route("/register").post(register_user)

export default user_router;