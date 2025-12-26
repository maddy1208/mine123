import express from 'express'
import exps from 'express-session'
import passport  from 'passport'
import { Strategy as local } from 'passport-local'
import mongoose from 'mongoose'
// import {user} from './utils/mongoose_schema.js'
const users=[{"id":1,"name":"maddy","password":123}]
const app=express()

app.use(express.json())

try{
const db_connect=await  mongoose.connect("mongodb://127.0.0.1:27017/sam").then(console.log("db conn established"))}
catch(err){
    console.log("error while connecting to db")
}


app.use(exps({
secret:"sam123",
resave:false,
saveUninitialized:false,
cookie:{
    maxAge:1000*60*60,
    
}
}))

app.use(passport.initialize())
app.use(passport.session())




passport.use('my-login',new local(
    {usernameField:'username',passwordField:'password'},
    (useruu,passu,done)=>{
        const userindb=users.find((obj)=>obj.name==useruu)
if(!userindb) return done(null,false,{"msg":'user not found'})
if(!userindb.password==passu) return done(null,false,{"msg":"wrong password"})
done (null,userindb.id,{"msg":"authentication success"})}))


passport.serializeUser((userid,done)=>{
    console.log("serialize called",userid)
    done(null,userid)
})



passport.deserializeUser((userid,done)=>{
    const userdetails=users.find((obj)=>obj.id==userid)
    done(null,userdetails)
})


app.get("/",(req,res,next)=>{
    res.send("home page")
})




//simple redirect
// app.post("/login",passport.authenticate('my-login',{
//     successRedirect: "/dashboard",
//     failureRedirect:"/login",
    
// }))

//more customized
app.post("/login",(req,res,next)=>{

    passport.authenticate('my-login',(err,userid,info)=>{

        if(err) return next(err)
        if(!userid) return res.send("auth failed",info)
        else {req.logIn(userid,(err)=>{
         if(err)return res.send("somethinh has happened")
        console.log(req.user)

       res.status(301).redirect("/dashboard")
        });
        }
    })(req,res,next)
    
})



app.use("/dashboard",(req,res)=>{
    if(req.isAuthenticated()){
console.log(req.user,req.userdetails)
    
    res.send("hello user your"+ req.user.name+" login success")
    }


})

app.use("/sam",(req,res,next)=>{
    next("oihb")
})

app.use((req,res)=>{
    console.log("test")
})
app.use((err,req,res,next)=>{
    console.log("error called")
})


app.listen(9000,()=>{})