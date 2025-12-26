import jwt from 'jsonwebtoken'
import { custom_error } from './error_handler.js'
import user_model from '../model/user_model.js'

export async function verify_auth (req,res,next){
    if(!req.cookies.token){
        return next(new custom_error("Unauthenticated, PLease login",401))
    }
   const decoded_id= jwt.verify(req.cookies.token||"nojwt",process.env.JWT_SECRET)
       if(decoded_id){
   req.user=await user_model.findById(decoded_id.id) 
   return next()
       }else {

    return next(new custom_error("Unauthenticated, PLease login",401))
       }


}