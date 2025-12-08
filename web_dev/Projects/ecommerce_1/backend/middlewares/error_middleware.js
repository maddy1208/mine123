import { custom_error } from "../helper/error_handler.js"

export const error_middleware=(err,req,res,next)=>{
    console.log(Object.keys(err.keyValue))
    if(err.code==11000){ 
    return next(new custom_error(`This ${Object.keys(err.keyValue)} has already raken`,400))
    }
    res.status(err.statuscode||500).send({msg:err.message})
   
}

