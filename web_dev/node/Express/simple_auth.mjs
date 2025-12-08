import  express from 'express'
import passport from 'passport'
import session from 'express-session'
import { Strategy } from 'passport-local'
import { checkSchema,validationResult,matchedData} from 'express-validator'
import  {validate_post_user_schema}  from './utils/validate_post_users.js'
import mongoose from 'mongoose'
import mongo_auth_val from './utils/simple_auth_mongoschema.js'
import { user_t } from './utils/mongoose_schema.js'
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
        maxAge: 60*60*60*1000
    }
}))
app.use(express.urlencoded({ extended: true }));
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

    const userdetails=await mongo_auth_val.findById(id)
    console.log("deserialze details,",userdetails)
    done(null,userdetails)



})

app.get("/",(req,res)=>{

  if(req.isAuthenticated()){
  console.log("user",req.user.name)



    res.send(["Your Profile + ",req.user.name])}
    else{
        res.status(400).send("Please login")
    }
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
app.get("/login",(req,res)=>{
    res.status(405).send("method not allowed")

})
//simple redirect
// app.post("/login",passport.authenticate('simple-auth',{"successRedirect":"/","failureRedirect":"/login"})

// )


//more customized login
app.post("/login",(req,res,next)=>{

    passport.authenticate("simple-auth",async (err,userinfo,msg)=>{
        if(err){ return next(err)}
        if(!userinfo){ return res.status(400).send(msg)}
           req.logIn(userinfo,(err)=> {
            if(err) console.log("error")   

            else   return res.status(302).redirect("/")
           })
      


    })(req,res,next)


})

app.listen('3000',(err)=>{
    console.log("server runnign in 3000")
})