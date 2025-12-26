import { custom_error } from "../helper/error_handler.js"
import user_model from "../model/user_model.js"

export async function register_user(req,res,next){

    if(!req.body ||!req.body.email || !req.body.password || !req.body.email ){ return next(new custom_error("Please enter valid details",400))}
     const { username,password,email,role}=req.body
     const newobject={ username,password
,email,avatar:{public_profile:"test",public_url:"test"},role}
const user=await user_model.create(newobject)
//const jwt=user.generate_jwt()
return res.status(200).send({success:true,newobject})

}

export async function login_user(req,res,next){
    const {email,password}=req.body
    if(!email || !password){
        return next(new custom_error("Please enter valid details",400))
    }
    const result_user=await user_model.findOne({email}).select("+password")
    if(!result_user) {return next(new custom_error("Email or password Incorrect",401))}
    const is_verified=await result_user.verify_user(password) //false
    if(!is_verified){ return next(new custom_error("Email or password Incorrect",401))}
    const token=await result_user.generate_jwt()
    req.user=result_user
    return res.status(200).cookie("token",token,{secure: true,httpOnly: true,maxAge: 60*1000*60*24}).send({msg:"success",result_user,token})
}

export function logout(req,res,next){
    res.cookie("token",null,{expires:new Date(Date.now())})
    res.send({success:true,msg:"successfully logged out",})
}
export function rolebased_access(...roles){
    return (req,res,next)=>{
       console.log("role",req.user.role)

         if(!roles.includes(req.user.role)){
       return next(new custom_error("Unauthorized action",400))
    }
       next()

    }
   
    


}

    export async function password_reset(req,res,next){
        if(!req.body.email){
            return next(new custom_error("PLease provide email address",400))
        }
    const result_user=await user_model.findOne({email:req.body.email})
    if(!result_user){
       return next(new custom_error("user not found",401))
    }
    const token=await result_user.generate_reset_token()
    console.log("token",token)
    console.log("token url",`${req.protocol}${req.domain}/password/reset/${token}`)
    await result_user.save()
    return res.status(200).send("token generated successfully")

    
    }
