const mongoose=require('mongoose') 
 const userschema=mongoose.Schema({
    name:{
        type:mongoose.SchemaTypes.String,
        required:true
    },
    password:{
         type:mongoose.SchemaTypes.String,
        required:true
    }
})


exports.user_t=mongoose.model("user",userschema)