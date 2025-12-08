import { custom_error } from "../helper/error_handler.js"
import user_model from "../model/user_model.js"

export async function register_user(req,res,next){

    if(!req.body.email || !req.body.password || !req.body.email ){ return next(new custom_error("Please enter valid details",400))}
    const { username,password,email}=req.body
    const newobject={ username,password
,email,avatar:{public_profile:"test",public_url:"test"}}

const user=await user_model.create(newobject)
const jwt=user.generate_jwt()
return res.status(200).send({success:true,newobject,token:jwt})

}