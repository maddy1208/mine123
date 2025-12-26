import mongoose, { mongo } from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { type } from 'os'

const user_schema=new mongoose.Schema({

username:{  type: String, required :[true,"Please enter username"],maxlength: [15, "Username too long"],minlength:[3,"Username too short"],unique:true},
password:{  type: String, required :[true,"Please enter password"],select:false,minLength:[6,"Password too short"]},
email:{ type: String, required :[true,"Please ente email"], validate:[validator.isEmail,"PLease ener valid email"],unique :true},
avatar:{  public_profile:{ type: String, required :[true,"Please enter public profile"]},
    public_url:{ type: String, required :[true,"Please enter public url"]}
},
role:{type: String, default: "user"},
reset_token:{type: String},
reset_token_expiry:{ type: Number}

},{timestamps:true})


user_schema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  this.password =await bcrypt.hashSync(this.password, 8);
 

});


user_schema.methods.generate_jwt=function (){

  const token=jwt.sign({"id":this._id},process.env.JWT_SECRET,{expiresIn: process.env.JWT_EXPIRY})
  console.log("token",token)
  return token;
}

user_schema.methods.verify_user=async function (given_password,next){
  
  return await bcrypt.compare(given_password,this.password)

}       


user_schema.methods.generate_reset_token=function(){
  const token=crypto.randomBytes(20).toString('hex')
  this.reset_token=crypto.createHash('sha256').update(token).digest('hex')
  this.reset_token_expiry=Date.now()+30*60*1000
  return token;

}

export default mongoose.model("user",user_schema)