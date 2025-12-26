import { custom_error } from "../helper/error_handler.js"

export const error_middleware=(err,req,res,next)=>{
  
    if(err.code==11000){ 
    return next(new custom_error(`This value has already raken`,400))
    }
    return res.status(err.statuscode||500).send({msg:err.message})
   
}

