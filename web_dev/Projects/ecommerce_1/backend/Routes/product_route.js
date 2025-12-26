import express from 'express'
import { add_product, delete_product, get_all_product, get_single_product, update_product } from '../controllers/product_controller.js'
import { verify_auth } from '../helper/user_verify.js'
import { rolebased_access } from '../controllers/user_controller.js'

export const product_router=express.Router()

product_router.route("/products").get(verify_auth,rolebased_access("user","admin"), get_all_product).post(verify_auth,rolebased_access("admin"),add_product)
product_router.route("/product/:id").get(verify_auth,rolebased_access("user","admin"),get_single_product).put(verify_auth,rolebased_access("admin"),update_product).delete(verify_auth,rolebased_access("admin"),delete_product)

