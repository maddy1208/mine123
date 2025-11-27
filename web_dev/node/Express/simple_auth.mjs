import  express from 'express'
import passport from 'passport'
import session from 'express-session'
import { Strategy } from 'passport-local'
import { checkSchema,validationResult,matchedData} from 'express-validator'
import  {validate_post_user_schema}  from './utils/validate_post_users.js'
import mongoose from 'mongoose'
import mongo_auth_val from './utils/simple_auth_mongoschema.js'
const app=express()

//mongo connection
try{
 const db_conn=await mongoose.connect("mongodb://127.0.0.1:27017/sam").then(()=>console.log("db successfully connected"))
}
catch (err){
    console.log("error on db connect",err)
}
app.use(express.json())
app.use(session({
    secret:"test13",
    
    saveUninitialized:false,
    resave: false,
    cookie:{
        maxAge: 60*60*60
    }
}))
app.use(express.urlencoded())
app.use(passport.initialize())
app.use(passport.session())

passport.use('simple-auth',new Strategy({
    usernameField: "name",passwordField:"pass"
} ,async (user,pass,done)=>{
const userfound=await mongo_auth_val.findOne({name:user})
console.log("oi",userfound)
if(!userfound){
    return done(null,false ,{"msg":"user not found"})
}
if(userfound.password!==pass){
    return done(null,false,{"msg":"password wrong "})

}
done(null,userfound.id,{"msg":"successfull auth"})


}))

passport.serializeUser((id,done)=>{
  
done(null,id)

})

passport.deserializeUser(async (id,done)=>{
    const userdetails=await mongo_auth_val.findOne({user})
    done(null,userdetails)



})

app.get("/",(req,res)=>{
    console.log(req.user)
    res.send("Your Profile + ",req.user.name)
})


//post users like signupp
app.post("/users",checkSchema(validate_post_user_schema),async (req,res)=>{

   const result=validationResult(req)
   console.log("validation res",result.errors)
   if(result.errors.length>0){
    return res.status(400).send({msg:"Please enter valid details","error":result.errors})
   }
   if(matchedData(req)){
   try{
    const newUser =new  mongo_auth_val(matchedData(req))
    console.log("newuser",newUser)
    await newUser.save()

     res.send("Users entered into db successfully")}
       catch(err){
        console.log(err)
        return res.send("Error on db operation",err)
     }}
  
    
   else{
    return res.status(400).send("NO Match data found")
   }

}


)

app.post("/login",passport.authenticate('simple-auth',{"successRedirect":"/","failureRedirect":"/login"})

)

app.listen('3000',(err)=>{
    console.log("server runnign in 3000")
})