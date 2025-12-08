import express from 'express'
import { add_product, delete_product, get_all_product, get_single_product, update_product } from '../controllers/product_controller.js'


export const product_router=express.Router()

product_router.route("/products").get(get_all_product).post(add_product)
product_router.route("/product/:id").get(get_single_product).put(update_product).delete(delete_product)

