import { delete_data, get_data, patch_data, post_data,get_single_data } from "../controller/controller.js"
import express from 'express'
export const app_router=express.Router()

app_router.route("/data").get(get_data).post(post_data)

app_router.route("/data/:id").get(get_single_data).patch(patch_data).delete(delete_data)
