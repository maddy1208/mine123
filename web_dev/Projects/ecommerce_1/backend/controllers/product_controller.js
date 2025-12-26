import { custom_error } from "../helper/error_handler.js"
import  product  from "../model/product_model.js"
import {APIhelper} from "../helper/api_helper.js"
export const get_all_product=async (req,res,next)=>{
   
    const get_product_query_object=new APIhelper(product.find(),req.query).search().filter();
    const querycopy=get_product_query_object.query.clone()
    const total_count=await querycopy.countDocuments()
   
    if(req.query.page>total_count || total_count<=0){
        return next(new custom_error("page not found",404))
    }
    const products=await get_product_query_object.pagination(4).query
    if(!products){ next(new custom_error("products empty",204))}
    res.status(200).send({"msg":true,"page":Number(req.query.page),"products":products})
}


export const add_product=async (req,res,next)=>{
    console.log("req.user",req.user)
    req.body.user=req.user.id
  
const new_product=req.body
    await product.create(new_product)
    res.status(201).send({"msg":"product inserted successfully",product:new_product})
}

export const update_product=async(req,res,next)=>{
 const update_body=req.body
 const new_product=await product.findByIdAndUpdate(req.params.id,update_body,{new:true,runValidators:true})

 if(!new_product) return next(new custom_error("product not found",404))
return res.status(200).send({success:true,new_product})
}

export const delete_product=async (req,res,next)=>{
    const product_id=req.params.id
    const product_d=await product.findByIdAndDelete(product_id)
    if(!product_d)   return next(new custom_error("product not found",404))

    return res.status(200).send("successfulyy deleted")
}


export const get_single_product=async (req,res,next)=>{
   const product_id=req.params.id
   const single_product=await product.findOne({_id:product_id})

   if(!single_product){
    return next(new custom_error("product not found",404))
   }
   return res.status(200).send({"success":true,product:single_product})

   
}

